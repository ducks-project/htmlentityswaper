import { bench, group, run } from 'mitata';

import { EntityMapBuilder } from '../src/core/EntityMapBuilder';
import { EntityReplacer } from '../src/core/EntityReplacer';
import type { ITextDocument } from '../src/core/ports/ITextDocument';

/** Line separator used to split the synthetic document into lines. */
const LINE_FEED = '\n';

/**
 * Approximate character counts the benchmark targets, matching the brief's
 * small / medium / large sizes. A line is ~37 characters, so the line counts
 * below land close to 100, 10000 and 100000 characters respectively.
 */
const SMALL_LINE_COUNT = 3;
const MEDIUM_LINE_COUNT = 270;
const LARGE_LINE_COUNT = 2_700;

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

/**
 * Benchmark entry point measuring the cost of computing the replacements for a
 * whole document, across representative sizes.
 */
async function main(): Promise<void> {
  const replacer = new EntityReplacer(new EntityMapBuilder().withDefaults().build());

  const documents: ReadonlyArray<readonly [string, string]> = [
    ['small (~100 chars)', makeDocument(SMALL_LINE_COUNT)],
    ['medium (~10k chars)', makeDocument(MEDIUM_LINE_COUNT)],
    ['large (~100k chars)', makeDocument(LARGE_LINE_COUNT)],
  ];

  group('computeReplacements (whole document)', () => {
    documents.forEach(([label, text]) => {
      const document = new BenchDocument(text);
      bench(label, () => replacer.computeReplacements(document));
    });
  });

  await run();
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Benchmark run failed', error);
  process.exit(1);
});
