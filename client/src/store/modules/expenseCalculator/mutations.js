import * as types from '../../mutation-types'

const mutations = {
  [types.expenseCalculator.SET_DISEASE_PANEL_DATA] (state, data) {
    if (data.data) {
      state.diseasePanelData.data = data.data
    }
    if (data.selected) {
      state.diseasePanelData.selected = data.selected
    }
    this.commit('expenseCalculator/saveLocalStorage')
  },
  [types.expenseCalculator.SET_LOCATION_PANEL_DATA] (state, data) {
    if (data.data) {
      state.locationPanelData.data = data.data
    }
    if (data.selected) {
      state.locationPanelData.selected = data.selected
    }
    if (data.autoLocation) {
      state.locationPanelData.autoLocation = data.autoLocation
      // // 自定定位成功返回了城市
      // // case 1: 城市列表已经获取，用户没有选择   判断自动获取的城市名是否在data里面，在就把selected赋值
      // // case 2: 城市列表已经获取，用户已经选择   不管
      // // case 3: 城市列表还没获取到   不管
      // if (state.locationPanelData.data.length > 0 && state.locationPanelData.selected === '') {
      //   let hasFlag = false
      //   state.locationPanelData.data.filter((item, index) => {
      //     if (item) {
      //       item.city.filter((itemi, indexi) => {
      //         if (itemi.name === state.locationPanelData.autoLocation) {
      //           hasFlag = true
      //           state.locationPanelData.selected = itemi.name
      //         }
      //         return hasFlag
      //       })
      //     }
      //     return hasFlag
      //   })
      // }
    }
    if (data.autoLocationStatus) {
      state.locationPanelData.autoLocationStatus = data.autoLocationStatus
    }
    this.commit('expenseCalculator/saveLocalStorage')
  },
  [types.expenseCalculator.SET_SBTYPE_SELECTION] (state, data) {
    state.SBTypeSelected = data.selected
    this.commit('expenseCalculator/saveLocalStorage')
  },
  [types.expenseCalculator.SET_CBTYPE_SELECTION] (state, data) {
    state.CBTypeSelected = data.selected
    this.commit('expenseCalculator/saveLocalStorage')
  },
  saveLocalStorage (state) {
    let data = {
      locationPanelData: {
        autoLocation: state.locationPanelData.autoLocation,
        autoLocationStatus: state.locationPanelData.autoLocationStatus,
        GPSData: state.locationPanelData.GPSData,
        selected: state.locationPanelData.selected
      },
      SBTypeSelected: state.SBTypeSelected,
      CBTypeSelected: state.CBTypeSelected,
      tiemStemp: (new Date()).getTime()
    }
    localStorage.setItem('state_expenseCalculator', JSON.stringify(data))
  }
}

export default mutations
