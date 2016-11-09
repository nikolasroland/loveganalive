'use strict';
angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $ionicHistory, $ionicPopup) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $scope.uid = window.location.search.substr(5);
    $scope.start = function() {
        if (window.localStorage.getItem('userId') == '' || window.localStorage.getItem('userId') == 0 || window.localStorage.getItem('userId') == null) {
            $ionicPopup.alert({
                title: '提示',
                template: '需要先登录爱肝一生app才可以参与哦'
            }).then(function() {
                window.parent.postMessage({
                    func: 'run',
                    params: ['login', []]
                }, '*');
            });
        } else {
            window.parent.postMessage({
                func: 'getAuth',
                params: ['patient']
            }, '*')
        }
    }
})

.controller('AddressCtrl', function($scope, $rootScope, $ionicHistory, $ionicPopup, Serv) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $scope.uid = window.location.search.substr(5);
    $scope.isBuy = false;
    $scope.setVal = function() {
        $scope.deliveryPeople = this.deliveryPeople;
    }

    Serv.reloadList().then(function(resp) {
        if (resp.total == 0) {
            init();

            Serv.reloadProducts().then(function(resp) {
                $scope.list = resp;
                var userName = window.localStorage.getItem('userName'),
                    nickName = window.localStorage.getItem('nickName');
                $scope.deliveryPeople = nickName;
                $scope.deliveryMobile = userName;
            });
        } else {
            $scope.isBuy = true;
            $scope.list = resp.list;
        }
    });

    $scope.changePrice = function(price) {
        $scope.price = price;
    }

    var uploadPic = null;

    $scope.saveProduct = function(deliveryPeople, deliveryMobile, deliveryAddress, productCode) {
        if (typeof deliveryPeople === 'undefined') {
            $ionicPopup.alert({
                title: '请填写收件人'
            });
        } else if (typeof deliveryMobile === 'undefined') {
            $ionicPopup.alert({
                title: '请填写联系电话'
            });
        } else if (typeof deliveryAddress === 'undefined') {
            $ionicPopup.alert({
                title: '请填写详细地址'
            });
        } else if (typeof productCode === 'undefined') {
            $ionicPopup.alert({
                title: '请选择药品盒数'
            });
        } else if (uploadPic === null || uploadPic.base64 === null) {
            $ionicPopup.alert({
                title: '请上传药方'
            });
        } else {
            $ionicPopup.prompt({
                title: '请输入密码',
                template: '支付' + $scope.price + $rootScope.ticket,
                inputType: 'password',
                okText: '确认',
                cancelText: '取消'
            }).then(function(userPwd) {
                if (typeof userPwd != 'undefined') {
                    Serv.buyProduct(deliveryPeople, deliveryMobile, deliveryAddress, productCode, userPwd, uploadPic.base64).then(function(resp) {
                        $ionicPopup.alert({
                            title: '预定成功!',
                            template: ''
                        }).then(function() {
                            window.parent.postMessage({
                                func: 'run',
                                params: ['historyBack', []]
                            }, '*')
                        })
                    })
                }
            });
        }
        return;
    }

    function init() {
        uploadPic = new UploadPic();
        uploadPic.init({
            input: document.getElementById('picfile'),
            callback: function(base64) {
                this.base64 = base64;
                /*$.ajax({
                    url: "{:U('upload')}",
                    data: {
                        str: base64,
                        type: this.fileType
                    },
                    type: 'post',
                    dataType: 'json',
                    success: function(i) {
                        alert(i.info);
                    }
                })*/
            },
            loading: function() {
                if(!$rootScope.isIOS) {
                    alert('正在上传图片...')
                }
            }
        });
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
        this.callback = function() {};
        this.loading = function() {};
    }

    UploadPic.prototype.init = function(options) {
        this.maxWidth = options.maxWidth || 800;
        this.maxHeight = options.maxHeight || 600;
        this.maxSize = options.maxSize || 3 * 1024 * 1024;
        this.input = options.input;
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
        var imgzip = document.getElementById('imgzip'),
            picfile = document.getElementById('picfile'),
            btnfile = document.getElementById('btnfile');

        for (var i = imgzip.childNodes.length - 1; i >= 0; i--) {
            imgzip.removeChild(imgzip.childNodes[i]);
        }
        imgzip.appendChild(this.canvasPreview);
        imgzip.style.zIndex = 2;
        picfile.style.left = '100px';
        btnfile.style.left = '100px';
        btnfile.innerText = '重新上传';
    };

})
