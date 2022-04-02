const path = require('path');

module.exports = {
    target: 'web',
    mode: 'development',
    entry: path.resolve(__dirname, 'dist.node/index.js'),
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist.web'),
        library: 'CDX',
        libraryTarget: 'umd',
        globalObject: 'this',
    },
};
