"use strict";
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic-datepicker', 'starter.controllers', 'starter.services', 'starter.directives', 'LocalStorageModule'])

.run(function($rootScope, RechargeServ, $timeout) {
    if (Native.isWeixin && WX_URL === 'http://wx.aiganyisheng.cn/') {
        var openid = localStorage.getItem('wx015.openid');
        if (openid) {
            $rootScope.openid = openid;
        } else {
            var getQueryStringArgsByHash = function() {
                var qs = window.location.href.substr(window.location.href.indexOf('?') + 1)
                var items = qs.split('&');
                var args = {};
                for (var i in items) {
                    var item = items[i].split('=');
                    var name = decodeURIComponent(item[0]);
                    var value = decodeURIComponent(item[1]);
                    args[name] = value;
                }
                return args;
            }

            var qs = getQueryStringArgsByHash();
            if (typeof qs.code === 'undefined') {
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe53e0da58a661bac&redirect_uri=' + WX_URL + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect'
            } else {
                RechargeServ.getOpenid(qs.code).then(function(resp) {
                    localStorage.setItem('wx015.openid', resp);
                    window.location.reload();
                })
            }
        }
    }
})

.run(function($ionicPlatform, $rootScope, $state) {

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)

        // umenglog
        var stateName = '';
        stateName = 'h5.' + $state.current.name;
        Native.run('umengEnter', [stateName])
        $rootScope.$on('$ionicView.enter', function() {
            stateName = 'h5.' + $state.current.name;
            Native.run('umengEnter', [stateName])
        })

        $rootScope.$on('$ionicView.beforeLeave', function() {
            Native.run('umengLeave', [stateName])
        })

        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
            Native.run('umengLog', ['view', 'detail', $state.current.name]);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
    });
})

.config(function(ionicDatePickerProvider) {
    var datePickerObj = {
        inputDate: new Date(),
        setLabel: '确定',
        todayLabel: '今天',
        closeLabel: '关闭',
        mondayFirst: false,
        weeksList: ["日", "一", "二", "三", "四", "五", "六"],
        monthsList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        templateType: 'popup',
        from: new Date(2016, 1, 1),
        to: new Date(2018, 1, 1),
        showTodayButton: false,
        dateFormat: 'dd MMMM yyyy',
        closeOnSelect: false
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
})

.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        '**'
    ]);
})

.config(function($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('')
    $ionicConfigProvider.backButton.previousTitleText(false)
    $ionicConfigProvider.backButton.icon('ion-ios-arrow-back')
    $ionicConfigProvider.tabs.position('bottom').style('standard')
    $ionicConfigProvider.navBar.alignTitle('center')
    $ionicConfigProvider.scrolling.jsScrolling(true);
})

/*.config(function($locationProvider) {
    $locationProvider.html5Mode(true);
})*/

