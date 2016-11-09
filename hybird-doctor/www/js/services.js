'use strict';

var _phppostQuiet = function(url, data, $http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    var deferred = $q.defer();
    $http.post(PHP_URL + url, data)
        .success(function(resp) {
            if (resp.code === 200) {
                if (typeof resp.data !== "undefined")
                    deferred.resolve(resp.data);
                else
                    deferred.resolve(resp);
            } else {
                deferred.reject(resp)
            }
        })
    return deferred.promise;
}

var _javapostQuiet = function(url, data, $http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    var deferred = $q.defer();
    $http.post(JAVA_URL + url, data)
        .success(function(resp) {
            if (resp.code === '0') {
                if (typeof resp.data !== "undefined")
                    deferred.resolve(resp.data);
                else
                    deferred.resolve(resp);
            }
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

var _javahttpspost = function(url, data, $http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    var deferred = $q.defer();
    $ionicLoading.show();
    $http.post(JAVA_HTTPS_URL + url, data)
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
                    /*                $ionicPopup.alert({
                                        title: '',
                                        template: '<div class="item item-text-wrap text-center"><h2>温馨提示</h2><p><br>' + resp.data + '</p></div>',
                                        okText: '确定'
                                    })*/

                $ionicLoading.show({
                    template: resp.data,
                    duration: 1200
                });
            }
        })
        .error(function(resp, status, headers, config) {
            $ionicLoading.hide();
            deferred.reject(resp)
                /*$ionicPopup.alert({
                    title: '网络不给力',
                    template: '<a style="text-align:center;" href="javascript:location.reload()">点击这里刷新再试试</a>',
                    okText: '取消'
                });*/

            $ionicLoading.show({
                template: '<i class="ion-android-sad" style="font-size:22px;"></i></br>网络不给力哦~',
                duration: 1200
            });
        })
    return deferred.promise;
}

angular.module('starter.services', [])

