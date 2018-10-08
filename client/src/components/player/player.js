/* global YDPlayer, $, baike */
// <script src="/res/libs/vue-slider/vue-slider.min.js"></script>
// <script src="//y.gtimg.cn/music/h5/player/player.js?max_age=2592000"></script>
// <script src="./../res/components/player/YDPlayer.js" inline></script>
import vueSlider from 'src/libs/vue-slider.min'
import './YDPlayer'

import filters from 'src/js/filters'

var util = {
  dotSize: window.innerWidth / 750 * 20,
  disableScroll: function (disable) {
    if (disable) {
      this.scrollTop = $(window).scrollTop()
      document.body.classList.add('disscroll')
      document.body.style.top = -this.scrollTop + 'px'
    } else {
      document.body.classList.remove('disscroll')
      document.body.scrollTop = this.scrollTop
      document.body.style.top = ''
    }
  },
  startTime: 0,
  pauseTime: 0,
  elapsedTime: 0
}

export default {
  props: {
    options: {
      type: Object,
      default: function () {
        return {
          mode: 0,
          fixed: true
        }
      }
    },
    audio: {
      type: Object,
      default: function () {
        return {
          src: '',
          size: 0,
          duration: 0
        }
      }
    }
  },
  data () {
    return {
      currentTime: 0,
      sliderOps: {
        max: 0,
        interval: 1,
        tooltip: false,
        lazy: true,
        dotSize: util.dotSize
      },
      progress: [],
      maxTime: 0,
      play: false,
      stopFromPlaying: false,
      mode: 0,
      fixed: true,
      player: null
    }
  },
  computed: {
  },
  components: {
    VueSlider: vueSlider
  },
  filters: {
    formatTime: filters.formatTime
  },
  created () {
    this.refresh()
  },
  mounted () {
    this.bind()
  },
  destroyed () {
    this.closeMini()
    if (util.elapsedTime < this.maxTime / 100) return
    baike.mtaReport(`audio_play_pause:${this.audio.docid}_${this.maxTime}_${util.elapsedTime}`)
  },
  methods: {
    refresh () {
      this.mode = this.options.mode || this.mode
      this.fixed = this.options.fixed || this.fixed
      this.src = this.audio.src || this.src
      this.maxTime = this.audio.duration || this.maxTime
      this.sliderOps.max = this.maxTime
      this.resetPlayer()
    },
    resetPlayer () {
      if (!this.src || !YDPlayer) return

      if (!this.player) {
        var player = new YDPlayer({
          loop: false,
          target: 'auto'
        })

        player.bind('loadedmetadata', () => {
          this.maxTime = player.duration
          this.sliderOps.max = this.maxTime
        })

        player.bind('play', () => {
          util.startTime = this.currentTime
          if (!this.audio || !this.audio.docid || this.currentTime > this.maxTime / 100) return
          baike.mtaReport('audio_play_start:' + this.audio.docid)
        })

        player.bind('pause', () => {
          util.pauseTime = this.currentTime
          util.elapsedTime += util.pauseTime - util.startTime
        })

        player.bind('ended', () => {
          this.play = false
          if (!this.audio || !this.audio.docid) return
          baike.mtaReport('audio_play_ended:' + this.audio.docid)
        })

        player.bind('timeupdate', () => {
          if (this.stopFromPlaying) return
          this.currentTime = player.currentTime
        })

        player.bind('progress', () => {
          this.progress = (player.getBuffer() || []).map(item => {
            if (item.length) {
              let length = item.length / this.maxTime * 100
              item.style = `left: ${item.start}px;width: ${length}%;`
            }
            return item
          })
        })

        this.player = player
      }

      this.player.load(this.src)
    },
    updateFromCtrl (time) {
      if (!this.player) return

      this.player.pause()
      this.stopFromPlaying = true
      this.currentTime = time
      this.$nextTick(() => {
        this.play = true
        this.stopFromPlaying = false
        this.player.play(this.src)
        this.player.currentTime = this.currentTime
      })
    },
    togglePlay () {
      if (!this.player) return

      this.play = !this.play
      if (this.play) {
        this.player.setAutoplay(true)
        this.player.play(this.src)
      } else {
        this.player.pause()
      }

      this.$emit('callback', 'playStateChange', this.play)
    },
    dragCtrl () {
      this.stopFromPlaying = true
      baike.mtaReport('ydd_audiodoc_procebar')
    },
    showMini () {
      this.mode = 0
    },
    closeMini () {
      this.mode = -1
      this.play = false
      if (this.player) {
        this.player.pause()
      }
      this.$emit('callback', 'close')
    },
    showFull () {
      this.mode = 1
      if (this.fixed) {
        util.disableScroll(true)
      }
    },
    closeFull () {
      this.mode = 0
      if (this.fixed) {
        util.disableScroll(false)
      }
    },
    bind () {
      // window.addEventListener('pagehide', () => {
      //   if (util.elapsedTime < this.maxTime / 100) return
      //   baike.lstore.setItem('audio_play_pause', `${this.audio.docid}_${this.maxTime}_${util.elapsedTime}`, 7 * 24 * 60)
      // })
    }
  }
}
