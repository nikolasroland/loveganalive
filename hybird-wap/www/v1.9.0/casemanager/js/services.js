'use strict';
angular.module('starter.services', [])

.factory('CaseManagerServ', function($http, $q, $ionicPopup, $ionicLoading, localStorageService) {
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
            $http.post(PHP_URL + 'appApi/get_user_info.json', {
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
            $http.post(PHP_URL + 'zhuli/get_doctor_list.json', {
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
        loadUseIn: function() {
            var doctor = localStorageService.get('doctorusein');
            if (doctor) {
                var deferred = $q.defer();
                deferred.resolve(doctor);
                return deferred.promise;
            } else {
                return serv.reloadUseIn();
            }
        },
        reloadUseIn: function() {
            var auth = (typeof AUTH !== 'undefined') ? AUTH : localStorageService.get('auth');
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(PHP_URL + 'zhuli/get_patient_by_doctor_list.json', {
                    auth: auth
                })
                .success(function(resp) {
                    if (resp.status === 'success') {
                        localStorageService.set('doctorusein', resp.data);
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
        updateDoctorInfo: function(doctorid, profession, adept, intro) {
            var auth = (typeof AUTH !== 'undefined') ? AUTH : localStorageService.get('auth');
            var deferred = $q.defer();
            profession = profession.replace('执业医师', '5').replace('住院医师', '4').replace('主治医师', '3').replace('副主任医师', '2').replace('主任医师', '1');
            $ionicLoading.show();
            $http.post(PHP_URL + 'zhuli/update_by_zhuli.json', {
                    auth: auth,
                    doctorid: doctorid,
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
        updateCaseManagerInfo: function(brief) {
            var auth = (typeof AUTH !== 'undefined') ? AUTH : localStorageService.get('auth');
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(PHP_URL + 'zhuli/change_info.json', {
                    auth: auth,
                    brief: brief
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
        loadPatients: function(doctorId) {
            var ls = 'patientlist' + doctorId;
            var patientList = localStorageService.get(ls);
            if (patientList) {
                var deferred = $q.defer();
                deferred.resolve(patientList);
                return deferred.promise;
            } else {
                return serv.reloadPatients(doctorId);
            }
        },
        reloadPatients: function(doctorId) {
            var auth = (typeof AUTH !== 'undefined') ? AUTH : localStorageService.get('auth');
            $ionicLoading.show();
            var deferred = $q.defer();
            $http.post(PHP_URL + 'zhuli/get_patient_list.json', {
                    auth: auth,
                    doctorid: doctorId,
                    is_attention: 0,
                    page: 1,
                    pagesize: 9999
                })
                .success(function(resp, status, headers, config) {
                    if (resp.status === 'success') {
                        var ls = 'patientlist' + doctorId;
                        localStorageService.set(ls, resp.data);
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
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: '网络不给力',
                        template: '<a style="text-align:center;" href="javascript:location.reload()">点击这里刷新再试试</a>',
                        okText: '取消'
                    });
                })
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
            var auth = (typeof AUTH !== 'undefined') ? AUTH : localStorageService.get('auth');
            $ionicLoading.show();
            var deferred = $q.defer();
            $http.post(PHP_URL + 'zhuli/get_order.json', {
                    auth: auth,
                    doctorid: doctorId
                })
                .success(function(resp, status, headers, config) {
                    if (resp.status === 'success') {
                        var ls = 'resesrvationlist' + doctorId;
                        localStorageService.set(ls, resp.data);
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
                    $ionicLoading.hide();
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
                    userId: userid,
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
                    userId: userid,
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
                    userId: userid,
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
                    app_type: 2
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
