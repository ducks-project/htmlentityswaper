import { bench, group, run } from 'mitata';

import { EntityMapBuilder } from '../src/core/EntityMapBuilder';
import { EntityReplacer } from '../src/core/EntityReplacer';

/**
 * Document sizes, in number of lines, used to characterise how the grouped
 * `WorkspaceEdit` replacement strategy scales from a tiny to a large document.
 */
const SMALL_LINE_COUNT = 10;
const MEDIUM_LINE_COUNT = 1_000;
const LARGE_LINE_COUNT = 50_000;

/**
 * Build a synthetic document of `lineCount` lines, each mixing mapped and
 * unmapped characters so the replacer has real work to do.
 * @param lineCount Number of lines to generate.
 * @returns A single string representing the document body.
 */
function makeDocument(lineCount: number): string {
  const line = 'Caf\u00e9 \u00e0 la cr\u00e8me \u2014 plain ascii tail.';
  return Array.from({ length: lineCount }, () => line).join('\n');
}

/**
 * Benchmark entry point measuring the cost of computing the replacements for a
 * whole document using the grouped-edit approach, across representative sizes.
 *
 * TODO: wire this up once {@link EntityReplacer} is implemented. For now the
 * structure (groups, cases, `run()`) is in place but the measured body is a
 * placeholder so the file compiles and `npm run bench` starts mitata.
 */
async function main(): Promise<void> {
  // References kept so the imports are exercised; the real setup lands with the
  // replacer implementation.
  EntityMapBuilder;
  EntityReplacer;

  const documents: ReadonlyArray<readonly [string, string]> = [
    ['small', makeDocument(SMALL_LINE_COUNT)],
    ['medium', makeDocument(MEDIUM_LINE_COUNT)],
    ['large', makeDocument(LARGE_LINE_COUNT)],
  ];

  group('computeReplacements (grouped WorkspaceEdit)', () => {
    documents.forEach(([label, text]) => {
      // TODO: build an EntityMap/EntityReplacer and call
      // TODO: replacer.computeReplacements(documentAdapterOver(text)); the
      // TODO: placeholder body below only keeps `text` live until then.
      bench(label, () => text.length);
    });
  });

  await run();
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Benchmark run failed', error);
  process.exit(1);
});
