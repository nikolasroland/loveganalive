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

    $scope.reserve = function() {
        if ($scope.uid == '' || $scope.uid == '(null)') {
            $ionicPopup.alert({
                title: '提示',
                template: '需要先登录爱肝一生app才可以预约哦'
            }).then(function() {
                window.parent.postMessage({
                    func: 'run',
                    params: ['login', []]
                }, '*');
            });
        } else {
            $ionicPopup.alert({
                title: '温馨提示',
                template: '在爱肝一生app首页点击医生头像，再点击屏幕右上角的预约按钮就可以随时与您的医生预约啦'
            }).then(function() {
                window.parent.postMessage({
                    func: 'getAuth',
                    params: ['patient']
                }, '*')
            })
        }
    }
})
