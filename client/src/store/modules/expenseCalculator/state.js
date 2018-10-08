/*
 * @Author: arvinlin
 * @Date: 2018-07-17 20:48:03
 * @Last Modified by: arvinlin
 * @Last Modified time: 2018-09-19 15:58:21
 */
import LocationPanel from './model/locationPanel'
import DiseasePanel from './model/diseasePanel'

class State {
  constructor ({
    locationPanelData = {},
    diseasePanelData = {},
    SBTypeSelected = '',
    CBTypeSelected = ''
  }) {
    this.locationPanelData = new LocationPanel(locationPanelData)
    this.diseasePanelData = new DiseasePanel(diseasePanelData)
    this.SBTypeSelected = SBTypeSelected // 不选择为空
    this.CBTypeSelected = CBTypeSelected // 不选择为空
  }
}

export default State
