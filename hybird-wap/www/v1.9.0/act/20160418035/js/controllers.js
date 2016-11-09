'use strict';
angular.module('starter.controllers', [])

.controller('ShopCtrl', function($scope, $rootScope, $ionicPopup, localStorageService, Serv) {
    $rootScope.search = window.location.hash.indexOf('?') === -1 ? '' : window.location.hash.substr(window.location.hash.indexOf('?'));
    $scope.cloudshop = true;
    var userId = '';

    window.parent.postMessage({
        func: 'getAuth',
        params: ['patient']
    }, '*')
    $scope.afterGetAuth = function() {
        userId = window.localStorage.getItem('userId');
        if (userId == '' || userId == 0 || userId == null) {
            $ionicPopup.alert({
                title: '提示',
                template: '需要先登录爱肝一生app才可以参与哦'
            }).then(function() {
                window.parent.postMessage({
                    func: 'run',
                    params: ['login', []]
                }, '*');
            })
        } else {
            if (window.localStorage.getItem('doctorId') == 0) {
                alert('您还没有绑定医生，请先选择一位距离您较近的医生吧。');
                window.parent.postMessage({
                    func: 'run',
                    params: ['transfer', [0, 'selectDoctor']]
                }, '*');
                return;
            } else {
                Serv.getDoctorCity(window.localStorage.getItem('doctorId')).then(function(resp) {
                    var args = getQueryStringArgs();
                    if (resp == '0' || args['cloudshop'] == 'true') {

                        Serv.reloadProducts().then(function(resp) {
                            for (var i in resp.serviceProduct) {
                                resp.serviceProduct[i].quantity = 0;
                                resp.serviceProduct[i].price = resp.serviceProduct[i].servicePackagePrice + resp.serviceProduct[i].doctorManagePrice;
                            }
                            for (var i in resp.drugProduct) {
                                resp.drugProduct[i].quantity = 0;
                                resp.drugProduct[i].price;
                            }

                            // 隐藏服务
                            if (args['cloudshop'] == 'true') {
                                $scope.cloudshop = true;
                                resp = { 'drugProduct': resp.drugProduct }
                            } else {
                                $scope.cloudshop = false;
                            }

                            $scope.shop = resp;
                        })
                        $scope.canBuyDrug = false;
                        Serv.getAppSetInfo().then(function(appInfo) {
                            if (appInfo == 1) {
                                Serv.getBalance(window.localStorage.getItem('auth')).then(function(resp) {
                                    if (resp.service_days > 0) {
                                        $scope.canBuyDrug = true;
                                    }
                                })
                            } else {
                                $scope.canBuyDrug = true;
                            }
                        })
                    } else {
                        window.location.href = WAP_URL + "v1.9.0/act/20160110046/index.html?uid=" + window.localStorage.getItem('userId') + "#/shop";
                    }
                })
            }
        }
    }

    $scope.amount = 0;
    $scope.serviceQuantity = 0;
    $scope.minus = function() {
        this.item.quantity--;
        $scope.amount = $scope.amount - this.item.price;
        $scope.serviceQuantity--;
    }
    $scope.plus = function() {
        this.item.quantity++;
        $scope.amount = $scope.amount + this.item.price;
        $scope.serviceQuantity++;
    }
    $scope.offlineAmount = 0;
    $scope.offlineMinus = function() {
        this.item.quantity--;
        $scope.offlineAmount = $scope.offlineAmount - this.item.price;
    }
    $scope.offlinePlus = function() {
        this.item.quantity++;
        $scope.offlineAmount = $scope.offlineAmount + this.item.price;
    }
    $scope.pay = function() {
        if ($scope.amount == 0) {
            $ionicPopup.confirm({
                title: '温馨提示',
                template: '您预定的药品服务将货到付款，线上总金额为0'
            }).then(function(res) {
                if (res) {
                    localStorageService.set('cart', $scope.shop);
                    window.location.href = '#/settle';
                }
            })
        } else {
            localStorageService.set('cart', $scope.shop);
            window.location.href = '#/settle';
        }
    }

    $scope.viewDetail = function() {
        window.location.href = "#/detail";
        localStorageService.set('productDetail', this.item);
    }
})

