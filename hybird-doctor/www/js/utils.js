(function() {
    // global 
    window.Native = window.Native || {};
    (function(Native) {

        Native.getAuth = function(prefix, callback) {
            var _cb = function(arr) {
                var userInfo = _getAuth(prefix, arr);
                callback.call(this, userInfo)
            }
            _nativeProxy('getAuth', [prefix], _cb);
        }

        Native.run = function(funcName, paramArr, callback) {
            _nativeProxy(funcName, paramArr, callback);
        }

        Native.refresh = function(isSuccess) {
            var appElement = document.querySelector('ion-view[nav-view=active]').querySelector('ion-content');
            var $scope = angular.element(appElement).scope();
            $scope.doRefresh(isSuccess);
        }

        function _nativeProxy(func, paramArr, callback) {
            if(typeof callback === 'function')
                callback();
        }

        function _getPlatform() {
            window.NativePlatform = window.NativePlatform || ionic ? ionic.Platform.platform() : 'webview'
            return window.NativePlatform;
        }

        function _getAuth(prefix, arr) {
            var userInfo = {};
            userInfo.auth = 'b91eVgFWCAMDAAVSVABSVAICCQRWVQNTBlxVX18ABgVXVjsHUlQMUgIDBVVSUgdUAVMAVlFRUQZXDFYLClECVlwABg';
            userInfo.doctorId = '44624';
            userInfo.doctorName = '19700001101';
            userInfo.doctorNickName = '医生1101';
            userInfo.assistantId = '44726';
            userInfo.assistantName = '001';
            userInfo.assistantNickName = '小雪';
            userInfo.canReservation = '1';
            return userInfo;
        }
    })(Native)
})();

(function() {
    Date.prototype.format = function(format) {
        var o = {
            "M+": this.getMonth() + 1, //month 
            "d+": this.getDate(), //day 
            "h+": this.getHours(), //hour 
            "m+": this.getMinutes(), //minute 
            "s+": this.getSeconds(), //second 
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
            "S": this.getMilliseconds() //millisecond 
        }

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    }
    Date.prototype.getDayString = function() {
        var day = this.getDay();
        switch(day) {
            case 0:
            return '星期日';
            case 1:
            return '星期一';
            case 2:
            return '星期二';
            case 3:
            return '星期三';
            case 4:
            return '星期四';
            case 5:
            return '星期五';
            case 6:
            return '星期六';
        }
    }
})()

    
function scaleImg(ele) {
    var srcImg;

    var img = document.createElement('img');
    var cover = document.createElement('div');
    if (ele.tagName === 'IMG') {
        srcImg = ele
    } else {
        srcImg = ele.getElementsByTagName('img')[0];
    }
    img.src = srcImg.src;
    img.style.position = 'absolute'
    img.style.top = '40px';
    img.style.width = '100%';
    img.style.zIndex = '100';

    cover.style.position = 'absolute'
    cover.style.top = '0px';
    cover.style.right = '0px';
    cover.style.bottom = '0px';
    cover.style.left = '0px';
    cover.style.backgroundColor = '#eee';
    cover.style.zIndex = '100';
    cover.style.borderRadius = "10px";

    document.body.appendChild(cover);
    cover.appendChild(img)
    cover.addEventListener('click', function(e) {
        document.body.removeChild(cover);
    })
}