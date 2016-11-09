var startServ = angular.module('starter.consult.services', [])

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
                    $rootScope.openLoginModal();
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

startServ.factory('DoctorServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {
    var serv = {
        hasmore: true,
        curPage: 1,
        reload: function(auth, doctorId) {
            return _phppost('public/get_user_info', {
                auth: auth,
                userid: doctorId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadAllInfo: function(auth, doctorId) {
            return _phppost('public/get_user_info', {
                auth: auth,
                userid: doctorId,
                all: 1,
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        reloadById: function(auth, id) {
            return _phppost('public/get_user_info', {
                auth: auth,
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
        getConsultForOneYuan: function(auth) {
            return _phppost('patient/consultation_list_for_one_yuan', {
                auth: auth
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
    }

    return serv;
})

startServ.factory('CommentServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {
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


startServ.factory('PatientServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {
    var serv = {
        reload: function(userInfo) {
            return _phppost('public/get_user_info', {
                auth: userInfo.auth,
                userid: userInfo.patientId
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        update: function(auth, nickname, sex, birthday, is_own, main_disease, realname, other_disease) {
            var formatBirthday = new Date(birthday).format('yyyyMM');
            return _phppost('patient/complete_info', {
                auth: auth,
                nickname: nickname,
                sex: sex,
                birthday: formatBirthday,
                is_own: is_own,
                main_disease: main_disease,
                other_disease: other_disease,
                realname: realname
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
        },
        pubConsult: function(casepoint, sex, age,inputPrescription, doctorId, auth) {
            return _phppost('patient/published_consultation', {
                content: casepoint,
                sex: sex,
                age: age,
                images: inputPrescription.base64!=null && inputPrescription.base64.indexOf(',')!=-1 ? inputPrescription.base64.split(',')[1] : inputPrescription.base64,
                doctorId: doctorId,
                auth: auth
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope)
        },
        getOneConsultProduct: function() {
            return _javapost('product/app/getOneConsultProduct.htm', {
                sign: '6c362b62fedb0eaa864dc7082ce640fb'
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope)
        },
        getQualityConsultProduct: function() {
            return _javapost('product/app/getQualityConsultProduct.htm', {
                sign: '6c362b62fedb0eaa864dc7082ce640fb'
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope)
        },
        reservaToDoc: function(doctorId, doctorName, doctorNickName, patientId, patientName, patientNickName, amOrPm, subscribeTime, userPwd, hospital, department, introduction, idCard, disease, objective, symptom, medicalRecordImages) {
            return _javapost('product/app/saveSubscribeDetailNew.htm', {
                sign: '014e0ca036e4b0adf74adea52057c6dc',
                doctorId: doctorId,
                doctorName: doctorName,
                doctorNickName: doctorNickName,
                patientId: patientId,
                patientName: patientName,
                patientNickName: patientNickName,
                amOrPm: amOrPm,
                subscribeTime: subscribeTime,
                userPwd: userPwd,
                hospital: hospital,
                department: department,
                introduction: introduction,
                idCard: idCard,
                disease: disease,
                objective: objective,
                symptom: symptom,
                medicalRecordImages: medicalRecordImages

            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        }
    }
    return serv;
})

startServ.factory('RechargeServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {
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
                passWord: passWord,
                payRole: 10
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        payConsultByBalance: function(userId, userName, type, tradeCode, passWord, subject, productId, doctorId, doctorName, patientId, patientName, questionId) {
            return _javapost('trade/app/payByAccountBalanceOrCash.htm', {
                sign: '612425ef188a522057c4ad608fb35567',
                userId: userId,
                userName: userName,
                type: type,
                tradeCode: tradeCode,
                passWord: passWord,
                payRole: 10,
                productData: JSON.stringify({
                    subject: subject,
                    productId: productId,
                    doctorId: doctorId,
                    doctorName: doctorName,
                    patientId: patientId,
                    patientName: patientName,
                    questionId: questionId
                })
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope);
        },
        payByWeixin: function(jsonData,productData) {
            return _javapost('trade/app/prepayIdProductPay.htm', {
                sign: 'a9122f9b07d06e9771d1433e33ee27eb',
                jsonData: jsonData,
                productData:productData
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


startServ.factory('conOrderServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {
    return {
        myConsultOrder: function(auth) {
            return _phppost('patient/get_all_of_my_consultation', {
                auth: auth
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope)
        },
        myConsultOrderDetail: function(auth, id) {
            return _phppost('patient/get_a_set_of_consultation', {
                auth: auth,
                id: id
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope)
        }
    }
});


startServ.factory('ReservationServ', function($http, $q, $ionicPopup, $ionicLoading, $rootScope, localStorageService) {
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
        },
        getReservDetail: function(id) {
            return _javapost('product/app/getSubscribeDetail.htm', {
                sign: 'caf9d505ce7fd4b5873ab71a124a5876',
                id: id
            }, $http, $q, $ionicPopup, $ionicLoading, $rootScope)
        }
    }
})
