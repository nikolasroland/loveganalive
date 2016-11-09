window.userInfo = {};


(function() {
    window.addEventListener('message', function(e) {
        if (e.data.func == 'getAuthCallback') {
            if (e.data.resp.doctorId == 0) {
                alert('您还没有绑定医生，请先选择一位距离您较近的医生吧。');
                window.parent.postMessage({
                    func: 'run',
                    params: ['transfer', [0, 'selectDoctor']]
                }, '*');
            } else {
                window.parent.postMessage({
                    func: 'run',
                    params: ['transfer', [1, '#tab/me/visit']]
                }, '*');
            }
        }
    });
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
        switch (day) {
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
})();

