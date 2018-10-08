import successIcon from '@/assets/images/mobile/message/success.png'
import errorIcon from '@/assets/images/mobile/message/error.png'
import warnIcon from '@/assets/images/mobile/message/warn.png'
import addIcon from '@/assets/images/mobile/message/add.png'

// 是否图片
const isImg = (img) => {
  return typeof img === 'string' && /\.(jpg|png|gif|bmp)$/.test(img)
}

// 默认设置
const toastCfg = {
  // 默认图标
  icon: {
    focus: addIcon,
    favor: addIcon,
    follow: addIcon,
    success: successIcon,
    error: errorIcon,
    warn: warnIcon
  },
  // 默认文案
  msg: {
    focus: '已添加到“我的关注”',
    favor: '已添加到“我的收藏”',
    follow: '已添加到“关注的人”'
  },
  // 默认动画
  animation: {
    focus: 'slide-right',
    favor: 'slide-right',
    follow: 'slide-right',
    success: 'slide-up',
    error: 'slide-up',
    warn: 'slide-up'
  },
  // toast显示时长
  duration: 1500,
  timer: null
}

export default {
  data () {
    return {
      // 是否显示
      showing: false,
      // 1 - 普通，2 - 已添加XXX
      mode: 0,
      // 消息
      msg: '',
      // 图标
      icon: '',
      // 动画
      animation: ''
    }
  },
  methods: {
    /**
     * 显示已添加XXX消息通知
     * e.g. showAdd('focus') - 显示focus的默认文案和默认图标
     * e.g. showAdd('已添加到“我的医院”', 'focus') - 显示自定义文案和focus默认图标
     * e.g. showAdd('已添加到“我的医院”', 'focus', 2000) - 显示自定义文案和focus默认图标，设置显示时长
     * e.g. showAdd('已添加到“我的医院”', require('@/assets/images/mobile/common/expert.png')) - 显示自定义文案和自定义图标
     * @param {*} msg 消息
     * @param {*} type 消息类型 / 图标
     * @param {*} duration 时长
     */
    showAdd (msg, type, duration, animation) {
      this.mode = 2
      this.msg = typeof msg === 'string' ? toastCfg.msg[msg] || msg : ''
      this.icon = isImg(type) ? type : typeof type === 'string' ? toastCfg.icon[type] || '' : toastCfg.icon[msg] || ''
      this.animation = typeof animation === 'string' ? toastCfg.animation[animation] || '' : toastCfg.animation[msg] || ''
      duration = typeof duration === 'number' ? duration : toastCfg.duration

      if (!this.msg) return
      clearTimeout(toastCfg.timer)
      this.showing = true
      toastCfg.timer = null
      toastCfg.timer = setTimeout(() => this.hide(), duration)
    },
    /**
     * 显示普通消息通知
     * e.g. showMsg('已添加到“我的医院”') - 显示自定义文案、无图标
     * e.g. showMsg('成功', 'success') - 显示自定义文案和success默认图标
     * e.g. showMsg('失败', 'error') - 显示自定义文案和error默认图标
     * e.g. showMsg('警告', 'warn') - 显示自定义文案和warn默认图标
     * e.g. showMsg('已添加到“我的医院”', 'focus', 2000) - 显示自定义文案和focus默认图标，设置显示时长
     * e.g. showMsg('已添加到“我的医院”', require('@/assets/images/mobile/common/expert.png')) - 显示自定义文案和自定义图标
     * @param {*} msg 消息
     * @param {*} type 消息类型 / 图标
     * @param {*} duration 时长
     */
    showMsg (msg, type, duration, animation) {
      this.mode = 1
      this.msg = typeof msg === 'string' ? msg : ''
      this.icon = isImg(type) ? type : typeof type === 'string' ? toastCfg.icon[type] || '' : ''
      this.animation = typeof animation === 'string' ? toastCfg.animation[animation] || animation : toastCfg.animation[type] || ''
      duration = typeof duration === 'number' ? duration : toastCfg.duration

      if (!this.msg) return
      clearTimeout(toastCfg.timer)
      this.showing = true
      toastCfg.timer = null
      toastCfg.timer = setTimeout(() => this.hide(), duration)
    },
    /**
     * 自定义显示消息通知
     * e.g. show({ mode: 0, msg: '我们会努力做得更好', icon: require('@/assets/images/mobile/common/expert.png'), duration: 2000, animation: 'slide-up' })
     * @param {*} { mode - 模式, msg - 消息, icon - 图标, duration - 时长, animation - 动画 }
     */
    show ({ mode, msg, icon, duration, animation }) {
      this.mode = mode || 0
      this.msg = msg || ''
      this.icon = icon || ''
      this.animation = typeof animation === 'string' ? toastCfg.animation[animation] || animation : ''
      duration = duration || toastCfg.duration

      if (!this.msg || !this.mode) return
      clearTimeout(toastCfg.timer)
      this.showing = true
      toastCfg.timer = null
      toastCfg.timer = setTimeout(() => this.hide(), duration)
    },
    // 隐藏消息通知
    hide () {
      this.showing = false
      this.mode = 0
      this.icon = ''
      this.msg = ''
      this.animation = ''
    }
  }
}
