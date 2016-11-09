var startServ = angular.module('starter.login.services', [])



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


startServ.factory('loginServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    return {
        getCode: function(phone, type) {
            return _phppost('public/phone_verification_code', {
                telphone: phone,
                type: type
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope)
        },
        checkCode: function(phone, code) {
            return _phppost('public/patient_login', {
                phone: phone,
                verify_code: code
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope)
        },
        setPayPwd: function(auth, code, password) {
            return _phppost('patient/set_payment_password', {
                auth: auth,
                verify_code: code,
                password: password
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope)
        }
    }
})
