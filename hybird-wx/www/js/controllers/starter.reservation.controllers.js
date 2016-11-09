var startCtrl = angular.module('starter.reservation.controllers', [])


startCtrl.controller('reserveCtrl', function($scope, $rootScope, $stateParams, $ionicPopup) {
    if (!window.localStorage.getItem('loginState')) {
        $rootScope.openLoginModal();
        return;
    }

    var auth = localStorage.getItem('auth');
    $scope.doctorId = localStorage.getItem('doctorId');
    if ($scope.doctorId == '' || $scope.doctorId == 0) {
        window.location.href = "#/consult/me-doctor-search";
        return;
    } else {
        window.location.href = '#/reservation/' + $scope.doctorId;
    }
})

startCtrl.controller('reservationCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, localStorageService, DoctorServ, PatientServ) {
    var today = Date.now(),
        day = [];
    var distance = new Date().getDay() - 1;
    distance = distance == -1 ? 6 : distance;
    $scope.weekday = distance + 1;
    $scope.afternoon = new Date().getHours() > 12;
    day[0] = new Date(today + (3600 * 24 * (0 - distance) * 1000)).format('MM月dd日');
    day[1] = new Date(today + (3600 * 24 * (6 - distance) * 1000)).format('dd日');
    day[2] = new Date(today + (3600 * 24 * (7 - distance) * 1000)).format('MM月dd日');
    day[3] = new Date(today + (3600 * 24 * (13 - distance) * 1000)).format('dd日');
    $scope.changeStatus = function(status) {
        $rootScope.status = status;
    }

    $scope.week1 = day[0] + '~' + day[1];
    $scope.week2 = day[2] + '~' + day[3];

    DoctorServ.querySchedule($stateParams.id).then(function(resp) {
        $rootScope.schedule = resp;
        if ((resp.next_weeks === '0,0|0,0|0,0|0,0|0,0|0,0|0,0' && resp.this_weeks === '0,0|0,0|0,0|0,0|0,0|0,0|0,0') || resp.limitPeoples == 0) {
            $ionicPopup.alert({
                title: '该医生尚未开放预约加号',
                template: ''
            })
        }
    });

    var auth = window.localStorage.getItem('auth');
    DoctorServ.reloadById(auth, $stateParams.id).then(function(doctor) {
        $scope.reserve = function(amOrPm, subscribeTime, price) {
            localStorageService.set('reserveInfo', { amOrPm: amOrPm, subscribeTime: subscribeTime, price: price });
            window.location.href = "#/reservation-doctor/" + $stateParams.id;
        }
    })

    $scope.choose = function(week, sxw, active) {
        if (active) {
            $scope.selected = {
                week: week,
                sxw: sxw,
                selectedDate: new Date(today + (3600 * 24 * (0 - distance + week - 1) * 1000)).format('yyyy-MM-dd hh:mm:ss')
            }
        }
    }
})

