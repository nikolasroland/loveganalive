'use strict';
var _phppost = function(url, data, $http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    var deferred = $q.defer();
    $ionicLoading.show();
    $http.post(PHP_URL + url, data)
        .success(function(resp) {
            $ionicLoading.hide();
            if (resp.code === 200 || resp.code === 206) {
                if (typeof resp.data !== "undefined")
                    deferred.resolve(resp.data);
                else
                    deferred.resolve(resp);
            } else {
                deferred.reject(resp)
                $ionicPopup.alert({
                    title: '',
                    template: '<div class="item item-text-wrap text-center"><h2>温馨提示</h2><p><br>' + resp.message + '</p></div>'
                })
            }
        })
        .error(function(resp, status, headers, config) {
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

var _javapost = function(url, data, $http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    var deferred = $q.defer();
    $ionicLoading.show();
    $http.post(JAVA_URL + url, data)
        .success(function(resp) {
            $ionicLoading.hide();
            if (resp.code === '0') {
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
                $ionicPopup.alert({
                    title: '',
                    template: '<div class="item item-text-wrap text-center"><h2>温馨提示</h2><p><br>' + resp.data + '</p></div>',
                    okText: '确定'
                })
            }
        })
        .error(function(resp, status, headers, config) {
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

angular.module('starter.services', [])

.factory('DoctorServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    return {
        getUserInfo: function(userid) {
            return _phppost('public/get_user_info', {
                userid: userid
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope)
        },
        checkRegPhone: function(phone) {
            return _phppost('doctor/reg_check_phone', {
                phone: phone
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        sendCode: function(telphone) {
            return _phppost('public/phone_verification_code', {
                telphone: telphone,
                type: 1
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        verifyCode: function(telphone, code) {
            return _phppost('public/phone_verification_code_check', {
                telphone: telphone,
                code: code
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        findCity: function(cityId) {
            return _phppost('patient/find_city', {
                city_id: cityId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope)
        },
        findHospital: function(cityId) {
            return _phppost('patient/find_hospital', {
                city_id: cityId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope)
        },
        checkEmail: function(email) {
            return _phppost('doctor/reg_check_email', {
                email: email
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope)
        },
        register: function(phone, referees, realname, email, hospitalId, hospital, offices, professionId, visitInfo) {
            return _phppost('doctor/register', {
                telphone: phone,
                realname: realname,
                hospital: hospital,
                hospital_id: hospitalId,
                profession_id: professionId,
                visit_type: visitInfo,
                offices: offices,
                email: email,
                referees: referees
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope)
        }
    };
})