.controller('SettleCtrl', function($scope, $rootScope, $ionicPopup, $ionicLoading, $timeout, localStorageService, Serv) {
    var cart = localStorageService.get('cart')
    var products = [],
        jsonData = [],
        amount = 0,
        offlineAmount = 0,
        quantity = 0,
        hasServiceProduct = false,
        doctorId = window.localStorage.getItem('doctorId');

    $scope.serviceQuantity = 0

    for (var i in cart.serviceProduct) {
        if (cart.serviceProduct[i].quantity > 0) {
            products.push(cart.serviceProduct[i]);
            jsonData.push({ "productId": cart.serviceProduct[i].id, "productCount": cart.serviceProduct[i].quantity, "doctorId": doctorId })
            quantity++;
            amount += cart.serviceProduct[i].price * cart.serviceProduct[i].quantity;
            hasServiceProduct = true;
            $scope.serviceQuantity += cart.serviceProduct[i].quantity;
        }
    }
    for (var i in cart.drugProduct) {
        if (cart.drugProduct[i].quantity > 0) {
            cart.drugProduct[i].isDrug = true;
            products.push(cart.drugProduct[i]);
            jsonData.push({ "productId": cart.drugProduct[i].id, "productCount": cart.drugProduct[i].quantity, "doctorId": doctorId })
            quantity++;
            offlineAmount += cart.drugProduct[i].price * cart.drugProduct[i].quantity;
        }
    }
    $scope.products = products;
    $scope.quantity = quantity;
    if ($scope.serviceQuantity >= 6 && $scope.serviceQuantity <= 11)
        amount -= 100;
    else if ($scope.serviceQuantity >= 12)
        amount -= 200;
    $scope.amount = amount;
    $scope.offlineAmount = offlineAmount;
    $scope.info = {};
    var userName = window.localStorage.getItem('userName'),
        realName = window.localStorage.getItem('realName'),
        address = window.localStorage.getItem('address'),
        idCard = window.localStorage.getItem('idCard');
    if (/[0-9\*]/.test(realName) || realName.length < 2)
        $scope.info.insurancePeople = '';
    else
        $scope.info.insurancePeople = realName;
    $scope.info.insuranceMobile = userName;
    $scope.info.insuranceAddress = address;
    if (!/^\s{0}$|(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard)) {
        $scope.info.insuranceIdCard = ''
    } else {
        $scope.info.insuranceIdCard = idCard;
    }
    $scope.info.detail = '';

    $scope.pay = function(insurancePeople, insuranceMobile, insuranceAddress, insuranceIdCard, detail) {
        console.log(insuranceIdCard)
        console.log(typeof insuranceIdCard)
        console.log(typeof insuranceIdCard !== 'undefined')
        console.log(insuranceIdCard != '')
        if (inputPrescription === null || inputPrescription.base64 === null) {
            $ionicPopup.alert({
                title: '请上传处方照片'
            });
        } else if (typeof insurancePeople === 'undefined' || insurancePeople === '') {
            $ionicPopup.alert({
                title: '请填写收件人'
            });
        } else if (typeof insuranceMobile === 'undefined') {
            $ionicPopup.alert({
                title: '请填写联系电话'
            });
        } else if (typeof insuranceAddress === 'undefined') {
            $ionicPopup.alert({
                title: '请填写详细地址'
            });
        } else {
            // 您预定的药品服务将货到付款，线上总金额为0
            Serv.buyProduct(insurancePeople, insuranceMobile, insuranceAddress, insuranceIdCard, jsonData, inputPrescription.input.files[0], detail).then(function(resp) {
                window.localStorage.setItem('address', insuranceAddress);
                window.localStorage.setItem('idCard', insuranceIdCard);
                $ionicLoading.show({
                    template: '等待支付...'
                });
                $timeout(function() {
                    $ionicLoading.hide();
                    window.location.href = '#/list';
                }, 2000)
                window.parent.postMessage({
                    func: 'run',
                    params: ['pay', [amount, resp, 45, hasServiceProduct ? '医事服务+' : '医药服务']]
                }, '*')
            })
        }
        return;
    }

    $scope.reserve = function(insurancePeople, insuranceMobile, insuranceAddress, insuranceIdCard, detail) {
        console.log(insuranceIdCard)
        console.log(typeof insuranceIdCard)
        console.log(typeof insuranceIdCard !== 'undefined')
        console.log(insuranceIdCard != '')
        if (inputPrescription === null || inputPrescription.base64 === null) {
            $ionicPopup.alert({
                title: '请上传处方照片'
            });
        } else if (typeof insurancePeople === 'undefined' || insurancePeople === '') {
            $ionicPopup.alert({
                title: '请填写收件人'
            });
        } else if (typeof insuranceMobile === 'undefined') {
            $ionicPopup.alert({
                title: '请填写联系电话'
            });
        } else if (typeof insuranceAddress === 'undefined') {
            $ionicPopup.alert({
                title: '请填写详细地址'
            });
        } else {
            // 您预定的药品服务将货到付款，线上总金额为0
            Serv.buyProduct(insurancePeople, insuranceMobile, insuranceAddress, insuranceIdCard, jsonData, inputPrescription.input.files[0], detail).then(function(resp) {
                window.localStorage.setItem('address', insuranceAddress);
                window.localStorage.setItem('idCard', insuranceIdCard);
                window.location.href = '#/list';
            })
        }
        return;
    }

    var inputPrescription = {};
    inputPrescription = init('picfilePrescription');

    function init(context) {
        var uploadPic = new UploadPic();
        uploadPic.init({
            context: document.getElementById(context),
            callback: function(base64) {
                this.base64 = base64;
            },
            loading: function() {
                if (!$rootScope.isIOS) {
                    alert('正在上传图片...')
                }
            }
        });
        return uploadPic;
    }
})

