
//设置最小高度,输入框和底部菜单问题
$('body').css('min-height', $(window).height());


//定义公共url前缀
var ajaxUrl='http://testmanage.aiganyisheng.net/product/app/';

//定义全局变量
var userName = localStorage.getItem("userName"),
    openId = localStorage.getItem("openId");


//获取地址中的信息
function GetQueryString(name) {
    /*定义正则，用于获取相应参数*/
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    /*字符串截取，获取匹配参数值*/
    var r = window.location.search.substr(1).match(reg);
    /*返回参数值*/
    if (r != null) {
        return decodeURI(r[2]);
    } else {
        return null;
    }

}
//返回箭头
$('.goback').swipe({
    tap: function(e) {
        window.history.go(-1);
        e.preventDefault();
    }
});

$(document).on('touchmove', function(e) {
    e.preventDefault();
});
(function($) {
    // Determine if we on iPhone or iPad
    var isiOS = false;
    var agent = navigator.userAgent.toLowerCase();
    if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0) {
        isiOS = true;
    }

    $.fn.doubletap = function(onDoubleTapCallback, onTapCallback, delay) {
        var eventName, action;
        delay = delay == null ? 500 : delay;
        eventName = isiOS == true ? 'touchend' : 'click';

        $(this).bind(eventName, function(event) {
            var now = new Date().getTime();
            var lastTouch = $(this).data('lastTouch') || now + 1 /** the first time this will make delta a negative number */ ;
            var delta = now - lastTouch;
            clearTimeout(action);
            if (delta < 500 && delta > 0) {
                if (onDoubleTapCallback != null && typeof onDoubleTapCallback == 'function') {
                    onDoubleTapCallback(event);
                }
            } else {
                $(this).data('lastTouch', now);
                action = setTimeout(function(evt) {
                    if (onTapCallback != null && typeof onTapCallback == 'function') {
                        onTapCallback(evt);
                    }
                    clearTimeout(action); // clear the timeout
                }, delay, [event]);
            }
            $(this).data('lastTouch', now);
        });
    };
})(jQuery);

//usage:
$(document).doubletap(
    /** doubletap-dblclick callback */
    function(e) {
        e.preventDefault();
    },
    /** touch-click callback (touch) */
    function(event) {});
