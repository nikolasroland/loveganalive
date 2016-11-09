'use strict';
angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $ionicHistory, $ionicPopup, Serv) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $scope.uid = window.location.search.substr(5);

    $scope.hasTelphone = false;

    window.parent.postMessage({
        func: 'getAuth',
        params: ['patient']
    }, '*')


    $scope.afterPostMessage = function(aid) {
        Serv.reloadTel(aid).then(function(resp) {
            if (resp.telphone) {
                $scope.hasTelphone = true;
                $scope.telphone = resp.telphone;
            }
        });
    }

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
            if (window.localStorage.getItem('doctorId') == 0) {
                alert('您还没有绑定医生，请先选择一位距离您较近的医生吧。');
                window.parent.postMessage({
                    func: 'run',
                    params: ['transfer', [0, 'selectDoctor']]
                }, '*');
                return;
            } else if (window.localStorage.getItem('assistantId') == 0) {
                alert('您的医生还没有绑定个管师，请先更换一位医生吧。');
                window.parent.postMessage({
                    func: 'run',
                    params: ['transfer', [0, 'selectDoctor']]
                }, '*');
            } else {
                window.location.href = "#detail";
            }


            /*////// debug //////
            window.localStorage.setItem('auth', '4ca8BFcMBgYPVAUAVlYBClJcUANRVwFWVFcPBVYEDVxUAGsEWgAFAglUBQJXAT4MUFYDBFUCVFQIUQZVVAMNXVcFVQICXVcHXwFWBwcBBQ');
            window.localStorage.setItem('userId', '44850');
            window.localStorage.setItem('userName', '19900001123');
            window.localStorage.setItem('nickName', '1123');

            window.location.href = "#detail";*/
        }
    }
})

.controller('OrderDetailCtrl', function($scope, $stateParams, Serv, localStorageService) {

    Serv.getFirstDetail($stateParams.orderCode).then(function(resp) {
        $scope.orderDetail = resp[0];
        Serv.getDetail(resp[0].id).then(function(resp) {
            if (resp.length !== 0) {
                $scope.orderDetail = resp[0]
                $scope.orderDetail.user_id = resp[0].userId;
                $scope.orderDetail.user_name = resp[0].userName;
                $scope.orderDetail.order_code = resp[0].orderCode;
                $scope.orderDetail.id = resp[0].orderId;
            }
        })
    })

    $scope.back = function() {
        window.history.back();
    }
})

.controller('OrderDetailByCodeCtrl', function($scope, $stateParams, Serv, localStorageService) {

    Serv.getFirstDetail($stateParams.orderCode).then(function(resp) {
        $scope.orderDetail = resp[0];
        Serv.getDetail(resp[0].id).then(function(resp) {
            if (resp.length !== 0) {
                $scope.orderDetail = resp[0];
                $scope.orderDetail.user_id = resp[0].userId;
                $scope.orderDetail.user_name = resp[0].userName;
                $scope.orderDetail.order_code = resp[0].orderCode;
                $scope.orderDetail.id = resp[0].orderId;
            }
        })
    })

    $scope.back = function() {
        window.parent.postMessage({
            func: 'run',
            params: ['historyBack', []]
        }, '*')
    }
})

