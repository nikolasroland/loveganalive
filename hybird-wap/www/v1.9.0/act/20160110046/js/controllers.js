'use strict';
angular.module('starter.controllers', [])

.controller('OrderDetailCtrl', function($scope, localStorageService) {
    $scope.orderDetail = localStorageService.get('orderdetail');

    $scope.back = function() {
        window.history.back();
    }
})

.controller('DetailCtrl', function($scope, $rootScope, $timeout, $ionicScrollDelegate, localStorageService, CommentServ) {
    $scope.productDetail = localStorageService.get('productDetail');
    $scope.productDetail.remark = $scope.productDetail.remark.replace(/<img src="/g, '<img src="' + JAVA_URL);

    if ($scope.productDetail.productTypeCode != '09') {

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
    }

    $scope.reserve = function(id, title, mark, productTypeCode) {
        window.location.href = "#/settle/" + id + "/" + title + "/" + mark + "/" + productTypeCode;
    }
})

.controller('ListCtrl', function($scope, $rootScope, localStorageService, Serv) {
    Serv.reloadList().then(function(resp) {
        $scope.list = resp;
    });

    $scope.viewOrderDetail = function() {
        localStorageService.set('orderdetail', this.item);
        window.location.href = "#/order/" + this.item.id;
    }
})

.controller('ShopCtrl', function($scope, $rootScope, $location, $ionicScrollDelegate, $ionicHistory, $ionicPopup, localStorageService, Serv) {
    window.parent.postMessage({
        func: 'getAuth',
        params: ['patient']
    }, '*')

    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $scope.uid = window.location.search.substr(5);
    $scope.afterGetAuth = function() {
        Serv.reloadProducts().then(function(resp) {
            $scope.list = resp;
            console.log(resp)
        });
    };
    $scope.afterGetAuth()

    $scope.status = 'all';
    $scope.setActive = function(status) {
        $scope.status = status;
    }

    $scope.viewDetail = function() {
        window.location.href = "#/detail";
        localStorageService.set('productDetail', this.item);
    }


    $scope.reserve = function(e, id, title, mark, productTypeCode) {
        e.stopImmediatePropagation();
        window.location.href = "#/settle/" + id + "/" + title + "/" + mark + "/" + productTypeCode;
    }
})

.controller('SettleCtrl', function($scope, $rootScope, $ionicPopup, $ionicLoading, $timeout, $stateParams, localStorageService, Serv) {
    // mark = 0 按年  mark = 1 按月  mark = 2 按季
    if ($stateParams.mark == '0') {
        $scope.isOnce = false;
    } else {
        $scope.isOnce = true;
    }

    var userName = window.localStorage.getItem('userName'),
        realName = window.localStorage.getItem('realName'),
        address = window.localStorage.getItem('address'),
        idCard = window.localStorage.getItem('idCard');
    if (/[0-9\*]/.test(realName) || realName.length < 2)
        $scope.insurancePeople = '';
    else
        $scope.insurancePeople = realName;
    $scope.insuranceMobile = userName;
    $scope.insuranceAddress = address;

    if (!/^\s{0}$|(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard)) {
        $scope.insuranceIdCard = ''
    } else {
        $scope.insuranceIdCard = idCard;
    }

    $scope.insurance = {}
    $scope.insurance.Distribution = '01';
    $scope.productName = $stateParams.title;
    $scope.productTypeCode = $stateParams.productTypeCode;
    $scope.mark = $stateParams.mark == '2' ? '12周' : $stateParams.mark == '1' ? '4周' : '1年';
    $scope.detail = '';

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

    $scope.saveProduct = function(insurancePeople, insuranceMobile, insuranceAddress, insuranceIdCard, insuranceDistribution, detail, productTypeCode) {
        console.log(insurancePeople)
        console.log(insuranceIdCard)
        if (typeof insurancePeople === 'undefined' || insurancePeople === '') {
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
        } else if (typeof insuranceDistribution === 'undefined') {
            $ionicPopup.alert({
                title: '请选择配送周期'
            });
            /*} else if (typeof productCode === 'undefined') {
                $ionicPopup.alert({
                    title: '请选择服务包'
                });*/
        } else if ((['15', '16', '17'].indexOf(productTypeCode) === -1) && (inputPrescription === null || inputPrescription.base64 === null)) {
            $ionicPopup.alert({
                title: '请上传处方照片'
            });
        } else {
            Serv.buyProduct(insurancePeople, insuranceMobile, insuranceAddress, insuranceIdCard, insuranceDistribution, $stateParams.id, inputPrescription.input.files[0], detail).then(function(resp) {
                window.localStorage.setItem('address', insuranceAddress);
                window.localStorage.setItem('idCard', insuranceIdCard);
                $ionicPopup.alert({
                    title: '预订成功!',
                    template: ''
                }).then(function() {
                    window.location.href = '#/list';
                    /*window.parent.postMessage({
                        func: 'run',
                        params: ['historyBack', []]
                    }, '*')*/
                })
            })
        }
        return;
    }
})

.controller('OrderExpressCtrl', function($scope, $stateParams) {
    $scope.link = 'http://m.kuaidi100.com/index_all.html?type=' + $stateParams.comp + '&postid=' + $stateParams.code + '#result&ui-state=dialog'
})
