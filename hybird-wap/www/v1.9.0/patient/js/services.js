'use strict';
angular.module('starter.services', [])

.factory('DoctorServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
    var serv = {
        load: function() {
            var doctor = localStorageService.get('doctor');
            if (doctor) {
                var deferred = $q.defer();
                deferred.resolve(doctor);
                return deferred.promise;
            } else {
                return serv.reload();
            }
        },
        reload: function() {
            var auth = (typeof AUTH !== 'undefined') ? AUTH : localStorageService.get('auth');
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(PHP_URL + 'huanzhe/get_mydoctor.json', {
                    auth: auth
                })
                .success(function(resp) {
                    if (resp.status === 'success') {
                        localStorageService.set('doctor', resp.data);
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
        loadById: function(id) {
            var ls = 'doctor' + id;
            var doctor = localStorageService.get(ls);
            if (doctor) {
                var deferred = $q.defer();
                deferred.resolve(doctor);
                return deferred.promise;
            } else {
                return serv.reloadById(id);
            }
        },
        reloadById: function(id) {
            var auth = (typeof AUTH !== 'undefined') ? AUTH : localStorageService.get('auth');
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(PHP_URL + 'appApi/get_user_info_byid.json', {
                    auth: auth,
                    userid: id
                })
                .success(function(resp) {
                    if (resp.status === 'success') {
                        var ls = 'doctor' + id;
                        localStorageService.set(ls, resp.data);
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
        querySchedule: function(id) {
            var deferred = $q.defer();
            $http.post(JAVA_URL + 'product/app/getDoctorSchedule.htm', {
                    sign: '7aca512be3b2bd84e98198f5a3886f09',
                    doctorId: id
                })
                .success(function(resp, status, headers, config) {
                    if (resp.code === '0') {
                        localStorageService.set('schedule', resp.data);
                        deferred.resolve(resp);
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
        },
        queryVisit: function(id) {
            var deferred = $q.defer();
            $http.post(JAVA_URL + '/product/app/getDoctorInfoByDoctorId.htm', {
                    sign: '3820fbc99267ff60be21bf72671a9e71',
                    doctorId: id
                })
                .success(function(resp, status, headers, config) {
                    if (resp.code === '0') {
                        localStorageService.set('visit', resp.data);
                        deferred.resolve(resp);
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
        },
        updateReserve: function(doctorId, doctorName, doctorNickName, patientId, patientName, patientNickName, amOrPm, subscribeTime, userPwd) {
            $ionicLoading.show();
            var deferred = $q.defer();
            var today = new Date();
            $http.post(JAVA_URL + 'product/app/saveSubscribeDetail.htm', {
                    sign: 'e2642229d04a59d2def93c490a00162f',
                    doctorId: doctorId,
                    doctorName: doctorName,
                    doctorNickName: doctorNickName,
                    patientId: patientId,
                    patientName: patientName,
                    patientNickName: patientNickName,
                    amOrPm: amOrPm,
                    subscribeTime: subscribeTime,
                    userPwd: userPwd
                })
                .success(function(resp, status, headers, config) {
                    if (resp.code === '0') {
                        deferred.resolve(resp);
                    } else if (resp.code === '400010') {
                        umengLog('PatientEvent', 'InsufficientBalance');
                        deferred.reject(resp)
                        $ionicPopup.confirm({
                            title: '余额不足',
                            template: '',
                            okText: '充值',
                            cancelText: '取消'
                        }).then(function(res) {
                            if (res) {
                                umengLog('PatientClick', 'Recharge');
                                if (ionic.Platform.isAndroid()) {
                                    Device.recharge();
                                } else if (ionic.Platform.isIOS()) {
                                    window.location.href = "ios://recharge";
                                }
                            }
                        });
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.data
                        });
                    }
                    $ionicLoading.hide();
                })
                .error(function(resp, status, headers, config) {
                    deferred.reject(resp)
                    $ionicPopup.alert({
                        title: '网络不给力，调整到一个信号好的方向再试一下吧',
                        okText: '取消'
                    });
                    $ionicLoading.hide();
                })
            return deferred.promise;
        },
        changeDoctorCheck: function(patientId, patientName) {
            $ionicLoading.show();
            var deferred = $q.defer();
            var today = new Date();
            $http.post(JAVA_URL + 'product/app/changeDoctorCheck.htm', {
                    sign: '28a205d33693b6bb9be3871c7c5c379d',
                    patientId: patientId,
                    patientName: patientName
                })
                .success(function(resp, status, headers, config) {
                    if (resp.code === '0') {
                        deferred.resolve(resp.data);
                    } else if (resp.code === '400010') {
                        umengLog('PatientEvent', 'InsufficientBalance');
                        deferred.reject(resp)
                        $ionicPopup.confirm({
                            title: resp.data,
                            template: '',
                            okText: '充值',
                            cancelText: '取消'
                        }).then(function(res) {
                            if (res) {
                                umengLog('PatientClick', 'Recharge');
                                if (ionic.Platform.isAndroid()) {
                                    Device.recharge();
                                } else if (ionic.Platform.isIOS()) {
                                    window.location.href = "ios://recharge";
                                }
                            }
                        });
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.data
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
        changeDoctor: function(doctorId, doctorName, doctorNickName, patientId, patientName, patientNickName, newDoctorId, userPwd) {
            $ionicLoading.show();
            var auth = (typeof AUTH !== 'undefined') ? AUTH : localStorageService.get('auth');
            var deferred = $q.defer();
            $http.post(JAVA_URL + 'product/app/patientChangeDoctor.htm', {
                    auth: auth,
                    sign: '44d4270a42b15958ca0fadb147411c56',
                    ndoctorId: doctorId,
                    doctorName: doctorName,
                    doctorNickName: doctorNickName,
                    patientId: patientId,
                    patientName: patientName,
                    patientNickName: patientNickName,
                    cdoctorId: newDoctorId,
                    userPwd: userPwd
                })
                .success(function(resp, status, headers, config) {
                    if (resp.code === '0') {
                        deferred.resolve(resp.data);
                    } else if (resp.code === '400010') {
                        umengLog('PatientEvent', 'InsufficientBalance');
                        deferred.reject(resp)
                        $ionicPopup.confirm({
                            title: '余额不足',
                            template: '',
                            okText: '充值',
                            cancelText: '取消'
                        }).then(function(res) {
                            if (res) {
                                umengLog('PatientClick', 'Recharge');
                                if (ionic.Platform.isAndroid()) {
                                    Device.recharge();
                                } else if (ionic.Platform.isIOS()) {
                                    window.location.href = "ios://recharge";
                                }
                            }
                        });
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.data
                        });
                    }
                    $ionicLoading.hide();
                })
                .error(function(resp, status, headers, config) {
                    deferred.reject(resp)
                    $ionicPopup.alert({
                        title: '网络不给力，调整到一个信号好的方向再试一下吧',
                        okText: '取消'
                    });
                    $ionicLoading.hide();
                })
            return deferred.promise;
        }
    }

    return serv;
})

.factory('PatientServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
    var serv = {
        load: function() {
            var patient = localStorageService.get('patient');
            if (patient) {
                var deferred = $q.defer();
                deferred.resolve(patient);
                return deferred.promise;
            } else {
                return serv.reload();
            }
        },
        reload: function() {
            var auth = (typeof AUTH !== 'undefined') ? AUTH : localStorageService.get('auth');
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(PHP_URL + 'appApi/get_user_info.json', {
                    auth: auth
                })
                .success(function(resp) {
                    console.log(resp)
                    if (resp.status === 'success') {
                        localStorageService.set('patient', resp.data);
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
        update: function(nickname, sex, birthday, is_own, disease, realname, telphone) {
            var auth = (typeof AUTH !== 'undefined') ? AUTH : localStorageService.get('auth');
            var deferred = $q.defer();
            var formatBirthday = new Date(birthday).format('yyyy-MM-dd');
            $ionicLoading.show();
            $http.post(PHP_URL + 'huanzhe/change_info.json', {
                    auth: auth,
                    nickname: nickname,
                    sex: sex,
                    birthday: formatBirthday,
                    is_own: is_own,
                    disease: disease,
                    realname: realname,
                    telphone: telphone
                })
                .success(function(resp, status, headers, config) {
                    if (resp.status === 'success') {
                        deferred.resolve(resp.data);
                    } else {
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
                        title: '网络不给力，调整到一个信号好的方向再试一下吧',
                        okText: '取消'
                    });
                    $ionicLoading.hide();
                })
            return deferred.promise;
        }
    }
    return serv;
})


.factory('CasemanagerServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
    var serv = {
        load: function() {
            var casemanager = localStorageService.get('casemanager');
            if (casemanager) {
                var deferred = $q.defer();
                deferred.resolve(casemanager);
                return deferred.promise;
            } else {
                return serv.reload();
            }
        },
        reload: function() {
            var auth = (typeof AUTH !== 'undefined') ? AUTH : localStorageService.get('auth');
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(PHP_URL + 'huanzhe/get_myzhuli.json', {
                    auth: auth
                })
                .success(function(resp) {
                    if (resp.status === 'success') {
                        localStorageService.set('casemanager', resp.data);
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
    }
    return serv;
})

.factory('RechargeServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
    var serv = {
        load: function(userId, userName) {
            var wallet = localStorageService.get('recharge');
            if (recharge) {
                var deferred = $q.defer();
                deferred.resolve(recharge);
                return deferred.promise;
            } else {
                return serv.reload(userId, userName);
            }
        },
        reload: function(userId, userName) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(JAVA_URL + 'account/app/rechargeDetailPage.htm', {
                    sign: 'c271a28eeb17d04662d7b6b82dd03ee1',
                    userId: userId,
                    userName: userName,
                    sortTarget: 0,
                    pageSize: 9999,
                    pageNo: 1,
                    underThePlatform: '00'
                })
                .success(function(resp) {
                    if (resp.code === '0') {
                        localStorageService.set('recharge', resp.data);
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
    }
    return serv;
})

.factory('PlanServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
    var serv = {
        load: function(userId) {
            var wallet = localStorageService.get('plan');
            if (plan) {
                var deferred = $q.defer();
                deferred.resolve(plan);
                return deferred.promise;
            } else {
                return serv.reload(userId);
            }
        },
        reload: function(userId) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(JAVA_URL + 'product/app/getMyTreatmentPlan.htm', {
                    sign: 'f07693eda1150a13f719acba9b4ac05e',
                    patientId: userId
                })
                .success(function(resp) {
                    if (resp.code === '0') {
                        localStorageService.set('plan', resp.data);
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
        query: function(patientId) {
            var deferred = $q.defer();
            $http.post(JAVA_URL + 'product/app/getMyTreatmentPlan.htm', {
                    patientId: patientId,
                    sign: 'f07693eda1150a13f719acba9b4ac05e'
                })
                .success(function(resp, status, headers, config) {
                    if (resp.code === '0') {
                        deferred.resolve(resp.data);
                    } else {
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
        },
        queryByCode: function(productCode) {
            var deferred = $q.defer();
            $http.post(JAVA_URL + 'product/app/getTreatmentPlanByCode.htm', {
                    productCode: productCode,
                    sign: '779bec4295b12875aa0c7d518498edb6'
                })
                .success(function(resp, status, headers, config) {
                    if (resp.code === '0') {
                        deferred.resolve(resp.data);
                    } else {
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
    }
    return serv;
})

.factory('ServiceServ', function($http, $q, $ionicPopup, localStorageService) {
    return {
        query: function(id) {
            var deferred = $q.defer();
            $http.post(JAVA_URL + 'product/app/getBuyProductServiceByPatientId.htm', {
                    patientId: id,
                    sign: '71b9333745f6046f7880e6e543836df3'
                })
                .success(function(resp, status, headers, config) {
                    if (resp.code === '0') {
                        localStorageService.set('service', resp.data);
                        deferred.resolve(resp);
                    } else {
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
    }
})

.factory('ReservationServ', function($http, $q, $ionicPopup, localStorageService) {
    return {
        query: function(id) {
            var deferred = $q.defer();
            $http.post(JAVA_URL + 'product/app/getSubscribeListByPatientId.htm', {
                    patientId: id,
                    sign: '0f0b0126ab30d0c0f6ab3610e2918c35'
                })
                .success(function(resp, status, headers, config) {
                    if (resp.code === '0') {
                        for (var i in resp.data) {
                            resp.data[i].datetime = new Date(resp.data[i].subscribeTime.replace(/-/g, '/')).format('MM月dd日') + (resp.data[i].amOrPm == 0 ? '上午' : '下午');
                        }
                        localStorageService.set('reservation', resp.data);
                        deferred.resolve(resp);
                    } else {
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
    }
})

.factory('RewardServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
    return {
        sendReward: function(userPwd, productId, productCount, doctorId, doctorName, doctorNickName, patientId, patientName, patientNickName) {
            $ionicLoading.show();
            var deferred = $q.defer();
            $http.post(JAVA_URL + 'product/app/buyAdmireProduct.htm', {
                    sign: '71c3756cdf32389e2d0a172099f4e0d6',
                    doctorId: doctorId,
                    doctorName: doctorName,
                    doctorNickName: doctorNickName,
                    patientId: patientId,
                    patientName: patientName,
                    patientNickName: patientNickName,
                    productCount: productCount,
                    productId: productId,
                    userPwd: userPwd
                })
                .success(function(resp, status, headers, config) {
                    if (resp.code === '0') {
                        deferred.resolve(resp);
                    } else if (resp.code === '400010') {
                        umengLog('PatientEvent', 'InsufficientBalance');
                        deferred.reject(resp)
                        $ionicPopup.confirm({
                            title: '余额不足',
                            template: '',
                            okText: '充值',
                            cancelText: '取消'
                        }).then(function(res) {
                            if (res) {
                                umengLog('PatientClick', 'Recharge');
                                if (ionic.Platform.isAndroid()) {
                                    Device.recharge();
                                } else if (ionic.Platform.isIOS()) {
                                    window.location.href = "ios://recharge";
                                }
                            }
                        });
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.data
                        });
                    }
                    $ionicLoading.hide();
                })
                .error(function(resp, status, headers, config) {
                    deferred.reject(resp)
                    $ionicPopup.alert({
                        title: '网络不给力，调整到一个信号好的方向再试一下吧',
                        okText: '取消'
                    });
                    $ionicLoading.hide();
                })
            return deferred.promise;
        }
    }
})

.factory('TipsServ', function($http, $q, $ionicPopup) {
    return {
        query: function(id) {
            var deferred = $q.defer();
            $http.post(JAVA_URL + 'product/app/getSysSlideImageDetails.htm', {
                    id: id,
                    sign: '272e1e032421156698cdcbb86227c049'
                })
                .success(function(resp, status, headers, config) {
                    if (resp.code === '0') {
                        deferred.resolve(resp.data);
                    } else {
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
    }
})

.factory('CommentServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
    var auth = (typeof AUTH !== 'undefined') ? AUTH : localStorageService.get('auth');
    return {
        hasmore: true,
        curPage: 1,
        reload: function(id, page) {
            var deferred = $q.defer();
            $http.post(MSG_URL + 'app_api/get_comment_list', {
                    auth: auth,
                    userid: id,
                    page: page
                })
                .success(function(resp) {
                    if (resp.code === 200) {
                        var ls = 'comment' + id;
                        localStorageService.set(ls, resp);
                        deferred.resolve(resp);
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
    }
})

.factory('QaServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
    return {
        reload: function() {
            var deferred = $q.defer();
            $http.post(PHP_URL + 'weixin/get_articles.json', {
                    
                })
                .success(function(resp) {
                    if (resp.code === 200) {
                        localStorageService.set('qa', resp.data);
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
    }
})