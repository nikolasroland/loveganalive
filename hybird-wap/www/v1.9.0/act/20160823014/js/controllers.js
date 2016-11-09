'use strict';
angular.module('starter.controllers', [])

.controller('AppCtrl', function() {})

.controller('HomeCtrl', function($scope, localStorageService, Serv) {

    window.parent.postMessage({
        func: 'getAuth',
        params: ['patient']
    }, '*')

    Serv.reloadProducts().then(function(resp) {
        for (var i in resp) {
            if ((JAVA_URL == 'http://testmanage.aiganyisheng.net/' && resp[i].productCode == '100048') || (JAVA_URL == 'http://manage.aiganyisheng.cn/' && resp[i].productCode == '100049'))
                localStorageService.set('yd', resp[i]);
            else
                localStorageService.set('am', resp[i]);
        }
    });

    Serv.getUserInfo().then(function(resp) {
        localStorageService.set('user', resp);
    })
})

.controller('YdCtrl', function($scope, $ionicPopup) {
    var userId = '';
    $scope.signUp = function(pos) {
        window.localStorage.setItem('pos', pos);
        window.parent.postMessage({
            func: 'getAuth',
            params: ['patient']
        }, '*')
    }
    $scope.afterGetAuth = function() {
        userId = window.localStorage.getItem('userId');
        if (userId == '' || userId == 0 || userId == null) {
            $ionicPopup.alert({
                title: '提示',
                template: '需要先登录才可以订购哦'
            }).then(function() {
                window.parent.postMessage({
                    func: 'run',
                    params: ['login', []]
                }, '*');
            })
        } else if (window.localStorage.getItem('doctorId') == 0) {
            alert('您还没有绑定医生，请先选择一位距离您较近的医生吧。');
            window.parent.postMessage({
                func: 'run',
                params: ['transfer', [0, 'selectDoctor']]
            }, '*');
            return;
        } else {
            window.location.href = "#/shop/" + window.localStorage.getItem('pos');
        }
    }

    $scope.tel = function(telphone) {

        window.parent.postMessage({
            func: 'run',
            params: ['tel', [telphone]]
        }, '*')
    }
})

.controller('AmCtrl', function($scope, $ionicPopup) {
    var userId = '';
    $scope.signUp = function(pos) {
        window.localStorage.setItem('pos', pos);
        window.parent.postMessage({
            func: 'getAuth',
            params: ['patient']
        }, '*')
    }
    $scope.afterGetAuth = function() {
        userId = window.localStorage.getItem('userId');
        if (userId == '' || userId == 0 || userId == null) {
            $ionicPopup.alert({
                title: '提示',
                template: '需要先登录才可以订购哦'
            }).then(function() {
                window.parent.postMessage({
                    func: 'run',
                    params: ['login', []]
                }, '*');
            })
        } else if (window.localStorage.getItem('doctorId') == 0) {
            alert('您还没有绑定医生，请先选择一位距离您较近的医生吧。');
            window.parent.postMessage({
                func: 'run',
                params: ['transfer', [0, 'selectDoctor']]
            }, '*');
            return;
        } else {
            window.location.href = "#/shop/" + window.localStorage.getItem('pos');
        }
    }

    $scope.tel = function(telphone) {

        window.parent.postMessage({
            func: 'run',
            params: ['tel', [telphone]]
        }, '*')
    }
})

.controller('ShopCtrl', function($scope, $stateParams, $ionicPopup, localStorageService, Serv) {
    $scope.division = division;
    var pos = $stateParams.pos;
    var product = localStorageService.get(pos);

    $scope.user = localStorageService.get('user');

    $scope.save = function(realname, tel, sex, province, city, address) {
        if (typeof realname === 'undefined' || realname === '') {
            $ionicPopup.alert({
                title: '请填写真实姓名'
            });
        } else if (typeof tel === 'undefined') {
            $ionicPopup.alert({
                title: '请填写联系电话'
            });
        } else if (typeof sex === 'undefined') {
            $ionicPopup.alert({
                title: '请选择性别'
            });
        } else if (typeof province === 'undefined') {
            $ionicPopup.alert({
                title: '请选择所在省份'
            });
        } else if (typeof city === 'undefined' || city === '') {
            $ionicPopup.alert({
                title: '请选择所在城市'
            });
        } else if (typeof address === 'undefined') {
            $ionicPopup.alert({
                title: '请填写详细地址'
            });
        } else {
            Serv.buyProduct(realname, tel, sex, province, city, address, product.id).then(function(orderCode) {
                console.log(orderCode)
                window.location.href = "#/pay/" + pos + "/" + orderCode;
            })
        }
    }
})

.controller('PayCtrl', function($scope, $stateParams, localStorageService, Serv) {
    var pos = $scope.pos = $stateParams.pos;
    var product = localStorageService.get(pos);

    $scope.price = product.price;

    $scope.pay = function() {
        window.parent.postMessage({
            func: 'run',
            params: ['pay', [product.price, $stateParams.orderCode, 45, pos == 'am' ? '澳门丙肝直通车（定金）' : '印度丙肝快团（定金）']]
        }, '*')
    }

    $scope.doRefresh = function(isSuccess) {
        if (isSuccess)
            window.location.href = "#/succ";
    }
})

.controller('TermsCtrl', function($scope, $stateParams, localStorageService, Serv) {
    var pos = $scope.pos = $stateParams.pos;
    var product = localStorageService.get(pos);
    $scope.remark = product.remark.replace(/<img src="/g, '<img src="' + JAVA_URL);
    $scope.back = function() {
        window.history.back();
    }
})

.controller('SuccCtrl', function($scope, $ionicHistory, $stateParams, $ionicPlatform, Serv) {
    $scope.succ = function() {
        window.parent.postMessage({
            func: 'run',
            params: ['goBack', []]
        }, '*');
    }
})

.controller('StatusCtrl', function($scope, $rootScope, $ionicHistory, $ionicPlatform, Serv) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $scope.uid = window.location.search.substr(5);
    Serv.reload($scope.uid).then(function(resp) {
        $scope.hasSigned = resp[0].hasOwnProperty('stepStatus');
        var table = {};
        for (var i in resp) {
            if (!(table[resp[i].phaseActionNo] instanceof Array))
                table[resp[i].phaseActionNo] = [];
            table[resp[i].phaseActionNo].push(resp[i]);

            if (resp[i].hasOwnProperty('stepStatus')) {
                resp[i].done = true;
                $rootScope.content = '您现在处于' + resp[i].processPhase + '，' + resp[i].processStep
                switch (resp[i].phaseActionNo) {
                    case '1':
                        $rootScope.progress = {
                            width: '20%'
                        };
                        break;
                    case '2':
                        $rootScope.progress = {
                            width: '50%'
                        };
                    case '3':
                        if (resp[i].processState == '00') {
                            $rootScope.progress = {
                                width: '80%'
                            };
                        } else {
                            $rootScope.progress = {
                                width: '100%'
                            };
                            $rootScope.content = '您已完成了全部治疗过程';
                        }
                }
            }
        }
        $rootScope.table = table;
    });
})

.controller('DetailCtrl', function($scope, $rootScope, $ionicHistory, $ionicPlatform, $stateParams, Serv) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $scope.detail = $rootScope.table[$stateParams.id];
    $scope.tit = $rootScope.table[$stateParams.id][0].processPhase;
})
