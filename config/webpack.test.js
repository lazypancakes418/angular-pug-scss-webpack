const webpack = require('webpack');
const helper = require('./helper');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ngtools = require('@ngtools/webpack');
const autoprefixer = require('autoprefixer');

module.exports = {
  mode: 'development',
  entry: {
    'polyfills': './src/polyfills.ts',
    'app': './src/main.ts',
    'styles': './src/styles.scss'
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [{
      test: /\.ts$/,
      loaders: [ 'ts-loader', 'angular2-template-loader']
      },
      {
          test: /\.pug$/,
          loaders: [
            'html-loader', {
              loader: 'pug-html-loader',
              options: {
                doctype: 'html'
              }
            }
          ]
      },
      {
        enforce: 'post',
        test: /\.ts$/,
        loader: 'istanbul-instrumenter-loader',
        include: helper.root('./src', 'app'),
        exclude: /\mocks|\.spec\.ts$/
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.(css|scss)$/,
        exclude: [helper.root('./src', 'app')],
        use: [ MiniCssExtractPlugin.loader, {
          loader: 'css-loader',
          query: {
            modules: false,
            sourceMaps: false,
            minimize: true,
            grid: true
          }
        },
        {
          loader: 'postcss-loader',
          options: {
          plugins: () => [
              autoprefixer
          ],
            sourceMap: true
          }
        },
        {
          loader: 'sass-loader',
          options: {
            data: ``,
            includePaths: [
            ],
            sourceMap: true
          }
        }]
      },
      {
        test: /\.scss$/,
        include: [helper.root('./src', 'app')],
        use: [
          {
            loader: 'css-to-string-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              data: ``,
              includePaths: [
              ],
              sourceMap: true
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new ngtools.AngularCompilerPlugin({
      tsConfigPath: helper.root('./src/tsconfig.app.json'),
      entryModule: helper.root('./src/app/app.module#AppModule'),
      mainPath: 'main.ts',
      skipCodeGeneration: true
    }),
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)@angular/,
      helper.root('./src'), // location of your src
      {} // a map of your routes
    )
  ]

}
