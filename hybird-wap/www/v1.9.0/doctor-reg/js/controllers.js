angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $http, $timeout, $location, $ionicLoading, $ionicModal, $ionicPopup, $stateParams, DoctorServ) {
    $scope.getCodeTxt = '获取验证码';
    $scope.getCode = true;
    $scope.reg = {};

    DoctorServ.getUserInfo($stateParams.id).then(function(resp) {
        $scope.reg.docName = resp.realname;
    })

    $scope.sandCode = function(phone) {
        console.log(phone)
        if (phone == undefined) {
            $ionicPopup.alert({
                title: '请填写手机号',
                template: ''
            })
            return;
        } else if (!/^([0-9]{11})?$/.test(phone)) {
            $ionicPopup.alert({
                title: '手机号格式不正确',
                template: ''
            })
            return;
        } else {
            DoctorServ.checkRegPhone(phone).then(function(resp) {
                DoctorServ.sendCode(phone).then(function(resp) {
                    $scope.getCode = false;
                    _timeDown(60);
                })
            })
        }
    }

    $scope.next = function(phone, code) {
        if (phone == undefined) {
            $ionicPopup.alert({
                title: '请填写手机号',
                template: ''
            })
            return;
        } else if (!/^([0-9]{11})?$/.test(phone)) {
            $ionicPopup.alert({
                title: '手机号格式不正确',
                template: ''
            })
            return;
        } else if (code == undefined) {
            $ionicPopup.alert({
                title: '请填写验证码',
                template: ''
            })
            return;
        } else {
            DoctorServ.checkRegPhone(phone).then(function(resp) {
                DoctorServ.verifyCode(phone, code).then(function(resp) {
                    window.location.href = '#/reg/' + phone + '/' + $stateParams.id;
                })
            })
        }
    }


    $scope.closeFindpwdModal = function() {
        $scope.findpwdModal.hide();
    };

    $ionicModal.fromTemplateUrl('./views/modal-agreement.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.agreementModal = modal;
    });

    $scope.openAgreementModal = function() {
        if (typeof $scope.agreementModal !== 'undefined') {
            $scope.agreementModal.show();
        } else {
            $timeout(function() { $scope.agreementModal.show() }, 500);
        }
    };

    $scope.closeAgreementModal = function() {
        $scope.agreementModal.hide();
    };


    function _timeDown(time) {
        $timeout(function() {
            time--;
            $scope.getCodeTxt = time + ' s';
            if (time < 0) {
                $scope.getCode = true;
                $scope.getCodeTxt = '获取验证码';
                return;
            }
            _timeDown(time);
        }, 1000);
    }
})

.controller('RegCtrl', function($scope, $http, $timeout, $location, $ionicLoading, $ionicModal, $ionicPopup, $stateParams, DoctorServ) {
    $scope.reg = { phone: $stateParams.phone, referees: $stateParams.id };

    $scope.register = function(phone, referees, realname, email, hospitalId, hospital, offices, professionId, visitInfo) {
        console.log(phone, referees, realname, email, hospitalId, hospital, offices, professionId, visitInfo)
        if (realname == undefined) {
            $ionicPopup.alert({
                title: '请填写真实姓名',
                template: ''
            })
            return;
        } else if (email == undefined) {
            $ionicPopup.alert({
                title: '请填写电子邮箱',
                template: ''
            })
            return;
        } else if (!/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(email)) {
            $ionicPopup.alert({
                title: '电子邮箱格式不正确',
                template: ''
            })
            return;
        } else {
            DoctorServ.checkEmail(email).then(function(resp) {
                DoctorServ.register(phone, referees, realname, email, hospitalId, hospital, offices, professionId, visitInfo).then(function(resp) {
                    window.location.href = '#/succ';
                })
            })
        }
    }

    $ionicModal.fromTemplateUrl('modal-citys.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.citysModal = modal;
    });

    $scope.openCitysModal = function() {
        if (typeof $scope.citysModal !== 'undefined') {
            $scope.citysModal.show();
        } else {
            $timeout(function() { $scope.citysModal.show() }, 500);
        }
    };
    $scope.closeCitysModal = function() {
        $scope.citysModal.hide();
    };

    $scope.findCity = function(cityId) {
        $scope.openCitysModal();
        DoctorServ.findCity(cityId).then(function(resp) {
            $scope.cityList = resp;
        })
    }

    $scope.findNext = function(cityId, level, hospitalId, hospitalName) {
        if (level == 1) {
            DoctorServ.findCity(cityId).then(function(resp) {
                $scope.cityList = resp;
            })
        } else if (level == 2) {
            DoctorServ.findHospital(cityId).then(function(resp) {
                $scope.cityList = resp;
            })
        } else {
            $scope.closeCitysModal();
            $scope.reg.hospitalId = hospitalId;
            $scope.reg.hospital = hospitalName;
        }
    }
})

.controller('SuccCtrl', function($scope) {

})
