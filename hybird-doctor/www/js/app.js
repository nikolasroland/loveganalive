'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic-datepicker', 'starter.controllers', 'starter.services', 'starter.directives', 'LocalStorageModule'])

.run(function($ionicPlatform, $rootScope, $state) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
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

.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        '**'
    ]);
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

.config(function($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('')
    $ionicConfigProvider.backButton.previousTitleText(false)
    $ionicConfigProvider.backButton.icon('ion-ios-arrow-back')
    $ionicConfigProvider.tabs.position('bottom').style('standard')
    $ionicConfigProvider.navBar.alignTitle('center')
    $ionicConfigProvider.scrolling.jsScrolling(!ionic.Platform.isIOS());
})

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
        templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.doctor-patients', {
        url: '/doctor/patients',
        views: {
            'tab-doctor-patients': {
                templateUrl: 'templates/doctor-patients.html',
                controller: 'DoctorPatientsCtrl'
            }
        }
    })

    .state('tab.doctor-reservation', {
        url: '/doctor/reservation',
        views: {
            'tab-doctor-reservation': {
                templateUrl: 'templates/doctor-reservation.html',
                controller: 'DoctorReservationCtrl'
            }
        }
    })

    .state('tab.doctor-me', {
        url: '/doctor/me',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-me.html',
                controller: 'DoctorMeCtrl'
            }
        }
    })

    .state('tab.doctor-info', {
        url: '/doctor/me/info',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-me-info.html',
                controller: 'DoctorInfoCtrl'
            }
        }
    })

    .state('tab.doctor-info-by-id', {
        url: '/doctor/me/info/:id',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-me-info-by-id.html',
                controller: 'DoctorInfoByIdCtrl'
            }
        }
    })

    .state('tab.doctor-info-edit', {
        url: '/doctor/me/edit/:id',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-me-info-edit.html',
                controller: 'DoctorInfoEditCtrl'
            }
        }
    })

    .state('tab.doctor-info-edit-detail', {
        url: '/doctor/me/edit-detail',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-me-info-edit-detail.html',
                controller: 'DoctorInfoEditDetailCtrl'
            }
        }
    })

    .state('tab.doctor-assistant', {
        url: '/doctor/me/assistant',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-me-assistant.html',
                controller: 'DoctorAssistantCtrl'
            }
        }
    })

    .state('tab.doctor-visit', {
        url: '/doctor/me/visit',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-me-visit.html',
                controller: 'DoctorVisitCtrl'
            }
        }
    })

    .state('tab.doctor-bed', {
        url: '/doctor/me/bed',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-me-bed.html',
                controller: 'DoctorBedCtrl'
            }
        }
    })

    .state('tab.doctor-referral', {
        url: '/doctor/me/referral/:id',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-me-referral.html',
                controller: 'DoctorReferralCtrl'
            }
        }
    })

    .state('tab.doctor-result', {
        url: '/doctor/me/result/:patientId',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-me-result.html',
                controller: 'DoctorResultCtrl'
            }
        }
    })


    .state('tab.doctor-result-history', {
        url: '/doctor/me/result/:patientId/:id',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-me-result.html',
                controller: 'DoctorResultHistoryCtrl'
            }
        }
    })

    .state('tab.doctor-earning', {
        url: '/doctor/me/earning',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-me-earning.html',
                controller: 'DoctorEarningCtrl'
            }
        }
    })

    .state('tab.doctor-earning-detail', {
        url: '/doctor/me/earning/:subject/:month',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-me-earning-detail.html',
                controller: 'DoctorEarningDetailCtrl'
            }
        }
    })

    .state('tab.doctor-qa', {
        url: '/doctor/me/qa',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-me-qa.html',
                controller: 'DoctorQaCtrl'
            }
        }
    })

    .state('tab.doctor-qa-detail', {
        url: '/doctor/me/qa/:id',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-me-qa-detail.html',
                controller: 'DoctorQaDetailCtrl'
            }
        }
    })

    .state('tab.assistant-patients', {
        url: '/assistant/patients',
        views: {
            'tab-assistant-patients': {
                templateUrl: 'templates/assistant-patients.html',
                controller: 'AssistantPatientsCtrl'
            }
        }
    })

    .state('tab.assistant-patients-list', {
        url: '/assistant/patients/:id',
        views: {
            'tab-assistant-patients': {
                templateUrl: 'templates/assistant-patients-list.html',
                controller: 'AssistantPatientsListCtrl'
            }
        }
    })

    .state('tab.assistant-patients-search-list', {
        url: '/assistant/patients/search/:id',
        views: {
            'tab-assistant-patients': {
                templateUrl: 'templates/assistant-patients-search-list.html',
                controller: 'AssistantPatientsSearchListCtrl'
            }
        }
    })

    .state('tab.assistant-reservation', {
            url: '/assistant/reservation',
            views: {
                'tab-assistant-reservation': {
                    templateUrl: 'templates/assistant-reservation.html',
                    controller: 'AssistantReservationCtrl'
                }
            }
        })
        .state('tab.assistant-reservation-list', {
            url: '/assistant/reservation/:id',
            views: {
                'tab-assistant-reservation': {
                    templateUrl: 'templates/assistant-reservation-list.html',
                    controller: 'AssistantReservationListCtrl'
                }
            }
        })

    .state('tab.assistant-me', {
        url: '/assistant/me',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me.html',
                controller: 'AssistantMeCtrl'
            }
        }
    })

    .state('tab.assistant-me-order', {
        url: '/assistant/me/order',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me-order.html',
                controller: 'AssistantMeOrderCtrl'
            }
        }
    })

    .state('tab.assistant-me-order-byid', {
        url: '/assistant/me/order/:id/:name',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me-order.html',
                controller: 'AssistantMeOrderCtrl'
            }
        }
    })

    .state('tab.assistant-me-div', {
        url: '/assistant/me/div',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me-div.html',
                controller: 'AssistantMeDivCtrl'
            }
        }
    })

    .state('tab.assistant-me-div-byid', {
        url: '/assistant/me/div/:id/:name',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me-div.html',
                controller: 'AssistantMeDivCtrl'
            }
        }
    })

    .state('tab.assistant-me-order-list', {
        url: '/assistant/me/order-list',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me-order-list.html',
                controller: 'AssistantMeOrderListCtrl'
            }
        }
    })

    .state('tab.assistant-me-order-detail', {
        url: '/assistant/me/order-detail',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me-order-detail.html',
                controller: 'AssistantMeOrderDetailCtrl'
            }
        }
    })

    .state('tab.assistant-me-order-detail-byid', {
        url: '/assistant/me/order-detail/:id',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me-order-detail.html',
                controller: 'AssistantMeOrderDetailByIdCtrl'
            }
        }
    })

    .state('tab.assistant-me-order-invoice', {
        url: '/assistant/me/order-invoice',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me-order-invoice.html',
                controller: 'AssistantMeOrderInvoiceCtrl'
            }
        }
    })

    .state('tab.assistant-me-order-express', {
        url: '/assistant/me/order-express/:comp/:code',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me-order-express.html',
                controller: 'AssistantMeOrderExpressCtrl'
            }
        }
    })

    .state('tab.assistant-me-product-detail', {
        url: '/assistant/me/product/:id',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me-product-detail.html',
                controller: 'AssistantMeProductDetailCtrl'
            }
        }
    })

    .state('tab.assistant-referral', {
        url: '/assistant/me/referral/:id',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me-referral.html',
                controller: 'AssistantReferralCtrl'
            }
        }
    })

    .state('tab.assistant-result', {
        url: '/assistant/me/result/:patientId',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me-result.html',
                controller: 'AssistantResultCtrl'
            }
        }
    })

    .state('tab.assistant-result-history', {
        url: '/assistant/me/result/:patientId/:id',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me-result.html',
                controller: 'AssistantResultHistoryCtrl'
            }
        }
    })

    .state('tab.assistant-info', {
        url: '/assistant/me/info',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me-info.html',
                controller: 'AssistantInfoCtrl'
            }
        }
    })

    .state('tab.assistant-info-by-id', {
        url: '/assistant/me/info/:id',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me-info-by-id.html',
                controller: 'AssistantInfoByIdCtrl'
            }
        }
    })

    .state('tab.assistant-info-edit', {
        url: '/assistant/me/edit/:id/:status',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me-info-edit.html',
                controller: 'AssistantInfoEditCtrl'
            }
        }
    })

    .state('tab.assistant-info-edit-detail', {
        url: '/assistant/me/edit-detail/:id',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me-info-edit-detail.html',
                controller: 'AssistantInfoEditDetailCtrl'
            }
        }
    })

    .state('tab.assistant-doctors', {
        url: '/assistant/me/doctors',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me-doctors.html',
                controller: 'AssistantDoctorsCtrl'
            }
        }
    })

    .state('tab.assistant-earning', {
        url: '/assistant/me/earning',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me-earning.html',
                controller: 'AssistantEarningCtrl'
            }
        }
    })

    .state('tab.assistant-earning-detail', {
        url: '/assistant/me/earning/:subject/:month',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me-earning-detail.html',
                controller: 'AssistantEarningDetailCtrl'
            }
        }
    })

    .state('tab.assistant-qa', {
        url: '/assistant/me/qa',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me-qa.html',
                controller: 'AssistantQaCtrl'
            }
        }
    })

    .state('tab.assistant-qa-detail', {
        url: '/assistant/me/qa/:id',
        views: {
            'tab-assistant-me': {
                templateUrl: 'templates/assistant-me-qa-detail.html',
                controller: 'AssistantQaDetailCtrl'
            }
        }
    })

    .state('tab.me', {
        url: '/me',
        views: {
            'tab-me': {
                templateUrl: 'templates/me.html',
                controller: 'MeCtrl'
            }
        }
    })

    .state('tab.me-bonus-result', {
        url: '/me/bonus-result/:randomCode',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-bonus-result.html',
                controller: 'BonusResultCtrl'
            }
        }
    })

    .state('tab.qa-red', {
        url: '/me/qa-red',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-qa.html',
                controller: 'QaRedCtrl'
            }
        }
    })

    .state('tab.qa-detail', {
        url: '/me/qa-detail:id',
        views: {
            'tab-me': {
                templateUrl: 'templates/me-qa-detail.html',
                controller: 'QaDetailCtrl'
            }
        }
    })

    .state('tab.discover', {
        url: '/discover',
        views: {
            'tab-discover': {
                templateUrl: 'templates/tab-discover.html',
                controller: 'DiscoverCtrl'
            }
        }
    })

    .state('tab.act-detail', {
        url: '/discover/act/:id',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-act-detail.html',
                controller: 'ActDetailCtrl'
            }
        }
    })


    .state('tab.act', {
        url: '/discover/act',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-act.html',
                controller: 'ActCtrl'
            }
        }
    })

    .state('tab.game', {
        url: '/discover/game',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-game.html',
                controller: 'GameCtrl'
            }
        }
    })
    
    .state('tab.hospital', {
        url: '/discover/hospital',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-hospital.html',
                controller: 'HospitalCtrl'
            }
        }
    })

    .state('tab.knowledge', {
        url: '/discover/knowledge',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-knowledge.html',
                controller: 'KnowledgeCtrl'
            }
        }
    })

    .state('tab.medicine', {
        url: '/discover/medicine',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-medicine.html',
                controller: 'MedicineCtrl'
            }
        }
    })

    .state('tab.story', {
        url: '/discover/story',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-story.html',
                controller: 'StoryCtrl'
            }
        }
    })

    .state('tab.school', {
        url: '/discover/school',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-school.html',
                controller: 'SchoolCtrl'
            }
        }
    })

    .state('tab.plan', {
        url: '/discover/plan',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-plan.html',
                controller: 'PlanCtrl'
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

    .state('tab.article-with-pager', {
        url: '/discover/article/:id/:hasPager',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-article.html',
                controller: 'ArticleCtrl'
            }
        }
    })

    .state('tab.question', {
        url: '/discover/question/:id',
        views: {
            'tab-discover': {
                templateUrl: 'templates/discover-question.html',
                controller: 'QuestionCtrl'
            }
        }
    })

    .state('tab.doctor-order-yigan', {
        url: '/doctor/me/order-yigan',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-order-yigan.html',
                controller: 'DoctorOrderYiganCtrl'
            }
        }
    })

    .state('tab.doctor-order-yigan-detail-a', {
        url: '/doctor/me/order-yigan-detail-a',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-order-yigan-detail-a.html',
                controller: 'DoctorOrderYiganDetailACtrl'
            }
        }
    })

    .state('tab.doctor-order-yigan-detail-b', {
        url: '/doctor/me/order-yigan-detail-b',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-order-yigan-detail-b.html',
                controller: 'DoctorOrderYiganDetailBCtrl'
            }
        }
    })

    .state('tab.doctor-order-binggan', {
        url: '/doctor/me/order-binggan',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-order-binggan.html',
                controller: 'DoctorOrderBingganCtrl'
            }
        }
    })

    .state('tab.doctor-order-zhifanggan', {
        url: '/doctor/me/order-zhifanggan',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-order-zhifanggan.html',
                controller: 'DoctorOrderZhifangganCtrl'
            }
        }
    })

    .state('tab.doctor-order-ganai', {
        url: '/doctor/me/order-ganai',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-order-ganai.html',
                controller: 'DoctorOrderGanaiCtrl'
            }
        }
    })

    .state('tab.doctor-order-yingxiang', {
        url: '/doctor/me/order-yingxiang',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-order-yingxiang.html',
                controller: 'DoctorOrderYingxiangCtrl'
            }
        }
    })

    .state('tab.doctor-me-followup', {
        url: '/doctor/me/followup/:patientId',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-me-followup.html',
                controller: 'DoctorFollowupCtrl'
            }
        }
    })

    .state('tab.doctor-me-followup-child-plan', {
        url: '/doctor/me/followup-child-plan/:id/:patientId',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-me-followup-child-plan.html',
                controller: 'DoctorFollowupChildPlanCtrl'
            }
        }
    })

    .state('tab.doctor-me-followup-plan-edit', {
        url: '/doctor/me/followup-plan-edit/:id/:patientId',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-me-followup-plan-edit.html',
                controller: 'DoctorFollowupPlanEditCtrl'
            }
        }
    })

     .state('tab.doctor-me-followup-plan-edit-drug', {
        url: '/doctor/me/followup-plan-edit-drug/:id/:patientId',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-me-followup-plan-edit-drug.html',
                controller: 'DoctorFollowupPlanEditDrugCtrl'
            }
        }
    })

     .state('tab.doctor-me-followup-plan-drug-edit', {
        url: '/doctor/me/followup-plan-drug-edit',
        views: {    
            'tab-doctor-me': {
                templateUrl: 'templates/docotr-me-followup-plan-drug-edit.html',
                controller: 'DoctorFollowupPlanDrugEditCtrl'
            }
        }
    })


    .state('tab.doctor-me-followup-visit-plan', {
        url: '/doctor/me/followup-visit-plan/:id/:patientId',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-me-followup-visit-plan.html',
                controller: 'DoctorFollowupVisitPlanCtrl'
            }
        }
    })

    .state('tab.doctor-me-followup-visit-plan-edit', {
        url: '/doctor/me/followup-visit-plan-edit/:id/:patientId',
        views: {
            'tab-doctor-me': {
                templateUrl: 'templates/doctor-me-followup-visit-plan-edit.html',
                controller: 'DoctorFollowupVisitPlanEditCtrl'
            }
        }
    })

     .state('doctorFlup', {
        url: '/doctorFlup/:id/:patientId',
        templateUrl: 'templates/doctorFlup.html',
        controller: 'doctorFlupCtrl'
    })

    .state('doctorFlupDetail', {
        url: '/doctorFlupDetail/:id/:patientId',
        templateUrl: 'templates/doctorFlupDetail.html',
        controller: 'doctorFlupDetailCtrl'
    })

    .state('doctortemplateChange', {
        url: '/doctortemplateChange/:id/:patientId&:state',
        templateUrl: 'templates/doctortemplateChange.html',
        controller: 'doctortemplateChangeCtrl'
    })
	
	.state('reportList', {
            url: '/reportList/:patientid',
            templateUrl: 'templates/reportList.html',
            controller: 'reportListCtrl'
          }) 
    .state('patientReport-detail', {
            url: '/patientReport-detail/:id',
            templateUrl: 'templates/patientReport-detail.html',
            controller: 'reportDetailCtrl'
          }) 
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/doctor/me');

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

.run(function($rootScope, $state) {
    $rootScope.JAVA_URL = JAVA_URL;
    $rootScope.ticket = ionic.Platform.isIOS() ? '元' : '张健康券';
    $rootScope.isIOS = ionic.Platform.isIOS();
    $rootScope.historyBack = function() {
        var stateName = 'h5.' + $state.current.name;
        Native.run('umengLeave', [stateName])
        Native.run('historyBack', []);
    }
    $rootScope.shareQRCode = function(imgUrl, doctorId, doctorName, doctorIcon) {
        var doctorUrl = 'http://wap.aiganyisheng.cn/wechat/index.html#/detail/' + doctorId;
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
