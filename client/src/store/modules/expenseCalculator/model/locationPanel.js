/**
 * @param  {Array} data
 * @param  {String} selected
 */
class LocationPanel {
  constructor ({
    autoLocation = '',
    autoLocationStatus = 0,
    GPSData = {},
    selected = '',
    data = []
  }) {
    this.data = data
    this.autoLocation = autoLocation // 自动定位的城市名
    this.autoLocationStatus = autoLocationStatus // 自动定位的状态 1 成功 0 初始化 -1定位失败
    this.GPSData = { // 经纬度
      longitude: GPSData.longitude || '',
      latitude: GPSData.latitude || ''
    }
    this.selected = selected // 最终查询条件的城市名
  }
}

export default LocationPanel
