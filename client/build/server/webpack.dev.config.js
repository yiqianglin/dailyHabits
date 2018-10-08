/* global require, module */
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

const argv = require('yargs').argv
console.log(argv)
console.log(argv.projectName)

const config = require('../../config')
const utils = require('./utils')
const baseWebpackConfig = require('./webpack.base.config')

// add hot-reload related code to entry chunks
// Object.keys(baseWebpackConfig.entry).forEach(function (name) {
//   baseWebpackConfig.entry[name] = ['./build/client/dev-client'].concat(baseWebpackConfig.entry[name])
// })

module.exports = merge(baseWebpackConfig, {
  target: 'node',
  mode: 'development',
  // eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  entry: ['./build/client/dev-client', baseWebpackConfig.entry.app_node],
  module: {
    rules: [
      {
        'test': /\.css$/,
        // oneOf: https://blog.csdn.net/sinat_17775997/article/details/78387007
        'oneOf': [
          {
            'use': [
              'vue-style-loader',
              {
                'loader': 'css-loader',
                'options': {
                  'minimize': false, 'sourceMap': true
                }
              }]
          }]
      }, {
        'test': /\.postcss$/,
        'oneOf': [
          {
            'use': [
              'vue-style-loader',
              {
                'loader': 'css-loader',
                'options': {
                  'minimize': false,
                  'sourceMap': true
                }
              }
            ]
          }
        ]
      }, {
        'test': /\.scss$/,
        'oneOf': [
          {
            'use': [
              'vue-style-loader',
              {
                'loader': 'css-loader',
                'options': {
                  'minimize': false,
                  'sourceMap': true
                }
              },
              {
                'loader': 'sass-loader',
                'options': {
                  'sourceMap': true
                }
              }
            ]
          }
        ]
      }
    ]
  },
  optimization: {
    namedChunks: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
      '_ENV_': "'development'",
      '_MTA_': {
        sid: config.build.mta.testing.sid,
        cid: config.build.mta.testing.cid
      }
    }),
    new FriendlyErrorsPlugin(),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      chunks: ['vendors', 'app'],
      favicon: 'favicon.ico',
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      title: '企鹅医典'
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/libs',
        to: 'dist/static/libs',
        cache: true
      }
    ]),
    new VueSSRServerPlugin()
  ]
})
