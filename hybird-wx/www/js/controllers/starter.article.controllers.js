var startCtrl = angular.module('starter.article.controllers', [])

startCtrl.controller('articleCtrl', function($scope, $rootScope, $ionicHistory, $ionicPlatform, $ionicListDelegate, $timeout, $http, articleservice) {
    if (!window.localStorage.getItem('loginState')) {
        $rootScope.openLoginModal();
        return;
    }

    var auth = window.localStorage.getItem("auth"),
        hasLoaded = false;
    $scope.table = [];
    $scope.loadMore = function() {
        //这里使用定时器是为了缓存一下加载过程，防止加载过快
        $timeout(function() {
            if (!articleservice.hasmore) {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                return;
            } //如果加载完成，无限滚动条出现
            articleservice.reloadPhp(auth, 1, articleservice.curPage, 10).then(function(response) {
                hasLoaded = true;
                articleservice.hasmore = response.pageinfo.total_page > articleservice.curPage;
                for (var i = 0; i < response.list.length; i++) {
                    $scope.table.push(response.list[i]);
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
                articleservice.curPage++;
            });
        }, 1000);
    };
    $scope.moreDataCanBeLoaded = function() {
        return articleservice.hasmore;
    }
    $scope.$on('stateChangeSuccess', function() {
        $scope.loadMore();
    });
})


startCtrl.controller('articleDetailCtrl', function($scope, $location, $stateParams, articledetailservice) {
    if (!window.localStorage.getItem('loginState')) {
        $rootScope.openLoginModal();
        return;
    }
    var auth = window.localStorage.getItem('auth');
    var id = window.localStorage.getItem('id');
    articledetailservice.reloadDetailPhp(auth, $stateParams.id).then(function(resp) {
        $scope.detail = resp;
        $scope.tit = resp.info.title;

    });
})
