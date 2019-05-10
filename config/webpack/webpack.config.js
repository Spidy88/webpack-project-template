const path = require('path');
const webpack = require('webpack');
const setupTerserPlugin = require('./plugins/terser');
const setupOptimizeCssAssetsPlugin = require('./plugins/optimize-css-assets');
const setupHtmlWebpackPlugin = require('./plugins/html-webpack');
const setupWorkboxWebpackPlugin = require('./plugins/workbox-webpack');
const setupManifestPlugin = require('./plugins/manifest');
const setupMiniCssExtractPlugin = require('./plugins/mini-css-extract');
const getExternalJavascriptLoader = require('./loaders/external-javascript');
const getLintLoader = require('./loaders/lint');
const getFileLoader = require('./loaders/file');
const getUrlLoader = require('./loaders/url');
const getJavascriptLoader = require('./loaders/javascript');
const {
  getPostCssLoader,
  getCssModuleLoader,
  getSassLoader,
  getSassModuleLoader
} = require('./loaders/styles');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const paths = require('./paths');
const modules = require('./modules');
const getClientEnvironment = require('./env');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
// Some apps do not need the benefits of saving a web request, so not inlining the chunk
// makes for a smoother build process.
const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false';

// This is the production and development configuration.
// It is focused on developer experience, fast rebuilds, and a minimal bundle.
module.exports = function(webpackEnv) {
  const isProduction = webpackEnv === 'production';
  const isDevelopment = !isProduction;

  const publicPath = isProduction ? paths.servedPath : '/';
  const shouldUseRelativeAssetPaths = publicPath === './';
  const publicUrl = isProduction ? publicPath.slice(0, -1) : '';

  const env = getClientEnvironment(publicUrl);

  const config = {
    isProduction,
    isDevelopment,
    publicPath,
    publicUrl,
    shouldUseSourceMap,
    shouldUseRelativeAssetPaths
  };

  return {
    mode: isProduction ? 'production' : 'development',
    bail: isProduction,
    devtool: isProduction
      ? shouldUseSourceMap && 'source-map'
      : 'cheap-module-source-map',
    entry: [
      isDevelopment && require.resolve('react-dev-utils/webpackHotDevClient'),
      paths.appIndexJs
    ].filter(Boolean),
    output: {
      path: isProduction ? paths.appBuild : undefined,
      pathinfo: isDevelopment,
      filename: isProduction
        ? 'static/js/[name].[contenthash:8].js'
        : 'static/js/bundle.js',
      // TODO: remove this when upgrading to webpack 5
      futureEmitAssets: true,
      chunkFilename: isProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : 'static/js/[name].chunk.js',
      publicPath: publicPath,
      devtoolModuleFilenameTemplate: isProduction
        ? info =>
            path
              .relative(paths.appSrc, info.absoluteResourcePath)
              .replace(/\\/g, '/')
        : info => 
            path
              .resolve(info.absoluteResourcePath)
              .replace(/\\/g, '/')
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        setupTerserPlugin(config),
        setupOptimizeCssAssetsPlugin(config)
      ],
      splitChunks: {
        chunks: 'all',
        name: false
      },
      runtimeChunk: true
    },
    resolve: {
      modules: ['node_modules', paths.appNodeModules].concat(modules.additionalModulePaths || []),
      extensions: paths.moduleFileExtensions
        .map(ext => `.${ext}`)
        .filter(ext => !ext.includes('ts')),
      plugins: [
        PnpWebpackPlugin,
        new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])
      ]
    },
    resolveLoader: {
      plugins: [
        PnpWebpackPlugin.moduleLoader(module)
      ]
    },
    module: {
      strictExportPresence: true,
      rules: [
        { parser: { requireEnsure: false } },
        getLintLoader(config),
        {
          oneOf: [
            getUrlLoader(config),
            getJavascriptLoader(config),
            getExternalJavascriptLoader(config),
            getPostCssLoader(config),
            getCssModuleLoader(config),
            getSassLoader(config),
            getSassModuleLoader(config),
            getFileLoader(config)
          ]
        }
      ]
    },
    plugins: [
      setupHtmlWebpackPlugin(isProduction),
      isProduction && shouldInlineRuntimeChunk &&
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
      new ModuleNotFoundPlugin(paths.appPath),
      new webpack.DefinePlugin(env.stringified),
      isDevelopment && new webpack.HotModuleReplacementPlugin(),
      isDevelopment && new CaseSensitivePathsPlugin(),
      isDevelopment && new WatchMissingNodeModulesPlugin(paths.appNodeModules),
      isProduction && setupMiniCssExtractPlugin(config),
      setupManifestPlugin(publicPath),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      isProduction && setupWorkboxWebpackPlugin(publicPath)
    ].filter(Boolean),
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    },
    performance: false
  };
};
