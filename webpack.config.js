const path = require('path')
const deepmerge = require('deepmerge')

// see https://webpack.js.org/guides/author-libraries/
const configBase = {
  target: 'web',
  // mode: '',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        // see https://github.com/TypeStrong/ts-loader
        options: {
          compilerOptions: {
            // in here parts of typescript compiler can be overridden
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts']
  },
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist.web'),
    // filename: '',
    library: {
      name: 'CycloneDX_library',
      type: 'umd'
    }
  },
  externals: {
    'packageurl-js': 'PackageURL'
  }
}

module.exports = [
  deepmerge(configBase, {
    mode: 'production',
    output: {
      filename: 'lib.js'
    }
  }),
  deepmerge(configBase, {
    mode: 'development',
    devtool: 'source-map',
    output: {
      filename: 'lib.dev.js'
    }
  })
]