.factory('DoctorDoctorServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
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
            var deferred = $q.defer();
            $ionicLoading.show();
            Native.getAuth('doctor', function(userInfo) {
                $http.post(PHP_URL + 'public/get_user_info', {
                        auth: userInfo.auth,
                        userid: userInfo.doctorId
                    })
                    .success(function(resp) {
                        $ionicLoading.hide();
                        if (resp.code === 200) {
                            localStorageService.set('doctor', resp.data);
                            deferred.resolve(resp.data);
                        } else {
                            deferred.reject(resp)
                            $ionicPopup.alert({
                                title: '提示',
                                template: resp.message
                            });
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
            })

            return deferred.promise;
        },
        getBalance: function() {
            var deferred = $q.defer();
            $ionicLoading.show();
            Native.getAuth('doctor', function(userInfo) {
                $http.post(PHP_URL + 'public/get_balance', {
                        auth: userInfo.auth
                    })
                    .success(function(resp) {
                        $ionicLoading.hide();
                        if (resp.code === 200) {
                            deferred.resolve(resp);
                        } else {
                            deferred.reject(resp)
                            $ionicPopup.alert({
                                title: '提示',
                                template: resp.message
                            });
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
            var deferred = $q.defer();
            $ionicLoading.show();
            Native.getAuth('doctor', function(userInfo) {
                $http.post(PHP_URL + 'public/get_user_info', {
                        auth: userInfo.auth,
                        userid: id
                    })
                    .success(function(resp) {
                        $ionicLoading.hide();
                        if (resp.code === 200) {
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
            });
            return deferred.promise;
        },
        updateDoctorInfo: function(profession, adept, intro) {
            var deferred = $q.defer();
            profession = profession.replace('执业医师', '5').replace('住院医师', '4').replace('主治医师', '3').replace('副主任医师', '2').replace('主任医师', '1');
            $ionicLoading.show();
            Native.getAuth('doctor', function(userInfo) {
                $http.post(PHP_URL + 'doctor/edit_info', {
                        auth: userInfo.auth,
                        profession: profession,
                        adept: adept,
                        intro: intro
                    })
                    .success(function(resp, status, headers, config) {
                        $ionicLoading.hide();
                        if (resp.code === 200) {
                            deferred.resolve(resp.data);
                        } else {
                            $ionicPopup.alert({
                                title: '提示',
                                template: resp.message
                            });
                        }
                    })
                    .error(function(resp, status, headers, config) {
                        $ionicLoading.hide();
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '网络不给力，调整到一个信号好的方向再试一下吧',
                            okText: '取消'
                        });
                    })
            });
            return deferred.promise;
        },
        updateIsCharge: function(isCharge) {
            var deferred = $q.defer();
            $ionicLoading.show();
            var type = isCharge ? 1 : 2;
            Native.getAuth('doctor', function(userInfo) {
                $http.post(PHP_URL + 'doctor/is_charge', {
                        auth: userInfo.auth,
                        type: type
                    })
                    .success(function(resp, status, headers, config) {
                        $ionicLoading.hide();
                        if (resp.code === 200) {
                            deferred.resolve(resp.data);
                        } else {
                            $ionicPopup.alert({
                                title: '提示',
                                template: resp.message
                            });
                        }
                    })
                    .error(function(resp, status, headers, config) {
                        $ionicLoading.hide();
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '网络不给力，调整到一个信号好的方向再试一下吧',
                            okText: '取消'
                        });
                    })
            });
            return deferred.promise;
        },
        querySchedule: function() {
            var deferred = $q.defer();
            Native.getAuth('doctor', function(userInfo) {
                $http.post(JAVA_URL + 'product/app/getDoctorSchedule.htm', {
                        sign: '7aca512be3b2bd84e98198f5a3886f09',
                        doctorId: userInfo.doctorId
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
            });
            return deferred.promise;
        },
        queryVisit: function(id) {
            var deferred = $q.defer();
            Native.getAuth('doctor', function(userInfo) {
                $http.post(JAVA_URL + 'product/app/getDoctorInfoByDoctorId.htm', {
                        sign: '3820fbc99267ff60be21bf72671a9e71',
                        doctorId: userInfo.doctorId
                    })
                    .success(function(resp, status, headers, config) {
                        if (resp.code === '0') {
                            localStorageService.set('visit', resp.data);
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
            });
            return deferred.promise;
        },
        queryBed: function() {
            var deferred = $q.defer();
            Native.getAuth('doctor', function(userInfo) {
                $http.post(JAVA_URL + 'product/app/getDoctorBed.htm', {
                        sign: '73b35491239148c77069a2e2d51cc8ee',
                        doctorId: userInfo.doctorId
                    })
                    .success(function(resp, status, headers, config) {
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
                    .error(function(resp, status, headers, config) {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '网络不给力',
                            template: '<a style="text-align:center;" href="javascript:location.reload()">点击这里刷新再试试</a>',
                            okText: '取消'
                        });
                    })
            });
            return deferred.promise;
        },
        updateVisit: function(limitPeoples, servicePrice, this_weeks, next_weeks) {
            var deferred = $q.defer();
            $ionicLoading.show();
            Native.getAuth('doctor', function(userInfo) {
                $http.post(JAVA_URL + 'product/app/settingDoctorInfo.htm', {
                        auth: userInfo.auth,
                        sign: '3eae9d179bae47a5378b6eed470f63c6',
                        doctorId: userInfo.doctorId,
                        doctorName: userInfo.doctorName,
                        doctorNickName: userInfo.doctorNickName,
                        limitPeoples: limitPeoples,
                        servicePrice: servicePrice,
                        this_weeks: this_weeks,
                        next_weeks: next_weeks
                    })
                    .success(function(resp, status, headers, config) {
                        $ionicLoading.hide();
                        if (resp.code === '0') {
                            deferred.resolve(resp);
                        } else {
                            $ionicPopup.alert({
                                title: '提示',
                                template: resp.data
                            });
                        }
                    })
                    .error(function(resp, status, headers, config) {
                        $ionicLoading.hide();
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '网络不给力，调整到一个信号好的方向再试一下吧',
                            okText: '取消'
                        });
                    })
            });
            return deferred.promise;
        },
        updateBed: function(limitPeoples, servicePrice, this_weeks, next_weeks) {
            var deferred = $q.defer();
            $ionicLoading.show();
            Native.getAuth('doctor', function(userInfo) {
                $http.post(JAVA_URL + 'product/app/settingDoctorBedInfo.htm', {
                        auth: userInfo.auth,
                        sign: 'bd53cc8e56b3e7b9be7a6186a28825b8',
                        doctorId: userInfo.doctorId,
                        doctorName: userInfo.doctorName,
                        doctorNickName: userInfo.doctorNickName,
                        limitPeoples: limitPeoples,
                        servicePrice: servicePrice,
                        this_weeks: this_weeks,
                        next_weeks: next_weeks
                    })
                    .success(function(resp, status, headers, config) {
                        $ionicLoading.hide();
                        if (resp.code === '0') {
                            deferred.resolve(resp);
                        } else {
                            $ionicPopup.alert({
                                title: '提示',
                                template: resp.data
                            });
                        }
                    })
                    .error(function(resp, status, headers, config) {
                        $ionicLoading.hide();
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '网络不给力，调整到一个信号好的方向再试一下吧',
                            okText: '取消'
                        });
                    })
            });
            return deferred.promise;
        }
    }

    return serv;
})

.factory('DoctorPatientServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
    var serv = {
        load: function(id) {
            var deferred = $q.defer();
            var patient = localStorageService.get(id + 'patient');
            if (patient) {
                deferred.resolve(patient);
                return serv.silenceReload();
            } else {
                return serv.reload();
            }
        },
        silenceReload: function() {
            var deferred = $q.defer();
            Native.getAuth('doctor', function(userInfo) {
                $http.post(PHP_URL + 'doctor/get_patient_list', {
                        auth: userInfo.auth,
                        page: 1,
                        limit: 9999
                    })
                    .success(function(resp) {
                        if (resp.code === 200) {
                            for (var i in resp.list) {
                                resp.list[i].realname = resp.list[i].alias || resp.list[i].realname;
                            }
                            localStorageService.set(userInfo.doctorId + 'patient', resp);
                            deferred.resolve(resp);
                        }
                    })
            });
            return deferred.promise;
        },
        reload: function() {
            var deferred = $q.defer();
            $ionicLoading.show();
            Native.getAuth('doctor', function(userInfo) {
                $http.post(PHP_URL + 'doctor/get_patient_list', {
                        auth: userInfo.auth,
                        page: 1,
                        limit: 9999
                    })
                    .success(function(resp) {
                        $ionicLoading.hide();
                        if (resp.code === 200) {
                            for (var i in resp.list) {
                                resp.list[i].realname = resp.list[i].alias || resp.list[i].realname;
                            }
                            localStorageService.set(userInfo.doctorId + 'patient', resp);
                            deferred.resolve(resp);
                        } else {
                            deferred.reject(resp)
                            $ionicPopup.alert({
                                title: '提示',
                                template: resp.message
                            });
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
            });
            return deferred.promise;
        },
        setAttention: function(id) {
            var deferred = $q.defer();
            $ionicLoading.show();
            Native.getAuth('doctor', function(userInfo) {
                $http.post(PHP_URL + 'doctor/set_attention', {
                        auth: userInfo.auth,
                        patientid: id
                    })
                    .success(function(resp, status, headers, config) {
                        $ionicLoading.hide();
                        if (resp.code === 200) {
                            var patient = localStorageService.get(userInfo.doctorId + 'patient');
                            for (var i in patient.list) {
                                if (patient.list[i].userid == id) {
                                    patient.list[i].is_attention = '1';
                                    break;
                                }
                            }
                            localStorageService.set(userInfo.doctorId + 'patient', patient);
                            deferred.resolve(resp);
                        } else {
                            $ionicPopup.alert({
                                title: '提示',
                                template: resp.message
                            });
                        }
                    })
                    .error(function(resp, status, headers, config) {
                        $ionicLoading.hide();
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '网络不给力，调整到一个信号好的方向再试一下吧',
                            okText: '取消'
                        });
                    })
            });
            return deferred.promise;
        },
        cancelAttention: function(id) {
            var deferred = $q.defer();
            $ionicLoading.show();
            Native.getAuth('doctor', function(userInfo) {
                $http.post(PHP_URL + 'doctor/delete_attention', {
                        auth: userInfo.auth,
                        patientid: id
                    })
                    .success(function(resp, status, headers, config) {
                        $ionicLoading.hide();
                        if (resp.code === 200) {
                            var patient = localStorageService.get(userInfo.doctorId + 'patient');
                            for (var i in patient.list) {
                                if (patient.list[i].userid == id) {
                                    patient.list[i].is_attention = '0';
                                    break;
                                }
                            }
                            localStorageService.set(userInfo.doctorId + 'patient', patient);
                            deferred.resolve(resp);
                        } else {
                            $ionicPopup.alert({
                                title: '提示',
                                template: resp.message
                            });
                        }
                    })
                    .error(function(resp, status, headers, config) {
                        $ionicLoading.hide();
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '网络不给力，调整到一个信号好的方向再试一下吧',
                            okText: '取消'
                        });
                    })
            });
            return deferred.promise;
        }
    }

    return serv;
})

.factory('DoctorReservationServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
    var serv = {
        load: function() {
            var reservation = localStorageService.get('reservation');
            if (reservation) {
                var deferred = $q.defer();
                deferred.resolve(reservation);
                return deferred.promise;
            } else {
                return serv.reload();
            }
        },
        reload: function() {
            var deferred = $q.defer();
            $ionicLoading.show();
            Native.getAuth('doctor', function(userInfo) {
                $http.post(PHP_URL + 'doctor/get_order', {
                        auth: userInfo.auth
                    })
                    .success(function(resp) {
                        $ionicLoading.hide();
                        if (resp.code === 200) {
                            for (var i in resp.list) {
                                resp.list[i].patientNickName = resp.list[i].alias || resp.list[i].patientNickName;
                            }
                            localStorageService.set('reservation', resp.data);
                            deferred.resolve(resp);
                        } else {
                            deferred.reject(resp)
                            $ionicPopup.alert({
                                title: '提示',
                                template: resp.message
                            });
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
            });
            return deferred.promise;
        },
        applyReserv: function(id) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(JAVA_URL + 'product/app/doctorEnsureSubscribe.htm', {
                    sign: '194e527b7ccd92bfc92bdf88cb786292',
                    id: id
                })
                .success(function(resp, status, headers, config) {
                    $ionicLoading.hide();
                    if (resp.code == '0') {
                        var reservationList = localStorageService.get('reservation');
                        for (var i in reservationList) {
                            if (reservationList[i].id == id) {
                                reservationList[i].status = '01';
                                break;
                            }
                        }
                        localStorageService.set('reservation', reservationList);
                        deferred.resolve(resp);
                    } else {
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.data
                        });
                    }
                })
                .error(function(resp, status, headers, config) {
                    $ionicLoading.hide();
                    deferred.reject(resp)
                    $ionicPopup.alert({
                        title: '网络不给力，调整到一个信号好的方向再试一下吧',
                        okText: '取消'
                    });
                })
            return deferred.promise;
        },
        rejectReserv: function(id) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(JAVA_URL + 'product/app/doctorCancelSubscribe.htm', {
                    sign: 'b8877674618678d6860155bc2413722c',
                    id: id
                })
                .success(function(resp, status, headers, config) {
                    $ionicLoading.hide();
                    if (resp.code == '0') {
                        var reservationList = localStorageService.get('reservation');
                        for (var i in reservationList) {
                            if (reservationList[i].id == id) {
                                reservationList[i].status = '02';
                                break;
                            }
                        }
                        localStorageService.set('reservation', reservationList);
                        deferred.resolve(resp);
                    } else {
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.data
                        });
                    }
                })
                .error(function(resp, status, headers, config) {
                    $ionicLoading.hide();
                    deferred.reject(resp)
                    $ionicPopup.alert({
                        title: '网络不给力，调整到一个信号好的方向再试一下吧',
                        okText: '取消'
                    });
                })
            return deferred.promise;
        }
    }

    return serv;
})

