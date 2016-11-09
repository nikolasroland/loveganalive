angular.module('starter.controllers', [])


.controller('HomeCtrl', function($scope, $rootScope, $http, $timeout, $location, $ionicLoading, $ionicPopup, $stateParams, DoctorServ) {

    if ($stateParams.id == 91) $stateParams.id = 55972; // 该用户名片打印出错
    
    DoctorServ.record($rootScope.phone, '', '10', '0080');

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

        $http.post(NEWPHP_URL + 'public/phone_verification_code', {
                telphone: mobile,
                type: 1
            })
            .success(function(resp) {
                if (resp.code === 200) {
                    $ionicPopup.alert({
                        title: '温馨提示',
                        template: '验证码已通过短信已发送至' + mobile + '请您留意查收'
                    })
                } else {
                    $ionicPopup.alert({
                        title: '温馨提示',
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
        $http.post(NEWPHP_URL + 'patient/wap_registers', {
                telphone: telphone,
                doctorid: DoctorServ.info.userid,
                verify_code: code
            })
            .success(function(resp) {
                $ionicLoading.hide();
                DoctorServ.record($rootScope.phone, DoctorServ.telphone, '10', '0081');
                $scope.message = resp.message;
                switch (resp.code) {
                    case 200:
                        $location.path('succ/' + telphone + '/' + DoctorServ.info.nickname);
                        break;
                    case 613:
                    case 611:
                    case 612:
                        $location.path('fail/' + telphone);
                        console.log('页面跳转到登录页面（该患者已经注册，但是绑定的医生不是该医生，登录账号支付更换医生）');
                        break;
                    case 615:
                        $location.path('other-reg/' + telphone);
                        
                        break;
                    default:
                        $ionicPopup.alert({
                            title: '错误提示',
                            template: resp.message
                        });
                        console.log(resp.message);
                        break;
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

.controller('DetailCtrl', function($scope, $stateParams, $location, localStorageService, DoctorServ) {
    DoctorServ.reload($stateParams.id).then(function(resp) {
        $scope.doctor = resp;
    });
    DoctorServ.querySchedule($stateParams.id).then(function(schedule) {
        $scope.schedule = schedule;
    });
})

.controller('SuccCtrl', function($scope, $rootScope, $stateParams, DoctorServ) {
    DoctorServ.record($rootScope.phone, $stateParams.tel, '10', '0082');
    $scope.telphone =  $stateParams.tel;
    $scope.docName =  $stateParams.name;
    $scope.download = function() {
        DoctorServ.record($rootScope.phone,  $stateParams.tel, '10', '0083');
    }
})

.controller('FailCtrl', function($scope, $rootScope, $stateParams, DoctorServ) {
    DoctorServ.record($rootScope.phone, $stateParams.tel, '10', '0082');
    $scope.telphone =  $stateParams.tel;
    $scope.download = function() {
        DoctorServ.record($rootScope.phone,  $stateParams.tel, '10', '0083');
    }
})
