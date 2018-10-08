module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      modules: true
    }
  },
  env: {
    browser: true,  // browser 全局变量。
    es6: true,  // 支持除模块外所有 ECMAScript 6 特性（该选项会自动设置 ecmaVersion 解析器选项为 6）。
    node: true  // Node.js 全局变量和 Node.js 作用域。
  },
  extends: [
    'plugin:vue/recommended',
    'standard'
  ],
  plugins: ['vue'],
  rules: {
     'vue/max-attributes-per-line': 'off'
  }
}
