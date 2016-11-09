'use strict';

var _phppost = function(url, data, $http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    var deferred = $q.defer();
    $ionicLoading.show();
    $http.post(NEWPHP_URL + url, data)
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
            return _javapost('product/app/getOverseasProduct.htm', {
                sign: '6c362b62fedb0eaa864dc7082ce640fb'
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        buyProduct: function(insurancePeople, insuranceMobile, insuranceSex, insuranceProvince, insuranceCity, insuranceAddress, productId) {
            var userId = window.localStorage.getItem('userId'),
                userName = window.localStorage.getItem('userName'),
                nickName = window.localStorage.getItem('nickName');

            return _javapost('product/app/buyProductOverseas.htm', {
                sign: '2697b054917085bd52af61bdb7367a7a',
                productId: productId,
                userId: userId,
                userName: userName,
                nickName: nickName,
                insurancePeople: insurancePeople,
                insuranceMobile: insuranceMobile,
                insuranceSex: insuranceSex,
                insuranceProvince: insuranceProvince,
                insuranceCity: insuranceCity,
                insuranceAddress: insuranceAddress
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getUserInfo: function() {
            var userId = window.localStorage.getItem('userId'),
                auth = window.localStorage.getItem('auth');
                
            return _phppost('public/get_user_info', {
                auth: auth,
                userid: userId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})
