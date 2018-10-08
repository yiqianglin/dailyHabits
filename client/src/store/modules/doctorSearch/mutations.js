import { doctorSearch as types } from '../../mutation-types'

const mutations = {
  [types.SET_HOSPITAL_SEARCH_FILTER] (state, data) {
    if (data.selectedIndex !== undefined) state.hospitalSearchFilterData.selectedIndex = data.selectedIndex
  },
  [types.SET_HOSPITAL_SEARCH_LIST] (state, data) {
    state.hospitalSearchList = data
  },
  [types.SET_HOSPITAL_INFO] (state, data) {
    const { name, op_logo: opLogo, website, vt_typeinfo: vtTypeInfo } = data
    state.hospitalInfo = { name, op_logo: opLogo, website, vt_typeinfo: vtTypeInfo }
  },
  [types.SET_CONSULTANT_LIST] (state, data) {
    state.consultantList = data
  },
  [types.SET_DOCTOR_SEARCH_LIST] (state, data) {
    state.doctorSearchList = data
  },
  [types.SET_DOCTOR_SEARCH_FILTER] (state, data) {
    if (data.doctorList) { // 修改医生列表，同步到科室、职称的筛选项
      let departmentList = ['全部科室']
      data.doctorList.forEach((itemI, indexI) => {
        let hasFlag = false
        departmentList.forEach(itemJ => {
          if (itemJ === itemI.department) {
            hasFlag = true
          }
        })
        if (!hasFlag) {
          departmentList.push(itemI.department)
        }
      })
      console.log('科室列表：', departmentList)

      let doctitleList = ['全部医师']
      data.doctorList.forEach((itemI, indexI) => {
        let hasFlag = false
        doctitleList.forEach(itemJ => {
          if (itemJ === itemI.doctitle) {
            hasFlag = true
          }
        })
        if (!hasFlag) {
          doctitleList.push(itemI.doctitle)
        }
      })
      console.log('职称列表：', doctitleList)
      console.log(this)
      state.doctorSearchFilterData.departmentList = departmentList
      state.doctorSearchFilterData.doctitleList = doctitleList
    }
    if (data.departmentSelectedIndex !== undefined) {
      state.doctorSearchFilterData.departmentSelectedIndex = data.departmentSelectedIndex
    }
    if (data.doctitleSelectedIndex !== undefined) {
      state.doctorSearchFilterData.doctitleSelectedIndex = data.doctitleSelectedIndex
    }
  },
  [types.SET_LOCATION_PANEL_DATA] (state, data) {
    if (data.data) {
      state.locationPanelData.data = data.data
    }
    if (data.selected) {
      state.locationPanelData.selected = data.selected
    }
  }
}

export default mutations
