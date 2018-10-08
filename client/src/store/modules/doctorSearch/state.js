/*
 * @Author: arvinlin
 * @Date: 2018-08-20 20:48:03
 * @Last Modified by: arvinlin
 * @Last Modified time: 2018-08-25 19:23:36
 */
import LocationPanel from '../expenseCalculator/model/locationPanel'

class State {
  constructor (locationPanelData = {}) {
    /* 医院搜索页面 */
    this.hospitalSearchList = [] // 医院检索结果列表
    // this.hospitalSearchFilterData = { // 医院检索条件
    //   selectedIndex: 0,
    //   locationData: ['全部', '北京', '深圳', '广州']
    // }
    this.doctorSmartSearchList = [] // 医生关键词提示搜索面板结果列表

    /* 医生搜索页面 */
    this.hospitalInfo = {} // 当前选择的医院信息
    // this.doctorSearchFilterData = {
    //   departmentList: [], // 科室
    //   departmentSelectedIndex: 0,
    //   doctitleList: [], // 职称
    //   doctitleSelectedIndex: 0
    // }
    this.doctorSearchList = [] // 全部医生列表
    this.locationPanelData = new LocationPanel(locationPanelData) // 城市列表
    this.consultantList = [] // 可咨询医生
  }
}

export default State
