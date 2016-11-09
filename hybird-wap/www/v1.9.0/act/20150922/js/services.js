'use strict';
angular.module('starter.services', [])

.factory('DiscoverServ', function($http, $q, $ionicPopup, $ionicLoading) {
    return {
        hasmore: true,
        curPage: 2,
        reload: function(type, page, rows) {
            var deferred = $q.defer();
            $http.post(JAVA_URL + 'product/app/getDiscoveryList.htm', {
                    sign: '4e10e65631a48eca8708d2810436b0dd',
                    discoveryType: type,
                    page: page,
                    rows: rows
                })
                .success(function(resp) {
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
                    deferred.reject(resp)
                    $ionicPopup.alert({
                        title: '网络不给力',
                        template: '<a style="text-align:center;" href="javascript:location.reload()">点击这里刷新再试试</a>',
                        okText: '取消'
                    });
                })
            return deferred.promise;
        },
        reloadDetail: function(id) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(JAVA_URL + 'product/app/getSysSlideImageDetails.htm', {
                    sign: '272e1e032421156698cdcbb86227c049',
                    id: id
                })
                .success(function(resp) {
                    if (resp.code === '0') {
                        deferred.resolve(resp.data);
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.data
                        });
                    }
                    $ionicLoading.hide();
                })
                .error(function(resp) {
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
    }
})