.config(function($stateProvider, $urlRouterProvider) {


    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html?016'
    })

    // Each tab has its own nav history stack:

    .state('tab.home', {
        url: '/home',
        views: {
            'tab-home': {
                templateUrl: 'templates/tab-home.html?016',
                controller: 'HomeCtrl'
            }
        }
    })

    .state('tab.chat', {
        url: '/chat',
        views: {
            'tab-chat': {
                templateUrl: 'templates/tab-chat.html?016',
                controller: 'ChatCtrl'
            }
        }
    })

    .state('tab.discover', {
        url: '/discover',
        views: {
            'tab-discover': {
                templateUrl: 'templates/tab-discover.html?016',
                controller: 'DiscoverCtrl'
            }
        }
    })

    .state('tab.article', {
        url: '/discover/article/:id',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-article.html',
                controller: 'ArticleCtrl'
            }
        }
    })

    .state('tab.me-article', {
        url: '/me/article/:id',
        views: {
            'tab-me': {
                templateUrl: 'templates/discover-article.html',
                controller: 'ArticleCtrl'
            }
        }
    })

    .state('tab.home-article', {
        url: '/home/article/:id',
        views: {
            'tab-home': {
                templateUrl: 'templates/discover-article.html',
                controller: 'ArticleCtrl'
            }
        }
    })

    .state('tab.me', {
        url: '/me',
        views: {
            'tab-me': {
                templateUrl: 'templates/tab-me.html?016',
                controller: 'MeCtrl'
            }
        }
    })

    .state('tab.other', {
        url: '/other',
        views: {
            'tab-other': {
                templateUrl: 'templates/tab-other.html?016',
                controller: 'OtherCtrl'
            }
        }
    })

    .state('tab.box', {
        url: '/chat/box/:userid/:nickname',
        views: {
            'tab-chat': {
                templateUrl: 'templates/chat-box.html?016',
                controller: 'BoxCtrl'
            }
        }
    })

    .state('tab.service', {
        url: '/me/service',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-service.html?016',
                controller: 'ServiceCtrl'
            }
        }
    })

    .state('tab.order', {
        url: '/me/order',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-order.html?016',
                controller: 'OrderCtrl'
            }
        }
    })

    .state('tab.order-reservation', {
        url: '/me/order-reservation',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-order-reservation.html?016',
                controller: 'OrderReservationCtrl'
            }
        }
    })

    .state('tab.order-medical-a', {
        url: '/me/order-medical-a',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-order-medical-a.html?016',
                controller: 'OrderMedicalACtrl'
            }
        }
    })

    .state('tab.order-medical-a-detail', {
        url: '/me/order-medical-a-detail/:id',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-order-medical-a-detail.html?016',
                controller: 'OrderMedicalADetailCtrl'
            }
        }
    })

    .state('tab.order-medical-b', {
        url: '/me/order-medical-b',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-order-medical-b.html?016',
                controller: 'OrderMedicalBCtrl'
            }
        }
    })

    .state('tab.order-medical-b-detail', {
        url: '/me/order-medical-b-detail/:id',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-order-medical-b-detail.html?016',
                controller: 'OrderMedicalBDetailCtrl'
            }
        }
    })

    .state('tab.order-challenge', {
        url: '/me/order-challenge',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-order-challenge.html?016',
                controller: 'OrderChallengeCtrl'
            }
        }
    })

    .state('tab.order-challenge-detail', {
        url: '/me/order-challenge-detail/:id',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-order-challenge-detail.html?016',
                controller: 'OrderChallengeDetailCtrl'
            }
        }
    })

    .state('tab.order-overseas', {
        url: '/me/order-overseas',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-order-overseas.html?016',
                controller: 'OrderOverseasCtrl'
            }
        }
    })

    .state('tab.order-overseas-detail', {
        url: '/me/order-overseas-detail/:id',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-order-overseas-detail.html?016',
                controller: 'OrderOverseasDetailCtrl'
            }
        }
    })

    .state('tab.order-overseas-detail-edit', {
        url: '/me/order-overseas-detail-edit/:status',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-order-overseas-detail-edit.html?016',
                controller: 'OrderOverseasDetailEditCtrl'
            }
        }
    })

    .state('tab.order-detail', {
        url: '/me/order-detail/:id',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-order-detail.html?016',
                controller: 'OrderDetailCtrl'
            }
        }
    })

    .state('tab.order-express', {
        url: '/me/order-express/:comp/:code',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-order-express.html',
                controller: 'OrderExpressCtrl'
            }
        }
    })

    .state('tab.reservation', {
        url: '/me/reservation',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-reservation.html?016',
                controller: 'ReservationCtrl'
            }
        }
    })

    .state('tab.doctor', {
        url: '/me/doctor/:id',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-doctor.html?016',
                controller: 'DoctorCtrl'
            }
        }
    })
      .state('tab.doctor-select', {
        url: '/me/doctor/:id',
        views: {
          'tab-me': {
            templateUrl: 'templates/me-doctor.html?016',
            controller: 'DoctorCtrl'
          }
        }
      })

      .state('tab.doctor-bind', {
        url: '/me/doctor/:id/:isServer',
        views: {
          'tab-me': {
            templateUrl: 'templates/me-doctor-newbind.html?016',
            controller: 'DoctorCtrl'
          }
        }
      })

    .state('tab.doctor-search', {
        url: '/me/doctor-search',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-doctor-search.html?016',
                controller: 'DoctorSearchCtrl'
            }
        }
    })

    .state('tab.doctor-info', {
        url: '/me/doctor-info/:id',
        views: {
            'tab-me': {
                templateUrl: "templates/me-doctor-info.html?016",
                controller: "DoctorInfoCtrl"
            }
        }
    })

    .state('tab.doctor-selected', {
        url: '/me/doctor-selected/:id/:isNew',
        views: {
            'tab-me': {
                templateUrl: "templates/me-doctor-selected.html?016",
                controller: "DoctorSelectedCtrl"
            }
        }
    })


    .state('tab.home-doctor', {
        url: '/home/doctor/:id',
        views: {
            'tab-home': {
                templateUrl: 'templates/me-doctor.html?016',
                controller: 'DoctorCtrl'
            }
        }
    })


    .state('tab.home-doctor-search', {
        url: '/home/doctor-search',
        views: {
            'tab-home': {
                templateUrl: 'templates/me-doctor-search.html?016',
                controller: 'DoctorSearchCtrl'
            }
        }
    })

    .state('tab.home-doctor-info', {
        url: '/home/doctor-info/:id',
        views: {
            'tab-home': {
                templateUrl: "templates/me-doctor-info.html?016",
                controller: "DoctorInfoCtrl"
            }
        }
    })

    .state('tab.home-doctor-selected', {
        url: '/home/doctor-selected/:id/:isNew',
        views: {
            'tab-home': {
                templateUrl: "templates/me-doctor-selected.html?016",
                controller: "DoctorSelectedCtrl"
            }
        }
    })

    .state('tab.succ', {
        url: '/me/succ/:id',
        views: {
            'tab-other': {
                templateUrl: "templates/me-succ.html?016",
                controller: "SuccCtrl"
            }
        }
    })

    .state('tab.assistant', {
        url: '/me/assistant',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-assistant.html?016',
                controller: 'AssistantCtrl'
            }
        }
    })

    .state('tab.wallet', {
        url: '/me/wallet',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-wallet.html?016',
                controller: 'WalletCtrl'
            }
        }
    })

    .state('tab.account', {
        url: '/me/account',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-account.html?016',
                controller: 'AccountCtrl'
            }
        }
    })

    .state('tab.info', {
        url: '/me/info',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-info.html?016',
                controller: 'InfoCtrl'
            }
        }
    })

    .state('tab.qa', {
        url: '/me/qa',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-qa.html?016',
                controller: 'QaCtrl'
            }
        }
    })

    .state('tab.qa-red', {
        url: '/me/qa-red',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-qa.html?016',
                controller: 'QaRedCtrl'
            }
        }
    })

    .state('tab.qa-detail', {
        url: '/me/qa-detail:id',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-qa-detail.html?016',
                controller: 'QaDetailCtrl'
            }
        }
    })

    .state('tab.tips', {
        url: '/me/tips/:id',
        views: {
            'tab-me': {
                templateUrl: "templates/me-tips.html?016",
                controller: "TipsCtrl"
            }
        }
    })

    .state('tab.rewardToMyDoctor', {
        url: '/chat/reward',
        views: {
            'tab-chat': {
                templateUrl: "templates/me-reward.html?016",
                controller: "RewardCtrl"
            }
        }
    })

    .state('tab.me-reward', {
        url: '/me/reward/:id',
        views: {
            'tab-me': {
                templateUrl: "templates/me-reward.html?016",
                controller: "RewardCtrl"
            }
        }
    })

    .state('tab.me-rewardToMyDoctor', {
        url: '/me/reward',
        views: {
            'tab-me': {
                templateUrl: "templates/me-reward.html?016",
                controller: "RewardCtrl"
            }
        }
    })

    .state('tab.reward', {
        url: '/chat/reward/:id',
        views: {
            'tab-chat': {
                templateUrl: "templates/me-reward.html?016",
                controller: "RewardCtrl"
            }
        }
    })

    .state('tab.home-rewardToMyDoctor', {
        url: '/home/reward',
        views: {
            'tab-home': {
                templateUrl: "templates/me-reward.html?016",
                controller: "RewardCtrl"
            }
        }
    })

    .state('tab.home-reward', {
        url: '/home/reward/:id',
        views: {
            'tab-home': {
                templateUrl: "templates/me-reward.html?016",
                controller: "RewardCtrl"
            }
        }
    })

    .state('tab.bonus', {
        url: '/me/bonus/:randomCode',
        views: {
            'tab-me': {
                templateUrl: "templates/me-bonus.html?016",
                controller: "BonusCtrl"
            }
        }
    })

    .state('tab.bonus-result', {
        url: '/me/bonus-result/:randomCode',
        views: {
            'tab-me': {
                templateUrl: "templates/me-bonus-result.html?016",
                controller: "BonusResultCtrl"
            }
        }
    })

    .state('tab.chat-visit', {
        url: '/chat/visit/:id',
        views: {
            'tab-chat': {
                templateUrl: "templates/me-visit.html?016",
                controller: "VisitCtrl"
            }
        }
    })

    .state('tab.visit', {
        url: '/me/visit/:id',
        views: {
            'tab-me': {
                templateUrl: "templates/me-visit.html?016",
                controller: "VisitCtrl"
            }
        }
    })

    .state('tab.home-visit', {
        url: '/home/visit/:id',
        views: {
            'tab-home': {
                templateUrl: "templates/me-visit.html?016",
                controller: "VisitCtrl"
            }
        }
    })

    .state('tab.qrcode', {
        url: '/me/qrcode',
        views: {
            'tab-me': {
                templateUrl: "templates/me-qrcode.html?016",
                controller: "QrcodeCtrl"
            }
        }
    })

    .state('tab.home-qrcode', {
        url: '/home/qrcode',
        views: {
            'tab-home': {
                templateUrl: "templates/me-qrcode.html?016",
                controller: "QrcodeCtrl"
            }
        }
    })

    .state('tab.history', {
        url: '/me/history',
        views: {
            'tab-me': {
                templateUrl: "templates/me-history.html?016",
                controller: "HistoryCtrl"
            }
        }
    })

    .state('tab.home-history', {
        url: '/home/history',
        views: {
            'tab-home': {
                templateUrl: "templates/me-history.html?016",
                controller: "HistoryCtrl"
            }
        }
    })

    .state('tab.settings', {
        url: '/me/settings',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-settings.html?016',
                controller: 'SettingsCtrl'
            }
        }
    })

    .state('tab.change-password', {
        url: '/me/change-password',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-change-password.html?016',
                controller: 'ChangePasswordCtrl'
            }
        }
    })

    .state('tab.rate', {
        url: '/me/rate/:modeid/:userid/:nickname',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-rate.html?016',
                controller: 'RateCtrl'
            }
        }
    })

    .state('tab.home-rate', {
        url: '/home/rate/:modeid/:userid/:nickname',
        views: {
            'tab-home': {
                templateUrl: 'templates/me-rate.html?016',
                controller: 'RateCtrl'
            }
        }
    })

    .state('tab.plan', {
        url: '/home/plan',
        views: {
            'tab-home': {
                templateUrl: 'templates/home-plan.html?016',
                controller: 'PlanCtrl'
            }
        }
    })

    .state('tab.referral', {
        url: '/home/referral',
        views: {
            'tab-home': {
                templateUrl: 'templates/home-referral.html?016',
                controller: 'ReferralCtrl'
            }
        }
    })

    .state('tab.result', {
        url: '/home/result',
        views: {
            'tab-home': {
                templateUrl: 'templates/home-result.html?016',
                controller: 'ResultCtrl'
            }
        }
    })

    .state('tab.result-history', {
        url: '/home/result/:id',
        views: {
            'tab-home': {
                templateUrl: 'templates/home-result.html?016',
                controller: 'ResultHistoryCtrl'
            }
        }
    })

    .state('tab.plan-logic', {
        url: '/home/plan-logic/:id/:name',
        views: {
            'tab-home': {
                templateUrl: 'templates/home-plan-logic.html?016',
                controller: 'PlanLogicCtrl'
            }
        }
    })

    .state('tab.plan-logic-update', {
        url: '/home/plan-logic/:id/:name/:isUpdate',
        views: {
            'tab-home': {
                templateUrl: 'templates/home-plan-logic.html?016',
                controller: 'PlanLogicCtrl'
            }
        }
    })

    .state('tab.pay', {
        url: '/me/pay',
        views: {
            'tab-me': {
                templateUrl: 'templates/home-pay.html?016',
                controller: 'PayCtrl'
            }
        }
    })

    .state('tab.me-plan', {
        url: '/me/plan',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-plan.html?016',
                controller: 'PlanCtrl'
            }
        }
    })

    .state('tab.me-referral', {
        url: '/me/referral',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-referral.html?016',
                controller: 'ReferralCtrl'
            }
        }
    })

    .state('tab.me-result', {
        url: '/me/result',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-result.html?016',
                controller: 'ResultCtrl'
            }
        }
    })

    .state('tab.me-result-history', {
        url: '/me/result/:id',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-result.html?016',
                controller: 'ResultHistoryCtrl'
            }
        }
    })

    .state('tab.me-plan-logic', {
        url: '/me/plan-logic/:id/:name',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-plan-logic.html?016',
                controller: 'PlanLogicCtrl'
            }
        }
    })

    .state('tab.me-plan-logic-update', {
        url: '/me/plan-logic/:id/:name/:isUpdate',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-plan-logic.html?016',
                controller: 'PlanLogicCtrl'
            }
        }
    })

    .state('tab.act', {
        url: '/discover/act',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-act.html?016',
                controller: 'ActCtrl'
            }
        }
    })

    .state('tab.act-detail', {
        url: '/discover/act/:id',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-act-detail.html?016',
                controller: 'ActDetailCtrl'
            }
        }
    })

    .state('tab.home-act-detail', {
        url: '/home/act/:id',
        views: {
            'tab-home': {
                templateUrl: 'templates/discover-act-detail.html?016',
                controller: 'ActDetailCtrl'
            }
        }
    })

    .state('tab.game', {
        url: '/discover/game',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-game.html?016',
                controller: 'GameCtrl'
            }
        }
    })

    .state('tab.game-detail', {
        url: '/discover/game/:id',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-game-detail.html?016',
                controller: 'GameDetailCtrl'
            }
        }
    })

    .state('tab.hospital', {
        url: '/discover/hospital',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-hospital.html?016',
                controller: 'HospitalCtrl'
            }
        }
    })

    .state('tab.hospital-detail', {
        url: '/discover/hospital/:id',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-hospital-detail.html?016',
                controller: 'HospitalDetailCtrl'
            }
        }
    })

    .state('tab.knowledge', {
        url: '/discover/knowledge',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-knowledge.html?016',
                controller: 'KnowledgeCtrl'
            }
        }
    })

    .state('tab.knowledge-detail', {
        url: '/discover/knowledge/:id',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-knowledge-detail.html?016',
                controller: 'KnowledgeDetailCtrl'
            }
        }
    })

    .state('tab.medicine', {
        url: '/discover/medicine',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-medicine.html?016',
                controller: 'MedicineCtrl'
            }
        }
    })

    .state('tab.medicine-detail', {
        url: '/discover/medicine/:id',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-medicine-detail.html?016',
                controller: 'MedicineDetailCtrl'
            }
        }
    })

    .state('tab.story', {
        url: '/discover/story',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-story.html?016',
                controller: 'StoryCtrl'
            }
        }
    })

    .state('tab.story-detail', {
        url: '/discover/story/:id',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-story-detail.html?016',
                controller: 'StoryDetailCtrl'
            }
        }
    })

    .state('tab.me-medical-a-shop', {
        url: '/me/medical-a-shop',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-medical-a-shop.html?016',
                controller: 'MedicalAShopCtrl'
            }
        }
    })

    .state('tab.me-medical-a-settle', {
        url: '/me/medical-a-settle',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-medical-a-settle.html?016',
                controller: 'MedicalASettleCtrl'
            }
        }
    })

    .state('tab.me-medical-a-detail', {
        url: '/me/medical-a-detail',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-medical-a-detail.html?016',
                controller: 'MedicalADetailCtrl'
            }
        }
    })

    .state('tab.me-medical-b-shop', {
        url: '/me/medical-b-shop',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-medical-b-shop.html?016',
                controller: 'MedicalBShopCtrl'
            }
        }
    })

    .state('tab.me-medical-b-settle', {
        url: '/me/medical-b-settle/:id/:title/:mark/:productTypeCode',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-medical-b-settle.html?016',
                controller: 'MedicalBSettleCtrl'
            }
        }
    })

    .state('tab.me-medical-b-detail', {
        url: '/me/medical-b-detail',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-medical-b-detail.html?016',
                controller: 'MedicalBDetailCtrl'
            }
        }
    })

    .state('patient-report', {
            url: '/patient-report',
            templateUrl: 'templates/patient-report.html',
            controller: 'patient-reportCtrl'
          }) 
        
    .state('reportList', {
            url: '/reportList',
            templateUrl: 'templates/reportList.html',
            controller: 'reportListCtrl'
          }) 
    .state('patientReport-detail', {
            url: '/patientReport-detail/:id',
            templateUrl: 'templates/patientReport-detail.html',
            controller: 'reportDetailCtrl'
          }) 
        
    .state('patient-flup', {
            url: '/patient-flup/:id',
            templateUrl: 'templates/patient-flup.html',
            controller: 'patientFlupCtrl'
          }) 
    .state('flupDetail', {
            url: '/flupDetail/:id',
            templateUrl: 'templates/flupDetail.html',
            controller: 'flupDetailCtrl'
          }) 


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/home');

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

