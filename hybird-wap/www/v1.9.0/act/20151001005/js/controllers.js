'use strict';
angular.module('starter.controllers', [])

.controller('AppCtrl', function() {
})

.controller('HomeCtrl', function($scope, $rootScope, $ionicHistory, $location, $ionicScrollDelegate, $ionicPopup, $ionicPlatform, Serv) {
    $scope.scrollToMain = function() {
        $location.hash("container");
        $ionicScrollDelegate.anchorScroll(true);
    }

    $scope.tel = function(telphone) {
        console.log(telphone)
        window.parent.postMessage({
            func: 'run',
            params: ['tel', [telphone]]
        }, '*')
    }


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
    $scope.signUp = function() {
        if ($scope.uid == '' || $scope.uid == '(null)') {
            $ionicPopup.alert({
                title: '提示',
                template: '需要先登录才可以报名哦'
            }).then(function() {
                window.parent.postMessage({
                    func: 'run',
                    params: ['login', []]
                }, '*');
            });
            return;
        }
        Serv.signUp($scope.uid).then(function(resp) {
            window.location.href = "#/tab/succ";
        });
    }
})

.controller('SuccCtrl', function($scope, $ionicHistory, $ionicPlatform, Serv) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
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
