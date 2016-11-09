angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $stateParams, $location, localStorageService, DoctorServ) {

    var device = localStorageService.get('device');

    DoctorServ.reload($stateParams.id).then(function(resp) {
        $scope.doctor = resp;
    });

    $scope.selectDoctor = function(userid, username, nickname, profession, avatarzxc) {
        if (typeof Device !== "undefined") {
            Device.selectDoctor(userid, username, nickname, profession, avatarzxc);
        } else {
            if (device === 'ios') {
                window.location.href = 'ios://sectorDoctor/' + userid + '/' + username + '/' + nickname;
            } else {
                $location.path('login');
            }
        }
    }

    $scope.isAndroid = ionic.Platform.isAndroid();
    $scope.showHistoryBack = (typeof Device !== "undefined" || device === 'ios');

    $scope.historyBack = function() {
        if (typeof Device !== 'undefined') {
            Device.historyBack();
        } else {
            window.location.href = "ios://historyBack";
        }
    }
})

.controller('LoginCtrl', function($scope, $http, $timeout, $location, $ionicLoading, $ionicPopup, DoctorServ) {
    $scope.getCodeTxt = '获取验证码';

    $scope.sendMsgCode = function(mobile) {

        $scope.getCode = true;
        //60秒后恢复点击获取验证码
        var times = 60;

        function timeDown(time) {
            $timeout(function() {
                times--;
                $scope.getCodeTxt = time;
                if (times < 0) {
                    $scope.getCode = false;
                    $scope.getCodeTxt = '获取验证码';
                    return;
                }
                timeDown(times);

            }, 1000);
        }
        timeDown(times);

        $http.post(PHP_URL + 'wap/get_phone_code.json', {
                telphone: mobile
            })
            .success(function(resp) {
                if (resp.status === 'success') {
                    $ionicPopup.alert({
                        title: '温馨提示',
                        template: '验证码已通过短信已发送至' + mobile + '请您留意查收'
                    })
                } else {
                    $ionicPopup.alert({
                        title: '提示',
                        template: resp.message
                    })
                }
            })
            .error(function() {
                $ionicPopup.alert({
                    title: '网络不给力，调整到一个信号好的方向再试一下吧',
                    okText: '取消'
                });
            });
    }

    $scope.login = function(telphone, code) {
        DoctorServ.telphone = telphone;

        $ionicLoading.show();
        $http.post(PHP_URL + 'wap/check_phone.json', {
                telphone: telphone,
                doctorid: DoctorServ.info.userid,
                code: code
            })
            .success(function(resp) {
                $ionicLoading.hide();
                $scope.message = resp.message;
                if (resp.status === 'success') {
                    switch (resp.code) {
                        case 200:
                            $ionicPopup.alert({
                                title: '温馨提示',
                                template: '您已注册，并且已绑定该医生'
                            }).then(function(res) {
                                $location.path('home');
                            });
                            console.log('患者已注册，并且已经绑定该医生');
                            break;
                        case 206:
                            $location.path('reg');
                            break;
                        case 207:
                            $ionicPopup.alert({
                                title: '温馨提示',
                                template: '您已注册过爱肝一生账号，并已绑定了 ' + resp.data.old_doctor.nickname + ' 医生。<br />如果您需要更改绑定医生，请登录爱肝一生手机客户端，在“我的医生”界面使用“更换医生”功能修改绑定医生'
                            }).then(function(res) {
                                $location.path('home');
                            });
                            console.log('页面跳转到登录页面（该患者已经注册，但是绑定的医生不是该医生，登录账号支付更换医生）');
                            break;
                        case 217:
                            $ionicPopup.alert({
                                title: '温馨提示',
                                template: '您已绑定该医生'
                            }).then(function(res) {
                                $location.path('home');
                            });
                            console.log('该患者已经绑定该医生');
                            break;
                        case 218:
                            $ionicPopup.alert({
                                title: '温馨提示',
                                template: '该患者已经注册，但没有绑定任何医生'
                            });
                            console.log('该患者已经注册，但没有绑定任何医生，跳转至医生列表');
                            break;
                        default:
                            $ionicPopup.alert({
                                title: '错误提示',
                                template: resp.message
                            });
                            console.log(resp.message);
                            break;
                    }
                } else {
                    $ionicPopup.alert({
                        title: '错误提示',
                        template: resp.message
                    })
                }
            })
            .error(function() {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: '网络不给力，调整到一个信号好的方向再试一下吧',
                    okText: '取消'
                });
            });
    }
})

