'use strict';
angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $ionicHistory, $ionicPopup, Serv) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $scope.uid = window.location.search.substr(5);


    window.parent.postMessage({
        func: 'getAuth',
        params: ['patient']
    }, '*')

    $scope.start = function() {
        if (window.localStorage.getItem('userId') == '' || window.localStorage.getItem('userId') == 0 || window.localStorage.getItem('userId') == null) {
            $ionicPopup.alert({
                title: '提示',
                template: '需要先登录爱肝一生app才可以参与哦'
            }).then(function() {
                window.parent.postMessage({
                    func: 'run',
                    params: ['login', []]
                }, '*');
            });
        } else {
            if (window.localStorage.getItem('doctorId') == 0) {
                alert('您还没有绑定医生，请先选择一位距离您较近的医生吧。');
                window.parent.postMessage({
                    func: 'run',
                    params: ['transfer', [0, 'selectDoctor']]
                }, '*');
                return;
            } else if (window.localStorage.getItem('assistantId') == 0) {
                alert('您的医生还没有绑定个管师，请先更换一位医生吧。');
                window.parent.postMessage({
                    func: 'run',
                    params: ['transfer', [0, 'selectDoctor']]
                }, '*');
            } else {
                window.location.href = "#/plan";
            }


            /*////// debug //////
            window.localStorage.setItem('auth', '4ca8BFcMBgYPVAUAVlYBClJcUANRVwFWVFcPBVYEDVxUAGsEWgAFAglUBQJXAT4MUFYDBFUCVFQIUQZVVAMNXVcFVQICXVcHXwFWBwcBBQ');
            window.localStorage.setItem('userId', '44850');
            window.localStorage.setItem('userName', '19900001123');
            window.localStorage.setItem('nickName', '1123');

            window.location.href = "#detail";*/
        }
    }
})

.controller('PlanCtrl', function($scope, $rootScope, $ionicPopup, $ionicScrollDelegate, Serv, localStorageService) {
    Serv.reloadProducts().then(function(resp) {
        for (var i in resp) {
            resp[i].ckb = true;
        }
        $scope.productList = resp;
        $scope.agree = true;

        var realName = window.localStorage.getItem('realName');
        if (/[0-9\*]/.test(realName) || realName.length < 2)
            $scope.realName = '';
        else
            $scope.realName = realName;

        $scope.mobileNo = window.localStorage.getItem('userName');

        Serv.reloadList().then(function(list) {
            for (var i in list) {
                for (var j in resp) {
                    if (list[i].pro_id == resp[j].id) {
                        resp[j].isJoinIn = true;
                        resp[j].ckb = false;
                        resp[j].planStatus = list[i].plan_status;
                    }
                }
            }

            $scope.isShowInfo = false;
            for (var i in resp) {
                console.log(resp[i].ckb)
                if (resp[i].ckb) {
                    $scope.isShowInfo = true;
                }
            }
        })


        $scope.saveProduct = function(agree, productList, realName, mobileNo, insuranceIdCard) {

            var proIdArr = [],
                proCodeArr = [];
            for (var i in productList) {
                if (productList[i].ckb) {
                    proIdArr.push(productList[i].id);
                    proCodeArr.push(productList[i].productCode);
                }
            }
            if (!agree) {
                $ionicPopup.alert({
                    title: '请在详细阅读公约并同意后，再选择要加入的计划'
                });
            } else if (proIdArr.length === 0) {
                $ionicPopup.alert({
                    title: '请选择要加入的计划'
                });
            } else if (typeof realName === 'undefined') {
                $ionicPopup.alert({
                    title: '请填写真实姓名'
                });
            } else if (typeof mobileNo === 'undefined') {
                $ionicPopup.alert({
                    title: '请填写联系电话'
                });
            } else if (typeof insuranceIdCard === 'undefined') {
                $ionicPopup.alert({
                    title: '请填写身份证号'
                });
            } else if (!/^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/.test(insuranceIdCard)) {
                $ionicPopup.alert({
                    title: '身份证号格式不正确'
                });
            } else {
                Serv.buyProduct(proIdArr.join(','), proCodeArr.join(','), realName, mobileNo, insuranceIdCard).then(function(resp) {
                    $ionicPopup.alert({
                        title: '加入成功!',
                        template: ''
                    }).then(function() {
                        window.parent.postMessage({
                            func: 'run',
                            params: ['historyBack', []]
                        }, '*')
                    })
                })
            }
        }
    });

    $scope.viewOrderDetail = function() {
        localStorageService.set('orderdetail', this.item);
    }

    $scope.viewDetail = function() {
        $rootScope.remark = this.item.remark.replace(/<img src="/g, '<img src="' + JAVA_URL);
        $rootScope.isJoinIn = this.item.isJoinIn;
    }

    $scope.loginInsurance = function() {
        Serv.loginJumpAllInsurance(window.localStorage.getItem('userId')).then(function(resp) {
            if ($rootScope.isIOS) {
                window.parent.postMessage({
                    func: 'run',
                    params: ['redirect', [resp]]
                }, '*')
            } else
                window.location.href = resp;
        })
    }

})

.controller('DetailCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, $ionicScrollDelegate, Serv, localStorageService) {
    $scope.back = function() {
        window.history.back();
    }

    $scope.joinIn = function() {
        Serv.buyProduct($stateParams.id).then(function(resp) {
            $ionicPopup.alert({
                title: '加入成功！',
                template: ''
            }).then(function() {
                window.history.back();
                window.location.reload();
            });
        })
    }
})

.controller('TaskCtrl', function($scope, $rootScope, $stateParams, $timeout, $ionicPopup, $ionicScrollDelegate, Serv, localStorageService) {
    $scope.back = function() {
        window.history.back();
    }

    $scope.taskList = []
    Serv.hasmore = true;
    Serv.curPage = 1;

    $scope.loadMore = function() {
        $scope.hasLoaded = false;
        //这里使用定时器是为了缓存一下加载过程，防止加载过快
        $timeout(function() {
            if (!Serv.hasmore) {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                return;
            }
            Serv.getTask($stateParams.id, Serv.curPage).then(function(response) {
                $scope.hasLoaded = true;
                Serv.hasmore = response.total / 10 > Serv.curPage;
                for (var i = 0; i < response.rows.length; i++) {
                    response.rows[i].raiseTime = new Date(response.rows[i].raiseTime.replace(/-/g, '/'));
                    response.rows[i].deadTime = new Date(response.rows[i].deadTime.replace(/-/g, '/'));
                    $scope.taskList.push(response.rows[i]);
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
                Serv.curPage++;
            });
        }, 1000);
    };
    $scope.moreDataCanBeLoaded = function() {
        return Serv.hasmore;
    }

    $scope.pay = function(id, amount) {
        var self = this.task;
        $ionicPopup.prompt({
            title: '需要支付 ' + amount + ' 元',
            template: '请输入密码',
            inputType: 'password',
            okText: '确认',
            cancelText: '取消'
        }).then(function(res) {
            if (typeof res != 'undefined') {
                Serv.pay(id, res).then(function(resp) {
                    $ionicPopup.alert({
                        title: '支付成功'
                    }).then(function() {
                        self.status = '1';
                    })
                })
            }
        });
    }
})

.controller('SubCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, $ionicScrollDelegate, Serv, localStorageService) {
    $scope.back = function() {
        window.history.back();
    }
})
