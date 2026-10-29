import { createRequire } from 'node:module';
import { cpus, type as osType } from 'node:os';
import { mkdir, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { bench, group, run } from 'mitata';

import { EntityMapBuilder } from '../src/core/EntityMapBuilder';
import { EntityReplacer } from '../src/core/EntityReplacer';
import type { ITextDocument } from '../src/core/ports/ITextDocument';
import type { IBenchmarkEnvironment, IBenchmarkMeasurement, IBenchmarkReport } from './types';

/** Line separator used to split the synthetic document into lines. */
const LINE_FEED = '\n';

/** Unit of the serialised measurement value: mitata reports latency in nanoseconds per iteration. */
const LATENCY_UNIT = 'ns/iter';

/** Directory (relative to this file) that holds the published report. */
const DOCS_DIRECTORY = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'docs');

/** Final report path and the temporary file used for the atomic write-then-rename. */
const REPORT_PATH = resolve(DOCS_DIRECTORY, 'benchmarks.md');
const REPORT_TEMP_PATH = resolve(DOCS_DIRECTORY, 'benchmarks.md.tmp');

/** Process exit code used when a size is missing or the suite throws (Requirement 3.3). */
const FAILURE_EXIT_CODE = 1;

/**
 * Approximate character counts the benchmark targets, matching the brief's
 * small / medium / large sizes. A line is ~37 characters, so the line counts
 * below land close to 100, 10000 and 100000 characters respectively, with each
 * size at least ten times larger than the previous one (Requirement 3.1).
 */
const SMALL_LINE_COUNT = 3;
const MEDIUM_LINE_COUNT = 270;
const LARGE_LINE_COUNT = 2_700;

/**
 * One benchmark size definition: a human label and the document body generated
 * for it. The character count is derived from the generated text so each
 * measurement can capture its exact UTF-16 length (Requirement 3.4).
 */
interface IBenchmarkSize {
  /** Human label of the size bucket (e.g. "small (~100 chars)"). */
  readonly label: string;
  /** Generated document body for this size. */
  readonly text: string;
}

/**
 * Build a synthetic document of `lineCount` lines, each mixing mapped and
 * unmapped characters so the replacer has real work to do.
 * @param lineCount Number of lines to generate.
 * @returns A single string representing the document body.
 */
function makeDocument(lineCount: number): string {
  const line = 'Caf\u00e9 \u00e0 la cr\u00e8me \u2014 plain ascii tail.';
  return Array.from({ length: lineCount }, () => line).join(LINE_FEED);
}

/**
 * Minimal in-memory {@link ITextDocument} over a plain string, mirroring the
 * test helper so the benchmark exercises the real `computeReplacements` path.
 */
class BenchDocument implements ITextDocument {
  private readonly text: string;

  private readonly lines: readonly string[];

  public constructor(text: string) {
    this.text = text;
    this.lines = text.split(LINE_FEED);
  }

  public get lineCount(): number {
    return this.lines.length;
  }

  public lineAt(index: number): string {
    return this.lines[index];
  }

  public getText(): string {
    return this.text;
  }
}

/** Shape of a single mitata run entry, narrowed to the fields this writer reads. */
interface IMitataRun {
  /** Benchmark name reported for the run. */
  readonly name: string;
  /** Collected statistics, or `undefined` when the run errored. */
  readonly stats?: { readonly avg: number };
  /** Error captured when the run failed, or `undefined` on success. */
  readonly error?: unknown;
}

/** Shape of a single mitata trial, narrowed to the fields this writer reads. */
interface IMitataTrial {
  /** Benchmark label passed to `bench(label, ...)`. */
  readonly alias: string;
  /** One entry per executed run; a static benchmark produces a single run. */
  readonly runs: readonly IMitataRun[];
}

/** Shape of the value `run()` resolves with, narrowed to the fields this writer reads. */
interface IMitataResult {
  /** One trial per registered benchmark. */
  readonly benchmarks: readonly IMitataTrial[];
}

/**
 * Read the Extension version string from `package.json` without hardcoding it.
 * @returns The `version` field declared in the package manifest.
 */
function readExtensionVersion(): string {
  // Load package.json through a require relative to this module so the value is
  // read at run time rather than baked in (Requirement 3.5).
  const require = createRequire(import.meta.url);
  const manifest = require('../package.json') as { version: string };
  return manifest.version;
}

/**
 * Capture the current runtime environment for the report (Requirement 3.4).
 * @returns The OS name, CPU model, and Node.js version.
 */
function captureEnvironment(): IBenchmarkEnvironment {
  const [firstCpu] = cpus();
  return {
    osName: osType(),
    cpuModel: firstCpu.model,
    nodeVersion: process.version,
  };
}

/**
 * Extract the measured latency for a size by matching its label against the
 * mitata trials.
 * @param result The value resolved by mitata `run()`.
 * @param size The size whose measurement is wanted.
 * @returns The measurement, or `undefined` when the size was not measured.
 */
