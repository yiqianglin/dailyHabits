/* global require, module, __dirname */
const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')

const config = require('../../config')
const projectRoot = path.resolve(__dirname, '../../')
const isBuilding = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'testing'
console.log('build:', isBuilding)

// check env & config/index.js to decide weither to enable CSS Sourcemaps for the
// various preprocessor loaders added to vue-loader at the end of this file
const cssSourceMapDev = !isBuilding && config.dev.cssSourceMap
const cssSourceMapProd = isBuilding && config.build.productionSourceMap
const useCssSourceMap = cssSourceMapDev || cssSourceMapProd

module.exports = {
  performance: {
    maxEntrypointSize: 300000, // 入口最大的size
    hints: isBuilding ? 'warning' : false
  },
  entry: {
    app: './src/entry-client.js'
  },
  output: {
    path: config.build.assetsRoot, // '/'
    publicPath: config.dev.assetsPublicPath, // 'static'
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  },
  externals: {
    jquery: 'jQuery'
  },
  resolve: {
    extensions: ['.js', '.vue', '.sass', '.scss', '.css'],
    modules: [path.join(__dirname, '../../node_modules')],
    alias: {
      '@': path.resolve(__dirname, '../../src'),
      'src': path.resolve(__dirname, '../../src'),
      'components': path.resolve(__dirname, '../../src/components'),
      'page': path.resolve(__dirname, '../../src/page'),
      'assets': path.resolve(__dirname, '../../src/asstes'),
      'store': path.resolve(__dirname, '../../src/store'),
      'utils': path.resolve(__dirname, '../../src/utils'),
      'libs': path.resolve(__dirname, '../../src/libs'),
      vue: 'vue/dist/vue.js'
    }
  },
  resolveLoader: {
    modules: [path.join(__dirname, '../../node_modules')]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }

      },
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory',
        include: projectRoot,
        exclude: [/node_modules/, path.join(__dirname, '../../src/libs/')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // regExp: /\S+\/mobile\/(\S+)\/(\S+)\.(\S+)$/,
              name: 'static/images/[name].[hash:7].[ext]',
              limit: isBuilding ? 8192 : 1
            }
          }
        ]
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader'
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'static/fonts/[name].[hash:7].[ext]',
              limit: 8192
            }
          }
        ]
      },
      {
        test: /lufylegend/, // 这个test需要优化
        loader: 'exports-loader?window.LGlobal!script-loader'
      },
      {
        test: /weui.min.js/,
        loader: 'exports-loader?window.weui!script-loader'
      }
    ]
  },
  plugins: [
    // new webpack.ProvidePlugin({
    //     $: 'jquery',
    //     jQuery: 'jquery',
    //     'window.jQuery': 'jquery'
    // }),
    new VueLoaderPlugin()
  ]
}
