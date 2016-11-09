'use strict';
angular.module('starter.services', [])

.factory('Serv', function($http, $q, $ionicPopup, $ionicLoading) {
    return {
        signUp: function(uid) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(JAVA_URL + 'product/app/joinProductProcess.htm', {
                    sign: '93c3c0b39c0638bf97c1bd0684330d7f',
                    patientId: uid
                })
                .success(function(resp) {
                    $ionicLoading.hide();
                    if (resp.code === '0') {
                        deferred.resolve(resp.data);
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.data
                        });
                    }
                })
                .error(function(resp) {
                    $ionicLoading.hide();
                    deferred.reject(resp)
                    $ionicPopup.alert({
                        title: '网络不给力',
                        template: '<a style="text-align:center;" href="javascript:location.reload()">点击这里刷新再试试</a>',
                        okText: '取消'
                    });
                })
            return deferred.promise;
        },
        reload: function(uid) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(JAVA_URL + 'product/app/findProcessNumber.htm', {
                    sign: 'b6de5d2cac9b65d35bc5590faba732dc',
                    patientId: uid
                })
                .success(function(resp) {
                    $ionicLoading.hide();
                    if (resp.code === '0') {
                        deferred.resolve(resp.data);
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.data
                        });
                    }
                })
                .error(function(resp) {
                    $ionicLoading.hide();
                    deferred.reject(resp)
                    $ionicPopup.alert({
                        title: '网络不给力',
                        template: '<a style="text-align:center;" href="javascript:location.reload()">点击这里刷新再试试</a>',
                        okText: '取消'
                    });
                })
            return deferred.promise;
        },
        reloadDetail: function(uid) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(JAVA_URL + 'product/app/joinProductProcess.htm', {
                    sign: '93c3c0b39c0638bf97c1bd0684330d7f',
                    patientId: uid
                })
                .success(function(resp) {
                    $ionicLoading.hide();
                    if (resp.code === '0') {
                        deferred.resolve(resp.data);
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.data
                        });
                    }
                })
                .error(function(resp) {
                    $ionicLoading.hide();
                    deferred.reject(resp)
                    $ionicPopup.alert({
                        title: '网络不给力',
                        template: '<a style="text-align:center;" href="javascript:location.reload()">点击这里刷新再试试</a>',
                        okText: '取消'
                    });
                })
            return deferred.promise;
        }
    }
})
