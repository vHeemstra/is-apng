// Install:
// npm install -D @rollup/plugin-terser @rollup/plugin-commonjs
// import typescript from '@rollup/plugin-typescript'
// import terser from '@rollup/plugin-terser'
// import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
// import {RollupOptions} from 'rollup'

const isProduction = process.env.NODE_ENV === 'production'

// See: https://rollupjs.org/guide/en/#outputformat

export default [
  {
    input: 'src/index.ts',
    // plugins: [typescript(), isProduction && terser()],
    plugins: [
      esbuild({
        sourceMap: !isProduction,
        minify: isProduction,
      }),
    ],
    output: [
      {
        file: `${isProduction ? 'dist' : 'lib'}/index.esm.js`,
        format: 'esm',
        // sourcemap: isProduction,
      },
      {
        name: 'isApng',
        file: `${isProduction ? 'dist' : 'lib'}/index.cjs.js`,
        format: 'cjs',
        // interop: 'auto',
        // sourcemap: isProduction,
      },
      {
        name: 'isApng',
        file: `${isProduction ? 'dist' : 'lib'}/index.js`,
        format: 'umd',
        // sourcemap: isProduction,
      },
    ],
  },
  // {
  //   input: 'src/index.ts',
  //   plugins: [
  //     esbuild({
  //       // All options are optional
  //       include: /\.[jt]sx?$/, // default, inferred from `loaders` option
  //       exclude: /node_modules/, // default
  //       sourceMap: true, // default
  //       // minify: true,
  //       target: 'es2017', // default, or 'es20XX', 'esnext'
  //       // jsx: 'transform', // default, or 'preserve'
  //       // jsxFactory: 'React.createElement',
  //       // jsxFragment: 'React.Fragment',
  //       // Like @rollup/plugin-replace
  //       // define: {
  //       //   __VERSION__: '"x.y.z"',
  //       // },
  //       // tsconfig: 'tsconfig.json', // default
  //       // Add extra loaders
  //       // loaders: {
  //       //   // Add .json files support
  //       //   // require @rollup/plugin-commonjs
  //       //   '.json': 'json',
  //       //   // Enable JSX in .js files too
  //       //   '.js': 'jsx',
  //       // },
  //     }),
  //     // typescript(),
  //     // commonjs(),
  //     // isProduction && terser()
  //   ],
  //   output: {
  //     name: 'isApng',
  //     file: `${isProduction ? 'dist' : 'lib'}/index.cjs.js`,
  //     format: 'cjs',
  //     // interop: 'default',
  //     interop: 'auto',
  //   },
  // },
  {
    input: `src/index.ts`,
    plugins: [dts()],
    output: {
      file: `${isProduction ? 'dist' : 'lib'}/index.d.ts`,
      format: 'es',
    },
  },
]
