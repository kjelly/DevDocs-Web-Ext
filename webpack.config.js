const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    'devdocs-style': './src/popup/devdocs.sass',
    'devdocs-dark-style': './src/popup/devdocs-dark.sass',
    'popup-style': './src/popup/popup.sass',
    'popup-js': './src/popup',

    'background-js': './src/background',

    'options-js': './src/options',
    'options-style': './src/options/options.sass'
  },
  output: {
    path: path.resolve('./extension/dist')
  },
  module: {
    rules: [{
      test: /\.(png|jpg|gif)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 8192
        }
      }]
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader'
      }]
    }, {
      test: /vendor\/devdocs\/assets\/javascripts\/app\/searcher\.coffee/,
      use: [{
        loader: 'exports-loader',
        options: {
          'app.Searcher': true
        }
      }, {
        loader: 'imports-loader',
        options: {
          app: `>{config: {max_results: 50}}`,
          $: 'jquery',
          Events: '../lib/events.coffee',
          util: '../lib/util.coffee'
        }
      }, {
        loader: 'coffee-loader'
      }]
    }, {
      test: /vendor\/devdocs\/assets\/javascripts\/models\/entry\.coffee/,
      use: [{
        loader: 'exports-loader',
        options: {
          'app.models.Entry': true
        }
      }, {
        loader: 'imports-loader',
        options: {
          app: `>{models: {}, Model: function (o) {for(k in o) {this[k] = o[k]}}}`,
          'app.Searcher': '../app/searcher.coffee'
        }
      }, {
        loader: 'coffee-loader'
      }]
    }, {
      test: /vendor\/devdocs\/assets\/javascripts\/lib\/events\.coffee/,
      use: [{
        loader: 'exports-loader',
        options: {
          'this.Events': true
        }
      }, {
        loader: 'coffee-loader'
      }]
    }, {
      test: /vendor\/devdocs\/assets\/javascripts\/lib\/util\.coffee/,
      use: [{
        loader: 'imports-loader',
        options: {
          $: 'jquery'
        }
      }, {
        loader: 'coffee-loader'
      }]
    }, {
      test: /\.(css)$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        }]
      })
    }, {
      test: /\.(scss|sass)$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            includePaths: [
              path.parse(require.resolve('compass-mixins')).dir,
              path.resolve(__dirname, 'vendor/devdocs/assets/stylesheets/')
            ]
          }
        }]
      })
    }, {
      test: /\.(svelte)$/,
      exclude: /node_modules/,
      use: [{
        loader: 'svelte-loader'
      }]
    }, {
      test: /\.(pug)$/,
      use: [{
        loader: 'pug-loader'
      }]
    }]
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'inline-cheap-source-map',
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: 'src/popup/popup.pug',
      inject: false,
      chunks: ['devdocs-style', 'devdocs-dark-style', 'popup-style', 'vendors', 'popup-js']
    }),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      template: 'src/options/options.pug',
      chunks: ['options-style', 'vendors', 'options-js']
    }),
    new ExtractTextPlugin({
      filename: '[name].css'
    }),
    new webpack.ProgressPlugin(),
    new DashboardPlugin()
  ]
}
