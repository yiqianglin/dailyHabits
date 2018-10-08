(function(document, window) {

    var baike = !!window.baike ? window.baike : {};
    window.baike = baike;
    baike.query = function(query) {
        query = query.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var expr = "[\\?&]" + query + "=([^&#]*)";
        var regex = new RegExp(expr);
        var results = regex.exec(window.location.href);
        if (results !== null) {
            return decodeURIComponent(results[1].replace(/\+/g, " "));
        } else {
            return "";
        }
    };

    baike.get = function(url, params, callback) {
        $.ajax({
            type: 'GET',
            url: url,
            data: params,
            dataType: 'json',
            timeout: 10000,
            headers: {
                'bk-uri': location.href,
                'adtag': baike.getAdtag()
            },
            success: function(res) {
                if (res.retcode === 302) {
                    baike.setCookie('bk_uri', location.href);
                    location.href = res.redirect_uri;
                    return;
                } else if ($.isFunction(callback)) {
                    callback(res);
                }
            }
        })
    };

    baike.post = function(url, params, callback, sendReport, errcallback) {
        $.ajax({
            type: 'POST',
            url: url,
            data: params,
            dataType: 'json',
            timeout: 10000,
            headers: {
                'bk-uri': location.href,
                'adtag': baike.getAdtag()
            },
            success: function(res) {
                if (res.retcode === 302) {
                    baike.setCookie('bk_uri', location.href);
                    location.href = res.redirect_uri;
                    return;
                } else if ($.isFunction(callback)) {
                    callback(res);
                }
            }
        })


    };

    baike.isFunction = function(fn) {
        return Object.prototype.toString.call(fn) === '[object Function]';
    };

    baike.getAdtag = function() {
        var adtag = baike.query('adtag') || (!!sessionStorage ? sessionStorage.getItem('bk_adtag') : false) || baike.getCookie('bk_adtag') || '';
        return adtag;
    };

    baike.getNetworkType = function () {
       var connection =  navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
       return connection.type || connection.effectiveType;
    };

    baike.getCookie = function(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return "";
    };

    baike.setCookie = function(name, value) {
        var Days = 1;
        var exp = new Date();
        if (!value) {
            value = name;
            name = 'adtag';
        }
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";path=/;domain=.qq.com;expires=" + exp.toGMTString();
    };

    baike.hasClass = function(obj, cls) {
        return new RegExp('(\\s|^)' + cls + '(\\s|$)').test(obj.className);
    };

    baike.addClass = function(obj, cls) {
        if (!baike.hasClass(obj, cls)) obj.className += " " + cls;
    };

    baike.removeClass = function(obj, cls) {
        if (baike.hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    };

    baike.setShare = function(shareData) {
        if (window.wx) {
            wx.ready(function() {
                // 分享给朋友
                wx.onMenuShareAppMessage({
                    title: shareData.friendTitle, // 分享标题
                    desc: shareData.friendContent, // 分享描述
                    link: shareData.link, // 分享链接
                    imgUrl: shareData.image, // 分享图标 type: '',  分享类型,music、video或link，不填默认为link dataUrl: '', 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        MtaH5.clickStat(shareData.activity + '_share_wechat_friend'); //微信好友；
                    }
                });
                wx.onMenuShareTimeline({
                    title: shareData.timelineTitle, // 分享标题
                    link: shareData.link, // 分享链接
                    imgUrl: shareData.image, // 分享图标
                    success: function () {
                        MtaH5.clickStat(shareData.activity + '_share__wechat_moments'); //微信朋友圈
                    }
                });
                wx.onMenuShareQQ({
                    title: shareData.friendTitle, // 分享标题
                    desc: shareData.friendContent, // 分享描述
                    link: shareData.link, // 分享链接
                    imgUrl: shareData.image, // 分享图标 type: '',  分享类型,music、video或link，不填默认为link
                    success: function () {
                        MtaH5.clickStat(shareData.activity + '_share_qq'); //QQ分享
                    },
                });
                wx.onMenuShareQZone({
                    title: shareData.friendTitle, // 分享标题
                    desc: shareData.friendContent, // 分享描述
                    link: shareData.link, // 分享链接
                    imgUrl: shareData.image, // 分享图标 type: '',  分享类型,music、video或link，不填默认为link
                    success: function () {
                        MtaH5.clickStat(shareData.activity + '_share_qzone'); //qq控件
                    },
                });
            });
        }
    };

    baike.isPhoneNum = function(phone) {
        return /^1[34578]\d{9}$/.test(phone)
    };

    baike.getUrl = function(url) {
        var tag = baike.query('adtag');
        if (url.match(/([\\?&]adtag=)[^&#]*/) || !tag || tag !== 'tx.wx.hr') {
            return url;
        }
        var query = '?adtag=' + tag;
        var arr = url.split('?');
        // HR版返回HR版首页
        arr[0] = arr[0].replace('enter.html', 'enter_hr.html');
        if (arr[1]) {
            query += '&' + arr[1];
        }
        var res = arr[0] + query;
        return res;
    };

    baike.isWeixin = function() {
        var reg = /MicroMessenger/i;
        return reg.test(navigator.userAgent);
    };
    baike.isUCBrowser = function() {
        var re = /UCBrowser/ig,
            that = this;
        return re.test(navigator.userAgent);
    };

    baike.isQQBrowser = function() {
        var re = /MQQBrowser/ig,
            that = this;
        return re.test(navigator.userAgent) && !baike.isMobileQQ() && !baike.isWeixin();
    };

    baike.isAndroid = function() {

        var re = /Android/ig,
            that = this;
        return re.test(navigator.userAgent);
    };

    baike.isMobileQQ = function() {

        var re = /\s+qq/ig,
            that = this;
        return re.test(navigator.userAgent);
    };
    baike.getPlatform = function() {
        var ua = navigator.userAgent;
        if (/micromessenger/i.test(ua)) {
            return 'wx';
        }
        if (/qq\//i.test(ua) || /qq/i.test(ua) && !/qqbrowser/i.test(ua)) {
            return 'qq';
        }
        return '';
    };

    if (!!window.addEventListener) {

        window.addEventListener('DOMContentLoaded', function() {

            baike.getPlatform() == 'wx' && baike.get('/mobile/get_wx_config', {}, function(o) {
                window['wx'] && window['wx'].config({
                    appId: o.appId || '',
                    timestamp: o.timestamp,
                    nonceStr: o.nonceStr,
                    signature: o.signature,
                    jsApiList: [
                        'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'onMenuShareQZone',
                        'hideMenuItems',
                        'showMenuItems',
                        'hideAllNonBaseMenuItem',
                        'showAllNonBaseMenuItem',
                        'translateVoice',
                        'startRecord',
                        'stopRecord',
                        'onVoiceRecordEnd',
                        'playVoice',
                        'onVoicePlayEnd',
                        'pauseVoice',
                        'stopVoice',
                        'uploadVoice',
                        'downloadVoice',
                        'chooseImage',
                        'previewImage',
                        'uploadImage',
                        'downloadImage',
                        'getNetworkType',
                        'openLocation',
                        'getLocation',
                        'hideOptionMenu',
                        'showOptionMenu',
                        'closeWindow',
                        'scanQRCode',
                        'chooseWXPay',
                        'openProductSpecificView',
                        'addCard',
                        'chooseCard',
                        'openCard'
                    ]
                });
            });
        }, false);
    }


})(document, window);