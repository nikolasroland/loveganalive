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
        reloadList: function() {
            var userId = window.localStorage.getItem('userId');

            return _javapost('trade/app/findInsuranceDetails.htm', {
                sign: 'f73becec3b54e981efe0e49c8baf1e6b',
                userId: userId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadProducts: function() {
            return _javapost('product/app/getInsuranceList.htm', {
                sign: '7f187df2e535ba793353ac6b9814a63b'
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        buyProduct: function(insurancePeople, insuranceMobile, insuranceAddress, insuranceIdCard, insuranceDistribution, productCode, insurancePrescription, detail) {
            var userId = window.localStorage.getItem('userId'),
                userName = window.localStorage.getItem('userName'),
                nickName = window.localStorage.getItem('nickName');
            return _javaformpost('product/app/buyProductInsurance.htm', {
                sign: '133f78fb52e8c7c3609980f9d3fc7d5e',
                userId: userId,
                userName: userName,
                nickName: nickName,
                productId: productCode,
                insurancePeople: insurancePeople,
                insuranceMobile: insuranceMobile,
                insuranceAddress: insuranceAddress,
                insuranceIdCard: insuranceIdCard,
                insuranceDistribution: insuranceDistribution,
                insurancePrescription: insurancePrescription,
                detail: detail
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