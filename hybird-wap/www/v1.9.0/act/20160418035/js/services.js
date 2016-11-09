'use strict';

var _phppost = function(url, data, $http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    var deferred = $q.defer();
    $ionicLoading.show();
    $http.post(PHP_URL + url, data)
        .success(function(resp) {
            $ionicLoading.hide();
            if (resp.code === 200) {
                if (typeof resp.data !== "undefined")
                    deferred.resolve(resp.data);
                else
                    deferred.resolve(resp);
            } else {
                if (resp.code === 202) {
                    $rootScope.loginState = '';
                    window.localStorage.setItem('loginState', '');
                }
                deferred.reject(resp)
                $ionicLoading.show({
                    template: resp.message,
                    duration: 1200
                });
            }
        })
        .error(function(resp, status, headers, config) {
            $ionicLoading.hide();
            deferred.reject(resp)
            $ionicLoading.show({
                template: '<i class="ion-android-sad" style="font-size:22px;"></i></br>网络不给力哦~',
                duration: 1200
            });
        })
    return deferred.promise;
}

var _javapost = function(url, data, $http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    var deferred = $q.defer();
    $ionicLoading.show();
    $http.post(JAVA_URL + url, data)
        .success(function(resp) {
            $ionicLoading.hide();
            if (resp.code === '0' || typeof(resp.code) == 'undefined') {
                if (typeof resp.data !== "undefined")
                    deferred.resolve(resp.data);
                else
                    deferred.resolve(resp);
            } else if (resp.code === '400023') {
                resp.data = '400023';
                deferred.resolve(resp.data);
            } else if (resp.code === '400010') {
                Native.run('umengLog', ['event', 'detail', 'InsufficientBalance']);
                deferred.reject(resp)
                $ionicPopup.confirm({
                    title: '余额不足',
                    template: '',
                    okText: '充值',
                    cancelText: '取消'
                }).then(function(res) {
                    if (res) {
                        Native.run('recharge', []);
                        Native.run('umengLog', ['event', 'detail', 'Recharge']);
                    }
                });
            } else {
                deferred.reject(resp)
                $ionicLoading.show({
                    template: resp.data,
                    duration: 1200
                });
            }
        })
        .error(function(resp, status, headers, config) {
            $ionicLoading.hide();
            deferred.reject(resp)
            $ionicLoading.show({
                template: '<i class="ion-android-sad" style="font-size:22px;"></i></br>网络不给力哦~',
                duration: 1200
            });
        })
    return deferred.promise;
}

var _javaformpost = function(url, data, $http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    var deferred = $q.defer();
    $ionicLoading.show();
    var formData = new FormData();
    for (var i in data) {
        formData.append(i, data[i]);
    }
    $http({
            method: 'POST',
            headers: {
                'Content-Type': undefined,
                'Accept': 'application/json, text/javascript, */*; q=0.01'
            },
            transformRequest: function(data) {
                return data;
            },
            url: JAVA_URL + url,
            data: formData
        })
        .success(function(resp) {
            $ionicLoading.hide();
            if (resp.code === '0' || typeof(resp.code) == 'undefined') {
                if (typeof resp.data !== "undefined")
                    deferred.resolve(resp.data);
                else
                    deferred.resolve(resp);
            } else if (resp.code === '400023') {
                resp.data = '400023';
                deferred.resolve(resp.data);
            } else if (resp.code === '400010') {
                Native.run('umengLog', ['event', 'detail', 'InsufficientBalance']);
                deferred.reject(resp)
                $ionicPopup.confirm({
                    title: '余额不足',
                    template: '',
                    okText: '充值',
                    cancelText: '取消'
                }).then(function(res) {
                    if (res) {
                        Native.run('recharge', []);
                        Native.run('umengLog', ['event', 'detail', 'Recharge']);
                    }
                });
            } else {
                deferred.reject(resp)
                $ionicLoading.show({
                    template: resp.data,
                    duration: 1200
                });
            }
        })
        .error(function(resp, status, headers, config) {
            $ionicLoading.hide();
            deferred.reject(resp)
            $ionicLoading.show({
                template: '<i class="ion-android-sad" style="font-size:22px;"></i></br>网络不给力哦~',
                duration: 1200
            });
        })
    return deferred.promise;
}

angular.module('starter.services', [])

.factory('Serv', function($http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    return {
        reloadProducts: function() {
            var doctorId = window.localStorage.getItem('doctorId');
            return _javapost('product/app/getDoctorManageServiceProduct.htm', {
                sign: '9452cbf446e8515b7de18514844f2f92',
                doctorId: doctorId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadList: function() {
            var userId = window.localStorage.getItem('userId');
            return _javapost('trade/app/findDoctorProduct.htm', {
                sign: '54f75f1458ddd08f8e68ba2fa4db7f36',
                title: 10,
                commodityType: 5,
                doctorUserId: userId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getDoctorCity: function() {
            var doctorId = window.localStorage.getItem('doctorId');
            return _javapost('product/app/getOrderTypeByDoctorCity.htm', {
                sign: '23e9391966832e1f3152b7de0deccd7a',
                doctorId: doctorId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getAppSetInfo: function() {
            return _javapost('product/app/getAppSetInfo.htm', {
                sign: '071f6f83fc0f2b7c7ccc300ac468fba4',
                type: 1
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getBalance: function() {
            var auth = window.localStorage.getItem('auth');
            return _phppost('public/get_balance', {
                auth: auth
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        buyProduct: function(insurancePeople, insuranceMobile, insuranceAddress, insuranceIdCard, jsonData, insurancePrescription, detail) {
            var userId = window.localStorage.getItem('userId'),
                userName = window.localStorage.getItem('userName'),
                nickName = window.localStorage.getItem('nickName');

            jsonData = JSON.stringify({ "data": jsonData });

            return _javaformpost('product/app/buyDoctorManage.htm', {
                sign: 'bfd9d6fc4212b20aa67a828a64314c99',
                userId: userId,
                userName: userName,
                nickName: nickName,
                data: jsonData,
                insurancePeople: insurancePeople,
                insuranceMobile: insuranceMobile,
                insuranceAddress: insuranceAddress,
                insuranceIdCard: insuranceIdCard,
                insurancePrescription: insurancePrescription,
                detail: detail
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        cancelOrder: function(orderCode) {
            return _javapost('trade/app/cancelDoctorInsurance.htm', {
                sign: '04b62942b7f4073b62b0f2c50d8e00cd',
                title: 10,
                sourceType: 'doctorManage',
                orderCode: orderCode
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})

.factory('CommentServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {
    return {
        hasmore: true,
        curPage: 1,
        reserveList: function(id, page) {
            return _javapost('product/app/queryEveluateById.htm', {
                sign: '442fc007eb3923d00221192567e4473c',
                id: id,
                type: '01',
                page: page,
                rows: 10
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})