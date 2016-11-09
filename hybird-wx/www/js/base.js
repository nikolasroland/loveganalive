(function() {
    // global 
    window.Native = window.Native || {};
    window.USERINFO = window.USERINFO || {};
    window.Timer = window.Timer || {};


    (function(Native) {
        // for normal
        Native.pageSize = 10;
        Native.isWeb = true;
        Native.isWeixin = /MicroMessenger/i.test(navigator.userAgent);

        Native.getIdentify = function(callback) {
            var _cb = function(arr) {
                var mac = _getIdentify(arr);
                callback.call(this, mac);
            }
            _nativeProxy('getIdentify', [], _cb);
        }

        Native.getAuth = function(prefix, callback) {
            var _cb = function(arr) {
                var userInfo = _getAuth(prefix, arr);
                callback.call(this, userInfo)
            }
            _nativeProxy('getAuth', [prefix], _cb);
        }

        Native.frameHistoryBack = function() {
            console.log('frameHistoryBack')
            clearTimeout(window.Timer);
        }

        Native.run = function(funcName, paramArr, callback) {
            _nativeProxy(funcName, paramArr, callback);
        }

        Native.frameLogin = function() {
            var appElement = document.querySelector('ion-view[nav-view=active]').querySelector('ion-content');
            var $scope = angular.element(appElement).scope();
            $scope.frameLogin();
        }

        Native.refresh = function(isSuccess) {
            var appElement = document.querySelector('ion-view[nav-view=active]').querySelector('ion-content');
            var $scope = angular.element(appElement).scope();
            $scope.doRefresh(isSuccess);
        }

        Native.frameRefresh = function(isSuccess) {
            window.frames[window.frames.length - 1].postMessage({
                'func': 'doRefresh',
                'resp': { 'isSuccess': isSuccess }
            }, '*');
        }

        function _nativeProxy(func, paramArr, callback) {
            switch (func) {
                case 'rate':
                    if (paramArr[3]) {
                        window.location.href = '#/tab/me/rate/' + paramArr[0] + '/' + paramArr[1] + '/' + paramArr[2];
                    } else {
                        window.location.href = '#/tab/home/rate/' + paramArr[0] + '/' + paramArr[1] + '/' + paramArr[2];
                    }
                    break;
                case 'changeDoctor':
                    if (paramArr[0]) {
                        window.location.href = '#/tab/me/doctor-search';
                    } else {
                        window.location.href = '#/tab/home/doctor-search';
                    }
                    break;
                case 'recharge':
                    //var appElement = document.querySelector('ion-view[nav-view=active]').querySelector('ion-content');

                    var $scope = angular.element(document.body).scope();
                    $scope.openRechargeModal();
                    break;
                case 'goBack':
                case 'historyBack':
                    //var appElement = document.querySelector('ion-view[nav-view=active]').querySelector('ion-content');
                    var $scope = angular.element(document.body).scope();
                    $scope.goBack();
                    break;
                case 'startChat':
                    window.location.href = "#/tab/chat";
                    setTimeout(function() {
                        window.location.href = "#/tab/chat/box/" + paramArr[0] + "/" + paramArr[1];
                    }, 300);
                    break;
                case 'login':
                    var $scope = angular.element(document.body).scope();
                    $scope.openLoginModal();
                    break;
                case 'share':
                    console.log(paramArr)
                    break;
                case 'redirect':
                    console.log(paramArr[0])
                    window.location.href = paramArr[0];
                    break;
                case 'transfer':
                    if (paramArr[0] == 0) {
                        switch (paramArr[1]) {
                            case 'selectDoctor':
                                window.location.href = '#/tab/me/doctor-search'
                                break;
                        }
                    } else {
                        window.location.href = paramArr[1];
                    }
                    break;
                case 'pay':
                    window.localStorage.setItem('payAmount', paramArr[0]);
                    window.localStorage.setItem('payOrderCode', paramArr[1]);
                    window.localStorage.setItem('payProName', paramArr[3]);
                    window.location.href = '#/tab/me/pay';
            }
            if (typeof callback === 'function')
                callback();
        }

        function _getPlatform() {
            window.NativePlatform = window.NativePlatform || ionic ? ionic.Platform.platform() : 'webview'
            return window.NativePlatform;
        }


        function _getIdentify(arr) {
            var mac = '64D5A9B9-7D39-42F7-B297-1C1D9456F7D9';
            return mac;
        }

        function _getAuth(prefix, arr) {
            var userInfo = {};
            var loginState = window.localStorage.getItem('loginState') || '';
            if (loginState) {
                userInfo.auth = window.localStorage.getItem('auth');
                userInfo.patientId = window.localStorage.getItem('patientId');
                userInfo.patientName = window.localStorage.getItem('patientName');
                userInfo.patientNickName = window.localStorage.getItem('patientNickName');
                userInfo.patientRealName = window.localStorage.getItem('patientRealName');
                userInfo.doctorId = window.localStorage.getItem('doctorId');
                userInfo.doctorName = window.localStorage.getItem('doctorName');
                userInfo.doctorNickName = window.localStorage.getItem('doctorNickName');
                userInfo.assistantId = window.localStorage.getItem('assistantId');
                userInfo.assistantName = '';
                userInfo.assistantNickName = '';
                userInfo.doctorBed = window.localStorage.getItem('doctorBed');
                userInfo.canReserve = window.localStorage.getItem('canReserve');
                userInfo.hasPassword = window.localStorage.getItem('hasPassword');
                userInfo.main_disease = window.localStorage.getItem('main_disease');
            } else {
                userInfo.auth = '';
                userInfo.patientId = '';
                userInfo.patientName = '';
                userInfo.patientNickName = '';
                userInfo.patientRealName = '';
                userInfo.doctorId = '';
                userInfo.doctorName = '';
                userInfo.doctorNickName = '';
                userInfo.assistantId = '';
                userInfo.assistantName = '';
                userInfo.assistantNickName = '';
                userInfo.doctorBed = '';
                userInfo.canReserve = '';
                userInfo.hasPassword = '';
                userInfo.main_disease = '';
            }
            return userInfo;
        }
    })(Native)
})();

