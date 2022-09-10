const typescript = require('@rollup/plugin-typescript')

/**
 * @see {@link https://rollupjs.org}
 * @type {import('rollup').RollupOptions}
 */
module.exports = {
  input: 'src/index.node.ts',
  external: [
    // region own shipped
    /\.\/(?:libs|res)\//,
    // endregion own shipped
    // region externals dependencies
    'packageurl-js'
    // endregion externals dependencies
  ],
  treeshake: false,
  output: [
    {
      file: 'dist.node/lib.cjs',
      format: 'cjs',
      strict: true,
      sourcemap: false,
      compact: true
    },
    {
      file: 'dist.node/lib.dev.cjs',
      format: 'cjs',
      strict: true,
      sourcemap: true,
      compact: false
    },
    {
      file: 'dist.node/lib.mjs',
      format: 'esm',
      strict: true,
      sourcemap: false,
      compact: true
    },
    {
      file: 'dist.node/lib.dev.mjs',
      format: 'esm',
      strict: true,
      sourcemap: true,
      compact: false
    }
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.node.json',
      sourceMap: true
    })
  ]
}