.controller('RegCtrl', function($scope, $http, $location, $ionicLoading, $ionicPopup, DoctorServ) {
    $scope.birthday = new Date('1990/1/1');

    $scope.reg = function(avatar, nickname, password, pwdconfirm, realname, sex, birthday, is_own, disease) {
        $ionicLoading.show();
        $http.post(PHP_URL + 'wap/register.json', {
                username: DoctorServ.telphone,
                nickname: nickname,
                password: password,
                sex: sex,
                realname: realname,
                doctorid: DoctorServ.info.userid,
                birthday: birthday.toString(),
                is_own: is_own,
                disease: disease,
                avatar: avatar
            })
            .success(function(resp) {
                $ionicLoading.hide();
                if (resp.status === 'success') {
                    $location.path('succ');
                } else {
                    $ionicPopup.alert({
                        title: '错误提示',
                        template: resp.message
                    })
                }
            })
            .error(function() {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: '网络不给力，调整到一个信号好的方向再试一下吧',
                    okText: '取消'
                });
            })
    }


})

.controller('SuccCtrl', function($scope, $stateParams, DoctorServ) {
    $scope.doctor = DoctorServ;
})


.controller('DetailCtrl', function($scope, $http, $timeout, $location, $ionicLoading, $ionicPopup, $stateParams, DoctorServ) {

    if ($stateParams.id == 91) $stateParams.id = 55972; // 该用户名片打印出错

    DoctorServ.reload($stateParams.id).then(function(resp) {
        $scope.doctor = resp;
    });

    $scope.getCodeTxt = '获取验证码';

    $scope.sendMsgCode = function(mobile) {

        $scope.getCode = true;
        //60秒后恢复点击获取验证码
        var times = 60;

        function timeDown(time) {
            $timeout(function() {
                times--;
                $scope.getCodeTxt = time;
                if (times < 0) {
                    $scope.getCode = false;
                    $scope.getCodeTxt = '获取验证码';
                    return;
                }
                timeDown(times);

            }, 1000);
        }
        timeDown(times);

        $http.post(PHP_URL + 'wap/get_phone_code.json', {
                telphone: mobile
            })
            .success(function(resp) {
                if (resp.status === 'success') {
                    if (resp.code === 307) {
                        $ionicPopup.alert({
                            title: '温馨提示',
                            template: '您本日的短信发送次数已超过限制'
                        })
                    } else {
                        $ionicPopup.alert({
                            title: '温馨提示',
                            template: '验证码已通过短信已发送至' + mobile + '请您留意查收'
                        })
                    }
                } else {
                    $ionicPopup.alert({
                        title: '提示',
                        template: resp.message
                    })
                }
            })
            .error(function() {
                $ionicPopup.alert({
                    title: '网络不给力，调整到一个信号好的方向再试一下吧',
                    okText: '取消'
                });
            });
    }

    $scope.login = function(telphone, code) {
        DoctorServ.telphone = telphone;

        $ionicLoading.show();
        $http.post(PHP_URL + 'wap/register1.json', {
                telphone: telphone,
                doctorid: DoctorServ.info.userid,
                code: code
            })
            .success(function(resp) {
                $ionicLoading.hide();
                $scope.message = resp.message;
                if (resp.status === 'success') {
                    switch (resp.code) {
                        case 200:
                            DoctorServ.title1 = '您已成功加入';
                            DoctorServ.title2 = DoctorServ.info.nickname + ' 医生的治疗方案组';
                            DoctorServ.content1 = '';
                            DoctorServ.content2 = '';
                            $location.path('succ');
                            console.log('患者已注册，并且已经绑定该医生');
                            break;
                        case 206:
                            $location.path('reg');
                            break;
                        case 207:
                            $location.path('succ');
                            DoctorServ.title1 = '';
                            DoctorServ.title2 = '';
                            DoctorServ.content1 = '您已注册过爱肝一生账号，并已绑定了 ' + resp.data.old_doctor.nickname + ' 医生。';
                            DoctorServ.content2 = '如果您需要更改绑定医生，请登录爱肝一生手机客户端，在“我的医生”界面使用“更换医生”功能修改绑定医生。';
                            $location.path('succ');
                            console.log('页面跳转到登录页面（该患者已经注册，但是绑定的医生不是该医生，登录账号支付更换医生）');
                            break;
                        case 217:
                            DoctorServ.title1 = '您已成功加入';
                            DoctorServ.title2 = DoctorServ.info.nickname + ' 医生的治疗方案组';
                            DoctorServ.content1 = '';
                            DoctorServ.content2 = '';
                            $location.path('succ');
                            console.log('该患者已经绑定该医生');
                            break;
                        case 218:
                            DoctorServ.title1 = '您已成功加入';
                            DoctorServ.title2 = doctor.nickname + ' 医生的治疗方案组';
                            DoctorServ.content1 = '';
                            DoctorServ.content2 = '';
                            $location.path('succ');
                            console.log('该患者已经注册，但没有绑定任何医生，跳转至医生列表');
                            break;
                        default:
                            $ionicPopup.alert({
                                title: '错误提示',
                                template: resp.message
                            });
                            console.log(resp.message);
                            break;
                    }
                } else {
                    $ionicPopup.alert({
                        title: '错误提示',
                        template: resp.message
                    })
                }
            })
            .error(function() {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: '网络不给力，调整到一个信号好的方向再试一下吧',
                    okText: '取消'
                });
            });
    }
})
