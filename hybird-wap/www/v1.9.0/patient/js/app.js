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

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "views/tabs.html",
        controller: "TabCtrl"
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

    .state('tab.advisory', {
        url: "/advisory",
        views: {
            'tab-advisory': {
                templateUrl: "views/advisory.html",
                controller: "AdvisoryCtrl"
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

    .state('tab.history', {
        url: "/history",
        views: {
            'tab-history': {
                templateUrl: "views/history.html",
                controller: "HistoryCtrl"
            }
        }
    })

    .state('tab.service', {
        url: '/me/service',
        views: {
            'tab-me': {
                templateUrl: "views/service.html",
                controller: "ServiceCtrl"
            }
        }
    })

    .state('tab.reservation', {
        url: '/me/reservation',
        views: {
            'tab-me': {
                templateUrl: "views/reservation.html",
                controller: "ReservationCtrl"
            }
        }
    })

    .state('tab.wallet', {
            url: '/me/wallet',
            views: {
                'tab-me': {
                    templateUrl: "views/wallet.html",
                    controller: "WalletCtrl"
                }
            }
        })
        .state('tab.info', {
            url: '/me/info',
            views: {
                'tab-me': {
                    templateUrl: "views/info.html",
                    controller: "InfoCtrl"
                }
            }
        })
        .state('tab.plan', {
            url: '/me/plan',
            views: {
                'tab-me': {
                    templateUrl: "views/plan.html",
                    controller: "PlanCtrl"
                }
            }
        })
        .state('tab.tips', {
            url: '/me/tips/:id',
            views: {
                'tab-me': {
                    templateUrl: "views/tips.html",
                    controller: "TipsCtrl"
                }
            }
        })
        .state('tab.doctor', {
            url: '/me/doctor',
            views: {
                'tab-me': {
                    templateUrl: "views/doctor.html",
                    controller: "DoctorCtrl"
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
        .state('tab.casemanager', {
            url: '/me/casemanager',
            views: {
                'tab-me': {
                    templateUrl: "views/casemanager.html",
                    controller: "CasemanagerCtrl"
                }
            }
        })
        .state('tab.plan-detail', {
            url: '/me/plan/:id',
            views: {
                'tab-me': {
                    templateUrl: "views/plan-detail.html",
                    controller: "PlanDetailCtrl"
                }
            }
        })
        .state('tab.doctor-info', {
            url: '/doctor-info/:id',
            views: {
                'tab-me': {
                    templateUrl: "views/doctor-info.html",
                    controller: "DoctorInfoCtrl"
                }
            }
        })
        .state('tab.doctor-selected', {
            url: '/doctor-selected/:id',
            views: {
                'tab-me': {
                    templateUrl: "views/doctor-selected.html",
                    controller: "DoctorSelectedCtrl"
                }
            }
        })
        .state('tab.succ', {
            url: '/succ/:id',
            views: {
                'tab-doctor': {
                    templateUrl: "views/succ.html",
                    controller: "SuccCtrl"
                }
            }
        })
        .state('tab.settings', {
            url: '/me/settings',
            views: {
                'tab-me': {
                    templateUrl: "views/settings.html",
                    controller: "SettingsCtrl"
                }
            }
        })
        .state('tab.aboutus', {
            url: '/me/aboutus',
            views: {
                'tab-me': {
                    templateUrl: "views/about-us.html",
                    controller: "AboutusCtrl"
                }
            }
        })
        .state('tab.edit-password', {
            url: '/me/edit-password',
            views: {
                'tab-me': {
                    templateUrl: "views/edit-password.html",
                    controller: "EditPasswordCtrl"
                }
            }
        })

    .state('tab.rewardToMyDoctor', {
            url: '/advisory/reward',
            views: {
                'tab-advisory': {
                    templateUrl: "views/reward.html",
                    controller: "RewardCtrl"
                }
            }
        })
        .state('tab.reward', {
            url: '/advisory/reward/:id',
            views: {
                'tab-advisory': {
                    templateUrl: "views/reward.html",
                    controller: "RewardCtrl"
                }
            }
        })
        .state('tab.visit', {
            url: '/advisory/visit',
            views: {
                'tab-advisory': {
                    templateUrl: "views/visit.html",
                    controller: "VisitCtrl"
                }
            }
        })
        // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/home');

})

.config(function($sceDelegateProvider) {
   $sceDelegateProvider.resourceUrlWhitelist([
       // Allow same origin resource loads.
       'self',
       // Allow loading from our assets domain.  Notice the difference between * and **.
       'http://ag.furuihui.com/**']);
})

.config(function(localStorageServiceProvider) {

        localStorageServiceProvider.setPrefix('patient');

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
    $rootScope.ticket = ionic.Platform.isIOS() ? '元' : '张健康券';
    $rootScope.isIOS = ionic.Platform.isIOS();
})
