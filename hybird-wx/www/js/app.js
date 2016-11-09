// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic',
    'starter.consult.controllers',
    'starter.reservation.controllers',
    'starter.article.controllers',
    'starter.casereport.controllers',
    'starter.contract.controllers',

    'starter.login.services',
    'starter.consult.services',
    'starter.reservation.services',
    'starter.article.services',
    'starter.casereport.services',
    'starter.contract.services',
    'LocalStorageModule',
    'starter.directives',
    // 'starter.ajaxConfig'
])

.run(function($ionicPlatform, $rootScope, $state) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        var windowHeight = document.body.clientHeight;
        document.body.style.minHeight = windowHeight;
    })
    $rootScope.$on('$ionicView.afterEnter', function() {
        var i = document.createElement('iframe');
        i.src = 'favicon.ico';
        i.style.display = 'none';
        i.onload = function() {
            setTimeout(function() {
                i.remove();
            }, 9)
        }
        document.body.appendChild(i);
    })
})

.run(function($rootScope, contractervice, $timeout) {
    var openid = localStorage.getItem('wx015.openid');
    if (openid) {
        $rootScope.openid = openid;
    }
    if (Native.isWeixin) {
        var openid = localStorage.getItem('wx015.openid');
        if (openid) {
            $rootScope.openid = openid;
        } else {
            document.body.innerHTML = "";
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
                window.localStorage.setItem('jumpTo', window.location.href);
                if (WX_URL === 'http://wx.aiganyisheng.cn/')
                    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe53e0da58a661bac&redirect_uri=' + WX_URL + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect'
                else
                    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd121dd5024977916&redirect_uri=' + WX_URL + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect'
            } else {
                contractervice.getOpenid(qs.code).then(function(resp) {
                    localStorage.setItem('wx015.openid', resp);
                    // window.location.reload();
                    window.location.href = window.localStorage.getItem('jumpTo');
                })
            }
        }
    }
})

.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        '**'
    ]);
})

//ionic组件初始化
.config(function($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('')
    $ionicConfigProvider.backButton.previousTitleText(false)
    $ionicConfigProvider.backButton.icon('ion-ios-arrow-back')
    $ionicConfigProvider.tabs.position('bottom').style('standard')
    $ionicConfigProvider.navBar.alignTitle('center')
    $ionicConfigProvider.scrolling.jsScrolling(!ionic.Platform.isIOS());
})

//头部配置以及数据处理
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


