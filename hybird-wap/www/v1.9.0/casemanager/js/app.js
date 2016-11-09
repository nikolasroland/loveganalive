'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives', 'LocalStorageModule'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

        .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "views/tabs.html"
        })
        .state('tab.home', {
            url: "/home",
            views: {
                'tab-home': {
                    templateUrl: "views/home.html",
                    controller: "HomeCtrl"
                }
            }
        })
        .state('tab.patients', {
            url: "/patients",
            views: {
                'tab-patients': {
                    templateUrl: "views/patients.html",
                    controller: "PatientsCtrl"
                }
            }
        })
        .state('tab.patientslist', {
            url: "/patients/:id",
            views: {
                'tab-patients': {
                    templateUrl: "views/patients-list.html",
                    controller: "PatientsListCtrl"
                }
            }
        })
        .state('tab.reservation', {
            url: "/reservation",
            views: {
                'tab-reservation': {
                    templateUrl: "views/reservation.html",
                    controller: "ReservationCtrl"
                }
            }
        })
        .state('tab.reservationlist', {
            url: "/reservation/:id",
            views: {
                'tab-reservation': {
                    templateUrl: "views/reservation-list.html",
                    controller: "ReservationListCtrl"
                }
            }
        })
        .state('tab.me', {
            url: "/me",
            views: {
                'tab-me': {
                    templateUrl: "views/me.html",
                    controller: "MeCtrl"
                }
            }
        })
        .state('tab.info', {
            url: "/me/info",
            views: {
                'tab-me': {
                    templateUrl: "views/info.html",
                    controller: "InfoCtrl"
                }
            }
        })
        .state('tab.doctors', {
            url: "/me/doctors",
            views: {
                'tab-me': {
                    templateUrl: "views/doctors.html",
                    controller: "DoctorsCtrl"
                }
            }
        })
        .state('tab.doctor-info', {
            url: "/me/doctor-info/:id",
            views: {
                'tab-me': {
                    templateUrl: "views/doctor-info.html",
                    controller: "DoctorInfoCtrl"
                }
            }
        })
        .state('tab.doctor-info-edit', {
            url: "/me/doctor-info-edit/:id",
            views: {
                'tab-me':{
                    templateUrl: "views/doctor-info-edit.html",
                    controller: "DoctorInfoEditCtrl"
                }
            }
        })
        .state('tab.earning', {
            url: "/me/earning",
            views: {
                'tab-me':{
                    templateUrl: "views/earning.html",
                    controller: "EarningCtrl"
                }
            }
        })
        .state('tab.earning-detail', {
            url: "/me/earning-detail/:subject/:month",
            views: {
                'tab-me':{
                    templateUrl: "views/earning-detail.html",
                    controller: "EarningDetailCtrl"
                }
            }
        })
        .state('tab.qa', {
            url: '/me/qa',
            views: {
                'tab-me': {
                    templateUrl: "views/qa.html",
                    controller: "QaCtrl"
                }
            }
        })
        .state('tab.qa-detail', {
            url: '/me/qa/:id',
            views: {
                'tab-me': {
                    templateUrl: "views/qa-detail.html",
                    controller: "QaDetailCtrl"
                }
            }
        })
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/home');
})

.config(function(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('casemanager');
})

.config(function($sceDelegateProvider) {
   $sceDelegateProvider.resourceUrlWhitelist([
       // Allow same origin resource loads.
       'self',
       // Allow loading from our assets domain.  Notice the difference between * and **.
       'http://ag.furuihui.com/**']);
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
