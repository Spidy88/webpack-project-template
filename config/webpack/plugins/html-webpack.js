const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('../paths');

function setupPlugin({ isProduction }) {
    let minifyOptions = {
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true
        }
    };

    return new HtmlWebpackPlugin(
        Object.assign(
            {
                inject: true,
                template: paths.appHtml
            },
            isProduction ? minifyOptions : undefined
        )
    );
}

module.exports = setupPlugin;