function extractMeasurement(
  result: IMitataResult,
  size: IBenchmarkSize,
): IBenchmarkMeasurement | undefined {
  const trial = result.benchmarks.find(({ alias }) => size.label === alias);
  if (undefined === trial) {
    return undefined;
  }

  const [firstRun] = trial.runs;
  if (undefined === firstRun || undefined === firstRun.stats) {
    return undefined;
  }

  return {
    label: size.label,
    characterCount: size.text.length,
    value: firstRun.stats.avg,
    unit: LATENCY_UNIT,
  };
}

/**
 * Serialise a report into the Benchmark_Report Markdown format
 * (Requirements 3.4, 3.5).
 * @param report The fully measured report payload.
 * @returns The Markdown document body.
 */
function renderReport(report: IBenchmarkReport): string {
  const { environment, extensionVersion, measurements } = report;
  const environmentLine = `${environment.osName}, ${environment.cpuModel}, Node.js ${environment.nodeVersion}`;
  const rows = measurements
    .map(({ characterCount, value, unit }) => `| ${characterCount} | ${value} | ${unit} |`)
    .join(LINE_FEED);

  return [
    '# Benchmark Report',
    '',
    `## Extension version ${extensionVersion}`,
    '',
    `- Environment: ${environmentLine}`,
    `- Date (UTC): ${new Date().toISOString()}`,
    '',
    '| Input size (chars) | Throughput / latency | Unit |',
    '| --- | --- | --- |',
    rows,
    '',
  ].join(LINE_FEED);
}

/**
 * Write the report to `docs/benchmarks.md` atomically: write a temp file first,
 * then rename it over the final path so a crash mid-write cannot corrupt the
 * preserved report (Requirement 3.2).
 * @param report The fully measured report payload.
 */
async function writeReport(report: IBenchmarkReport): Promise<void> {
  await mkdir(DOCS_DIRECTORY, { recursive: true });
  await writeFile(REPORT_TEMP_PATH, renderReport(report), 'utf8');
  await rename(REPORT_TEMP_PATH, REPORT_PATH);
}

/**
 * Benchmark entry point measuring the cost of computing the replacements for a
 * whole document, across representative sizes.
 */
async function main(): Promise<void> {
  const replacer = new EntityReplacer(new EntityMapBuilder().withDefaults().build());

  const sizes: readonly IBenchmarkSize[] = [
    { label: 'small (~100 chars)', text: makeDocument(SMALL_LINE_COUNT) },
    { label: 'medium (~10k chars)', text: makeDocument(MEDIUM_LINE_COUNT) },
    { label: 'large (~100k chars)', text: makeDocument(LARGE_LINE_COUNT) },
  ];

  // Capture each size's exact UTF-16 character count up front so the
  // serialisation step can build an IBenchmarkMeasurement without regenerating
  // the documents (Requirement 3.4).
  const characterCounts: ReadonlyArray<Pick<IBenchmarkMeasurement, 'label' | 'characterCount'>> =
    sizes.map(({ label, text }) => ({ label, characterCount: text.length }));
  // eslint-disable-next-line no-console
  console.table(characterCounts);

  group('computeReplacements (whole document)', () => {
    sizes.forEach(({ label, text }) => {
      const document = new BenchDocument(text);
      bench(label, () => replacer.computeReplacements(document));
    });
  });

  const result = (await run()) as IMitataResult;

  // Match every size to a measurement; collect any that are missing so the
  // error can name them (Requirement 3.3).
  const measurements: IBenchmarkMeasurement[] = [];
  const unmeasured: string[] = [];
  sizes.forEach((size) => {
    const measurement = extractMeasurement(result, size);
    if (undefined === measurement) {
      unmeasured.push(size.label);
      return;
    }
    measurements.push(measurement);
  });

  // Preserve the existing report and fail when any size is missing
  // (Requirements 3.3, 3.6 — the only non-zero exit is the missing-size case).
  if (0 !== unmeasured.length) {
    // eslint-disable-next-line no-console
    console.error(`Benchmark report not written; unmeasured sizes: ${unmeasured.join(', ')}`);
    process.exit(FAILURE_EXIT_CODE);
    return;
  }

  const report: IBenchmarkReport = {
    extensionVersion: readExtensionVersion(),
    environment: captureEnvironment(),
    measurements,
  };

  await writeReport(report);
  // eslint-disable-next-line no-console
  console.log(`Benchmark report written to ${REPORT_PATH}`);
}

main().catch((error) => {
  // A thrown error leaves the existing docs/benchmarks.md untouched and exits
  // non-zero (Requirement 3.3).
  // eslint-disable-next-line no-console
  console.error('Benchmark run failed', error);
  process.exit(FAILURE_EXIT_CODE);
});
