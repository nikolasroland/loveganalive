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

        function _nativeProxy(func, paramArr, callback) {
            var platform = _getPlatform();
            switch (platform) {
                case 'ios':
                    // window.location.href = 'ios://' + func + '/' + paramArr.join('/');
                    cordova.exec(callback, function(err) {
                        callback('Nothing to echo.');
                    }, "NativeViewPlugin", func, paramArr);
                    break;
                case 'android':
                    // Device[func].apply(this, paramArr);
                    cordova.exec(callback, function(err) {
                        callback('Nothing to echo.');
                    }, "NativeViewPlugin", func, paramArr);
                    break;
                default:
                    console.log('now is webview.');
                    break;
            }
        }

        function _getPlatform() {
            window.NativePlatform = window.NativePlatform || ionic ? ionic.Platform.platform() : 'webview'
            return window.NativePlatform;
        }

        function _getAuth(prefix, arr) {
            var userInfo = {};
            switch (prefix) {
                case 'patient':
                    userInfo.auth = arr[1];
                    userInfo.patientId = arr[2];
                    userInfo.patientName = arr[3];
                    userInfo.patientNickName = arr[4];
                    userInfo.patientRealName = arr[5];
                    userInfo.doctorId = arr[6];
                    userInfo.doctorName = arr[7];
                    userInfo.doctorNickName = arr[8];
                    userInfo.assistantId = arr[9];
                    break;
                case 'doctor':
                    userInfo.auth = arr[1];
                    userInfo.doctorId = arr[2];
                    userInfo.doctorName = arr[3];
                    userInfo.doctorNickName = arr[4];
                    userInfo.assistantId = arr[5];
                    break;
                case 'assistant':
                    userInfo.auth = arr[1];
                    userInfo.assistantId = arr[2];
                    userInfo.assistantName = arr[3];
                    userInfo.assistantNickName = arr[4];
                    break;
            }
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
