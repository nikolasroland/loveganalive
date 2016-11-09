'use strict';
angular.module('starter.services', [])

.factory('Serv', function($http, $q, $ionicPopup, $ionicLoading) {
    return {
        reloadQuestions: function(uid) {
            var deferred = $q.defer();
            var auth = window.localStorage.getItem('auth');
            $ionicLoading.show();
            $http.post(NEWPHP_URL + 'patient/get_question', {
                    auth: auth
                })
                .success(function(resp) {
                    $ionicLoading.hide();
                    if (resp.code === 200) {
                        deferred.resolve(resp);
                    } else if(resp.code === 514) {
                        deferred.resolve(resp);
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.message
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
        saveAnswer: function(answer, startTime) {
            var deferred = $q.defer();
            $ionicLoading.show();
            var auth = window.localStorage.getItem('auth');
            $http.post(NEWPHP_URL + 'patient/save_answer', {
                    answer: answer,
                    state_time: startTime,
                    auth: auth
                })
                .success(function(resp) {
                    $ionicLoading.hide();
                    if (resp.code === 200) {
                        deferred.resolve(resp);
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.message
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
