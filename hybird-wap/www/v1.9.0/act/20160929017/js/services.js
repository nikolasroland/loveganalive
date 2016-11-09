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
        sendCode: function(tel) {
            return _phppost('public/phone_verification_code', {
                telphone: tel,
                type: 1
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadProducts: function(doctorId, productId) {
            return _javapost('product/app/getContractServiceProduct.htm', {
                sign: '4f691c39dab984ddc78c66bf288710b1',
                doctorUserId: doctorId,
                productId: productId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadDrug: function(orderCode, serveId) {
            return _javapost('trade/app/findTradeOrderPrescriptionList.htm', {
                sign: 'a946722dc66284ddd67043d0208e9f07',
                orderCode: orderCode,
                serveId: serveId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadOrders: function(doctorId) {
            return _javapost('trade/app/findHbvSignedOrderList.htm', {
                sign: 'e6d855184a96a7a40c5b7d045ebb93ed',
                title: '12',
                doctorUserId: doctorId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadBuyPatients: function(auth, productid) {
            return _phppost('doctor/contract_have_buy_patient', {
                auth: auth,
                productid: productid
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadNotBuyPatients: function(auth, productid) {
            return _phppost('doctor/contract_not_buy_patient', {
                auth: auth,
                productid: productid
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        createQrcode: function(auth, patientid, productid) {
            return _phppost('doctor/contract_create_order', {
                auth: auth,
                patientid: patientid,
                productid: productid
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        buyProduct: function(info, drug, userId, userName, insurancePrescription) {
            return _javaformpost('product/app/buyProductHbvSignedServe.htm', {
                sign: '19fb8a78beba1591ae124561162441d3',
                orderCode: drug.orderCode,
                serveId: drug.id,
                insurancePeople: info.insurancePeople,
                insuranceMobile: info.insuranceMobile,
                insuranceIdCard: info.insuranceIdCard,
                medicare: info.medicare,
                insuranceAddress: info.insuranceAddress,
                serveName: drug.itemName,
                serveNumber: info.serveNumber,
                proNumber: info.proNumber,
                serveType: drug.serveType,
                userId: userId,
                userName: userName,
                insurancePrescription: insurancePrescription
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})
