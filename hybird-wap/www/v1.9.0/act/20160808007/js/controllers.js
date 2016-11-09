'use strict';
angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $rootScope, $ionicPopup, $ionicLoading, localStorageService, Serv) {
    $scope.data = {};
    $scope.sendCode = function(tel) {
        if (typeof tel === 'undefined') {
            $ionicPopup.alert({
                title: '请填写联系电话'
            });
            $ionicLoading.show({
                template: '请填写联系电话',
                duration: 1200
            });
        } else {
            Serv.sendCode(tel).then(function() {
                $ionicLoading.show({
                    template: '验证码已发送',
                    duration: 1200
                });
            })
        }
    }

    $scope.go = function(realname, tel, code) {
        if (typeof realname === 'undefined') {
            $ionicPopup.alert({
                title: '请填写姓名'
            });
        } else if (!/^[\.·\u0391-\uFFE5]*$/.test(realname)) {
            $ionicPopup.alert({
                title: '姓名只能为汉字'
            });
        } else if (typeof tel === 'undefined') {
            $ionicPopup.alert({
                title: '请填写联系电话'
            });
        } else if (!/^\d{11}$/.test(tel)) {
            $ionicPopup.alert({
                title: '请填写11位手机号码'
            });
        } else if (typeof code === 'undefined') {
            $ionicPopup.alert({
                title: '请填写验证码'
            });
        } else {
            Serv.join(realname, tel, code).then(function() {
                $ionicLoading.show({
                    template: '报名成功',
                    duration: 1200
                });
            }).then(function() {
                $scope.data = {};
                $scope.popup.close();
            })
        }
    }


    $scope.signUp = function() {
        $scope.popup = $ionicPopup.show({
            template: '' + '<div class="list list-inset">' + '    <ion-item class="text-center">' + '        <h2>报名信息</h2>' + '    </ion-item>' + '    <ion-item class="item-input">' + '        <span class="input-label">姓名：</span>' + '        <input type="text" maxlength="8" ng-model="data.realname" placeholder="请填写姓名">' + '    </ion-item>' + '    <ion-item class="item-input">' + '        <span class="input-label">联系电话：</span>' + '        <input type="tel" maxlength="11" ng-model="data.tel" placeholder="请填写联系电话">' + '    </ion-item>' + '    <div class="login-line"></div>' + '    <ion-item class="item-input">' + '        <span class="input-label">验证码：</span>' + '        <input type="text" maxlength="6" ng-model="data.code" placeholder="验证码" style="padding-right:12px;width:82px;max-width:82px;">' + '        <button class="button button-clear button-positive" ng-click="sendCode(data.tel)" style="text-decoration: none;font-size:12px">获取验证码</button>' + '    </ion-item>' + '    <div class="login-line"></div>' + '    <ion-item>' + '        <div class="row" style="padding:0">' + '            <div class="col">' + '                <button class="button button-block button-stable" ng-click="popup.close()">取消</button>' + '            </div>' + '            <div class="col">' + '                <button class="button button-block button-positive" ng-click="go(data.realname, data.tel, data.code)">报名</button>' + '            </div>' + '        </div>' + '    </ion-item>' + '</div>',
            scope: $scope,
            cssClass: 'reg-popup'
        });
    }
    
    $scope.tel = function(telphone) {
        window.parent.postMessage({
            func: 'run',
            params: ['tel', [telphone]]
        }, '*')
    }
    
    $scope.mailto = function(email) {
        window.parent.postMessage({
            func: 'run',
            params: ['mailto', [email]]
        }, '*')
    }
})
