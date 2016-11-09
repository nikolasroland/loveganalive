'use strict';
angular.module('starter.services', [])

.factory('DoctorServ', function($http, $q, $ionicPopup, $ionicLoading) {
    var serv = {
        info : null,
        telphone: null,
        title1:'',
        title2:'',
        content: '',
        load: function(id) {
            var doctor = serv.info;
            if(serv.info) {
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
            $http.post(PHP_URL + 'wap/get_doctor.json', {
                    userid: id
                })
                .success(function(resp) {
                    if (resp.status === 'success') {
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
        }
    };
    return serv;
})
