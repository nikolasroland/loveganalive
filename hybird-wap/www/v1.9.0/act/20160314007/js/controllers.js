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
        }
    };
    
    $scope.afterGetAuth = function() {
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
            }
        };
    };
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
    var inputRecipe = {};
    var inputPrescription = {};

    var realName = window.localStorage.getItem('realName');
    if (/[0-9\*]/.test(realName) || realName.length < 2)
        $scope.insurancePeople = '';
    else
        $scope.insurancePeople = realName;
    $scope.insuranceMobile = window.localStorage.getItem('userName');

    Serv.reloadList().then(function(resp) {
        if (resp.count == 0) {
            inputRecipe = init('picfileRecipe');
            inputPrescription = init('picfilePrescription');
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

    $scope.saveProduct = function(insurancePeople, insuranceMobile, insuranceAddress, detail, insuranceDistribution) {
        if (typeof insurancePeople === 'undefined') {
            $ionicPopup.alert({
                title: '请填写收件人'
            });
        } else if (typeof insuranceMobile === 'undefined') {
            $ionicPopup.alert({
                title: '请填写联系电话'
            });
        } else if (!/^([0-9]{11})?$/.test(insuranceMobile)) {
            $ionicPopup.alert({
                title: '电话格式不正确'
            });
        } else if (typeof insuranceAddress === 'undefined') {
            $ionicPopup.alert({
                title: '请填写详细地址'
            });
        } else if (typeof insuranceDistribution === 'undefined') {
            $ionicPopup.alert({
                title: '请选择配送周期'
            });
        } else if (inputPrescription === null || inputPrescription.base64 === null) {
            $ionicPopup.alert({
                title: '请上传处方照片'
            });
        } else {
            Serv.buyProduct($scope.productId, insurancePeople, insuranceMobile, insuranceAddress, detail, insuranceDistribution, inputRecipe.input.files[0], inputPrescription.input.files[0]).then(function(resp) {
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
    }

    $scope.back = function() {
        window.history.back();
    }

    function init(context) {
        var uploadPic = new UploadPic();
        uploadPic.init({
            context: document.getElementById(context),
            callback: function(base64) {
                this.base64 = base64;
            },
            loading: function() {
                if (!$rootScope.isIOS) {
                    alert('正在上传图片...')
                }
            }
        });
        return uploadPic;
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
                $scope.plan.planContent = '' + '运动方案：\n1、中等量有氧运动（如骑自行车，快速步行，游泳，跳舞等），每周7次，累计时间至少300分钟，运动后靶心率》170-年龄；\n2、每周最好进行2次轻或中度阻力性肌肉运动（举哑铃，俯卧撑等）\n\n' + '饮食方案：\n1、控制膳食热卡总量，建议每日适宜热量摄取为{[身高（cm）-105]*20-500}Kcal;\n2、低糖低脂的平衡饮食，减少含蔗糖或果糖饮料以及饱和脂肪（动物脂肪和棕榈油等）和反式脂肪（油炸食品）的摄入，增加膳食纤维（豆类，谷物类，蔬菜和水果）含量;\n3、对于经过长期减食疗法减肥效果不明显的病例，可改用按医嘱使用低热量饮食甚至极低热量饮食\n\n' + '心理方案：\n1、本次挑战是本年内重要的目标，就是比工作还重要；\n2、再不降低肝内脂肪数量，会越来越影响生活质量，肝硬化离的没那么远；\n3、健康的生活方式就是自己想要的，不是别人逼的；\n\n' + '药物方案：\n详见处方';
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
})

.controller('OrderExpressCtrl', function($scope, $stateParams) {
    $scope.link = 'http://m.kuaidi100.com/index_all.html?type=' + $stateParams.comp + '&postid=' + $stateParams.code + '#result&ui-state=dialog'
})
