'use strict';
angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $ionicHistory, $ionicPopup) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $scope.uid = window.location.search.substr(5);
    $scope.start = function() {
        if (window.localStorage.getItem('userId') == '' || window.localStorage.getItem('userId') == 0 || window.localStorage.getItem('userId') == null) {
            $ionicPopup.alert({
                title: '提示',
                template: '需要先登录爱肝一生app才可以参与哦'
            }).then(function() {
                window.parent.postMessage({
                    func: 'run',
                    params: ['login', []]
                }, '*');
            });
        } else {
            window.parent.postMessage({
                func: 'run',
                params: ['recharge', []]
            }, '*')
        }
    }
})
