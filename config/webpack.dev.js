const webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const commonConfig = require('./webpack.common.js');
const helper = require('./helper');
const ngtools = require('@ngtools/webpack');

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',

  output: {
    path: helper.root('dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name]-[id].chunk.js'
  },

  optimization: {
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
    }
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new ngtools.AngularCompilerPlugin({
      tsConfigPath: helper.root('./src/tsconfig.app.json'),
      entryModule: helper.root('./src/app/app.module#AppModule'),
      mainPath: "main.ts",
      skipCodeGeneration: true
    })
  ],
  devServer: {
    historyApiFallback: true,
  }
});
