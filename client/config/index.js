// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    sourcemapsRoot: path.resolve(__dirname, '../sourcemap'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/dist/',
    productionSourceMap: true,
    bundleAnalyzerReport: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    mta: {
      // 开发环境
      testing: {
        sid: '500500616',
        cid: '500500617'
      },
      // 线上环境
      production: {
        sid: '500487122',
        cid: '500487807'
      }
    }
  },
  dev: {
    env: require('./dev.env'),
    port: 8082,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // context: [
      //     '/v1',
      //     '/mobile/**',
      //     '!**.html'
      // ],
      context: function (pathname, req) {
        // console.log(pathname, '    :     ' ,pathname.match('^/mobile') && !pathname.match('.html') || pathname.match('activities/getQQRewardData'))
        return ((pathname.match('^/mobile') || pathname.match('^/api')) && !pathname.match('.html')) || pathname.match('activities/getQQRewardData')
      },
      options: {
        // target: 'http://baikepreview.sparta.html5.qq.com',
        // target: 'http://baiketest.sparta.html5.qq.com',
        target: 'http://baike.sparta.html5.qq.com',
        // target: 'http://baike.sparta.html5.qq.com',
        // target: 'http://local.baike.qq.com',
        // target: 'http://h5.baike.qq.com',
        changeOrigin: true,
        ws: true
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
