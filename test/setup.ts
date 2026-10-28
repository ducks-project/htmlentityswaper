// Test bootstrap loaded by Mocha before any spec file.
//
// `chai` (v5) and `fast-check` (v3) ship as pure ES modules. Under the CommonJS
// `ts-node/register` transpile, Mocha loads the spec files through a parallel
// `Promise.all(import(...))`, and each spec's `import ... from 'chai'` lowers to
// a `require()` of that ESM package. Requiring the same ES module from several
// files concurrently trips Node's `ERR_REQUIRE_ESM_RACE_CONDITION`. Requiring
// the ESM-only dependencies once here, sequentially and before the specs load,
// warms Node's module cache so every later `require()` resolves instantly.
require('chai');
require('fast-check');
