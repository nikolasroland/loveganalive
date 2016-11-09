'use strict';
angular.module('starter.services', [])

.factory('Serv', function($http, $q, $ionicPopup, $ionicLoading) {
    return {

        reloadTel: function(userid) {
            var deferred = $q.defer();
            $ionicLoading.show();
            var formData = new FormData();
            formData.append('userid', userid);
            $http({
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined,
                        'Accept': 'application/json, text/javascript, */*; q=0.01'
                    },
                    transformRequest: function(data) {
                        return data;
                    },
                    url: NEWPHP_URL + 'public/get_user_info',
                    data: formData
                })
                .success(function(resp) {
                    $ionicLoading.hide();
                    if (resp.code === 200) {
                        deferred.resolve(resp.data);
                    } else {
                        deferred.reject(resp.data)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.message
                        });
                    }
                })
                .error(function(resp) {
                    $ionicLoading.hide();
                    deferred.reject(resp.data)
                    $ionicPopup.alert({
                        title: '网络不给力',
                        template: '<a style="text-align:center;" href="javascript:location.reload()">点击这里刷新再试试</a>',
                        okText: '取消'
                    });
                })
            return deferred.promise;
        },
        reloadList: function() {
            var deferred = $q.defer();
            $ionicLoading.show();

            var auth = window.localStorage.getItem('auth'),
                userId = window.localStorage.getItem('userId'),
                userName = window.localStorage.getItem('userName'),
                nickName = window.localStorage.getItem('nickName');

            var formData = new FormData();
            formData.append('sign', '8b850bae6fa63d69a9abb79b9308af76');
            formData.append('doctorUserId ', userId);
            formData.append('title ', 10);
            $http({
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined,
                        'Accept': 'application/json, text/javascript, */*; q=0.01'
                    },
                    transformRequest: function(data) {
                        return data;
                    },
                    url: JAVA_URL + 'trade/app/findPlanHeartSchemeOrder.htm',
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
        },
        reloadListByDoctor: function(doctorId) {
            var deferred = $q.defer();
            $ionicLoading.show();

            var formData = new FormData();
            formData.append('sign', '8b850bae6fa63d69a9abb79b9308af76');
            formData.append('doctorUserId ', doctorId);
            formData.append('title ', 12);
            $http({
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined,
                        'Accept': 'application/json, text/javascript, */*; q=0.01'
                    },
                    transformRequest: function(data) {
                        return data;
                    },
                    url: JAVA_URL + 'trade/app/findPlanHeartSchemeOrder.htm',
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
        },
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
                    url: JAVA_URL + 'product/app/getHeartList.htm',
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
        buyProduct: function(productCode) {
            var deferred = $q.defer();
            $ionicLoading.show();
            var auth = window.localStorage.getItem('auth'),
                userId = window.localStorage.getItem('userId'),
                userName = window.localStorage.getItem('userName'),
                nickName = window.localStorage.getItem('nickName');

            var formData = new FormData();
            formData.append('sign', '8745ee4a06bec220447d761e4191ca40');
            formData.append('userId', userId);
            formData.append('userName', userName);
            formData.append('nickName', nickName);
            formData.append('productId', productCode);
            $http({
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined,
                        'Accept': 'application/json, text/javascript, */*; q=0.01'
                    },
                    transformRequest: function(data) {
                        return data;
                    },
                    url: JAVA_URL + 'product/app/buyProductHeart.htm',
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
        },
        getDetail: function(orderId) {
            var deferred = $q.defer();
            $ionicLoading.show();
            var formData = new FormData();
            formData.append('sign', '1a4354c51efa822d72c230bb42e61bab');
            formData.append('orderId', orderId);
            $http({
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined,
                        'Accept': 'application/json, text/javascript, */*; q=0.01'
                    },
                    transformRequest: function(data) {
                        return data;
                    },
                    url: JAVA_URL + 'trade/app/findIsCurrentPlanHeartScheme.htm',
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
        getFirstDetail: function(orderCode) {
            var deferred = $q.defer();
            $ionicLoading.show();
            var formData = new FormData();
            formData.append('sign', 'f73becec3b54e981efe0e49c8baf1e6b');
            formData.append('orderCode', orderCode);
            $http({
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined,
                        'Accept': 'application/json, text/javascript, */*; q=0.01'
                    },
                    transformRequest: function(data) {
                        return data;
                    },
                    url: JAVA_URL + 'trade/app/findInsuranceDetails.htm',
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
        savePlan: function(plan, doctorId, doctorName) {
            var deferred = $q.defer();
            $ionicLoading.show();

            var formData = new FormData();
            formData.append('sign', 'e166c7c28c4092870a7ac2a2287f372c');
            formData.append('orderId', plan.id);
            formData.append('orderCode', plan.order_code);
            formData.append('userId', plan.user_id);
            formData.append('userName', plan.user_name);
            formData.append('planName', plan.planName);
            formData.append('planContent', plan.planContent);
            formData.append('taboo', plan.taboo);
            formData.append('planType', '0');
            formData.append('movementTime', plan.movementTime);
            formData.append('doctorUserId', doctorId);
            formData.append('doctorUserName', doctorName);
            $http({
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined,
                        'Accept': 'application/json, text/javascript, */*; q=0.01'
                    },
                    transformRequest: function(data) {
                        return data;
                    },
                    url: JAVA_URL + 'trade/app/updateHeartScheme.htm',
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
        },
        login: function(userName, orderCode) {
            var deferred = $q.defer();
            $ionicLoading.show();

            var formData = new FormData();
            formData.append('sign', 'dd980ded7fd12d9f0f7d9f95a5ac2b0c');
            formData.append('orderId', orderCode);
            formData.append('userName', userName);
            $http({
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined,
                        'Accept': 'application/json, text/javascript, */*; q=0.01'
                    },
                    transformRequest: function(data) {
                        return data;
                    },
                    url: JAVA_URL + 'product/app/userLogin.htm',
                    data: formData
                })
                .success(function(resp) {
                    $ionicLoading.hide();
                    deferred.resolve(resp);
                    /*if (resp.code === '0') {
                        deferred.resolve(resp);
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.data
                        });
                    }*/
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
