
/* global baike, $, MtaH5 */
/*
 * @fileOverview 新版上报
 * @author yeonzhou
 * @version 1.0.0
 */
import service from './service'

export default {
  install: (Vue) => {
    /**
   * @class Report
   * @return {Object} sendPv,sendClick
   */
    class Report {
      constructor () {
        this.params = {
          useragent: navigator.userAgent
        }
        // 先不上点击
        // this.autoReport()
      }
      MtaH5Report (tags, ptag) {
        var hrtag = tags[1]
        if (ptag[1]) {
          window.MtaH5 && MtaH5.clickStat(ptag[0], {
            'value': ptag[1]
          })
        } else {
          window.MtaH5 && MtaH5.clickStat(ptag[0])
        }
        if (hrtag) {
          window.MtaH5 && MtaH5.clickStat(hrtag)
        }
      }
      reportNotAllowed (ptag) {
        // 只需要上报mta，不需要上报action的event,加入下面黑名单
        var reportBlackList = ['main_smallbn_show', 'list_topbn_show', 'main_bn_show', 'emergency_topbn_show', 'content_endbn_show', 'cardwitha_topbc_show', 'detail_endbn_show']
        return reportBlackList.indexOf(ptag[0]) > -1
      }
      /**
      * 点击上报
      * @param {string} event: 事件id
      * @param {Object} actionData: {cata : list,text:xxx, postion:x }
      * @param {boolean} isUrl: isUrl表示是否是url的ptag上报
      */
      sendClick (event, actionData, isUrl) {
        if (event === 'undefined') event = ''
        if (!event && !isUrl && !actionData) return
        if (event === 'pv') {
          window.MtaH5 && MtaH5.pgv()
          event = ''
        }
        var tags = event.split(',')
        var ptag = tags[0].split(/\||:/)
        // mta上报
        this.MtaH5Report(tags, ptag)
        if (this.reportNotAllowed(ptag)) return
        var referrer = (document.referrer || '')
        var curUrl = (window.location.href || '')
        try {
          referrer = encodeURI(decodeURI(referrer))
          curUrl = encodeURI(decodeURI(curUrl))
        } catch (e) { }
        var reportActionData = {
          time: new Date().getTime(),
          current: (isUrl && event ? referrer : curUrl) || '',
          event: (referrer === curUrl && isUrl ? '' : ptag[0]) || '',
          value: (referrer === curUrl && isUrl ? '' : ptag[1]) || ''
        }
        if (actionData) reportActionData = $.extend(reportActionData, actionData, this.params)
        service.post('ReportAction', reportActionData)
      }

      // 自动上报点击
      autoReport () { // mta上报，属性key为ptag，值为ptag|index
        $('body').off('tap').on('tap', (e) => {
          e = e || window.event
          if (e) {
            var targetNode = e.srcElement || e.target
            var ptag = ''
            var tourl = ''
            while (!tourl && targetNode && targetNode.nodeName !== 'BODY' && targetNode.getAttribute) {
              tourl = targetNode.getAttribute('tourl') || ''
              ptag = targetNode.getAttribute('ptag') || ''
              if (!tourl) {
                targetNode = targetNode.parentNode
              }
            }
            if (tourl) {
              baike.goToUrl(baike.replaceParam('ptag', ptag, tourl))
            } else {
              ptag = ''
              targetNode = e.srcElement || e.target
              while (!ptag && targetNode && targetNode.nodeName !== 'BODY' && targetNode.getAttribute) {
                ptag = targetNode.getAttribute('ptag') || ''
                if (!ptag) {
                  targetNode = targetNode.parentNode
                }
              }
              this.sendClick(ptag)
            }
          }
        })
      }
      /**
      * pv上报
      * @param {Object} to: 即将要进入的目标 路由对象
      * @param {Object} from: 当前导航正要离开的路由
      */
      sendPV (to, from) {
        var event = from.name ? (to.query.ptag || '') : ''
        // mta 上报
        var tags = event.split(',')
        var ptag = tags[0].split(/\||:/)
        // this.MtaH5Report(tags, ptag)
        if (this.reportNotAllowed(ptag)) return
        // 用户行为上报
        var referrer = !from.name ? document.referrer : `${location.origin}${from.fullPath}` // 刷新时refer取值
        var curUrl = `${location.origin}${to.fullPath}` || ''
        try {
          referrer = encodeURI(decodeURI(referrer))
          curUrl = encodeURI(decodeURI(curUrl))
        } catch (e) { }
        var reportActionData = {
          time: new Date().getTime(),
          referer: referrer || '',
          current: (event ? referrer : curUrl) || '',
          event: 'pv' // 刷新时from.name为null
        }
        Object.assign(reportActionData, this.params)
        service.post('ReportAction', {
          payload: reportActionData,
          client: {
            vnk: to.query.VNK // 用于关联一个页面的所有请求
          }
        })
      }
    }
    return new Report()
  }
}