.controller('DetailCtrl', function($scope, $rootScope, $ionicPopup, $ionicScrollDelegate, Serv, localStorageService) {


    $scope.isBuy = false;
    Serv.reloadList().then(function(resp) {
        if (resp.count == 0) {
            Serv.reloadProducts().then(function(resp) {
                $scope.remark = resp[0].remark;
                $scope.productId = resp[0].id;
            });
        } else {
            $scope.isBuy = true;
            $scope.list = resp.data;
        }
    });

    $scope.login = function() {
        Serv.login(this.item.user_name, this.item.order_code).then(function(resp) {
            if ($rootScope.isIOS) {
                //window.parent.location.href = resp.values.url + '?sessionId=' + resp.values.sessionId;
                window.parent.postMessage({
                    func: 'run',
                    params: ['redirect', [resp.values.url + '?sessionId=' + resp.values.sessionId]]
                }, '*')
            } else
                window.location.href = resp.values.url + '?sessionId=' + resp.values.sessionId;
        })
    }

    $scope.changeIsBuy = function() {
        $scope.isBuy = false;
        Serv.reloadProducts().then(function(resp) {
            $scope.remark = resp[0].remark;
            $scope.productId = resp[0].id;

            $ionicScrollDelegate.scrollTop();
        });
    }

    $scope.viewOrderDetail = function() {
        localStorageService.set('orderdetail', this.item);
    }

    $scope.saveProduct = function() {
        Serv.buyProduct($scope.productId).then(function(resp) {
            $ionicPopup.alert({
                title: '预订成功!',
                template: ''
            }).then(function() {
                window.parent.postMessage({
                    func: 'run',
                    params: ['historyBack', []]
                }, '*')
            })
        })
    }

    $scope.back = function() {
        window.history.back();
    }
})

.controller('DoctorListCtrl', function($scope, $stateParams, Serv) {
    $scope.hasLoaded = false;
    Serv.reloadListByDoctor($stateParams.doctorId).then(function(resp) {
        $scope.hasLoaded = true;
        $scope.list = resp.data;
    });

    $scope.doctorId = $stateParams.doctorId;
    $scope.doctorName = $stateParams.doctorName;
})

.controller('DoctorPlanCtrl', function($scope, $stateParams, $ionicPopup, Serv) {
    $scope.back = function() {
        window.history.back();
    }

    $scope.doctorId = $stateParams.doctorId;
    $scope.doctorName = $stateParams.doctorName;
    Serv.getDetail($stateParams.orderId).then(function(resp) {
        if (resp.length === 0) {
            Serv.getFirstDetail($stateParams.orderCode).then(function(resp) {
                $scope.plan = resp[0];
                $scope.plan.planName = '基础方案';
                $scope.plan.movementTime = '一年';
                $scope.plan.taboo = '无';
                $scope.plan.planContent = ''
                + '运动方案：\n1、中等量有氧运动（如骑自行车，快速步行，游泳，跳舞等），每周7次，累计时间至少300分钟，运动后靶心率》170-年龄；\n2、每周最好进行2次轻或中度阻力性肌肉运动（举哑铃，俯卧撑等）\n\n'
                + '饮食方案：\n1、控制膳食热卡总量，建议每日适宜热量摄取为{[身高（cm）-105]*20-500}Kcal;\n2、低糖低脂的平衡饮食，减少含蔗糖或果糖饮料以及饱和脂肪（动物脂肪和棕榈油等）和反式脂肪（油炸食品）的摄入，增加膳食纤维（豆类，谷物类，蔬菜和水果）含量;\n3、对于经过长期减食疗法减肥效果不明显的病例，可改用按医嘱使用低热量饮食甚至极低热量饮食\n\n'
                + '心理方案：\n1、本次挑战是本年内重要的目标，就是比工作还重要；\n2、再不降低肝内脂肪数量，会越来越影响生活质量，肝硬化离的没那么远；\n3、健康的生活方式就是自己想要的，不是别人逼的；\n\n'
                + '药物方案：\n详见处方';
            })
        } else {
            resp[0].user_id = resp[0].userId;
            resp[0].user_name = resp[0].userName;
            resp[0].order_code = resp[0].orderCode;
            resp[0].id = resp[0].orderId;
            $scope.plan = resp[0];
        }
    })

    $scope.savePlan = function(plan) {
        if (typeof plan.planName === 'undefined') {
            $ionicPopup.alert({
                title: '请填写方案名称'
            });
        } else if (typeof plan.movementTime === 'undefined') {
            $ionicPopup.alert({
                title: '请填写有效时长'
            });
        } else if (typeof plan.taboo === 'undefined') {
            $ionicPopup.alert({
                title: '请填写禁忌'
            });
        } else if (typeof plan.planContent === 'undefined') {
            $ionicPopup.alert({
                title: '请填写内容'
            });
        } else {
            Serv.savePlan(plan, $scope.doctorId, $scope.doctorName).then(function(resp) {
                $ionicPopup.alert({
                    title: '保存成功!',
                    template: ''
                }).then(function() {
                    window.history.back();
                })
            })
        }
        return;
    }
})

