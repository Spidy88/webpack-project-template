const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');

function setupPlugin({ shouldUseSourceMap }) {
    return new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
            parser: safePostCssParser,
            map: shouldUseSourceMap && {
                inline: false,
                annotation: true
            }
        }
    });
}

module.exports = setupPlugin;