'use strict';
angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $rootScope, $ionicHistory, $ionicPopup, $ionicPlatform, Serv) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $scope.uid = window.location.search.substr(5);
    $scope.signUp = function() {
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

            /*if (typeof window.parent.Native != 'undefined') {
                window.parent.Native.getAuth('patient', function(userInfo) {
                    if (userInfo.doctorId == 0) {
                        $ionicPopup.alert({
                            title: '提示',
                            template: '您还没有绑定医生，请先选择一位距离您较近的医生吧。'
                        }).then(function() {
                            window.parent.Native.run('transfer', [0, 'selectDoctor']);
                        })
                    }
                    else {
                        window.parent.Native.run('transfer', [1, '#tab/me/visit']);
                    }
                })
            } else {
                $ionicPopup.alert({
                    title: '温馨提示',
                    template: '在爱肝一生app首页点击医生头像，再点击屏幕右上角的预约按钮就可以随时与您的医生预约啦'
                });
            }*/
        }
    }
})