.controller('ListCtrl', function($scope, $rootScope, $timeout, $ionicPopup, $ionicHistory, $ionicLoading, localStorageService, Serv) {
    $scope.$on('$ionicView.enter', function() {
        $scope.doRefresh();
    })

    $scope.doRefresh = function() {
        Serv.reloadList().then(function(resp) {
            $scope.list = resp;
        });
    }

    $scope.pay = function(amount, orderCode, subjectName) {
        this.item.btnDisabled = true;
        var _item = this.item;
        window.parent.postMessage({
            func: 'run',
            params: ['pay', [amount, orderCode, 45, orderCode]]
        }, '*')
        $timeout(function() {
            _item.btnDisabled = false;
        }, 2000)
    }

    $scope.cancel = function(orderCode) {
        $ionicPopup.confirm({
            title: '温馨提示',
            template: '确定要取消该订单吗？'
        }).then(function(res) {
            if (res) {
                Serv.cancelOrder(orderCode).then(function(resp) {
                    $scope.doRefresh();
                })
            }
        })
    }

    $scope.viewOrderDetail = function() {
        localStorageService.set('orderdetail', this.item);
    }

    $scope.enterShop = function() {
        $ionicHistory.clearCache()
        $rootScope.enter = true;
    }
})

.controller('OrderDetailCtrl', function($scope, $rootScope, $ionicPopup, $ionicLoading, localStorageService, Serv) {
    var orderDetail = localStorageService.get('orderdetail')

    var products = [],
        jsonData = [],
        amount = 0,
        offlineAmount = 0,
        quantity = 0,
        hasServiceProduct = false,
        doctorId = window.localStorage.getItem('doctorId');

    for (var i in orderDetail.tradeOrderProductList) {
        if (orderDetail.tradeOrderProductList[i].productTypeCode == '08') {
            quantity += orderDetail.tradeOrderProductList[i].productCount;
            amount += (orderDetail.tradeOrderProductList[i].doctorManagePrice + orderDetail.tradeOrderProductList[i].servicePackagePrice) * orderDetail.tradeOrderProductList[i].productCount;
        } else if (orderDetail.tradeOrderProductList[i].productTypeCode == '09') {
            quantity += orderDetail.tradeOrderProductList[i].productCount;
            offlineAmount += orderDetail.tradeOrderProductList[i].price * orderDetail.tradeOrderProductList[i].productCount;
        }
    }
    $scope.orderDetail = orderDetail;
    $scope.quantity = quantity;
    $scope.amount = amount;
    $scope.offlineAmount = offlineAmount;
    console.log(orderDetail)

    $scope.back = function() {
        window.history.back();
    }
})

.controller('OrderExpressCtrl', function($scope, $stateParams) {
    $scope.link = 'http://m.kuaidi100.com/index_all.html?type=' + $stateParams.comp + '&postid=' + $stateParams.code + '#result&ui-state=dialog';
})

.controller('DetailCtrl', function($scope, $rootScope, $timeout, $ionicScrollDelegate, localStorageService, CommentServ) {
    $scope.productDetail = localStorageService.get('productDetail');
    $scope.productDetail.remark = $scope.productDetail.remark.replace(/<img src="/g, '<img src="' + JAVA_URL);


    $scope.commentList = [];
    CommentServ.hasmore = true;
    CommentServ.curPage = 1;

    $scope.doRefresh = function() {
        $scope.commentList = [];
        CommentServ.hasmore = true;
        CommentServ.curPage = 1;
        $scope.loadMore();
    }

    var _lock = false;
    $scope.loadMore = function() {
        if (_lock) return;
        _lock = true;
        $scope.hasLoaded = false;
        //这里使用定时器是为了缓存一下加载过程，防止加载过快
        $timeout(function() {
            _lock = false;
            if (!CommentServ.hasmore) {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                return;
            }
            CommentServ.reserveList($scope.productDetail.id, CommentServ.curPage).then(function(response) {
                $scope.hasLoaded = true;
                $scope.comment = response;

                CommentServ.hasmore = response.total / 10 > CommentServ.curPage;
                for (var i = 0; i < response.rows.length; i++) {
                    $scope.commentList.push(response.rows[i]);
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
                CommentServ.curPage++;
                $ionicScrollDelegate.freezeScroll(false);
            });
        }, 1000);
    };
    $scope.loadMore();

    $scope.moreDataCanBeLoaded = function() {
        return CommentServ.hasmore;
    }
})
