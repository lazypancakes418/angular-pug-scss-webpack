const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const commonConfig = require('./webpack.common.js');
const helper = require('./helper');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { AngularCompilerPlugin } = require('@ngtools/webpack');
const {  SuppressExtractedTextChunksWebpackPlugin, CleanCssWebpackPlugin, BundleBudgetPlugin, PostcssCliResources } = require('@angular/cli/plugins/webpack');
const { PurifyPlugin } = require('@angular-devkit/build-optimizer');
const { ModuleConcatenationPlugin } = require('webpack').optimize;

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',

  output: {
    path: helper.root('dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[name]-[id].[hash].chunk.js'
  },
  stats: { warnings: false },
  optimization:{
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
      },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    },
    minimizer: [  new UglifyJsPlugin({
      "test": /\.js$/i,
      "extractComments": false,
      "sourceMap": false,
      "cache": true,
      "parallel": true,
      "uglifyOptions": {
        "output": {
          "ascii_only": true,
          "comments": false,
          "webkit": true
        },
        "ecma": 5,
        "warnings": false,
        "ie8": false,
        "mangle": {
          "safari10": true
        },
        "compress": {
          "typeofs": false,
          "pure_getters": true,
          "passes": 3
        }
      }
    }),
    new OptimizeCSSAssetsPlugin({})
  ]},
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
    new CleanCssWebpackPlugin(),
    new ModuleConcatenationPlugin({}),
    new BundleBudgetPlugin({}),
    new webpack.NoEmitOnErrorsPlugin(),
    new PurifyPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    }),
    new webpack.LoaderOptionsPlugin({
      htmlLoader: {
        minimize: false // workaround for ng2
      }
    }),
    new AngularCompilerPlugin({
      tsConfigPath: helper.root('./client/tsconfig.app.json'),
      entryModule: helper.root('./client/src/app/app.module#AppModule'),
      mainPath: 'main.ts',
      skipCodeGeneration: false,
      platform: 0,
    })
  ]
});
