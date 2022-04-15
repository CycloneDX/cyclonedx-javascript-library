const path = require('path');
const merge = require('deepmerge')

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
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts'],
    },
    entry: path.resolve(__dirname, 'src/index.ts'),
    output: {
        path: path.resolve(__dirname, 'dist.web'),
        // filename: '',
        library: {
            name: 'CycloneDX_library',
            type: 'umd',
        },
    },
    externals: {
        'packageurl-js': 'PackageURL',
    },
};


module.exports = [
    merge(configBase, {
        mode: 'production',
        output: {
            filename: 'lib.js',
        },
    }),
    merge(configBase, {
        mode: 'development',
        devtool: 'source-map',
        output: {
            filename: 'lib.dev.js',
        },
    }),
]
