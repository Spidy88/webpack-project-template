const paths = require('../paths');

// Process application JS with Babel.
// The preset includes JSX, Flow, and some ESnext features.
function getLoader({ isProduction }) {
  return {
    test: /\.(js|jsx)$/,
    include: paths.appSrc,
    loader: require.resolve('babel-loader'),
    options: {
      customize: require.resolve(
        'babel-preset-react-app/webpack-overrides'
      ),
      
      plugins: [
        [
          require.resolve('babel-plugin-named-asset-import'),
          {
            loaderMap: {
              svg: {
                ReactComponent: '@svgr/webpack?-svgo,+ref![path]'
              }
            }
          }
        ]
      ],
      cacheDirectory: true,
      cacheCompression: isProduction,
      compact: isProduction
    }
  };
}

module.exports = getLoader;