startCtrl.controller('reservationDocCtrl', function($scope, $rootScope, $ionicHistory, $stateParams, $ionicPopup, localStorageService, PatientServ, DoctorServ) {
    var auth = window.localStorage.getItem('auth');

    Native.getAuth('patient', function(userInfo) {
        $scope.patient = userInfo;
        console.log(userInfo)
    });

    $scope.reserveInfo = localStorageService.get('reserveInfo');
    $scope.reserveInfo.objective = '复诊';
    $scope.reserveInfo.main_disease = $scope.patient.main_disease;
    $scope.reserveInfo.idCard = window.localStorage.getItem('idCard');
    $scope.reserveInfo.symptom = '';
    $scope.reserveInfo.subscribeTime = $scope.reserveInfo.subscribeTime.split(' ')[0] + $scope.reserveInfo.amOrPm.toString().replace('0', ' 上午').replace('1', ' 下午');
    DoctorServ.reloadById(auth, $stateParams.id).then(function(doctor) {
        $scope.doctorInfo = doctor;
    });


    $scope.goToPay = function(reserveInfo) {
        if (typeof reserveInfo.realName == "undefined" || reserveInfo.realName == '') {
            $ionicPopup.alert({
                title: '请输入您的真实姓名'
            });
        } else if (typeof reserveInfo.idCard != "undefined" && reserveInfo.idCard != '' && reserveInfo.idCard != null && !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(reserveInfo.idCard)) {
            $ionicPopup.alert({
                title: '请输入正确身份证号'
            });
        } else if (typeof reserveInfo.objective == 'undefined' || reserveInfo.objective == '') {
            $ionicPopup.alert({
                title: '请选择预约目的'
            });
        } else if (typeof reserveInfo.main_disease == 'undefined' || reserveInfo.main_disease == '') {
            $ionicPopup.alert({
                title: '请选择您所患疾病'
            });
        } else if (typeof reserveInfo.symptom == 'undefined' || reserveInfo.symptom == '') {
            $ionicPopup.alert({
                title: '请简要描述您的症状'
            });
        } else {
            if ($scope.patient.hasPassword == '1') {
                $ionicPopup.prompt({
                    title: '此次预约需要支付' + reserveInfo.price + '元',
                    template: '请输入支付密码',
                    inputType: 'password',
                    okText: '确认',
                    cancelText: '取消'
                }).then(function(res) {
                    console.log(res)
                    if (typeof res != 'undefined') {
                        if (res == '') {
                            $ionicLoading.show({
                                template: '请输入支付密码',
                                duration: 1200
                            });
                            return;
                        }
                        PatientServ.reservaToDoc($scope.doctorInfo.userid, $scope.doctorInfo.username, $scope.doctorInfo.nickname, $scope.patient.patientId, $scope.patient.patientName, reserveInfo.realName, reserveInfo.amOrPm, reserveInfo.subscribeTime, res, $scope.doctorInfo.hospital, $scope.doctorInfo.offices, $scope.doctorInfo.adept, reserveInfo.idCard, reserveInfo.main_disease, reserveInfo.objective, reserveInfo.symptom, null).then(function(resp) {
                            window.localStorage.setItem('idCard', reserveInfo.idCard);
                            $ionicPopup.alert({
                                title: '预约成功！'
                            }).then(function() {
                                window.location.href = '#/my-reserv-order';
                            })
                        })
                    }
                });
            } else {
                $ionicPopup.alert({
                    title: '您尚未设置支付密码，请先进行设置'
                }).then(function() {
                    window.location.href = '#/set-password-receivecode';
                })
            }
        }
    }
})

