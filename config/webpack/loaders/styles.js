const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const postcssNormalize = require('postcss-normalize');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

// common function to get style loaders
function getStyleLoaders(config, cssOptions, preProcessor) {
  let { 
    isDevelopment,
    isProduction,
    shouldUseSourceMap,
    shouldUseRelativeAssetPaths
  } = config;

  const loaders = [
    isDevelopment && require.resolve('style-loader'),
    isProduction && {
      loader: MiniCssExtractPlugin.loader,
      options: Object.assign(
        {},
        shouldUseRelativeAssetPaths ? { publicPath: '../../' } : undefined
      )
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009'
            },
            stage: 3
          }),
          // Adds PostCSS Normalize as the reset css with default options,
          // so that it honors browserslist config in package.json
          // which in turn let's users customize the target behavior as per their needs.
          postcssNormalize()
        ],
        sourceMap: isProduction && shouldUseSourceMap
      }
    }
  ].filter(Boolean);

  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: isProduction && shouldUseSourceMap
      }
    });
  }

  return loaders;
};

// "postcss" loader applies autoprefixer to our CSS.
// "css" loader resolves paths in CSS and adds assets as dependencies.
// "style" loader turns CSS into JS modules that inject <style> tags.
// In production, we use MiniCSSExtractPlugin to extract that CSS
// to a file, but in development "style" loader enables hot editing
// of CSS.
// By default we support CSS Modules with the extension .module.css
function getPostCssLoader(config) {
  let { isProduction, shouldUseSourceMap } = config;

  return {
    test: cssRegex,
    exclude: cssModuleRegex,
    use: getStyleLoaders(config, {
      importLoaders: 1,
      sourceMap: isProduction && shouldUseSourceMap
    }),
    sideEffects: true
  };
}

// Adds support for CSS Modules (https://github.com/css-modules/css-modules)
// using the extension .module.css
function getCssModuleLoader(config) {
  let { isProduction, shouldUseSourceMap } = config;

  return {
      test: cssModuleRegex,
      use: getStyleLoaders(config, {
          importLoaders: 1,
          sourceMap: isProduction && shouldUseSourceMap,
          modules: true,
          getLocalIdent: getCSSModuleLocalIdent
      })
  };
}

// Opt-in support for SASS (using .scss or .sass extensions).
// By default we support SASS Modules with the
// extensions .module.scss or .module.sass
function getSassLoader(config) {
  let { isProduction, shouldUseSourceMap } = config;

  return {
    test: sassRegex,
    exclude: sassModuleRegex,
    use: getStyleLoaders(config, {
        importLoaders: 2,
        sourceMap: isProduction && shouldUseSourceMap
      },
      'sass-loader'
    ),
    sideEffects: true
  };
}

// Adds support for CSS Modules, but using SASS
// using the extension .module.scss or .module.sass
function getSassModuleLoader(config) {
  let { isProduction, shouldUseSourceMap } = config;

  return {
    test: sassModuleRegex,
    use: getStyleLoaders(config, {
        importLoaders: 2,
        sourceMap: isProduction && shouldUseSourceMap,
        modules: true,
        getLocalIdent: getCSSModuleLocalIdent
      },
      'sass-loader'
    )
  };
}

module.exports = exports = {
  getPostCssLoader,
  getCssModuleLoader,
  getSassLoader,
  getSassModuleLoader
};