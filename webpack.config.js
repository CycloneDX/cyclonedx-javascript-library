const path = require('path');

module.exports = {
    target: 'web',
    mode: 'production',
    entry: path.resolve(__dirname, 'dist.node/index.js'),
    output: {
        filename: 'CycloneDX_library.js',
        path: path.resolve(__dirname, 'dist.web'),
        library: 'CycloneDX_library',
        libraryTarget: 'umd',
        globalObject: 'this',
        umdNamedDefine: true,
    },
};