startCtrl.controller('myReserOrderCtrl', function($scope, $ionicPopup, $timeout, DoctorServ, ReservationServ) {

    var auth = window.localStorage.getItem('auth'),
        patientId = window.localStorage.getItem('patientId'),
        doctorId = window.localStorage.getItem('doctorId');
    $scope.status = 'all';
    $scope.all = true;

    $scope.statusName = {
        '00': '待确认',
        '01': '已确认',
        '02': '已取消',
        '03': '待审核',
        '04': '已就诊',
        '05': '未就诊'
    }

    $scope.setActive = function(status) {
        $scope.status = status;
        if (status == 'all') {
            $scope.all = true;
        } else {
            $scope.all = false;
        }
    }

    $scope.comment = function(orderCode, e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        this.reservation.btnDisabled = true;
        var _item = this.reservation;
        Native.run('comment', [orderCode]);

        $timeout(function() {
            _item.btnDisabled = false;
        }, 2000)
    }

    $scope.doRefresh = function() {
        DoctorServ.reload(auth, doctorId).then(function(resp) {
            $scope.doctor = resp;
        })

        ReservationServ.query(patientId).then(function(resp) {
            $scope.hasData = {};
            $scope.hasLoaded = true;
            for (var i in resp) {
                resp[i].datetime = new Date(resp[i].subscribeTime.replace(/-/g, '/')).format('MM月dd日') + (resp[i].amOrPm == 0 ? '上午' : '下午');
                $scope.hasData[resp[i].status] = true;
            }
            $scope.reservationList = resp;
        });
        $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.doRefresh();

    $scope.reservationDetail = function(id) {
        Native.run('goNative', ['reservationDetail', id]);
    }

    $scope.rejectReserv = function(e, id) {
        e.stopImmediatePropagation();
        e.preventDefault();
        $ionicPopup.confirm({
            title: '提示',
            template: '确定要取消预约吗？',
            okText: '确定',
            cancelText: '取消'
        }).then(function(res) {
            if (res) {
                ReservationServ.rejectReserv(id).then(function(resp) {
                    $ionicPopup.alert({
                        title: '已取消本次预约',
                        template: ''
                    }).then(function() {
                        ReservationServ.query(patientId).then(function(resp) {
                            $scope.reservationList = resp;
                        });
                    })
                })
            }
        })
    }
})

startCtrl.controller('myReservOrderDetailCtrl', function($scope, $stateParams, ReservationServ) {
    ReservationServ.getReservDetail($stateParams.id).then(function(resp) {
        resp.status = resp.status.replace('00', '待确认').replace('01', '已确认').replace('02', '已取消').replace('03', '待审核').replace('04', '已就诊').replace('05', '未就诊');
        if (resp.medicalRecordImages)
            $scope.imgArr = resp.medicalRecordImages.split(';');
        $scope.reservDetail = resp;
        console.log(resp)
    });

})

.controller('setPasswordReceiveCodeCtrl', function($scope, $rootScope, $ionicHistory, $ionicPopup, loginServ) {
    $scope.data = {
        tel: window.localStorage.getItem('patientName')
    };
    $scope.getCode = function(tel, type) {
      console.log(tel);
        if (tel) {
            loginServ.getCode(tel, type);
        } else {
            $ionicPopup.alert({
                title: '请填写手机号',
                template: ''
            })
        }
    };

    var auth = window.localStorage.getItem('auth');
    $scope.setPwd = function(code, pwd, confirmPwd) {
        if (typeof code === 'undefined' || code == '') {
            $ionicPopup.alert({
                title: '请填写验证码',
                template: ''
            })
        } else if (typeof pwd === 'undefined' || pwd == '') {
            $ionicPopup.alert({
                title: '请填写一个6位数字密码',
                template: ''
            })
        } else if (typeof confirmPwd === 'undefined' || confirmPwd != pwd) {
            $ionicPopup.alert({
                title: '两次密码输入不一致，请重新输入',
                template: ''
            })
        } else {
            loginServ.setPayPwd(auth, code, pwd).then(function() {
                loginServ.setPayPwd(auth, code, pwd).then(function(resp) {
                    $ionicPopup.alert({
                        title: '支付密码设置成功',
                        template: ''
                    }).then(function() {
                        $ionicHistory.goBack();
                    })
                })
            })
        }
    }
})

.controller('setPasswordCtrl', function($scope, $rootScope, $ionicPlatform, $ionicPopup, loginServ) {
    $scope.pwd = {}
    $scope.changePassword = function(oldPwd, newPwd, confirmPwd) {
        if (oldPwd == undefined || newPwd == undefined || confirmPwd == undefined) {
            $ionicPopup.alert({
                title: '请填写完整',
                template: ''
            })
            return
        }
        if (newPwd !== confirmPwd) {
            $ionicPopup.alert({
                title: '两次密码输入不一致，请重新输入',
                template: ''
            })
            return
        }
        Native.getAuth('patient', function(userInfo) {
            loginServ.changePassword(userInfo.auth, oldPwd, newPwd).then(function(resp) {
                $ionicPopup.alert({
                    title: '密码修改成功，请重新登录',
                    template: ''
                }).then(function() {
                    $rootScope.logout();
                })
            })
        });
    }
})

.controller('accountCtrl', function($scope, $rootScope, $ionicPlatform, $ionicPopup, loginServ) {
    $scope.loginState = window.localStorage.getItem('loginState');
})
