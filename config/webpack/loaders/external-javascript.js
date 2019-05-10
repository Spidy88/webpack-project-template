// Process any JS outside of the app with Babel.
// Unlike the application JS, we only compile the standard ES features.
function getLoader({ isProduction }) {
  return {
    test: /\.(js|mjs)$/,
    exclude: /@babel(?:\/|\\{1,2})runtime/,
    loader: require.resolve('babel-loader'),
    options: {
      babelrc: false,
      configFile: false,
      compact: false,
      presets: [
        [
          require.resolve('babel-preset-react-app/dependencies'),
          { helpers: true }
        ]
      ],
      cacheDirectory: true,
      cacheCompression: isProduction,
      sourceMaps: false
    }
  };
}

module.exports = getLoader;