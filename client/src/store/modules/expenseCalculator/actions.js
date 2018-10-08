/* global baike, wx */
const actions = {
  /**
   * 获取肿瘤治疗费用工具筛选条件
   * @param  {} {commit}
   * @param  {} params
   */
  async getDiseaseCostFilter ({ commit }, params) {
    const url = '/mobile/getDiseaseCostFilter'
    const result = await new Promise((resolve, reject) => {
      baike.post(
        url,
        {
          type: params.type || '',
          city: params.city || '',
          insure_type: params.insure_type || '',
          insure_person: params.insure_person || '',
          hospital_grade: params.hospital_grade || ''
        },
        data => {
          if (data.retcode === 0) {
            resolve(data)
          } else {
            reject(data)
          }
        }
      )
    })
    return result
  },
  /**
   * 获取城市列表
   * @param  {} {commit}
   * @param  {} params
   */
  async getCityList ({ dispatch, commit }, params) {
    const result = await dispatch('getDiseaseCostFilter', params)
    commit('SET_LOCATION_PANEL_DATA', { data: result.citylist })
    return result
  },
  /**
   * getLocation
   * 获取位置信息
   */
  async getLocation () {
    let data = {}
    try {
      if (baike.isWeixin() && window.wx) {
        console.log('微信定位中...')
        data = await actions.wxGetLocation()
        console.log('微信定位返回:', data)
        if (data.latitude || data.longitude) {
          // 如果有返回经纬度
          console.log('微信返回有经纬度')
          return data
        } else {
          console.log('微信返回无经纬度')
          return data
        }
      }
      console.log('h5定位中....')
      if (navigator.geolocation) {
        return await new Promise((resolve, reject) => {
          let hasGetLocationInH5 = false
          navigator.geolocation.getCurrentPosition(
            position => {
              console.log('定位callback', position)
              data.latitude = position.coords.latitude // 获取纬度
              data.longitude = position.coords.longitude // 获取经度
              hasGetLocationInH5 = true
              resolve(data)
            },
            error => {
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  console.log('定位失败,用户拒绝请求地理定位')
                  // alert('定位失败,用户拒绝请求地理定位')
                  break
                case error.POSITION_UNAVAILABLE:
                  console.log('定位失败,位置信息是不可用')
                  // alert('定位失败,位置信息是不可用')
                  break
                case error.TIMEOUT:
                  console.log('定位失败,请求获取用户位置超时')
                  // alert('定位失败,请求获取用户位置超时')
                  break
                case error.UNKNOWN_ERROR:
                  console.log('定位失败,定位系统失效')
                  // alert('定位失败,定位系统失效')
                  break
                default:
                  // alert('不知名错误')
                  console.log('不知名错误', error.message, error.code)
                  break
              }
              console.log('失败后，若后台已经返回了')
              hasGetLocationInH5 = false
              // 失败后，若后台已经返回了
              reject(error)
            },
            {
              enableHighAccuracy: false,
              timeout: 3000,
              maximumAge: 86400000 * 5
            }
          )
          setTimeout(() => {
            if (!hasGetLocationInH5) {
              console.log('定时器返回的data!!!!!!!!!!!!!!')
              resolve(data)
            }
          }, 3500)
        })
          .then((data) => {
            console.log('h5 定位成功')
            return data
          })
          .catch((e) => {
            console.log('catch h5定位失败')
            return data
          })
      }
      return await data
    } catch (e) {
      console.log('try报错被捕捉', data)
      return data
    }
  },

  /**
   * 微信获取所在城市 api调用
   */
  async wxGetLocation () {
    const temp = await new Promise((resolve, reject) => {
      // if (_ENV_ === 'development') {
      //   resolve({
      //     latitude: 39.95933,
      //     longitude: 116.29845
      //   })
      // }
      wx.ready(function () {
        wx.getLocation({
          type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function (res) {
            var latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
            var longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
            console.log('微信定位成功:', res)
            resolve({
              latitude,
              longitude
            })
          },
          fail (err) {
            if (err) {
              console.log('微信定位错误:', err)
            }
            resolve({})
          },
          cancel (res) {
            console.log('微信定位，用户取消:', res)
            resolve({})
          }
        })
      })
    })
    return temp
  },

  /**
   * 根据经纬度获取城市名
   * @param {any} { commit } store
   * @param {any} { latitude, longitude } 经纬度
   * @returns data
   */
  async getCityName ({ commit }, { latitude, longitude }) {
    const result = await new Promise((resolve, reject) => {
      // setTimeout(() => {
      //   resolve({'cityname': '上海', retcode: 0})
      // }, 1000)
      baike.post(
        '/mobile/conConvLatLng2Addr',
        {
          lat: latitude,
          lng: longitude
        },
        data => {
          console.log('根据经纬度返回的城市:', data)
          if (data.retcode === 0) {
            resolve(data)
          } else {
            reject(data)
          }
        },
        null,
        err => {
          reject(err)
        }
      )
    })
    return result
  }

}

export default actions
