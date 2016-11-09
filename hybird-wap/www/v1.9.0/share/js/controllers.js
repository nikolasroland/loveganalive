'use strict';
angular.module('starter.controllers', [])

.controller('ListCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicListDelegate, $timeout, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        DiscoverServ.reload('13', 1, 10).then(function(resp) {
            $scope.table = resp;
            DiscoverServ.hasmore = resp.total / 10 > 1;
        })

        $scope.loadMore = function() {
            //这里使用定时器是为了缓存一下加载过程，防止加载过快
            $timeout(function() {
                if (!DiscoverServ.hasmore) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                DiscoverServ.reload('00', DiscoverServ.curPage, 10).then(function(response) {
                    DiscoverServ.hasmore = response.total / 10 > DiscoverServ.curPage;
                    for (var i = 0; i < response.rows.length; i++) {
                        $scope.table.rows.push(response.rows[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    DiscoverServ.curPage++;
                });
            }, 1000);
        };
        $scope.moreDataCanBeLoaded = function() {
            return DiscoverServ.hasmore;
        }
        $scope.$on('stateChangeSuccess', function() {
            $scope.loadMore();
        });
        $ionicListDelegate.showReorder(true);
    });
})

.controller('ListDetailCtrl', function($scope, $ionicHistory, $ionicPlatform, $stateParams, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        DiscoverServ.reloadDetail($stateParams.id).then(function(resp) {
            window.document.title = resp.title;
            resp.remark = resp.remark.replace(/<img src="/g, '<img src="' + JAVA_URL);
            $scope.detail = resp;
            $scope.tit = resp.title;
            $scope.link = resp.link;
        })
        DiscoverServ.reloadQRCode().then(function(resp) {
            $scope.qrcodeList = resp;
        })
    });
})
