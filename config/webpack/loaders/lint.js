const paths = require('../paths');

function getLoader() {
    return {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        use: [
        {
            options: {
                formatter: require.resolve('react-dev-utils/eslintFormatter'),
                eslintPath: require.resolve('eslint')
            },
            loader: require.resolve('eslint-loader')
        }
        ],
        include: paths.appSrc
    };
}

module.exports = getLoader;