.run(function($rootScope, $state, $ionicHistory) {
    $rootScope.JAVA_URL = JAVA_URL;
    $rootScope.WAP_URL = WAP_URL;
    // $rootScope.ticket = ionic.Platform.isIOS() ? '元' : '张健康券';
    $rootScope.ticket = '元';
    $rootScope.isIOS = ionic.Platform.isIOS();
    $rootScope.historyBack = function() {
        var stateName = 'h5.' + $state.current.name;
        Native.run('umengLeave', [stateName])
        Native.run('historyBack', []);
    }

    $rootScope.goBack = function() {
        if ($ionicHistory.viewHistory().backView === null) {
            window.location.href = '#/tab/home';
        } else {
            $ionicHistory.goBack();
        }
    }


    $rootScope.shareQRCode = function(imgUrl, doctorId, doctorName, doctorIcon) {
        var doctorUrl = WAP_URL + 'wechat/index.html#/detail/' + doctorId;
        Native.run('shareQRCode', [imgUrl, doctorUrl, doctorName, doctorIcon]);
    }
    $rootScope.share = function(discoveryType, title, subject, introduction) {
        var url = WX_URL + 'index.html' + window.location.hash;
        var icon = '';
        if (subject != "") {
            icon = WX_URL + 'img/icon/logo.png';
        } else {
            switch (discoveryType) {
                case '00':
                    icon = WX_URL + 'img/icon/act.png';
                    break;
                case '02':
                    icon = WX_URL + 'img/icon/medicine.png';
                    break;
                case '03':
                    icon = WX_URL + 'img/icon/game.png';
                    break;
                case '04':
                    icon = WX_URL + 'img/icon/knowledge.png';
                    break;
                case '05':
                    icon = WX_URL + 'img/icon/story.png';
                    break;
                case '06':
                    icon = WX_URL + 'img/icon/hospital.png';
                    break;
                default:
                    icon = WX_URL + 'img/icon/act.png';
                    break;
            }
        }
        Native.run('share', [url, icon, title, introduction]);
    }
})

