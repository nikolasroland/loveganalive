'use strict';
angular.module('starter.services', [])

.factory('DoctorServ', function($http, $q, $ionicPopup, $ionicLoading) {
    var serv = {
        info: null,
        schedule: null,
        telphone: null,
        title1: '',
        title2: '',
        content: '',
        load: function(id) {
            var doctor = serv.info;
            if (serv.info) {
                var deferred = $q.defer();
                deferred.resolve(doctor);
                return deferred.promise;
            } else {
                return serv.reload(id);
            }
        },
        reload: function(id) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(NEWPHP_URL + 'public/get_user_info', {
                    userid: id
                })
                .success(function(resp) {
                    if (resp.code === 200) {
                        serv.info = resp.data;
                        deferred.resolve(resp.data);
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.message
                        });
                    }
                    $ionicLoading.hide();
                })
                .error(function(resp, status, headers, config) {
                    deferred.reject(resp)
                    $ionicPopup.alert({
                        title: '网络不给力',
                        template: '<a style="text-align:center;" href="javascript:location.reload()">点击这里刷新再试试</a>',
                        okText: '取消'
                    });
                    $ionicLoading.hide();
                })
            return deferred.promise;
        },
        record: function(system, username, site, handle) {
            var deferred = $q.defer();
            var timestamp = Date.now().toString().substr(0, 10);
            $http.post(NEWPHP_URL + 'public/record_android', {
                system: system,
                modelid: 10,
                app: 1,
                username: username,
                login: 1,
                type: 'h5',
                site: site,
                handle: handle,
                timestamp: timestamp
            })
            return deferred.promise;
        },
        querySchedule: function(id) {
            var deferred = $q.defer();
            $http.post(JAVA_URL + 'product/app/getDoctorSchedule.htm', {
                    sign: '7aca512be3b2bd84e98198f5a3886f09',
                    doctorId: id
                })
                .success(function(resp, status, headers, config) {
                    if (resp.code === '0') {
                        serv.schedule = resp.data;
                        deferred.resolve(resp.data);
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.data
                        });
                    }
                })
                .error(function(resp, status, headers, config) {
                    deferred.reject(resp)
                    $ionicPopup.alert({
                        title: '网络不给力',
                        template: '<a style="text-align:center;" href="javascript:location.reload()">点击这里刷新再试试</a>',
                        okText: '取消'
                    });
                })
            return deferred.promise;
        }
    };
    return serv;
})
