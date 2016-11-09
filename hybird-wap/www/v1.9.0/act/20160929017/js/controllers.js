'use strict';
angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, $ionicLoading, localStorageService, Serv) {
    $scope.afterGetAuth = function() {
        var doctorId = window.localStorage.getItem('doctorId');
        Serv.reloadProducts(doctorId, $stateParams.productId).then(function(resp) {
            $scope.list = resp;
        })
    }
    $scope.manage = function() {
        localStorageService.set('product', this.item);
        window.location.href = '#/manage';
    }

    $scope.historyBack = function() {
        window.callActivityPlugin("historyBack", [], function(echoValue) {});
    }

    // for production
    window.callActivityPlugin = function(func, paramArr, callback) {
        cordova.exec(callback, pluginFailed, "NativeViewPlugin", func, paramArr);
    };

    var pluginFailed = function(message) {
        console.log('cordova native view plugin failed');
    }

    var callback = function(arr) {
        window.localStorage.setItem('auth', arr[1]);
        window.localStorage.setItem('doctorId', arr[2]);
    }

    var init = function() {
        document.addEventListener("deviceready", onDeviceReady, true);
    }

    var onDeviceReady = function() {
        window.callActivityPlugin("getAuth", ["doctor"], function(echoValue) {
            window.localStorage.setItem('auth', echoValue[1]);
            window.localStorage.setItem('doctorId', echoValue[2]);
            $scope.afterGetAuth()
        });
    };

    init();

    // for test
    // $scope.afterGetAuth();
})

.controller('ManageCtrl', function($scope, $rootScope, $ionicPopup, $ionicLoading, localStorageService, Serv) {
    var auth = window.localStorage.getItem('auth');
    var product = localStorageService.get('product');

    $scope.tit = product.productName;
    Serv.reloadBuyPatients(auth, product.id).then(function(resp) {
        for (var i in resp.list.data) {
            resp.list.data[i].expire = resp.list.data[i].expire.substr(0, 10)
        }
        $scope.list = resp.list.data;
    })

    $scope.prescribe = function() {
        localStorageService.set('patient', this.item);
        console.log(this.item)
        window.location.href = '#/prescribe';
    }
})

.controller('PrescribeCtrl', function($scope, $rootScope, $ionicPopup, $ionicLoading, localStorageService, Serv) {
    $scope.patient = localStorageService.get('patient');
    $scope.drug = function() {
        localStorageService.set('drug', this.item);
        window.location.href = '#/drug';
    }
    $scope.checklist = function() {
        localStorageService.set('checklist', this.item);
        window.location.href = '#/checklist';
    }
})

.controller('QrcodeCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, $ionicLoading, localStorageService, Serv) {
    var auth = window.localStorage.getItem('auth');
    $scope.product = localStorageService.get('product');
    $scope.patient = localStorageService.get('patient');
    Serv.createQrcode(auth, $stateParams.userid, $scope.product.id).then(function(resp) {
        $scope.order = resp;

    })
})

.controller('ContractCtrl', function($scope, $rootScope, $ionicPopup, $ionicLoading, localStorageService, Serv) {
    var auth = window.localStorage.getItem('auth');
    var product = localStorageService.get('product');
    Serv.reloadNotBuyPatients(auth, product.id).then(function(resp) {
        $scope.list = resp.list;
    })
})

.controller('OrderCtrl', function($scope, $rootScope, $ionicPopup, $ionicLoading, localStorageService, Serv) {
    var doctorId = window.localStorage.getItem('doctorId');
    Serv.reloadOrders(doctorId).then(function(resp) {
        $scope.orderList = resp;
    })
})

.controller('DetailCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, $ionicLoading, localStorageService, Serv) {
    $scope.product = localStorageService.get('product');
    $scope.product.remark = $scope.product.remark.replace(/<img src="/g, '<img src="' + JAVA_URL);

})

.controller('DrugCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, $ionicLoading, $ionicHistory, localStorageService, Serv) {
    $scope.patient = localStorageService.get('patient');
    console.log($scope.patient)
    $scope.drug = localStorageService.get('drug');
    console.log($scope.drug)
    $scope.BigNo = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十'];
    Serv.reloadDrug($scope.drug.orderCode, $scope.drug.id).then(function(resp) {
        $scope.drugList = resp;
        console.log(resp)
    })

    $scope.info = $scope.patient || {};
    $scope.info.prescriptionNumber = [];
    console.log($scope.info)
    $scope.buy = function(info) {
        var arr = [];
        console.log(info.prescriptionNumber)
        for (var i in info.prescriptionNumber) {
            if (info.prescriptionNumber[i]) {
                arr.push(i)
            }
        }
        info.serveNumber = arr.join(',');
        info.proNumber = $scope.drugList[0].drugsCount * arr.length;
        if (arr.length <= 0) {
            $ionicPopup.alert({
                title: '您还没有开药'
            });
        } else if (inputPrescription === null || inputPrescription.base64 === null) {
            $ionicPopup.alert({
                title: '请上传处方照片'
            });
        } else if (typeof info.insurancePeople === 'undefined' || info.insurancePeople === '') {
            $ionicPopup.alert({
                title: '请填写收件人'
            });
        } else if (typeof info.insuranceMobile === 'undefined') {
            $ionicPopup.alert({
                title: '请填写联系电话'
            });
        } else if (typeof info.insuranceAddress === 'undefined') {
            $ionicPopup.alert({
                title: '请填写详细地址'
            });
        } else {
            Serv.buyProduct(info, $scope.drug, $scope.patient.userId, $scope.patient.userName, inputPrescription.input.files[0]).then(function(resp) {
                $ionicPopup.alert({
                    title: '下单成功！'
                }).then(function() {
                    localStorageService.set('info' + $scope.patient.userId, info);
                    var historyId = $ionicHistory.currentHistoryId();
                    var history = $ionicHistory.viewHistory().histories[historyId];
                    var targetViewIndex = history.stack.length - 3;
                    $ionicHistory.backView(history.stack[targetViewIndex]);
                    $ionicHistory.goBack();
                })
            })
        }
        return;
    }

    var inputPrescription = {};
    inputPrescription = init('picfilePrescription');

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

.controller('ChecklistCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, $ionicLoading, $ionicHistory, localStorageService, Serv) {
    $scope.patient = localStorageService.get('patient');
    $scope.drug = localStorageService.get('checklist');
    console.log($scope.drug)
    $scope.BigNo = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十'];
    Serv.reloadDrug($scope.drug.orderCode, $scope.drug.id).then(function(resp) {
        $scope.drugList = resp;
        console.log(resp)
    })

    $scope.info = localStorageService.get('info') || {};
    $scope.info.prescriptionNumber = [];
    console.log($scope.info)
    $scope.buy = function(info) {
        var arr = [];
        for (var i in info.prescriptionNumber) {
            if (info.prescriptionNumber[i]) {
                arr.push(i)
            }
        }
        info.serveNumber = arr.join(',');
        info.proNumber = arr.length;

        if (arr.length <= 0) {
            $ionicPopup.alert({
                title: '您还没有开检查单'
            });
        } else {
            Serv.buyProduct(info, $scope.drug, $scope.patient.userId, $scope.patient.userName).then(function(resp) {
                $ionicPopup.alert({
                    title: '下单成功！'
                }).then(function() {
                    var historyId = $ionicHistory.currentHistoryId();
                    var history = $ionicHistory.viewHistory().histories[historyId];
                    var targetViewIndex = history.stack.length - 3;
                    $ionicHistory.backView(history.stack[targetViewIndex]);
                    $ionicHistory.goBack();
                })
            })
        }
        return;
    }
})
