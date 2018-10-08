$(function () {
    var popup = {
        init() {
            var that = this,
                channel = baike.query('channel');
            if (!!channel && !that.getStorage('isPopupShowed')) {
                that.add();
                that.load(channel);

                $('html').delegate('.chnl-popup .mask, .chnl-popup .close', 'click', function (e) {
                    popup.hide();
                });

                $('html').delegate('.chnl-popup .image', 'click', function (e) {
                    var href = $(this).data('href');
                    if(!!href){
                        MtaH5.clickStat("ydd_main_adwindowx_clk");
                        var adtag = baike.query('adtag');
                        if(!!adtag){
                            adtag = `${/\?/ig.test(href) ? '&' : '?'}adtag=${adtag}`;
                        }
                        that.setStorage('isPopupShowed', true);
                        location.href = href + adtag;
                    }
                });
            }
        },
        load(channel) {
            var that = this;
            baike.post('/mobile/getHomePopup', {channel: channel}, function (o) {
                if(o.popups.length > 0 && !!o.popups[0].image && !!o.popups[0].redirectUrl){
                    that.show();
                    var image = new Image;
                    image.src = o.popups[0].image;
                    image.onload = ()=>{
                        $('.chnl-popup .image').attr('src', o.popups[0].image).data('href', o.popups[0].redirectUrl);
                        that.show();
                    };
                }
            });
        },
        show() {
            MtaH5.clickStat("ydd_main_adwindowx");
            $('.chnl-popup').show();
        },
        hide() {
            MtaH5.clickStat("ydd_main_adwindowx_close");
            $('.chnl-popup').hide();
            this.setStorage('isPopupShowed', true);
        },
        setStorage(k, v) {
            if (!k) return;
            !!localStorage ? localStorage.setItem(k, v) : baike.setCookie(k, v);
        },
        getStorage(k) {
            if (!k) return;
            return !!localStorage ? localStorage.getItem(k) : baike.getCookie(k);
        },
        add() {
            var html = `<div class="chnl-popup"><div class="mask"></div><div class="content"><div class="close"></div><img class="image" src=""></div></div>`;
            $('body').append(html);
        }
    };
    popup.init();
    window.baike.POPUP = popup;
});