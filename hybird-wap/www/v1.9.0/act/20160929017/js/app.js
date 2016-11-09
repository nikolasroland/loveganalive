'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives', 'starter.utils', 'LocalStorageModule'])

.config(function($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('')
    $ionicConfigProvider.backButton.previousTitleText(false)
    $ionicConfigProvider.backButton.icon('ion-ios-arrow-back')
    $ionicConfigProvider.navBar.alignTitle('center')
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
        .state('home', {
            url: "/home/:productId",
            templateUrl: "views/home.html",
            controller: 'HomeCtrl'
        })
        .state('manage', {
            url: "/manage",
            templateUrl: "views/manage.html",
            controller: 'ManageCtrl'
        })
        .state('prescribe', {
            url: "/prescribe",
            templateUrl: "views/prescribe.html",
            controller: 'PrescribeCtrl'
        })
        .state('qrcode', {
            url: "/qrcode/:userid",
            templateUrl: "views/qrcode.html",
            controller: 'QrcodeCtrl'
        })
        .state('contract', {
            url: "/contract",
            templateUrl: "views/contract.html",
            controller: 'ContractCtrl'
        })
        .state('order', {
            url: "/order",
            templateUrl: "views/order.html",
            controller: 'OrderCtrl'
        })
        .state('detail', {
            url: "/detail",
            templateUrl: "views/detail.html",
            controller: 'DetailCtrl'
        })
        .state('drug', {
            url: "/drug",
            templateUrl: "views/drug.html",
            controller: 'DrugCtrl'
        })
        .state('checklist', {
            url: "/checklist",
            templateUrl: "views/checklist.html",
            controller: 'ChecklistCtrl'
        })
        // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');

})

.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        '**'
    ]);
})

.config(function($httpProvider) {
    // 头部配置  
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    // $httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';


    /**  
     * 重写angular的param方法，使angular使用jquery一样的数据序列化方式  The workhorse; converts an object to x-www-form-urlencoded serialization.  
     * @param {Object} obj  
     * @return {String}  
     */
    var param = function(obj) {
        var query = '',
            name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
            value = obj[name];

            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            } else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            } else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest  
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
})

.run(function($rootScope) {
    $rootScope.JAVA_URL = JAVA_URL;
    $rootScope.ticket = ionic.Platform.isIOS() ? '元' : '张健康券';
    $rootScope.isIOS = ionic.Platform.isIOS();
    $rootScope.historyBack = function() {
        Native.run('historyBack', []);
    }
})
