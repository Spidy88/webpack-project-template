const isWsl = require('is-wsl');
const TerserPlugin = require('terser-webpack-plugin');

function setupPlugin({ shouldUseSourceMap }) {
    return new TerserPlugin({
        terserOptions: {
        parse: {
            ecma: 8
        },
        compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2
        },
        mangle: {
            safari10: true
        },
        output: {
            ecma: 5,
            comments: false,
            ascii_only: true
        }
        },
        parallel: !isWsl,
        cache: true,
        sourceMap: shouldUseSourceMap
    });
}

module.exports = setupPlugin;