.factory('DoctorEarningServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
    var serv = {
        hasmore: false,
        curPage: 1,
        reloadTradeAmount: function(month) {
            var deferred = $q.defer();
            $ionicLoading.show();
            Native.getAuth('doctor', function(userInfo) {
                $http.post(JAVA_URL + '/account/app/statisticsBillSumByDay.htm', {
                        sign: '2dba3f8ca205e48617868b651fd94cf3',
                        userId: userInfo.doctorId,
                        userName: userInfo.doctorName,
                        month: month,
                        tradeType: 1
                    })
                    .success(function(resp) {
                        $ionicLoading.hide();
                        if (resp.code === '0') {
                            localStorageService.set('tradeamount', resp.data);
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
                        $ionicLoading.hide();
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '网络不给力',
                            template: '<a style="text-align:center;" href="javascript:location.reload()">点击这里刷新再试试</a>',
                            okText: '取消'
                        });
                    })
            })

            return deferred.promise;
        },
        reloadSubjectAmount: function(month) {
            var deferred = $q.defer();
            $ionicLoading.show();
            Native.getAuth('doctor', function(userInfo) {
                $http.post(JAVA_URL + 'account/app/statisticsBillSumBySubject.htm', {
                        sign: 'bbe0da0ba733fa6c0af64dbdcc3b0d2b',
                        userId: userInfo.doctorId,
                        userName: userInfo.doctorName,
                        month: month,
                        tradeType: 1
                    })
                    .success(function(resp) {
                        $ionicLoading.hide();
                        if (resp.code === '0') {
                            localStorageService.set('subjectamount', resp);
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
                        $ionicLoading.hide();
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '网络不给力',
                            template: '<a style="text-align:center;" href="javascript:location.reload()">点击这里刷新再试试</a>',
                            okText: '取消'
                        });
                    })
            });
            return deferred.promise;
        },
        reloadSubjectDetail: function(subject, month, page) {
            var deferred = $q.defer();
            $ionicLoading.show();
            Native.getAuth('doctor', function(userInfo) {
                $http.post(JAVA_URL + 'account/app/subjectDetailPage.htm', {
                        sign: '2e79ce37ed07f126296605bc050a8bc6',
                        userId: userInfo.doctorId,
                        userName: userInfo.doctorName,
                        month: month,
                        subject: subject,
                        tradeType: 1,
                        sortTarget: 0,
                        pageSize: 10,
                        pageNo: page,
                        underThePlatform: '00'
                    })
                    .success(function(resp) {
                        $ionicLoading.hide();
                        if (resp.code === '0') {
                            var ls = subject + month + 'subjectdetail';
                            localStorageService.set(ls, resp.data);
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
                        $ionicLoading.hide();
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '网络不给力',
                            template: '<a style="text-align:center;" href="javascript:location.reload()">点击这里刷新再试试</a>',
                            okText: '取消'
                        });
                    })
            });
            return deferred.promise;
        }
    }

    return serv;
})