.run(function($rootScope, $ionicHistory, $ionicPopup, $ionicLoading, $ionicModal, $timeout, LoginServ, RechargeServ, localStorageService) {
    // for weixin login & reg
    $rootScope.loginState = window.localStorage.getItem('loginState') || '';
    $rootScope.canReserve = window.localStorage.getItem('canReserve');
    $rootScope.isWeb = Native.isWeb;



    $ionicModal.fromTemplateUrl('../templates/modal-login.html', {
        scope: $rootScope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $rootScope.loginModal = modal;
    });

    $rootScope.openLoginModal = function() {
        if (typeof $rootScope.loginModal !== 'undefined') {
            $rootScope.loginModal.show();
        } else {
            $timeout(function() { $rootScope.loginModal.show() }, 500);
        }
    };
    $rootScope.closeLoginModal = function() {
        $rootScope.loginModal.hide();
    };

    $ionicModal.fromTemplateUrl('../templates/modal-reg.html', {
        scope: $rootScope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $rootScope.regModal = modal;
    });

    $rootScope.openRegModal = function() {
        if (typeof $rootScope.regModal !== 'undefined') {
            $rootScope.regModal.show();
        } else {
            $timeout(function() { $rootScope.regModal.show() }, 500);
        }
    };

    $rootScope.closeRegModal = function() {
        $rootScope.regModal.hide();
    };

    $ionicModal.fromTemplateUrl('../templates/modal-findpwd.html', {
        scope: $rootScope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $rootScope.findpwdModal = modal;
    });

    $rootScope.openFindpwdModal = function() {
        if (typeof $rootScope.findpwdModal !== 'undefined') {
            $rootScope.findpwdModal.show();
        } else {
            $timeout(function() { $rootScope.findpwdModal.show() }, 500);
        }
    };

    $rootScope.closeFindpwdModal = function() {
        $rootScope.findpwdModal.hide();
    };

    $ionicModal.fromTemplateUrl('../templates/modal-agreement.html', {
        scope: $rootScope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $rootScope.agreementModal = modal;
    });

    $rootScope.openAgreementModal = function() {
        if (typeof $rootScope.agreementModal !== 'undefined') {
            $rootScope.agreementModal.show();
        } else {
            $timeout(function() { $rootScope.agreementModal.show() }, 500);
        }
    };

    $rootScope.closeAgreementModal = function() {
        $rootScope.agreementModal.hide();
    };

    $rootScope.logout = function() {
        $rootScope.loginState = '';
        window.localStorage.setItem('loginState', '');
        localStorageService.set('im', []);
        window.localStorage.setItem('im_token', '');
        window.location.href = '#/tab/me'
        window.location.reload();
    }

    $rootScope.login = function(username, password) {
        if (typeof username === 'undefined' || username === '') {
            $ionicLoading.show({
                template: '请填写用户名',
                duration: 1200
            });
            return;
        } else if (typeof password === 'undefined' || password === '') {
            $ionicLoading.show({
                template: '请填写密码',
                duration: 1200
            });
            return;
        }
        LoginServ.login(username, password).then(function(resp) {
            $rootScope.loginState = true;
            localStorageService.set('im', resp.im_list);

            window.localStorage.setItem('loginState', true);

            var docusername = '';
            for (var i in resp.im_list) {
                if (resp.im_list[i].userid == resp.user.doctorid) {
                    docusername = resp.im_list[i].realname;
                    break;
                }
            }

            window.localStorage.setItem('auth', resp.user.auth);
            window.localStorage.setItem('patientId', resp.user.userid);
            window.localStorage.setItem('patientName', resp.user.username);
            window.localStorage.setItem('patientNickName', resp.user.nickname);
            window.localStorage.setItem('patientRealName', resp.user.realname);
            window.localStorage.setItem('doctorId', resp.user.doctorid);
            window.localStorage.setItem('doctorName', docusername);
            window.localStorage.setItem('doctorNickName', resp.user.docname);
            window.localStorage.setItem('doctorBed', resp.user.doctor_bed);
            window.localStorage.setItem('assistantId', resp.user.aideid);
            window.localStorage.setItem('canReserve', resp.user.doctor_show_yuyue == '1' ? '2' : '1');
            window.localStorage.setItem('icon', resp.user.icon);
            window.localStorage.setItem('header', resp.user.header);
            window.localStorage.setItem('hasPassword', '1');
            localStorageService.set('frno', password);
            LoginServ.getToken(resp.user.auth).then(function(token) {
                window.localStorage.setItem('im_token', token.token);
                $rootScope.closeLoginModal();
                window.parent.location.reload();
            })
        })
    }

    $rootScope.regIsOwn = '1';
    $rootScope.regSex = '1';
    $rootScope.regBirthday = '1980/1/1';
    $rootScope.regDisease = '乙肝';

    $rootScope.sendCode = function(tel, type) {
        if (tel) {
            LoginServ.sendCode(tel, type);
        } else {
            $ionicPopup.alert({
                title: '请填写手机号',
                template: ''
            })
        }
    }

    $rootScope.reg = function(regTel, regCode, regNickName, regRealName, regIsOwn, regSex, regBirthday, regDisease) {
        LoginServ.reg(regTel, regCode, regNickName, regRealName, regIsOwn, regSex, regBirthday, regDisease).then(function(resp) {
            $ionicPopup.alert({
                title: '注册成功',
                template: ''
            }).then(function() {
                $rootScope.closeRegModal();
            })
        })
    }

    $rootScope.findPwdAndlogin = function(tel, code) {
        LoginServ.resetPassword(tel, code).then(function(resp) {
            $ionicPopup.alert({
                title: '验证码已发送',
                template: ''
            }).then(function() {
                $rootScope.closeFindpwdModal();
            })
        })
    }

    $ionicModal.fromTemplateUrl('../templates/modal-recharge.html', {
        scope: $rootScope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $rootScope.rechargeModal = modal;
    });

    $rootScope.openRechargeModal = function() {
        if (typeof $rootScope.rechargeModal !== 'undefined') {
            $rootScope.rechargeModal.show();
        } else {
            $timeout(function() { $rootScope.rechargeModal.show() }, 500);
        }
    };
    $rootScope.closeRechargeModal = function() {
        $rootScope.rechargeModal.hide();
    };

    $rootScope.wxRecharge = function(money) {
        var jsonData = {
            'orderData': {
                'userId': window.localStorage.getItem('patientId'),
                'userName': window.localStorage.getItem('patientName'),
                'nickName': window.localStorage.getItem('patientNickName'),
                'subject': '09',
                'underThePlatform': '00'
            },
            'tenpayData': {
                'body': '健康券',
                'total_fee': money * 100,
                'remoteAddr': '196.168.1.1',
                'tradeType': 'JSAPI',
                'openid': $rootScope.openid

            }
        }
        RechargeServ.recharge(JSON.stringify(jsonData)).then(function(resp) {
            if (resp == 'error') {
                $ionicPopup.alert({
                    title: '微信支付出现了网络错误'
                });
                return;
            }
            wx.config({
                // debug: true,
                appId: 'wxe53e0da58a661bac', // 必填，公众号的唯一标识
                timestamp: Date.now().toString().substr(0, 10), // 必填，生成签名的时间戳
                nonceStr: resp.xml.nonce_str[0], // 必填，生成签名的随机串
                signature: resp.xml.sign[0], // 必填，签名，见附录1
                jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            })

            wx.ready(function() {
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                wx.chooseWXPay({
                    timestamp: resp.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: resp.nonceStr, // 支付签名随机串，不长于 32 位
                    package: resp.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: resp.signHfive, // 支付签名
                    success: function(res) {
                        console.log('scccccuuu')
                    }
                });
            });
        })
    }
})