//登录,充值
.run(function($rootScope, $ionicHistory,
    $ionicPopup, $ionicLoading,
    $ionicModal, $timeout,
    loginServ, RechargeServ, DoctorServ,
    localStorageService, $interval) {


    $rootScope.JAVA_URL = JAVA_URL;
    $rootScope.loginState = window.localStorage.getItem('loginState') || '';
    $rootScope.paraevent = true;
    $rootScope.phone = {};
    $rootScope.tips = "获取验证码";

    $ionicModal.fromTemplateUrl('../templates/login.html', {
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



    $rootScope.logout = function() {
        $rootScope.loginState = '';
        window.localStorage.setItem('loginState', '');
        window.location.reload();
    }


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

    $rootScope.checkPhone = function(phone) {
        if (!(/^1[3|4|5|7|8|]\d{9}$/.test(phone)) || phone == '') {
            $ionicPopup.alert({
                title: '请输入正确手机号！',
                template: ''
            });
        } else {
            var second = 180,
                timePromise = undefined;
            loginServ.getCode(phone, 1).then(function(resp) {
                $ionicLoading.show({
                    template: '验证码已发送至您的手机',
                    duration: 1200
                });
                //提示剩余时间
                if ($rootScope.paraevent) {
                    timePromise = $interval(function() {
                        if (second <= 0) {
                            $interval.cancel(timePromise);
                            timePromise = undefined;
                            second = 180;
                            $rootScope.tips = "重发验证码";
                            $rootScope.paraevent = true;
                        } else {
                            $rootScope.tips = second + ' s';
                            second--;
                            $rootScope.paraevent = false;
                        }
                    }, 1000);
                }
            })
        }
    };
    $rootScope.checkCode = function(phone, code) {
        loginServ.checkCode(phone, code).then(function(resp) {
            if (resp.code == 200) {
                window.localStorage.setItem('loginState', true);
                window.localStorage.setItem('auth', resp.user.auth);
                window.localStorage.setItem('patientId', resp.user.userid);
                window.localStorage.setItem('patientName', resp.user.username);
                window.localStorage.setItem('patientNickName', resp.user.nickname);
                window.localStorage.setItem('patientRealName', resp.user.realname);
                window.localStorage.setItem('doctorId', resp.user.doctorid);
                window.localStorage.setItem('doctorBed', resp.user.doctor_bed);
                window.localStorage.setItem('assistantId', resp.user.aideid);
                window.localStorage.setItem('canReserve', resp.user.doctor_show_yuyue == '1' ? '2' : '1');
                window.localStorage.setItem('icon', resp.user.icon);
                window.localStorage.setItem('header', resp.user.header);
                window.localStorage.setItem('hasPassword', resp.user.have_payment_password);
                window.localStorage.setItem('consultation', resp.user.consultation);
                window.localStorage.setItem('balance', resp.user.balance);
                window.localStorage.setItem('sex', resp.user.sex);
                window.localStorage.setItem('birthday', resp.user.birthday);
                window.localStorage.setItem('main_disease', resp.user.main_disease);

                $timeout(function() {
                    $rootScope.closeLoginModal();
                    window.location.reload();
                }, 1000);
            }
        })
    }


    $rootScope.doctorId = window.localStorage.getItem('userId');

    $rootScope.regIsOwn = '1';
    $rootScope.regSex = '1';
    $rootScope.regBirthday = '1980/1/1';
    $rootScope.regDisease = '乙肝';

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

    $ionicModal.fromTemplateUrl('../templates/my-order.html', {
        scope: $rootScope,
        animate: 'slide-in-up'
    }).then(function(modal) {
        $rootScope.orderModal = modal;
    });

    $rootScope.openOrderModal = function() {
        $rootScope.orderModal.show();
    };
    $rootScope.closeOrderModal = function() {
        $rootScope.orderModal.hide();
    };

    // for weixin login & reg
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
                'body': '充值',
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
                appId: APP_ID, // 必填，公众号的唯一标识
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

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

        .state('patient-me', {
        url: '/patient-me',
        templateUrl: 'templates/patient-me.html',
        controller: 'patientMeCtrl'
    })

    .state('reserve', {
        url: '/reserve',
        templateUrl: 'templates/reserve.html',
        controller: 'reserveCtrl'
    })

    //预约
    .state('reservation', {
        url: '/reservation/:id',
        templateUrl: 'templates/reservation.html',
        controller: 'reservationCtrl'
    })

    .state('reservation-doctor', {
        url: '/reservation-doctor/:id',
        templateUrl: 'templates/me-reservation-doctor.html',
        controller: 'reservationDocCtrl'
    })

    //咨询
    .state('consult', {
        url: '/consult',
        templateUrl: 'templates/consult.html',
        controller: 'consultCtrl'
    })

    .state('me-doctor-search', {
        url: '/consult/me-doctor-search',
        templateUrl: 'templates/me-doctor-search.html',
        controller: 'doctorSearchCtrl'
    })

    .state('me-doctor-info', {
        url: '/consult/me-doctor-info/:id',
        templateUrl: 'templates/me-doctor-info.html',
        controller: 'doctorInfoCtrl'
    })

    .state('me-doctor-consult', {
        url: '/consult/me-doctor-consult/:id',
        templateUrl: 'templates/me-doctor-consult.html',
        controller: 'doctorConsultCtrl'
    })

    .state('me-doctor-quick-consult', {
        url: '/consult/me-doctor-quick-consult',
        templateUrl: 'templates/quick-consult.html',
        controller: 'quickConsultCtrl'
    })


    //支付
    .state('me-pay', {
        url: '/consult/me-pay',
        templateUrl: 'templates/me-pay.html',
        controller: 'mePayCtrl'
    })

    .state('me-pay-over', {
        url: '/consult/me-pay-over',
        templateUrl: 'templates/me-pay-over.html',
        controller: 'mePayOverCtrl'
    })

    .state('me-pay-res-over', {
        url: '/reserv/me-pay-res-over',
        templateUrl: 'templates/me-pay-res-over.html',
        controller: 'mePayOverCtrl'
    })

    //订单
    .state('my-consult-order', {
        url: '/my-consult-order',
        templateUrl: 'templates/my-consult-order.html',
        controller: 'myConsultOrderCtrl'
    })

    .state('my-consult-order-detail', {
        url: '/consult/my-consult-order-detail/:id',
        templateUrl: 'templates/my-consult-order-detail.html',
        controller: 'myConsultOrderDetailCtrl'
    })

    .state('my-consult-order-detail-empty', {
        url: '/consult/my-consult-order-detail/:id/:status',
        templateUrl: 'templates/my-consult-order-detail.html',
        controller: 'myConsultOrderDetailCtrl'
    })

    .state('my-reserv-order', {
        url: '/my-reserv-order',
        templateUrl: 'templates/my-reservation-order.html',
        controller: 'myReserOrderCtrl'
    })

    .state('my-reserv-order-detail', {
        url: '/my-reserv-order-detail/:id',
        templateUrl: 'templates/my-reservation-order-detail.html',
        controller: 'myReservOrderDetailCtrl'
    })

    //文章与其他
    .state('article', {
        url: '/article',
        templateUrl: 'templates/article.html',
        controller: 'articleCtrl'
    })

    .state('article-detail', {
        url: '/article-detail/:id',
        templateUrl: 'templates/article-detail.html',
        controller: 'articleDetailCtrl'
    })


    .state('contract', {
        url: '/contract/:orderCode',
        templateUrl: 'templates/contract.html',
        controller: 'contractCtrl'
    })

    .state('contract-detail', {
        url: '/contract-detail',
        templateUrl: 'templates/contract-detail.html',
        controller: 'contractDetailCtrl'
    })

    .state('casereport', {
        url: '/casereport',
        templateUrl: 'templates/casereport.html',
        controller: 'casereportCtrl'
    })

    .state('casereport-detail', {
        url: '/casereport-detail',
        templateUrl: 'templates/casereport-detail.html',
        controller: 'casereportDetailCtrl'
    })

    .state('set-password-receivecode', {
        url: '/set-password-receivecode',
        templateUrl: 'templates/set-password-receivecode.html',
        controller: 'setPasswordReceiveCodeCtrl'
    })

    .state('set-password', {
        url: '/set-password',
        templateUrl: 'templates/set-password.html',
        controller: 'setPasswordCtrl'
    })

    .state('to-abd', {
        url: '/to-abd/:gName',
        templateUrl: 'templates/to-abd.html',
        controller: 'toAbdCtrl'
    })

    .state('account', {
        url: '/account',
        templateUrl: 'templates/account.html',
        controller: 'accountCtrl'
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('account');

});
