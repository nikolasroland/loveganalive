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
            $http.post(PHP_URL + 'appApi/get_user_info.json', {
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
        updateDoctorInfo: function(profession, adept, intro) {
            var auth = (typeof AUTH !== 'undefined') ? AUTH : localStorageService.get('auth');
            var deferred = $q.defer();
            profession = profession.replace('执业医师', '5').replace('住院医师', '4').replace('主治医师', '3').replace('副主任医师', '2').replace('主任医师', '1');
            $ionicLoading.show();
            $http.post(PHP_URL + 'yisheng/update_userinfo.json', {
                    auth: auth,
                    profession: profession,
                    adept: adept,
                    intro: intro
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
            $http.post(JAVA_URL + 'product/app/getDoctorInfoByDoctorId.htm', {
                    sign: '3820fbc99267ff60be21bf72671a9e71',
                    doctorId: id
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
            return deferred.promise;
        },
        updateVisit: function(doctorId, doctorName, doctorNickName, limitPeoples, servicePrice, this_weeks, next_weeks) {
            var auth = (typeof AUTH !== 'undefined') ? AUTH : localStorageService.get('auth');
            var deferred = $q.defer();
            $http.post(JAVA_URL + 'product/app/settingDoctorInfo.htm', {
                    auth: auth,
                    sign: '3eae9d179bae47a5378b6eed470f63c6',
                    doctorId: doctorId,
                    doctorName: doctorName,
                    doctorNickName: doctorNickName,
                    limitPeoples: limitPeoples,
                    servicePrice: servicePrice,
                    this_weeks: this_weeks,
                    next_weeks: next_weeks
                })
                .success(function(resp, status, headers, config) {
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
            $http.post(PHP_URL + 'yisheng/get_patient_list.json', {
                    auth: auth,
                    is_attention: 0,
                    page: 1,
                    pagesize: 9999
                })
                .success(function(resp) {
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
        setAttention: function(id) {
            var auth = (typeof AUTH !== 'undefined') ? AUTH : localStorageService.get('auth');
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(PHP_URL + 'yisheng/set_attention.json', {
                    auth: auth,
                    patientid: id
                })
                .success(function(resp, status, headers, config) {
                    if (resp.status === 'success') {
                        var patient = localStorageService.get('patient');
                        for (var i in patient.list) {
                            if (patient.list[i].userid == id) {
                                patient.list[i].is_attention = '1';
                                break;
                            }
                        }
                        localStorageService.set('patient', patient);
                        deferred.resolve(resp);
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
        },
        cancelAttention: function(id) {
            var auth = (typeof AUTH !== 'undefined') ? AUTH : localStorageService.get('auth');
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(PHP_URL + 'yisheng/delete_attention.json', {
                    auth: auth,
                    patientid: id
                })
                .success(function(resp, status, headers, config) {
                    if (resp.status === 'success') {
                        var patient = localStorageService.get('patient');
                        for (var i in patient.list) {
                            if (patient.list[i].userid == id) {
                                patient.list[i].is_attention = '0';
                                break;
                            }
                        }
                        localStorageService.set('patient', patient);
                        deferred.resolve(resp);
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

.factory('ReservationServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
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
            var auth = (typeof AUTH !== 'undefined') ? AUTH : localStorageService.get('auth');
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(PHP_URL + 'yisheng/get_order.json', {
                    auth: auth
                })
                .success(function(resp) {
                    if (resp.status === 'success') {
                        localStorageService.set('reservation', resp.data);
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
        applyReserv: function(id) {
            var auth = (typeof AUTH !== 'undefined') ? AUTH : localStorageService.get('auth');
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(JAVA_URL + 'product/app/doctorEnsureSubscribe.htm', {
                    sign: '194e527b7ccd92bfc92bdf88cb786292',
                    id: id
                })
                .success(function(resp, status, headers, config) {
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
        rejectReserv: function(id) {
            var auth = (typeof AUTH !== 'undefined') ? AUTH : localStorageService.get('auth');
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(JAVA_URL + 'product/app/doctorCancelSubscribe.htm', {
                    sign: 'b8877674618678d6860155bc2413722c',
                    id: id
                })
                .success(function(resp, status, headers, config) {
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

.factory('EarningServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
    var serv = {
        loadTradeAmount: function(userid, username, month) {
            var tradeAmount = localStorageService.get('tradeamount');
            if (tradeAmount) {
                var deferred = $q.defer();
                deferred.resolve(tradeAmount);
                return deferred.promise;
            } else {
                return serv.reload(userid, username, month);
            }
        },
        reloadTradeAmount: function(userid, username, month) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(JAVA_URL + '/account/app/statisticsBillSumByDay.htm', {
                    sign: '2dba3f8ca205e48617868b651fd94cf3',
                    userId : userid,
                    userName: username,
                    month: month,
                    tradeType: 1
                })
                .success(function(resp) {
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
        loadSubjectAmount: function(userid, username, month) {
            var subjectAmount = localStorageService.get('subjectamount');
            if (subjectAmount) {
                var deferred = $q.defer();
                deferred.resolve(subjectAmount);
                return deferred.promise;
            } else {
                return serv.reload(userid, username, month);
            }
        },
        reloadSubjectAmount: function(userid, username, month) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(JAVA_URL + 'account/app/statisticsBillSumBySubject.htm', {
                    sign: 'bbe0da0ba733fa6c0af64dbdcc3b0d2b',
                    userId : userid,
                    userName: username,
                    month: month,
                    tradeType: 1
                })
                .success(function(resp) {
                    if (resp.code === '0') {
                        localStorageService.set('subjectamount', resp.data);
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
        loadSubjectDetail: function(userid, username, month, subject) {
            var ls = subject + month + 'subjectdetail';
            var subjectAmount = localStorageService.get(ls);
            if (subjectAmount) {
                var deferred = $q.defer();
                deferred.resolve(subjectAmount);
                return deferred.promise;
            } else {
                return serv.reload(userid, username, month);
            }
        },
        reloadSubjectDetail: function(userid, username, subject, month) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(JAVA_URL + 'account/app/subjectDetailPage.htm', {
                    sign: '2e79ce37ed07f126296605bc050a8bc6',
                    userId : userid,
                    userName: username,
                    month: month,
                    subject: subject,
                    tradeType: 1,
                    sortTarget: 0,
                    pageSize: 9999,
                    pageNo: 1,
                    underThePlatform: '00'
                })
                .success(function(resp) {
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
            $http.post(PHP_URL + 'yisheng/get_patient_num.json', {
                    auth: auth
                })
                .success(function(resp) {
                    console.log(resp)
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

.factory('CommentServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
    var auth = (typeof AUTH !== 'undefined') ? AUTH : localStorageService.get('auth');
    return {
        hasmore: false,
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
                    app_type: 1
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