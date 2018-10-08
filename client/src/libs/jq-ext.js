/**
 * Created by agenalzhu on 2017/11/28.
 */
(function($){
    var _ajax = $.ajax;
    //重写jquery的ajax方法
    $.ajax = function(opt){
        var _complete = opt.complete, _beforeSend = opt.beforeSend, url = opt.url || '', timecount = !opt.timestop, starttime = (new Date()).valueOf();
        var _opt = $.extend(opt, {
            beforeSend: function (xhr, ts) {
                starttime = (new Date()).valueOf();
                $.isFunction(_beforeSend) && _beforeSend(xhr, ts);
            },
            complete: function(xhr, ts){
                var el = $('#xnsb');
                if(el.length != 0){
                    var proj = el.attr('proj') || '', hook  = el.attr('hook') || '';
                    var ispage = !!hook && new RegExp(hook,'g').test(url);
                    if(!!timecount || ispage){
                        var uri = location.protocol + '//' + location.host + location.pathname, action = url;
                        try{
                            if(ispage){
                                starttime = performance.timing.navigationStart || 0;
                            }
                            if(starttime == 0){
                                return;
                            }
                            var time = (new Date()).valueOf() - starttime;
                            var img = new Image();
                            if(location.host === 'h5.baike.qq.com'){
                                img.src = '//baike.qq.com/common/reporter/time?proj=' + proj + '&uri='+ uri + '&action=' + action + '&ispage=' + (ispage ? '1' : '') + '&time=' + time;
                            }else{
                                img.src = '//common.sparta.html5.qq.com/reporter/time?proj=' + proj + '&uri='+ uri + '&action=' + action + '&ispage=' + (ispage ? '1' : '') + '&time=' + time;
                            }
                        }catch (e){
                            console.error(e);
                        }
                    }
                }

                $.isFunction(_complete) && _complete(xhr, ts);
            }
        });
        return _ajax(_opt);
    };
})($);