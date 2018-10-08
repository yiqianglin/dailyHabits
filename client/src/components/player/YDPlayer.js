/* global QMplayer */
(function (window) {
  var QMPLAYER_EVENT = ['play', 'pause', 'ended', 'timeupdate', 'waiting', 'error']
  var AUDIO_EVENT = ['loadedmetadata', 'progress']

  function YDPlayer (options) {
    if (!QMplayer) {
      console.log('QMplayer not loaded')
      return
    }

    var player = new QMplayer(options)

    if (!player.__.audio) {
      console.log('audio not support')
    }
    player._audioEvents = {}
    let audio = player.__.audio
    let events = player._audioEvents

    initListener(audio, events)

    player.bind = initBind(player, events)

    player.getBuffer = initBuffer(audio)

    player.load = initLoad(audio)

    player.setAutoplay = setAutoplay(audio)

    return player
  }

  function initListener (audio, events) {
    if (!audio || !events) return

    AUDIO_EVENT.forEach(function (event) {
      audio.addEventListener(event, function () {
        var handlers = events[event]
        if (handlers && handlers.length) {
          handlers.forEach(function (handler) {
            if (Object.prototype.toString.call(handler) === '[object Function]') {
              handler()
            }
          })
        }
      })
    })
  }

  function initBind (player, events) {
    return function (event, callback) {
      if (QMPLAYER_EVENT.indexOf(event) !== -1) {
        player.on(event, callback)
        return
      }
      if (!events[event]) {
        events[event] = []
      }
      events[event].push(callback)
    }
  }

  function initBuffer (audio) {
    return function () {
      if (!audio || !audio.buffered) return []
      var buffered = audio.buffered
      var result = []
      for (let i = 0; i < buffered.length; i++) {
        var start = buffered.start(i)
        var end = buffered.end(i)
        result.push({
          start,
          end,
          length: end - start
        })
      }
      return result
    }
  }

  function initLoad (audio) {
    return function (src) {
      if (!audio || !/\.mp3/.test(src)) return
      audio.autoplay = false
      audio.src = src
      audio.load()
    }
  }

  function setAutoplay (audio) {
    return function (autoplay) {
      if (!audio) return
      audio.autoplay = !!autoplay
    }
  }

  window.YDPlayer = YDPlayer
})(window)
