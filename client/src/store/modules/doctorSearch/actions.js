/* global baike */
import { doctorSearch as types } from '../../mutation-types'

const resolveCity = (cities) => {
  let cityMap = {}
  cities = [{ name: '全部城市', letter: '#' }, ...cities]
  cities.forEach(city => {
    let letter = city.letter.toUpperCase()
    cityMap[letter] = cityMap[letter] || []
    if (cityMap[letter].indexOf(city.name) === -1) {
      cityMap[letter].push(city.name)
    }
  })
  let locations = []
  for (let key of Object.keys(cityMap)) {
    locations.push({
      name: key,
      city: cityMap[key].map(name => { return { name } })
    })
  }
  return locations
}

const actions = {
  /**
   * 获取医院列表信息
   * @param  {} {commit}
   * @param  {} params
   */
  async getTumourHospital ({ commit }, params) {
    const url = '/mobile/getTumourHospital'
    const result = await new Promise((resolve, reject) => {
      baike.post(
        url,
        {
          city: params.city || '',
          disease: params.disease || ''
        },
        data => {
          if (data.retcode === 0) {
            commit(types.SET_HOSPITAL_SEARCH_LIST, data.hospitals)
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
   * 获取肿瘤医生联想词
   * @param  {} {commit}
   * @param  {} params
   */
  async sugTumourDoctorFilter ({ commit }, params) {
    const url = '/mobile/sugTumourDoctorFilter'
    const result = await new Promise((resolve, reject) => {
      baike.post(
        url,
        {
          query: params.query || '',
          disease: params.disease || '',
          city: params.city || '',
          hospital_id: params.hospital_id || ''
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
   * 根据id获取医院详细信息
   * @param  {} {commit}
   * @param  {} params
   */
  async getHospitalInfo ({ commit }, params) {
    const url = '/mobile/getHospitalInfo'
    const result = await new Promise((resolve, reject) => {
      baike.post(url, {
        hospital_id: params.hospital_id || '',
        disease: params.disease || ''
      },
      data => {
        if (data.retcode === 0) {
          commit(types.SET_HOSPITAL_INFO, data)
          resolve(data)
        } else {
          reject(data)
        }
      })
    })
    return result
  },

  /**
   * 获取肿瘤医生
   * @param  {} {commit}
   * @param  {} params
   */
  async getTumourDoctor ({ commit, dispatch }, params) {
    const url = '/mobile/getTumourDoctor'
    const result = await new Promise((resolve, reject) => {
      baike.post(
        url,
        {
          hospital_id: params.hospital_id,
          disease: params.disease || ''
        },
        data => {
          if (data.retcode === 0) {
            // data.doctors.forEach((item) => {
            //   if (item.name === '李亚芬') {
            //     item.other_depart = ['其他科室1', '其他科室2']
            //   }
            // })
            commit(types.SET_DOCTOR_SEARCH_LIST, data.doctors)
            // 更新可咨询标志
            dispatch('getDoctorBaseInfoListHdf', { type: 1 })
            resolve(data)
          } else {
            reject(data)
          }
        }
      )

      /* var data = {
        retcode: 0,
        list: [
          {
            name: 'aaa医生',
            department: '内科',
            doctitle: '高级医师',
            image: 'http://store-30017.sz.gfp.tencent-cloud.com/201807/徐兵河/d6bfbc40-916e-11e8-81f1-3db0bc0c5ddd_0.png',
            hospital: '复旦大学附属华山医院',
            tag: ['乳腺癌', '肺癌', '肿瘤']
          },
          {
            name: 'aaa医生',
            department: '内科',
            doctitle: '副高级医师',
            image: 'http://store-30017.sz.gfp.tencent-cloud.com/201807/徐兵河/d6bfbc40-916e-11e8-81f1-3db0bc0c5ddd_0.png',
            hospital: '复旦大学附属华山医院',
            tag: ['乳腺癌']
          },
          {
            name: 'aab医生',
            department: '儿科',
            doctitle: '副高级医师',
            image: 'http://store-30017.sz.gfp.tencent-cloud.com/201807/徐兵河/d6bfbc40-916e-11e8-81f1-3db0bc0c5ddd_0.png',
            hospital: '复旦大学附属华山医院',
            tag: ['乳腺癌', '肺癌', '肿瘤']
          },
          {
            name: 'bbb医生',
            department: '内科',
            doctitle: '主任医师',
            image: 'http://store-30017.sz.gfp.tencent-cloud.com/201807/张建中/d836f2f0-916e-11e8-b5e3-6f09243350ce_0.png',
            hospital: '复旦大学附属华山医院',
            tag: ['乳腺癌']
          },
          {
            name: 'bbb医生',
            department: '儿科',
            doctitle: '副主任医师',
            image: 'http://store-30017.sz.gfp.tencent-cloud.com/201807/霍勇/d34318a0-916e-11e8-b5e3-6f09243350ce_0.png',
            hospital: '复旦大学附属华山医院',
            tag: ['乳腺癌', '肺癌', '肿瘤']
          },
          {
            name: 'bbb医生',
            department: '内科',
            doctitle: '院长',
            image: 'http://store-30017.sz.gfp.tencent-cloud.com/201807/霍勇/d34318a0-916e-11e8-b5e3-6f09243350ce_0.png',
            hospital: '复旦大学附属华山医院',
            tag: ['乳腺癌', '肿瘤']
          }
        ]
      }
      setTimeout(() => {
        commit(types.SET_DOCTOR_SEARCH_LIST, data.list)
        resolve(data)
      }, 500)
    */
    })
    return result
  },

  /**
   * 获取可咨询医生
   * @param  {} {commit}
   * @param  {} params
   */
  async getDoctorBaseInfoListHdf ({ commit }, params) {
    const url = '/mobile/getDoctorBaseInfoListHdf'
    const result = await new Promise((resolve, reject) => {
      baike.post(url, {
        hospital_id: params.hospital_id,
        disease: params.disease || '',
        type: params.type || 0,
        doctors: params.doctors || []
      }, o => {
        if (o.retcode !== 0) return reject(o)

        // o.doctors.forEach((item) => {
        //   item.hdfUrl = Math.random() > 0.5
        //   item.city = Math.random() > 0.5 ? { name: '北京', letter: 's' } : Math.random() > 0.5 ? { name: '广州', letter: 'g' } : { name: '上海', letter: 's' }
        // })
        if (params.type === 1) {
          commit(types.SET_CONSULTANT_LIST, o.doctors.filter(doctor => doctor.hdfUrl))
        } else {
          commit(types.SET_CONSULTANT_LIST, o.doctors)

          let cities = resolveCity(o.doctors.map(doctor => doctor.city))
          commit(types.SET_LOCATION_PANEL_DATA, { data: cities, selected: '全部城市' })
        }
        resolve(o)
      }
      )
    })
    return result
  }
}

export default actions
