'use strict';
angular.module('starter.services', [])

.factory('Serv', function($http, $q, $ionicPopup, $ionicLoading) {
    return {
        reloadList: function() {
            var deferred = $q.defer();
            $ionicLoading.show();

            var auth = window.localStorage.getItem('auth'),
                userId = window.localStorage.getItem('userId'),
                userName = window.localStorage.getItem('userName'),
                nickName = window.localStorage.getItem('nickName');

            var formData = new FormData();
            formData.append('sign', '4b889748ccf68287e3532442ddde461f');
            formData.append('userId ', userId);
            $http({
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined,
                        'Accept': 'application/json, text/javascript, */*; q=0.01'
                    },
                    transformRequest: function(data) {
                        return data;
                    },
                    url: JAVA_URL + 'trade/app/findAllInsuranceOrder.htm',
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
        loginJumpAllInsurance: function(userId) {
            var deferred = $q.defer();
            $ionicLoading.show();

            var formData = new FormData();
            formData.append('sign', '0cb3739572a9c1132557cdec29766eee');
            formData.append('userId ', userId);
            formData.append('target ', 2);
            $http({
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined,
                        'Accept': 'application/json, text/javascript, */*; q=0.01'
                    },
                    transformRequest: function(data) {
                        return data;
                    },
                    url: JAVA_URL + 'trade/app/loginJumpAllInsurance.htm',
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
                    url: JAVA_URL + 'product/app/getZhongBaoList.htm',
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
        getTask: function(proCode) {
            var deferred = $q.defer();
            $ionicLoading.show();
            var userId = window.localStorage.getItem('userId');
            var formData = new FormData();
            formData.append('sign', '05022d202974f54a9b1d72da94718493');
            formData.append('planId', proCode);
            formData.append('userId', userId);
            $http({
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined,
                        'Accept': 'application/json, text/javascript, */*; q=0.01'
                    },
                    transformRequest: function(data) {
                        return data;
                    },
                    url: JAVA_URL + 'product/app/getTaskList.htm',
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
        pay: function(id, passWord) {
            var deferred = $q.defer();
            $ionicLoading.show();
            var userId = window.localStorage.getItem('userId'),
                userName = window.localStorage.getItem('userName');

            var formData = new FormData();
            formData.append('sign', '1170c16b619f56f485dee60ab3c0b017');
            formData.append('taskBillId', id);
            formData.append('userId', userId);
            formData.append('userName', userName);
            formData.append('passWord', passWord);
            formData.append('tradeCode', '');
            formData.append('type', 0);
            $http({
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined,
                        'Accept': 'application/json, text/javascript, */*; q=0.01'
                    },
                    transformRequest: function(data) {
                        return data;
                    },
                    url: JAVA_URL + 'account/app/payByAccountBalanceOrCash.htm',
                    data: formData
                })
                .success(function(resp) {
                    $ionicLoading.hide();
                    if (resp.code === '0') {
                        deferred.resolve(resp.data);
                    } else if (resp.code === '400010') {
                        deferred.reject(resp)
                        $ionicPopup.confirm({
                            title: '余额不足',
                            template: '',
                            okText: '充值',
                            cancelText: '取消'
                        }).then(function(res) {
                            if (res) {
                                window.parent.postMessage({
                                    func: 'run',
                                    params: ['recharge', []]
                                }, '*')
                            }
                        });
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
        buyProduct: function(proIdArr, proCodeArr, realName, mobileNo, insuranceIdCard) {
            var deferred = $q.defer();
            $ionicLoading.show();
            var auth = window.localStorage.getItem('auth'),
                userId = window.localStorage.getItem('userId'),
                userName = window.localStorage.getItem('userName'),
                nickName = window.localStorage.getItem('nickName');

            var formData = new FormData();
            formData.append('sign', '2ca197c87e7c9262c10c90d472388644');
            formData.append('userId', userId);
            formData.append('userName', userName);
            formData.append('nickName', nickName);
            formData.append('productId', proIdArr);
            formData.append('proCode', proCodeArr);
            formData.append('realName', realName);
            formData.append('mobileNo', mobileNo);
            formData.append('insuranceIdCard', insuranceIdCard);
            $http({
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined,
                        'Accept': 'application/json, text/javascript, */*; q=0.01'
                    },
                    transformRequest: function(data) {
                        return data;
                    },
                    url: JAVA_URL + 'product/app/buyAllInsurance.htm',
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
        }
    }
})