(function() {
    window.addEventListener('message', function(e) {
        e.data.params.push(function(resp) {
            window.frames['discoverIframe'].postMessage({
                'func': e.data.func + 'Callback',
                'resp': resp
            }, '*');
        })
        Native[e.data.func].apply(this, e.data.params);
    })
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

    Date.prototype.getToday = function() {
        var tempDay = this.getDay();
        var day;
        switch (tempDay) {
            case 0:
                day = '星期日';
                break;
            case 1:
                day = '星期一';
                break;
            case 2:
                day = '星期二';
                break;
            case 3:
                day = '星期三';
                break;
            case 4:
                day = '星期四';
                break;
            case 5:
                day = '星期五';
                break;
            case 6:
                day = '星期六';
                break;
        }
        return {
            year: this.getFullYear(),
            month: this.getMonth() + 1,
            date: this.getDate(),
            day: day
        }
    }

})();



function scaleImg(ele) {
    var srcImg;
    if (ele.tagName === 'IMG') {
        srcImg = ele
    } else {
        srcImg = ele.getElementsByTagName('img')[0];
    }
    if (typeof srcImg === 'undefined') return;
    var img = document.createElement('img');
    var cover = document.createElement('div');
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

UploadPic.prototype.delImg = function() {

    var imgzip = this.context.getElementsByClassName('imgzip')[0],
        picfile = this.context.getElementsByClassName('picfile')[0],
        btndel = this.context.getElementsByClassName('btndel')[0],
        btnfile = this.context.getElementsByClassName('btnfile')[0];

    this.input = null;
    this.base64 = null;
    picfile.style.left = '10px';
    btnfile.style.left = '10px';
    btnfile.innerText = '上传病情';
    btndel.style.display = 'none';
    imgzip.removeChild(imgzip.childNodes[0]);
    imgzip.appendChild(document.createElement('div'));
    imgzip.style.zIndex=0;
}


function UploadPic() {
    this.sw = 0;
    this.sh = 0;
    this.tw = 0;
    this.th = 0;
    this.scale = 0;
    this.maxWidth = 0;
    this.maxHeight = 0;
    this.maxSize = 0;
    this.fileSize = 0;
    this.fileDate = null;
    this.fileType = '';
    this.fileName = '';
    this.input = null;
    this.canvas = null;
    this.mime = {};
    this.type = '';
    this.base64 = null;
    this.count = 0;
    this.callback = function() {};
    this.loading = function() {};
}

UploadPic.prototype.init = function(options) {
    this.maxWidth = options.maxWidth || 800;
    this.maxHeight = options.maxHeight || 600;
    this.maxSize = options.maxSize || 8 * 1024 * 1024;
    this.context = options.context;
    this.input = this.context.getElementsByClassName('picfile')[0];
    this.mime = {
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'bmp': 'image/bmp'
    };
    this.callback = options.callback || function() {};
    this.loading = options.loading || function() {};

    this._addEvent();
};

/** 
 * @description 绑定事件 
 * @param {Object} elm 元素 
 * @param {Function} fn 绑定函数 
 */
UploadPic.prototype._addEvent = function() {
    var _this = this;

    function tmpSelectFile(ev) {
        _this._handelSelectFile(ev);
    }
    this.input.addEventListener('change', tmpSelectFile, false);
};

/** 
 * @description 绑定事件 
 * @param {Object} elm 元素 
 * @param {Function} fn 绑定函数 
 */
UploadPic.prototype._handelSelectFile = function(ev) {
    var file = ev.target.files[0];
    /*
            this.type = file.type

            // 如果没有文件类型，则通过后缀名判断（解决微信及360浏览器无法获取图片类型问题） 
            if (!this.type) {
                this.type = this.mime[file.name.match(/\.([^\.]+)$/i)[1]];
            }

            if (!/image.(png|jpg|jpeg|bmp)/.test(this.type)) {
                alert('选择的文件类型不是图片');
                return;
            }*/

    if (file.size > this.maxSize) {
        alert('选择文件大于' + this.maxSize / 1024 / 1024 + 'M，请重新选择');
        return;
    }

    this.fileName = file.name;
    this.fileSize = file.size;
    this.fileType = this.type;
    this.fileDate = file.lastModifiedDate;

    this._readImage(file);
};

/** 
 * @description 读取图片文件 
 * @param {Object} image 图片文件 
 */
UploadPic.prototype._readImage = function(file) {
    var _this = this;

    function tmpCreateImage(uri) {
        _this._createImage(uri);
    }

    this.loading();

    this._getURI(file, tmpCreateImage);
};

/** 
 * @description 通过文件获得URI 
 * @param {Object} file 文件 
 * @param {Function} callback 回调函数，返回文件对应URI 
 * return {Bool} 返回false 
 */
UploadPic.prototype._getURI = function(file, callback) {
    var reader = new FileReader();
    var _this = this;

    function tmpLoad() {
        // 头不带图片格式，需填写格式 
        var re = /^data:base64,/;
        var ret = this.result + '';

        if (re.test(ret)) ret = ret.replace(re, 'data:' + _this.mime[_this.fileType] + ';base64,');

        callback && callback(ret);
    }

    reader.onload = tmpLoad;

    reader.readAsDataURL(file);

    return false;
};

/** 
 * @description 创建图片 
 * @param {Object} image 图片文件 
 */
UploadPic.prototype._createImage = function(uri) {
    var img = new Image();
    var _this = this;

    function tmpLoad() {
        _this._drawImage(this);
    }

    img.onload = tmpLoad;

    img.src = uri;
};

/** 
 * @description 创建Canvas将图片画至其中，并获得压缩后的文件 
 * @param {Object} img 图片文件 
 * @param {Number} width 图片最大宽度 
 * @param {Number} height 图片最大高度 
 * @param {Function} callback 回调函数，参数为图片base64编码 
 * return {Object} 返回压缩后的图片 
 */
UploadPic.prototype._drawImage = function(img, callback) {
    this.sw = img.width;
    this.sh = img.height;
    this.tw = img.width;
    this.th = img.height;

    this.scale = (this.tw / this.th).toFixed(2);

    if (this.sw > this.maxWidth) {
        this.sw = this.maxWidth;
        this.sh = Math.round(this.sw / this.scale);
    }

    if (this.sh > this.maxHeight) {
        this.sh = this.maxHeight;
        this.sw = Math.round(this.sh * this.scale);
    }


    this.canvas = document.createElement('canvas');
    var ctx = this.canvas.getContext('2d');

    this.canvas.width = this.sw;
    this.canvas.height = this.sh;

    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.sw, this.sh);

    this.callback(this.canvas.toDataURL(this.type));

    ctx.clearRect(0, 0, this.tw, this.th);
    this.canvas.width = 0;
    this.canvas.height = 0;
    this.canvas = null;

    this.canvasPreview = document.createElement('canvas');
    var ctxPreview = this.canvasPreview.getContext('2d');
    ctxPreview.drawImage(img, 0, 0, img.width, img.height, 0, 0, 82, 78);
    var imgzip = this.context.getElementsByClassName('imgzip')[0],
        picfile = this.context.getElementsByClassName('picfile')[0],
        btndel = this.context.getElementsByClassName('btndel')[0],
        btnfile = this.context.getElementsByClassName('btnfile')[0];

    for (var i = imgzip.childNodes.length - 1; i >= 0; i--) {
        imgzip.removeChild(imgzip.childNodes[i]);
    }

    this.context.removeChild(picfile);
    var newEle = document.createElement('input');
    newEle.className = 'picfile';
    newEle.name = 'insurancePrescription';
    newEle.title = ++this.count;
    newEle.setAttribute('accept','image/*')
    newEle.setAttribute('capture','camera')
    newEle.setAttribute('type','file')
    this.context.insertBefore(newEle,this.context.childNodes[0]);
    this.input = this.context.getElementsByClassName('picfile')[0];
    this._addEvent();
    btndel.style.display = "block";
    img.width = 82;
    img.height = 78;
    imgzip.appendChild(img);
    imgzip.style.zIndex = 2;
    picfile.style.left = '100px';
    btnfile.style.left = '100px';
    btnfile.innerText = '重新上传';
};