.controller('AddressCtrl', function($scope, $rootScope, $location, $ionicScrollDelegate, $ionicHistory, $ionicPopup, localStorageService, Serv) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $scope.uid = window.location.search.substr(5);
    $scope.isBuy = false;
    var inputRecipe = {};
    var inputPrescription = {};

    Serv.reloadList().then(function(resp) {
        if (resp.count == 0) {
            inputRecipe = init('picfileRecipe');
            inputPrescription = init('picfilePrescription');

            Serv.reloadProducts().then(function(resp) {
                $scope.list = resp;
                var userName = window.localStorage.getItem('userName'),
                    nickName = window.localStorage.getItem('nickName');
                $scope.insurancePeople = nickName;
                $scope.insuranceMobile = userName;
            });
        } else {
            $scope.isBuy = true;
            $scope.list = resp.data;
        }
    });

    $scope.viewOrderDetail = function() {
        localStorageService.set('orderdetail', this.item);
    }

    $scope.viewDetail = function() {
        $rootScope.remark = this.item.remark.replace(/<img src="/g, '<img src="' + JAVA_URL);
    }

    $scope.changeIsBuy = function() {
        $scope.isBuy = false;
        Serv.reloadProducts().then(function(resp) {
            $scope.list = resp;
            var userName = window.localStorage.getItem('userName'),
                nickName = window.localStorage.getItem('nickName');
            $scope.insurancePeople = nickName;
            $scope.insuranceMobile = userName;
            inputRecipe = {};
            inputPrescription = {};
            inputRecipe = init('picfileRecipe');
            inputPrescription = init('picfilePrescription');

            $location.hash('picfileRecipe');
            $ionicScrollDelegate.anchorScroll(true);
        });
    }


    $scope.saveProduct = function(insurancePeople, insuranceMobile, insuranceAddress, insuranceDistribution, productCode) {
        if (typeof insurancePeople === 'undefined') {
            $ionicPopup.alert({
                title: '请填写收件人'
            });
        } else if (typeof insuranceMobile === 'undefined') {
            $ionicPopup.alert({
                title: '请填写联系电话'
            });
        } else if (typeof insuranceAddress === 'undefined') {
            $ionicPopup.alert({
                title: '请填写详细地址'
            });
        } else if (typeof insuranceDistribution === 'undefined') {
            $ionicPopup.alert({
                title: '请选择按季度或按年配送'
            });
        } else if (typeof productCode === 'undefined') {
            $ionicPopup.alert({
                title: '请选择服务包'
            });
            /*        } else if (uploadPic === null || uploadPic.base64 === null) {
                        $ionicPopup.alert({
                            title: '请上传协议'
                        });*/
        } else {
            Serv.buyProduct(insurancePeople, insuranceMobile, insuranceAddress, insuranceDistribution, productCode, inputRecipe.input.files[0], inputPrescription.input.files[0]).then(function(resp) {
                $ionicPopup.alert({
                    title: '预订成功!',
                    template: ''
                }).then(function() {
                    window.parent.postMessage({
                        func: 'run',
                        params: ['historyBack', []]
                    }, '*')
                })
            })
        }
        return;
    }

    function init(context) {
        var uploadPic = new UploadPic();
        uploadPic.init({
            context: document.getElementById(context),
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
                if (!$rootScope.isIOS) {
                    alert('正在上传图片...')
                }
            }
        });
        return uploadPic;
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
            btnfile = this.context.getElementsByClassName('btnfile')[0];

        for (var i = imgzip.childNodes.length - 1; i >= 0; i--) {
            imgzip.removeChild(imgzip.childNodes[i]);
        }
        img.width = 82;
        img.height = 78;
        imgzip.appendChild(img);
        imgzip.style.zIndex = 2;
        picfile.style.left = '100px';
        btnfile.style.left = '100px';
        btnfile.innerText = '重新上传';
    };

})
