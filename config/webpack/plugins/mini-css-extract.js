const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function setupPlugin() {
    return new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    });
}

module.exports = setupPlugin;