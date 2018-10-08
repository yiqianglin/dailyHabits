// 命中高亮关键词
function highLight (text = '', keywords = []) {
  var keys = keywords.join('|')
  return keys ? text.replace(new RegExp(`(${keys})`, 'ig'), '<span class="match">$1</span>') : text
}

// 媒体文件大小格式化：Byte转为两位小数的MB
function formatSize (size) {
  var mb = parseFloat(size) / 1024
  if (!mb) return 0
  if (Number.isInteger(mb)) return mb
  return mb.toPrecision(2)
}

// 媒体文件时长格式化：毫秒数转为hh:mm:ss
function formatTime (time) {
  if (!time) return '00:00'
  var hours = parseInt(time / 3600)
  time = time - hours * 3600
  var minutes = parseInt(time / 60)
  time = time - minutes * 60
  var seconds = parseInt(time)
  var timeStr = ('00' + minutes).substr(('00' + minutes).length - 2) + ':' + ('00' + seconds).substr(('00' + seconds).length - 2)
  timeStr = hours ? ('00' + hours).substr(('00' + hours).length - 2) + ':' + timeStr : timeStr
  return timeStr
}

// 单位转换：指定转换后的精度
function convertUnit (value, unitDiff, precision) {
  if (!value || !unitDiff) return 0
  var converted = value * unitDiff
  return precision ? converted.toFixed(precision).replace(/\.0+/, '') : converted
}

// 分隔符连接字符串
function connectDivider (value = '', divider = '', ...other) {
  let words = [value, ...other]
  return words.filter(val => val).join(divider)
}

export default {
  highLight,
  formatSize,
  formatTime,
  convertUnit,
  connectDivider
}

/**
 * 使用方法
 * v-html类：
 * js:
 * import filters from 'src/js/filters'
 * export default {
 *   props: {},
 *   filters: {
 *     highLight: filters.highLight
 *   }
 * }
 * html:
 * <span v-html="$options.filters.highlight(text, keywords)"></span>
 * v-bind、{{}} 类：
 * js:
 * import filters from 'src/js/filters'
 * export default {
 *   props: {},
 *   filters: {
 *     formatTime: filters.formatTime
 *   }
 * }
 * html:
 * <span>{{ time | formatTime }}</span>
 */
