var startCtrl = angular.module('starter.contract.controllers', [])

startCtrl.controller('contractCtrl', ['$scope', '$rootScope', '$location', '$ionicPopup', '$stateParams', 'contractervice', function($scope, $rootScope, $location, $ionicPopup, $stateParams, contractervice) {
    contractervice.reloadContract($stateParams.orderCode).then(function(resp) {
        $scope.orderDetail = resp;
        $scope.info = {};

        if (resp.paymentStatus == '01') {
            $ionicPopup.alert({
                title: '此订单已经被支付了'
            }).then(function() {
                WeixinJSBridge.call('closeWindow');
            })
            return;
        }

        $scope.buy = function(info) {
            if (typeof info.insuranceIdCard === 'undefined' || info.insuranceIdCard === '') {
                $ionicPopup.alert({
                    title: '请填写身份证号'
                });
            } else if (typeof info.insuranceAddress === 'undefined' || info.insuranceAddress === '') {
                $ionicPopup.alert({
                    title: '请填写详细地址'
                });
            } else {
                var jsonData = {
                    'orderData': {
                        'uI': $scope.orderDetail.userId,
                        'uN': $scope.orderDetail.userName,
                        'nN': $scope.orderDetail.nickName,
                        'pR': 'H5',
                        'oC': $scope.orderDetail.orderCode,
                        'pF': '00'
                    },
                    'tenpayData': {
                        'body': $scope.orderDetail.proName,
                        'total_fee': $scope.orderDetail.amount * 100,
                        'remoteAddr': '196.168.1.1',
                        'tradeType': 'JSAPI',
                        'openid': $rootScope.openid
                    },
                    'parameterData': {
                        insuranceIdCard: info.insuranceIdCard,
                        medicare: info.medicare,
                        insuranceAddress: info.insuranceAddress
                    }
                }
                contractervice.buy(JSON.stringify(jsonData)).then(function(resp) {
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
                                WeixinJSBridge.call('closeWindow');
                                console.log('scccccuuu');
                            }
                        });
                    });
                })
            }
        }
    })
}])

.controller('contractDetailCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, $ionicLoading, localStorageService, contractervice) {
    contractervice.getProductDetail().then(function(resp) {
        $scope.product = resp[0];
        $scope.product.remark = $scope.product.remark.replace(/<img src="/g, '<img src="' + JAVA_URL);
    })
})

.controller('toAbdCtrl', function($scope, $rootScope, $stateParams) {
    if ($rootScope.openid)
        window.location.href = WAP_URL + "v1.9.0/act/20161014001/product.html?openid=" + $rootScope.openid + "&gName=" + $stateParams.gName;

})
