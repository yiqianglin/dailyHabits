/* global require, env, rm, cp, mkdir, process */

// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = 'production'

const fs = require('fs')
var path = require('path')
var config = require('../../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.config')
const _package = JSON.parse(fs.readFileSync('./package.json'))

var spinner = ora('building for production...')
spinner.start()

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
rm('-rf', path.join(config.build.assetsRoot))
rm('-rf', path.join(`${config.build.sourcemapsRoot}/${_package.version}`))
mkdir('-p', assetsPath)
cp('-R', 'static/', './dist/')
cp('-R', 'favicon.ico', './dist/')
webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) {
    throw err
  }
  process.stdout.write(
    stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n'
  )
})
