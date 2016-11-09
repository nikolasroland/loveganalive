"use strict";

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
var _phpposts = function(url, data, $http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    var deferred = $q.defer();
    $ionicLoading.show();
    $http.post("https://api.aiganyisheng.cn/" + url, data)
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

.factory('LoginServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    return {
        login: function(username, password) {
            return _phppost('public/patient_login', {
                phone: username,
                verify_code: password
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getToken: function(auth) {
            return _phppost('public/get_token', {
                auth: auth
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        sendCode: function(tel, type) {
            return _phppost('public/phone_verification_code', {
                telphone: tel,
                type: type
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        resetPassword: function(tel, code) {
            return _phppost('public/reset_password', {
                telphone: tel,
                code: code
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        changePassword: function(auth, oldPwd, newPwd) {
            return _phppost('public/change_password', {
                auth: auth,
                old_password: oldPwd,
                new_password: newPwd
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reg: function(regTel, regCode, regNickName, regRealName, regIsOwn, regSex, regBirthday, regDisease) {
            var formatBirthday = new Date(regBirthday).format('yyyy-MM-dd');
            return _phppost('patient/register', {
                telphone: regTel,
                verify_code: regCode,
                nickname: regNickName,
                realname: regRealName,
                sex: regSex,
                birthday: formatBirthday,
                disease: regDisease,
                is_own: regIsOwn
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})

.factory('ReferralServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    return {
        hasmore: true,
        curPage: 1,
        reload: function(patientId, page) {
            return _javapost('product/app/getTreatmentPlanHistoryList.htm', {
                sign: 'fe3c2ea9dbe6229675aaa3c04300e314',
                patientId: patientId,
                page: page,
                rows: Native.pageSize
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadMyPlan: function(patientId) {
            return _javapost('product/app/getMyTreatmentPlanCurrent.htm', {
                sign: '683a1d4ab4e22d765996b6f8bb18f361',
                patientId: patientId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})

.factory('ResultServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    return {
        reload: function(patientId) {
            return _javapost('product/app/getMyTreatmentPlanCurrent.htm', {
                sign: '683a1d4ab4e22d765996b6f8bb18f361',
                patientId: patientId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadById: function(id) {
            return _javapost('product/app/getTreatmentByVisitTimeId.htm', {
                sign: '47dde1a527604dd27768b9ac027e198f',
                id: id
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})

.factory('PlanServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    return {
        reload: function() {
            return _javapost('product/app/productList.htm', {
                sign: '6c362b62fedb0eaa864dc7082ce640fb'
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadLogic: function(id) {
            return _javapost('product/app/findOptionData.htm', {
                sign: '8c2f642acc3fe64b72a6fe1065d07d57',
                productCode: id
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        joinPlan: function(userInfo, productCode, visitTime, resultJson) {
            return _javapost('product/app/joinTreatmentPlanNew.htm', {
                sign: 'be8f9704bd12f7f5444dc013f4faa15b',
                auth: userInfo.auth,
                doctorId: userInfo.doctorId,
                doctorName: userInfo.doctorName,
                doctorNickName: userInfo.doctorNickName,
                patientId: userInfo.patientId,
                patientName: userInfo.patientName,
                patientNickName: userInfo.patientNickName,
                productCode: productCode,
                visitTime: visitTime,
                resultJson: resultJson,
                userPwd: ''
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        updatePlan: function(userInfo, visitTime, resultJson) {
            return _javapost('product/app/updateVisitTime.htm', {
                sign: 'd764d32010fceeb5b86381ef7362e3a9',
                patientId: userInfo.patientId,
                visitTime: visitTime,
                resultJson: resultJson
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})

.factory('DiscoverServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    return {
        hasmore: true,
        curPage: 1,
        reload: function(type, page, rows, nameFilter) {
            nameFilter = nameFilter || '';
            return _javapost('product/app/getDiscoveryList.htm', {
                sign: '4e10e65631a48eca8708d2810436b0dd',
                discoveryType: type,
                title: nameFilter,
                page: page,
                rows: rows
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadDetail: function(id, userId) {
            return _javapost('product/app/getSysSlideImageDetails.htm', {
                sign: '272e1e032421156698cdcbb86227c049',
                id: id,
                userId: userId,
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getSlide: function(isLogin) {
            return _javapost('product/app/getDiscoveryListNew.htm', {
                'sign': 'f5d291042d829ff71eab5e1948c786ca',
                'discoveryType': isLogin ? '08' : '09'
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getHomePageBottom: function(id) {
            return _javapost('product/app/getBelowImageList.htm', {
                'sign': '515854ca14074d5456f6521134bd898c'
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getDiscoverList: function() {
            return _javapost('product/app/getDiscoveryListNew.htm', {
                'sign': 'f5d291042d829ff71eab5e1948c786ca',
                'discoveryType': '10'
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadDetailPhp: function(auth, id) {
            return _phppost('public/get_one_news', {
                'auth': auth,
                'id': id
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        praisePhp: function(auth, id) {
            return _phppost('public/praise_news', {
                'auth': auth,
                'id': id
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})

.factory('DoctorServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {
    var serv = {
        hasmore: true,
        curPage: 1,
        reload: function(userInfo) {
            return _phppost('public/get_user_info', {
                auth: userInfo.auth,
                userid: userInfo.doctorId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadAllInfo: function(userInfo, doctorId) {
            return _phppost('public/get_user_info', {
                auth: userInfo.auth,
                userid: doctorId,
                all: 1,
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadById: function(userInfo, id) {
            return _phppost('public/get_user_info', {
                auth: userInfo.auth,
                userid: id
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        querySchedule: function(id) {
            return _javapost('product/app/getDoctorSchedule.htm', {
                sign: '7aca512be3b2bd84e98198f5a3886f09',
                doctorId: id
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        queryBed: function(id) {
            return _javapost('product/app/getDoctorBed.htm', {
                sign: '73b35491239148c77069a2e2d51cc8ee',
                doctorId: id
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        updateReserve: function(userInfo, amOrPm, subscribeTime, userPwd, mac) {
            return _javapost('product/app/saveSubscribeDetail.htm', {
                sign: 'e2642229d04a59d2def93c490a00162f',
                doctorId: userInfo.doctorId,
                doctorName: userInfo.doctorName,
                doctorNickName: userInfo.doctorNickName,
                patientId: userInfo.patientId,
                patientName: userInfo.patientName,
                patientNickName: userInfo.patientRealName,
                amOrPm: amOrPm,
                subscribeTime: subscribeTime,
                mac: mac,
                userPwd: userPwd
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        updateBed: function(userInfo, amOrPm, subscribeTime, userPwd, mac) {
            return _javapost('product/app/saveSubscribeBed.htm', {
                sign: '76b73e1e0fd3b948c131b3756928faba',
                doctorId: userInfo.doctorId,
                doctorName: userInfo.doctorName,
                doctorNickName: userInfo.doctorNickName,
                patientId: userInfo.patientId,
                patientName: userInfo.patientName,
                patientNickName: userInfo.patientRealName,
                amOrPm: amOrPm,
                subscribeTime: subscribeTime,
                mac: mac,
                userPwd: userPwd
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        changeDoctorCheck: function(userInfo) {
            return _javapost('product/app/changeDoctorCheck.htm', {
                sign: '28a205d33693b6bb9be3871c7c5c379d',
                patientId: userInfo.patientId,
                patientName: userInfo.patientName
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        changeDoctor: function(userInfo, newDoctorId, newDoctorName, newDoctorNickName, userPwd) {
            return _javapost('product/app/patientChangeDoctor.htm', {
                auth: userInfo.auth,
                sign: '44d4270a42b15958ca0fadb147411c56',
                patientId: userInfo.patientId,
                patientName: userInfo.patientName,
                patientNickName: userInfo.patientNickName,
                ndoctorId: userInfo.doctorId,
                cdoctorId: newDoctorId,
                doctorName: newDoctorName,
                doctorNickName: newDoctorNickName,
                userPwd: userPwd
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        unbindDoctor: function(userInfo, doctorid, userPwd) {
            return _phppost('patient/remove_binding', {
                auth: userInfo.auth,
                doctorid: doctorid,
                payment_password: userPwd
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        bindDoctor: function(auth, doctorid) {
            return _phppost('patient/binding_doctor', {
                auth: auth,
                doctorid: doctorid
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        findDoctor: function(auth, page, searchType, search, hospitalId) {
            if (searchType == 'hospital_id') search = hospitalId;
            var data = {};
            data[searchType] = search;
            data.auth = auth;
            data.page = page;
            data.limit = Native.pageSize;
            return _phppost('patient/find_doctor', data, $http, $q, $ionicPopup, $ionicLoading, $rootScope)
        },
        findCity: function(cityId) {
            return _phppost('patient/find_city', {
                city_id: cityId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        findHospital: function(cityId) {
            return _phppost('patient/find_hospital', {
                city_id: cityId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getDoctorCity: function(doctorId) {
            return _javapost('product/app/getOrderTypeByDoctorCity.htm', {
                sign: '23e9391966832e1f3152b7de0deccd7a',
                doctorId: doctorId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getQualityConsult: function() {
            return _javapost('product/app/getQualityConsultProduct.htm', {
                sign: '6c362b62fedb0eaa864dc7082ce640fb'
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        bindDoc: function(doctorid,userInfo){
            return _phppost('patient/execute_banding',{
              doctorid:doctorid,
              auth:userInfo.auth
            },$http,$q,$ionicPopup,$ionicLoading,$rootScope);


          // function bindpost(url,data,$http, $q, $ionicPopup, $ionicLoading, $rootScope){
          //     var deferred = $q.defer();
          //     $ionicLoading.show();
          //     $http.post(url, data)
          //       .success(function(resp) {
          //         $ionicLoading.hide();
          //         if (resp.code === 200) {
          //           if (typeof resp.data !== "undefined")
          //             deferred.resolve(resp.data);
          //           else
          //             deferred.resolve(resp);
          //         } else {
          //           if (resp.code === 202) {
          //             $rootScope.loginState = '';
          //             window.localStorage.setItem('loginState', '');
          //           }
          //           deferred.reject(resp);
          //           $ionicLoading.show({
          //             template: resp.message,
          //             duration: 1200
          //           });
          //         }
          //       })
          //       .error(function(resp, status, headers, config) {
          //         $ionicLoading.hide();
          //         deferred.reject(resp);
          //         $ionicLoading.show({
          //           template: '<i class="ion-android-sad" style="font-size:22px;"></i></br>网络不给力哦~',
          //           duration: 1200
          //         });
          //       });
          //     return deferred.promise;
          //   }
          }
        };
    return serv;
})

.factory('PatientServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {
    var serv = {
        reload: function(userInfo) {
            return _phppost('public/get_user_info', {
                auth: userInfo.auth,
                userid: userInfo.patientId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },  
        update: function(auth, realname,nickname, sex, birthday, is_own,main_disease,other_disease, id_card) {
            var formatBirthday = new Date(birthday).format('yyyyMM');
            return _phppost('patient/complete_info', {
                auth: auth,
                realname: realname, 
                nickname: nickname,
                sex: sex,
                birthday: formatBirthday,
                is_own: is_own,
                main_disease:main_disease,
                other_disease: other_disease,               
                id_card: id_card
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        uploadAvatar: function(auth, image180, image90, image45, image30) {
            return _phppost('public/upload_icon', {
                auth: auth,
                image180: image180,
                image90: image90,
                image45: image45,
                image30: image30
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getHistory: function(userInfo, year) {
            return _phppost('public/get_case', {
                auth: userInfo.auth,
                year: year
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        uploadHistory: function(auth, data, small, filename, filesize, fileext) {
            return _phppost('patient/upload_case', {
                auth: auth,
                data: data,
                small: small,
                filename: filename,
                filesize: filesize,
                fileext: fileext
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        loginAccount: function(userId, userName) {
            return _javapostQuiet('account/app/loginAccount.htm', {
                sign: '8cce652dfab61d281ccec12a5245bfa7',
                userId: userId,
                userName: userName,
                type: 0
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getBalance: function(auth) {
            return _phppostQuiet('public/get_balance', {
                auth: auth
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
    return serv;
})


.factory('AssistantServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {
    var serv = {
        reload: function(userInfo) {
            return _phppost('public/get_user_info', {
                auth: userInfo.auth,
                userid: userInfo.assistantId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
    return serv;
})

.factory('RechargeServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {
    var serv = {
        hasmore: true,
        curPage: 1,
        reload: function(userInfo, page) {
            return _javapost('account/app/accountBalanceDetailPage.htm', {
                sign: '273eaccab4cc31116667f27764b4a3af',
                userId: userInfo.patientId,
                userName: userInfo.patientName,
                sortTarget: 0,
                pageSize: Native.pageSize,
                pageNo: page,
                underThePlatform: '00'
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        recharge: function(jsonData) {
            return _javapost('trade/app/prepayIdHfive.htm', {
                sign: '4f020651f50804152664e65f8bd485e2',
                jsonData: jsonData
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getCash: function(userName) {
            return _javapost('account/app/getCashInsuranceAccount.htm', {
                sign: 'd4f5fe412e8ddb05c1795b5a50525302',
                userName: userName
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        payByBalance: function(userId, userName, type, tradeCode, passWord) {
            return _javapost('account/app/payByAccountBalanceOrCash.htm', {
                sign: '1170c16b619f56f485dee60ab3c0b017',
                userId: userId,
                userName: userName,
                type: type,
                tradeCode: tradeCode,
                passWord: passWord
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        payByWeixin: function(jsonData) {
            return _javapost('trade/app/prepayIdHfiveOnline.htm', {
                sign: '425c0e434464a3806c8b78b9fe386d5b',
                jsonData: jsonData
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getOpenid: function(code) {
            return _javapost('trade/app/getAccessTokenCode.htm', {
                sign: '6f261a19475fff21d2feadb5d1659f27',
                code: code
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getJSApiTicket: function(url) {
            return _javapost('trade/app/getJsApiTicket.htm', {
                sign: 'bb43abd38b8f65d50db4a10eb90da659',
                url: url
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
    return serv;
})


.factory('ServiceServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {
    return {
        hasmore: true,
        curPage: 1,
        query: function(userInfo, page) {
            return _javapost('product/app/getBuyProductServiceByPatientIdPage.htm', {
                patientId: userInfo.patientId,
                sign: 'f9780de6803b8077534534f44fe0535d',
                page: page,
                row: Native.pageSize,
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadInsuranceDetail: function(orderCode) {
            return _javapost('trade/app/findInsuranceDetails.htm', {
                sign: 'f73becec3b54e981efe0e49c8baf1e6b',
                orderCode: orderCode
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        joinInOrder: function(orderCode) {
            return _javapost('trade/app/confirmPatientToDoctor.htm', {
                sign: 'e68820d33977adbccfa7b971000bc681',
                orderCode: orderCode
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getChallengeDetail: function(orderId) {
            return _javapost('trade/app/findIsCurrentPlanHeartScheme.htm', {
                sign: '1a4354c51efa822d72c230bb42e61bab',
                orderId: orderId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadMedicalAList: function(userId) {
            return _javapost('trade/app/findDoctorProduct.htm', {
                sign: '54f75f1458ddd08f8e68ba2fa4db7f36',
                title: 10,
                commodityType: 5,
                doctorUserId: userId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadMedicalBList: function(userId) {
            return _javapost('trade/app/findInsuranceDetails.htm', {
                sign: 'f73becec3b54e981efe0e49c8baf1e6b',
                userId: userId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        cancelOrder: function(orderCode) {
            return _javapost('trade/app/cancelDoctorInsurance.htm', {
                sign: '04b62942b7f4073b62b0f2c50d8e00cd',
                title: 10,
                sourceType: 5,
                doctorUserId: 'doctorManage',
                orderCode: orderCode
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadHeartSchemeList: function(userId) {
            return _javapost('trade/app/findPlanHeartSchemeOrder.htm', {
                sign: '8b850bae6fa63d69a9abb79b9308af76',
                title: 10,
                doctorUserId: userId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        challenge: function(userName, orderCode) {
            return _javapost('product/app/userLogin.htm', {
                sign: 'dd980ded7fd12d9f0f7d9f95a5ac2b0c',
                orderId: orderCode,
                userName: userName
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadOverseasList: function(userId) {
            return _javapost('trade/app/findOverseasProduct.htm', {
                sign: '1f89ef08b31cd95912dd9c4b67284baf',
                title: 10,
                doctorUserId: userId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        updateOverseasInfo: function(orderId, insurancePeople, insuranceMobile, insuranceProvince, insuranceCity, insuranceAddress) {
            return _javapost('trade/app/updateOverseasPeople.htm', {
                sign: 'a51a3ee51e22bbebcbfee8ccf1c3f68b',
                orderId: orderId,
                insurancePeople: insurancePeople,
                insuranceMobile: insuranceMobile,
                insuranceProvince: insuranceProvince,
                insuranceCity: insuranceCity,
                insuranceAddress: insuranceAddress
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})

.factory('ReservationServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {
    return {
        query: function(patientId) {
            return _javapost('product/app/getSubscribeListByPatientId.htm', {
                patientId: patientId,
                sign: '0f0b0126ab30d0c0f6ab3610e2918c35'
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        queryBed: function(patientId) {
            return _javapost('product/app/patientSubscribeBedList.htm', {
                patientId: patientId,
                sign: 'c308b3c50caad6e63a8b49ceb49afc60',
                pageSize: 9999,
                pageNo: 0,
                sortTarget: 0
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        rejectReserv: function(id) {
            return _javapost('product/app/patientCancelSubscribe.htm', {
                sign: 'e7fbd3a8a7eff35eb21b47a584884fd2',
                id: id
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        rejectReservBed: function(id) {
            return _javapost('product/app/patientCancelSubscribeBed.htm', {
                sign: '498e2798ac04c066d79f72c6aeff3558',
                id: id
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})

.factory('RewardServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    return {
        sendReward: function(userInfo, productId, productCount, doctorId, doctorName, doctorNickName, mac) {
            return _javapost('product/app/buyAdmireProduct.htm', {
                sign: '71c3756cdf32389e2d0a172099f4e0d6',
                doctorId: doctorId,
                doctorName: doctorName,
                doctorNickName: doctorNickName,
                patientId: userInfo.patientId,
                patientName: userInfo.patientName,
                patientNickName: userInfo.patientNickName,
                productCount: productCount,
                productId: productId,
                mac: mac,
                userPwd: '123456'
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})

.factory('TipsServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope) {
    return {
        query: function(id) {
            return _javapost('product/app/getSysSlideImageDetails.htm', {
                id: id,
                sign: '272e1e032421156698cdcbb86227c049'
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})

.factory('CommentServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {
    return {
        hasmore: true,
        curPage: 1,
        reload: function(auth, id, page) {
            return _phppost('public/get_comment_list', {
                auth: auth,
                userid: id,
                page: page,
                limit: Native.pageSize
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reserveList: function(id, page, type) {
            return _javapost('product/app/queryEveluateById.htm', {
                sign: '442fc007eb3923d00221192567e4473c',
                id: id,
                type: type,
                page: page,
                rows: Native.pageSize
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        doComment: function(auth, toid, star, content, timestamp) {
            return _phppost('patient/do_comment', {
                "auth": auth,
                "toid": toid,
                "star": star,
                "content": content,
                "timestamp": timestamp
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        delComment: function(auth, commentid) {
            return _phppost('patient/del_comment', {
                auth: auth,
                commentid: commentid
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})

.factory('QaServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {
    return {
        reload: function() {
            return _phppost('public/get_articles', {
                page: 1,
                limit: 9999,
                type: 0
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadRed: function() {
            return _phppost('public/get_articles', {
                page: 1,
                limit: 9999,
                type: 4
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})

.factory('BonusServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {
    return {
        reload: function(userInfo, randomCode) {
            return _javapost('product/app/checkRedEnvelope.htm', {
                sign: 'b65cf210347b38a5aecc55df0deb4e80',
                userId: userInfo.patientId,
                userName: userInfo.patientName,
                randomCode: randomCode
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        checkBonus: function(userInfo, icon, randomCode) {
            return _javapost('product/app/grabRedEnvelope.htm', {
                sign: '8870449ea3fa4a6c852a59057c43d6fc',
                userId: userInfo.patientId,
                userName: userInfo.patientName,
                userNickName: userInfo.patientNickName,
                userPortrait: icon,
                randomCode: randomCode
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})

.factory('MedicalBServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {
    return {
        reloadProducts: function(userInfo, randomCode) {
            return _javapost('product/app/getInsuranceList.htm', {
                sign: '7f187df2e535ba793353ac6b9814a63b'
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        buyProduct: function(userId, userName, nickName, insurancePeople, insuranceMobile, insuranceAddress, insuranceIdCard, insuranceDistribution, productCode, insurancePrescription, detail) {
            return _javaformpost('product/app/buyProductInsurance.htm', {
                sign: '133f78fb52e8c7c3609980f9d3fc7d5e',
                userId: userId,
                userName: userName,
                nickName: nickName,
                productId: productCode,
                insurancePeople: insurancePeople,
                insuranceMobile: insuranceMobile,
                insuranceAddress: insuranceAddress,
                insuranceIdCard: insuranceIdCard,
                insuranceDistribution: insuranceDistribution,
                insurancePrescription: insurancePrescription,
                detail: detail
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})


.factory('MedicalAServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {
    return {
        reloadProducts: function(doctorId) {
            return _javapost('product/app/getDoctorManageServiceProduct.htm', {
                sign: '9452cbf446e8515b7de18514844f2f92',
                doctorId: doctorId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getAppSetInfo: function() {
            return _javapost('product/app/getAppSetInfo.htm', {
                sign: '071f6f83fc0f2b7c7ccc300ac468fba4',
                type: 1
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        getBalance: function(auth) {
            return _phppost('public/get_balance', {
                auth: auth
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        buyProduct: function(userId, userName, nickName, insurancePeople, insuranceMobile, insuranceAddress, insuranceIdCard, jsonData, insurancePrescription, detail) {
            jsonData = JSON.stringify({ "data": jsonData });
            return _javaformpost('product/app/buyDoctorManage.htm', {
                sign: 'bfd9d6fc4212b20aa67a828a64314c99',
                userId: userId,
                userName: userName,
                nickName: nickName,
                data: jsonData,
                insurancePeople: insurancePeople,
                insuranceMobile: insuranceMobile,
                insuranceAddress: insuranceAddress,
                insuranceIdCard: insuranceIdCard,
                insurancePrescription: insurancePrescription,
                detail: detail
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
})

.factory('patientReportServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {
   
    var serv = {
        completeCard: function(auth,id_card) {
            return _phppost('patient/set_id_card', {
                auth: auth,
                id_card: id_card
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reload: function(auth,userid) {
            return _phppost('public/get_user_info', {
                auth: auth,
                userid: userid
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }       
    }
    return serv;
})


.factory('patientListServ',function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {  
    var serv = {
        reportLi: function(auth){
            return _phppost('patient/online_report_list',{
                auth:auth,              
            },$http, $q, $ionicPopup, $ionicLoading, $rootScope);           
        }
    }
    return serv;
})

.factory('patientDetailServ',function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {  
    var serv = {
        reportDetail: function(auth,keyno){
            return _phppost('patient/online_report_info',{
                auth:auth,
                keyno:keyno
            },$http, $q, $ionicPopup, $ionicLoading, $rootScope);           
        }
    }
    return serv;
})

.factory('patientFlupServ',function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {  
    var serv = {
       flupInfo: function(auth,id){
            return _phppost('patient/visits_info',{
                auth:auth,
                id:id
            },$http, $q, $ionicPopup, $ionicLoading, $rootScope);           
        },
        flupupload: function(auth,id,data){
            return _phppost('patient/upload_visit_record',{
                auth:auth,
                data:data,
                id:id
            },$http, $q, $ionicPopup, $ionicLoading, $rootScope);           
        },
    }
    return serv;
})

.factory('flupDetailServ',function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {  
    var serv = {       
        flupgetload: function(auth,id){
            return _phppost('patient/get_visit_record',{
                auth:auth,
                id:id
            },$http, $q, $ionicPopup, $ionicLoading, $rootScope);           
        }
    }
    return serv;
})
