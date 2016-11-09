'use strict';
angular.module('starter.services', [])

.factory('Serv', function($http, $q, $ionicPopup, $ionicLoading) {
    return {
        reloadProducts: function() {
            var deferred = $q.defer();
            $ionicLoading.show();
            var formData = new FormData();
            formData.append('sign', '7f187df2e535ba793353ac6b9814a63b');
            $http({
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined,
                        'Accept': 'application/json, text/javascript, */*; q=0.01'
                    },
                    transformRequest: function(data) {
                        return data;
                    },
                    url: JAVA_URL + 'product/app/getProductList.htm',
                    data: formData
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
        buyProduct: function(deliveryPeople, deliveryMobile, deliveryAddress, productCode, userPwd, base64) {
            var deferred = $q.defer();
            $ionicLoading.show();
            var auth = window.localStorage.getItem('auth'),
                userId = window.localStorage.getItem('userId'),
                userName = window.localStorage.getItem('userName'),
                nickName = window.localStorage.getItem('nickName');

            var picFile = document.getElementById('picfile').files[0];
            var formData = new FormData();
            formData.append('sign', '364559f26e105e01851e95a7f1cfbcdd');
            formData.append('userId', userId);
            formData.append('userName', userName);
            formData.append('nickName', nickName);
            formData.append('productId', productCode);
            formData.append('userPwd', userPwd);
            formData.append('deliveryPeople', deliveryPeople);
            formData.append('deliveryMobile', deliveryMobile);
            formData.append('deliveryAddress', deliveryAddress);
            formData.append('productImgFile', picFile);
            $http({
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined,
                        'Accept': 'application/json, text/javascript, */*; q=0.01'
                    },
                    transformRequest: function(data) {
                        return data;
                    },
                    url: JAVA_URL + 'product/app/buyProduct.htm',
                    data: formData
                })
                .success(function(resp) {
                    $ionicLoading.hide();
                    if (resp.code === '0') {
                        deferred.resolve(resp);
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