.factory('DoctorAssistantServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
    var serv = {
        load: function() {
            var assistant = localStorageService.get('assistant');
            if (assistant) {
                var deferred = $q.defer();
                deferred.resolve(assistant);
                return deferred.promise;
            } else {
                return serv.reload();
            }
        },
        reload: function() {
            var deferred = $q.defer();
            $ionicLoading.show();
            Native.getAuth('doctor', function(userInfo) {
                $http.post(PHP_URL + 'public/get_user_info', {
                        auth: userInfo.auth,
                        userid: userInfo.assistantId
                    })
                    .success(function(resp) {
                        $ionicLoading.hide();
                        if (resp.code === 200) {
                            localStorageService.set('assistant', resp.data);
                            deferred.resolve(resp.data);
                        } else {
                            deferred.reject(resp)
                            $ionicPopup.alert({
                                title: '提示',
                                template: resp.message
                            });
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
            });
            return deferred.promise;
        }
    }
    return serv;
})

.factory('ReferralServ', function($http, $q, $ionicPopup, $ionicLoading) {
    return {
        reloadMyPlan: function(id) {
            var deferred = $q.defer();
            $http.post(JAVA_URL + 'product/app/getMyTreatmentPlanCurrent.htm', {
                    sign: '683a1d4ab4e22d765996b6f8bb18f361',
                    patientId: id
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
        reload: function(id) {
            var deferred = $q.defer();
            $http.post(JAVA_URL + 'product/app/getTreatmentPlanHistoryList.htm', {
                    sign: 'fe3c2ea9dbe6229675aaa3c04300e314',
                    patientId: id,
                    page: 1,
                    rows: 9999
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
        }
    }
})


.factory('ResultServ', function($http, $q, $ionicPopup, $ionicLoading) {
    return {
        reload: function(patientId) {
            var deferred = $q.defer();
            $http.post(JAVA_URL + 'product/app/getMyTreatmentPlanCurrent.htm', {
                    sign: '683a1d4ab4e22d765996b6f8bb18f361',
                    patientId: patientId
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
        reloadById: function(id) {
            var deferred = $q.defer();
            $http.post(JAVA_URL + 'product/app/getTreatmentByVisitTimeId.htm', {
                    sign: '47dde1a527604dd27768b9ac027e198f',
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
        updateRemark: function(doctorId, id, doctorMessage, type) {
            var deferred = $q.defer();
            $http.post(JAVA_URL + 'product/app/updateDoctorMessage.htm', {
                    sign: 'a9743166501795dfe99ade6593604871',
                    doctorId: doctorId,
                    id: id,
                    doctorMessage: doctorMessage,
                    type: type
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
        reloadRemarkList: function() {
            var deferred = $q.defer();
            $http.post(JAVA_URL + 'product/app/appProductRemarkList.htm', {
                    sign: 'f0a96529fc105612304b3c35f40173a5'
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
        }
    }
})

.factory('CommentServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
    return {
        hasmore: false,
        curPage: 2,
        reload: function(id, page) {
            var deferred = $q.defer();
            Native.getAuth('doctor', function(userInfo) {
                $http.post(PHP_URL + 'public/get_comment_list', {
                        auth: userInfo.auth,
                        userid: id,
                        page: page,
                        limit: 10
                    })
                    .success(function(resp) {
                        $ionicLoading.hide();
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
            });
            return deferred.promise;
        },
        reserveList: function(id, page, type) {
            var deferred = $q.defer();
            $http.post(JAVA_URL + 'product/app/queryEveluateById.htm', {
                    sign: '442fc007eb3923d00221192567e4473c',
                    id: id,
                    type: type,
                    page: page,
                    rows: 10
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
        }
    }
})

.factory('QaServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
    return {
        reload: function() {
            var deferred = $q.defer();
            $http.post(PHP_URL + 'public/get_articles', {
                    page: 1,
                    limit: 9999,
                    type: 1
                })
                .success(function(resp) {
                    $ionicLoading.hide();
                    if (resp.code === 200) {
                        localStorageService.set('qa', resp);
                        deferred.resolve(resp);
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.message
                        });
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
        },
        reloadRed: function() {
            var deferred = $q.defer();
            $http.post(PHP_URL + 'public/get_articles', {
                    page: 1,
                    limit: 9999,
                    type: 4
                })
                .success(function(resp) {
                    $ionicLoading.hide();
                    if (resp.code === 200) {
                        localStorageService.set('qa', resp);
                        deferred.resolve(resp);
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.message
                        });
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
    }
})

















.factory('AssistantAssistantServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
    var serv = {
        load: function() {
            var assistant = localStorageService.get('assistant');
            if (assistant) {
                var deferred = $q.defer();
                deferred.resolve(assistant);
                return deferred.promise;
            } else {
                return serv.reload();
            }
        },
        reload: function() {
            var deferred = $q.defer();
            $ionicLoading.show();
            Native.getAuth('assistant', function(userInfo) {
                $http.post(PHP_URL + 'public/get_user_info', {
                        auth: userInfo.auth,
                        userid: userInfo.assistantId
                    })
                    .success(function(resp) {
                        $ionicLoading.hide();
                        if (resp.code === 200) {
                            localStorageService.set('assistant', resp.data);
                            deferred.resolve(resp.data);
                        } else {
                            deferred.reject(resp)
                            $ionicPopup.alert({
                                title: '提示',
                                template: resp.message
                            });
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
            })
            return deferred.promise;
        }
    }
    return serv;
})

.factory('AssistantDoctorServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
    var serv = {
        load: function(id) {
            var deferred = $q.defer();
            var doctor = localStorageService.get(id + 'doctor');
            if (doctor) {
                deferred.resolve(doctor);
                return serv.silenceReload();
            } else {
                return serv.reload();
            }
        },
        silenceReload: function() {
            var deferred = $q.defer();
            Native.getAuth('assistant', function(userInfo) {
                $http.post(PHP_URL + 'aid/get_doctor_list', {
                        auth: userInfo.auth
                    })
                    .success(function(resp) {
                        if (resp.code === 200) {
                            localStorageService.set(userInfo.assistantId + 'doctor', resp);
                            deferred.resolve(resp);
                        }
                    })
            });
            return deferred.promise;
        },
        reload: function() {
            var deferred = $q.defer();
            $ionicLoading.show();
            Native.getAuth('assistant', function(userInfo) {
                $http.post(PHP_URL + 'aid/get_doctor_list', {
                        auth: userInfo.auth
                    })
                    .success(function(resp) {
                        $ionicLoading.hide();
                        if (resp.code === 200) {
                            localStorageService.set(userInfo.assistantId + 'doctor', resp);
                            deferred.resolve(resp);
                        } else {
                            deferred.reject(resp)
                            $ionicPopup.alert({
                                title: '提示',
                                template: resp.message
                            });
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
            });
            return deferred.promise;
        },
        loadUseIn: function(id) {
            var deferred = $q.defer();
            var doctor = localStorageService.get(id + 'doctorusein');
            if (doctor) {
                deferred.resolve(doctor);
                return serv.silenceReloadUseIn();
            } else {
                return serv.reloadUseIn();
            }
        },
        silenceReloadUseIn: function() {
            var deferred = $q.defer();
            Native.getAuth('assistant', function(userInfo) {
                $http.post(PHP_URL + 'aid/get_patient_by_doctor_list', {
                        auth: userInfo.auth
                    })
                    .success(function(resp) {
                        if (resp.code === 200) {
                            localStorageService.set(userInfo.assistantId + 'doctorusein', resp);
                            deferred.resolve(resp);
                        }
                    })
            });
            return deferred.promise;
        },
        reloadUseIn: function() {
            var deferred = $q.defer();
            $ionicLoading.show();
            Native.getAuth('assistant', function(userInfo) {
                $http.post(PHP_URL + 'aid/get_patient_by_doctor_list', {
                        auth: userInfo.auth
                    })
                    .success(function(resp) {
                        $ionicLoading.hide();
                        if (resp.code === 200) {
                            localStorageService.set(userInfo.assistantId + 'doctorusein', resp);
                            deferred.resolve(resp);
                        } else {
                            deferred.reject(resp)
                            $ionicPopup.alert({
                                title: '提示',
                                template: resp.message
                            });
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
            });
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
            var deferred = $q.defer();
            $ionicLoading.show();
            Native.getAuth('assistant', function(userInfo) {
                $http.post(PHP_URL + 'public/get_user_info', {
                        auth: userInfo.auth,
                        userid: id
                    })
                    .success(function(resp) {
                        $ionicLoading.hide();
                        if (resp.code === 200) {
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
            });
            return deferred.promise;
        },
        updateDoctorInfo: function(doctorid, profession, adept, intro) {
            var deferred = $q.defer();
            profession = profession.replace('执业医师', '5').replace('住院医师', '4').replace('主治医师', '3').replace('副主任医师', '2').replace('主任医师', '1');
            $ionicLoading.show();
            Native.getAuth('assistant', function(userInfo) {
                $http.post(PHP_URL + 'doctor/edit_info', {
                        auth: userInfo.auth,
                        doctorid: doctorid,
                        profession: profession,
                        adept: adept,
                        intro: intro
                    })
                    .success(function(resp, status, headers, config) {
                        $ionicLoading.hide();
                        if (resp.code === 200) {
                            deferred.resolve(resp.data);
                        } else {
                            $ionicPopup.alert({
                                title: '提示',
                                template: resp.message
                            });
                        }
                    })
                    .error(function(resp, status, headers, config) {
                        $ionicLoading.hide();
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '网络不给力，调整到一个信号好的方向再试一下吧',
                            okText: '取消'
                        });
                    })
            });
            return deferred.promise;
        },
        updateAssistantInfo: function(brief) {
            var deferred = $q.defer();
            $ionicLoading.show();
            Native.getAuth('assistant', function(userInfo) {
                $http.post(PHP_URL + 'aid/editinfo', {
                        auth: userInfo.auth,
                        brief: brief
                    })
                    .success(function(resp, status, headers, config) {
                        $ionicLoading.hide();
                        if (resp.code === 200) {
                            deferred.resolve(resp.data);
                        } else {
                            $ionicPopup.alert({
                                title: '提示',
                                template: resp.message
                            });
                        }
                    })
                    .error(function(resp, status, headers, config) {
                        $ionicLoading.hide();
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '网络不给力，调整到一个信号好的方向再试一下吧',
                            okText: '取消'
                        });
                    })
            });
            return deferred.promise;
        },
        loadPatients: function(doctorId) {
            var ls = 'patientlist' + doctorId;
            var patientList = localStorageService.get(ls);
            if (patientList) {
                var deferred = $q.defer();
                deferred.resolve(patientList);
                return serv.silenceReloadPatients(doctorId);
            } else {
                return serv.reloadPatients(doctorId);
            }
        },
        loadLocalPatients: function(doctorId) {
            var ls = 'patientlist' + doctorId;
            var patientList = localStorageService.get(ls);
            if (patientList) {
                var deferred = $q.defer();
                deferred.resolve(patientList);
                return deferred.promise;
            }
        },
        silenceReloadPatients: function(doctorId) {
            var deferred = $q.defer();
            Native.getAuth('assistant', function(userInfo) {
                $http.post(PHP_URL + 'doctor/get_patient_list', {
                        auth: userInfo.auth,
                        doctorid: doctorId,
                        page: 1,
                        limit: 9999
                    })
                    .success(function(resp, status, headers, config) {
                        if (resp.code === 200) {
                            console.log('slience')
                            console.log(resp.list[0])
                            for (var i in resp.list) {
                                resp.list[i].realname = resp.list[i].alias || resp.list[i].realname;
                            }
                            var ls = 'patientlist' + doctorId;
                            localStorageService.set(ls, resp);
                            deferred.resolve(resp);
                        }
                    })
            });
            return deferred.promise;
        },
        reloadPatients: function(doctorId) {
            $ionicLoading.show();
            var deferred = $q.defer();
            Native.getAuth('assistant', function(userInfo) {
                $http.post(PHP_URL + 'doctor/get_patient_list', {
                        auth: userInfo.auth,
                        doctorid: doctorId,
                        page: 1,
                        limit: 9999
                    })
                    .success(function(resp, status, headers, config) {
                        $ionicLoading.hide();
                        if (resp.code === 200) {
                            for (var i in resp.list) {
                                resp.list[i].realname = resp.list[i].alias || resp.list[i].realname;
                            }
                            var ls = 'patientlist' + doctorId;
                            localStorageService.set(ls, resp);
                            deferred.resolve(resp);
                        } else {
                            $ionicPopup.alert({
                                title: '提示',
                                template: resp.message
                            });
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
            });
            return deferred.promise;
        },
        searchPatients: function(name) {
            $ionicLoading.show();
            var deferred = $q.defer();
            Native.getAuth('assistant', function(userInfo) {
                $http.post(PHP_URL + 'aid/find_patient', {
                        auth: userInfo.auth,
                        name: name
                    })
                    .success(function(resp, status, headers, config) {
                        $ionicLoading.hide();
                        if (resp.code === 200) {
                            for (var i in resp.list) {
                                for (var j in resp.list[i].list) {
                                    resp.list[i].list[j].realname = resp.list[i].list[j].alias || resp.list[i].list[j].realname;
                                }
                                var ls = 'patientlist' + resp.list[i].userid;
                                localStorageService.set(ls, resp.list[i]);
                            }
                            deferred.resolve(resp);
                        } else {
                            $ionicPopup.alert({
                                title: '提示',
                                template: resp.message
                            });
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
            });
            return deferred.promise;
        },
        loadReservation: function(doctorId) {
            var ls = 'resesrvationlist' + doctorId;
            var resesrvationlist = localStorageService.get(ls);
            if (resesrvationlist) {
                var deferred = $q.defer();
                deferred.resolve(resesrvationlist);
                return deferred.promise;
            } else {
                return serv.reloadReservation(doctorId);
            }
        },
        reloadReservation: function(doctorId) {
            $ionicLoading.show();
            var deferred = $q.defer();
            Native.getAuth('assistant', function(userInfo) {
                $http.post(PHP_URL + 'doctor/get_order', {
                        auth: userInfo.auth,
                        doctorid: doctorId
                    })
                    .success(function(resp, status, headers, config) {
                        $ionicLoading.hide();
                        if (resp.code === 200) {
                            for (var i in resp.list) {
                                resp.list[i].patientNickName = resp.list[i].alias || resp.list[i].patientNickName;
                            }
                            var ls = 'resesrvationlist' + doctorId;
                            localStorageService.set(ls, resp);
                            deferred.resolve(resp);
                        } else {
                            $ionicPopup.alert({
                                title: '提示',
                                template: resp.message
                            });
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
            });
            return deferred.promise;
        }
    }
    return serv;
})

.factory('AssistantEarningServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
    var serv = {
        hasmore: false,
        curPage: 1,
        reloadTradeAmount: function(month) {
            var deferred = $q.defer();
            $ionicLoading.show();
            Native.getAuth('assistant', function(userInfo) {
                $http.post(JAVA_URL + '/account/app/statisticsBillSumByDay.htm', {
                        sign: '2dba3f8ca205e48617868b651fd94cf3',
                        userId: userInfo.assistantId,
                        userName: userInfo.assistantName,
                        month: month,
                        tradeType: 1
                    })
                    .success(function(resp) {
                        $ionicLoading.hide();
                        if (resp.code === '0') {
                            localStorageService.set('tradeamount', resp.data);
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
                        $ionicLoading.hide();
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '网络不给力',
                            template: '<a style="text-align:center;" href="javascript:location.reload()">点击这里刷新再试试</a>',
                            okText: '取消'
                        });
                    })
            });
            return deferred.promise;
        },
        reloadSubjectAmount: function(month) {
            var deferred = $q.defer();
            $ionicLoading.show();
            Native.getAuth('assistant', function(userInfo) {
                $http.post(JAVA_URL + 'account/app/statisticsBillSumBySubject.htm', {
                        sign: 'bbe0da0ba733fa6c0af64dbdcc3b0d2b',
                        userId: userInfo.assistantId,
                        userName: userInfo.assistantName,
                        month: month,
                        tradeType: 1
                    })
                    .success(function(resp) {
                        $ionicLoading.hide();
                        if (resp.code === '0') {
                            localStorageService.set('subjectamount', resp);
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
                        $ionicLoading.hide();
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '网络不给力',
                            template: '<a style="text-align:center;" href="javascript:location.reload()">点击这里刷新再试试</a>',
                            okText: '取消'
                        });
                    })
            });
            return deferred.promise;
        },
        reloadSubjectDetail: function(subject, month, page) {
            var deferred = $q.defer();
            $ionicLoading.show();
            Native.getAuth('assistant', function(userInfo) {
                $http.post(JAVA_URL + 'account/app/subjectDetailPage.htm', {
                        sign: '2e79ce37ed07f126296605bc050a8bc6',
                        userId: userInfo.assistantId,
                        userName: userInfo.assistantName,
                        month: month,
                        subject: subject,
                        tradeType: 1,
                        sortTarget: 0,
                        pageSize: 10,
                        pageNo: page,
                        underThePlatform: '00'
                    })
                    .success(function(resp) {
                        $ionicLoading.hide();
                        if (resp.code === '0') {
                            var ls = subject + month + 'subjectdetail';
                            localStorageService.set(ls, resp.data);
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
                        $ionicLoading.hide();
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '网络不给力',
                            template: '<a style="text-align:center;" href="javascript:location.reload()">点击这里刷新再试试</a>',
                            okText: '取消'
                        });
                    })
            });
            return deferred.promise;
        }
    }

    return serv;
})

.factory('AssistantInsuranceServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
    return {
        reloadInsuranceList: function(auth, id) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(PHP_URL + 'aid/get_insurance_list', {
                    auth: auth,
                    userid: id
                })
                .success(function(resp) {
                    $ionicLoading.hide();
                    if (resp.code === 200) {
                        deferred.resolve(resp);
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.message
                        });
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
        },
        reloadInsuranceDetail: function(orderCode) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(JAVA_URL + 'trade/app/findInsuranceDetails.htm', {
                    sign: 'f73becec3b54e981efe0e49c8baf1e6b',
                    orderCode: orderCode
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
        },
        reloadDivList: function(auth, id) {
            var deferred = $q.defer();
            $http.post(PHP_URL + 'aid/get_directly_subordinate', {
                    auth: auth,
                    userid: id
                })
                .success(function(resp) {
                    if (resp.code === 200) {
                        deferred.resolve(resp.data);
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.message
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
        updateOrderInvoice: function(userId, orderCode, proInvoiceTitle, proInvoiceAmount) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(JAVA_URL + 'trade/app/updateTradeOrderInvoice.htm', {
                    sign: '2a14d9ba0111a77d216ebab8b8c3133e',
                    userId: userId,
                    orderCode: orderCode,
                    proInvoiceTitle: proInvoiceTitle,
                    proInvoiceAmount: proInvoiceAmount,
                    proInvoiceStatus: '02'
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
        },
        reloadExpressTrack: function(com, nu) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(JAVA_URL + 'trade/app/findExpressTrack.htm', {
                    sign: '40b577c853ba3aa229161df2dedd8580',
                    com: com,
                    nu: nu
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
        },
        cancelTradeOrder: function(orderCode) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(JAVA_URL + 'trade/app/cancelTradeOrder.htm', {
                    sign: '7c00d8dae635e2ce36347bb7dc0d2e74',
                    orderCode: orderCode
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
    }
})

.factory('BonusServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
    return {
        checkBonus: function(icon, randomCode, userid, username, nickname) {
            var deferred = $q.defer();
            Native.getAuth('patient', function(userInfo) {
                $http.post(JAVA_URL + 'product/app/grabRedEnvelope.htm', {
                        sign: '8870449ea3fa4a6c852a59057c43d6fc',
                        userId: userid,
                        userName: username,
                        userNickName: nickname,
                        userPortrait: icon,
                        randomCode: randomCode
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
            });
            return deferred.promise;
        }
    }
})

.factory('DiscoverServ', function($http, $q, $ionicPopup, $ionicLoading) {
    return {
        hasmore: true,
        curPage: 2,
        reload: function(type, page, rows, nameFilter) {
            nameFilter = nameFilter || '';
            var deferred = $q.defer();
            $http.post(JAVA_URL + 'product/app/getDiscoveryList.htm', {
                    sign: '4e10e65631a48eca8708d2810436b0dd',
                    discoveryType: type,
                    title: nameFilter,
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
        reloadPhp: function(auth, type, page, limit) {
            var deferred = $q.defer();
            $http.post(PHP_URL + 'doctor/get_news_list', {
                    auth: auth,
                    type: type,
                    page: page,
                    limit: limit
                })
                .success(function(resp) {
                    if (resp.code === 200) {
                        deferred.resolve(resp);
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.message
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
        reloadDetailPhp: function(auth, id) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(PHP_URL + 'public/get_one_news', {
                    auth: auth,
                    id: id
                })
                .success(function(resp) {
                    $ionicLoading.hide();
                    if (resp.code === 200) {
                        deferred.resolve(resp);
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.message
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
        praisePhp: function(auth, id) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(PHP_URL + 'public/praise_news', {
                    auth: auth,
                    id: id
                })
                .success(function(resp) {
                    $ionicLoading.hide();
                    if (resp.code === 200) {
                        deferred.resolve(resp);
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.message
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
        getCommentList: function(auth, id, page, limit) {
            var deferred = $q.defer();
            $http.post(PHP_URL + 'public/get_news_comment_list', {
                    auth: auth,
                    id: id,
                    page: page,
                    limit: limit
                })
                .success(function(resp) {
                    if (resp.code === 200) {
                        deferred.resolve(resp);
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.message
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
        commentArticlePhp: function(auth, id, content) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(PHP_URL + 'public/comment_news', {
                    auth: auth,
                    id: id,
                    content: content
                })
                .success(function(resp) {
                    $ionicLoading.hide();
                    if (resp.code === 200) {
                        deferred.resolve(resp);
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.message
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
        saveAnswerPhp: function(auth, id, answer) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(PHP_URL + 'doctor/news_question_answer', {
                    auth: auth,
                    id: id,
                    answer: answer
                })
                .success(function(resp) {
                    $ionicLoading.hide();
                    if (resp.code === 200) {
                        deferred.resolve(resp);
                    } else {
                        deferred.reject(resp)
                        $ionicPopup.alert({
                            title: '提示',
                            template: resp.message
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
        getDiscoverList: function(id) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(JAVA_URL + 'product/app/getDiscoveryListNew.htm', {
                    sign: 'f5d291042d829ff71eab5e1948c786ca',
                    'discoveryType': '10'
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
        }
    }
})

.factory('ProductServ', function($http, $q, $ionicPopup, $ionicLoading) {
    return {
        reloadById: function(id) {
            var deferred = $q.defer();
            $http.post(JAVA_URL + 'product/app/getTreatmentPlanByCode.htm', {
                    sign: '779bec4295b12875aa0c7d518498edb6',
                    productCode: id
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
        }
    }
})


.factory('OrderServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    return {
        getDoctorCity: function(doctorId) {
            return _javapost('product/app/getOrderTypeByDoctorCity.htm', {
                sign: '23e9391966832e1f3152b7de0deccd7a',
                doctorId: doctorId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadMedicalAList: function(doctorId) {
            return _javapost('product/app/getDoctorManageServiceProduct.htm', {
                sign: '9452cbf446e8515b7de18514844f2f92',
                doctorId: doctorId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadMedicalBList: function() {
            return _javapost('product/app/getInsuranceList.htm', {
                sign: '7f187df2e535ba793353ac6b9814a63b'
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadGanaiList: function() {
            return _javapost('product/app/getInsuranceList.htm', {
                sign: '7f187df2e535ba793353ac6b9814a63b'
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getProductPatients: function(auth, type) {
            return _phppost('doctor/patient_list_by_disease', {
                auth: auth,
                type: type
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getYiganOrderList: function(doctorId) {
            return _javapost('trade/app/findProductOrderBySubject.htm', {
                sign: 'd144c5d50cc16df0422f4b6a1c9faade',
                title: '12',
                subject: '29,45',
                userId: doctorId, 
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getBingganOrderList: function(doctorId) {
            return _javapost('trade/app/findOverseasProduct.htm', {
                sign: '1f89ef08b31cd95912dd9c4b67284baf',
                title: 12,
                doctorUserId: doctorId, 
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getZhifangganOrderList: function(doctorId) {
            return _javapost('trade/app/findProductOrderBySubject.htm', {
                sign: 'd144c5d50cc16df0422f4b6a1c9faade',
                title: 12,
                subject:'63,67',
                userId: doctorId, 
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getGanaiOrderList: function(doctorId) {
            return _javapost('trade/app/findDoctorProduct.htm', {
                sign: '54f75f1458ddd08f8e68ba2fa4db7f36',
                title: 12,
                doctorUserId: doctorId, 
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})

.factory('FollowupServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    return {
        getTemplates: function(auth) {
            return _phppost('doctor/visits_template_cate', {
                auth: auth
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        saveFollowupPlan: function(patientid,drugcure,nutrition,nutritionsug,sports,sportssug,mental,mentalsug,visit,auth) {
            return _phppost('doctor/visits_save_follow_up_plan', {
                patientid: patientid,
                drug: drugcure,
                non_drug:nutrition,
                non_drug_remark:nutritionsug,
                sport: sports,
                sport_remark: sportssug,
                mind: mental,
                mind_remark: mentalsug,
                visit: visit,
                auth: auth
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getTemplateById: function(catid, auth) {
            return _phppost('doctor/visits_template_one_info', {
                id: catid,
                auth: auth
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})


.factory('doctorFlupServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    return {
        doctorFlupInfo: function(auth, id) {
            return _phppost('doctor/visits_info', {
                auth: auth,
                id: id
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})

.factory('doctorFlupChangeServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    return {
        doctorFlupChange: function(auth, doctorFlup) {
            return _phppost('doctor/visits_save_follow_up_plan', {
                auth: auth,
                id: doctorFlup.id,
                patientid: doctorFlup.patientid,
                drug: doctorFlup.drug,
                non_drug: doctorFlup.non_drug,
                non_drug_remark: doctorFlup.non_drug_remark,
                sport: doctorFlup.sport,
                sport_remark: doctorFlup.sport_remark,
                mind: doctorFlup.mind,
                mind_remark: doctorFlup.mind_remark,
                visit: doctorFlup.visit
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})

.factory('doctorFlupDetailServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    return {
        doctorFlupDetail: function(auth, id) {
            return _phppost('doctor/get_visit_record', {
                auth: auth,
                id: id
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})

.factory('patientListServ',function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {  
    var serv = {
        reportLi: function(auth,patientid){
            return _phppost('doctor/online_report_list',{
                auth:auth,    
                patientid:patientid
            },$http, $q, $ionicPopup, $ionicLoading, $rootScope);           
        }
    }
    return serv;
})

.factory('patientDetailServ',function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {  
    var serv = {
        reportDetail: function(auth,keyno){
            return _phppost('doctor/online_report_info',{
                auth:auth,
                keyno:keyno
            },$http, $q, $ionicPopup, $ionicLoading, $rootScope);           
        }
    }
    return serv;
})