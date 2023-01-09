import { defineConfig } from 'tsup'
// import type { Options } from 'tsup'

const env = process.env.NODE_ENV

export default defineConfig((/* options: Options */) => {
  return {
    outExtension({ format }) {
      return {
        js: `.${format}.js`,
      }
    },
    splitting: true,
    clean: true, // clean up the dist folder
    dts: true, // generate dts files
    format: ['cjs', 'esm'], // generate cjs and esm files
    // sourcemap: env === 'production',
    minify: env === 'production',
    bundle: env === 'production',
    shims: true,
    skipNodeModulesBundle: true,
    entryPoints: ['src/index.ts'],
    watch: env === 'development' ? 'src' : false,
    target: 'es2020',
    outDir: env === 'production' ? 'dist' : 'lib',
    // entry: ['src/**/*.ts'], //include all files under src
    entry: ['src/index.ts'],
  }
})
