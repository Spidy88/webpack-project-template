function getLoader() {
    return {
        loader: require.resolve('file-loader'),
        exclude: [/\.(js|jsx)$/, /\.html$/, /\.json$/],
        options: {
            name: 'static/media/[name].[hash:8].[ext]'
        }
    };
}

module.exports = getLoader;