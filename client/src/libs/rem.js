(function(document, window){
    var docEl = document.documentElement,
        event = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function(){
            var size = 750;
            var zoom = docEl.clientWidth / size;
            // if(zoom > 1) docEl.style.fontSize = '100px';
            // docEl.style.fontSize = 100 * zoom + 'px';
            if(zoom > 1) {
                docEl.style.fontSize = '100px';
            }else{
                docEl.style.fontSize = 100 * zoom + 'px';
            }
        };
    if(!window.addEventListener) return;
    window.addEventListener(event, recalc, false);
    window.addEventListener('DOMContentLoaded', recalc, false);

    // if(window.FastClick){
    //     document.addEventListener('DOMContentLoaded', function(){
    //         FastClick.attach(document.body);
    //     });
    // }
})(document, window);

