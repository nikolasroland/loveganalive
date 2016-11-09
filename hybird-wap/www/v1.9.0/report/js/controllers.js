'use strict';
angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, $http, $ionicPopup, $timeout, $ionicListDelegate, MainServ) {
    var today, curDate;
    curDate = today = $scope.curDate = (new Date(Date.now() - (3600 * 24 * 1000))).format('yyyy-MM-dd');
    MainServ.curDate = curDate;

    $scope.end = true;

    $scope.nextDay = function(date) {
        curDate = new Date(date)
        $scope.curDate = curDate = new Date(curDate.setDate(curDate.getDate() + 1)).format('yyyy-MM-dd');
        if (new Date(curDate) >= new Date(today)) $scope.end = true;

        MainServ.reload(curDate, 2, 1).then(function(resp) {
            $scope.assistant_total = resp.total;
            $scope.assistant_rows = resp.rows;
            $scope.assistant_page = 1;
            $scope.assistant_hasMore = Math.ceil(resp.total / 9999) > 1;
        });

    }

    $scope.prevDay = function(date) {
        curDate = new Date(date)
        $scope.curDate = curDate = new Date(curDate.setDate(curDate.getDate() - 1)).format('yyyy-MM-dd');
        $scope.end = false;
        MainServ.reload(curDate, 2, 1).then(function(resp) {
            $scope.assistant_total = resp.total;
            $scope.assistant_rows = resp.rows;
            $scope.assistant_page = 1;
            $scope.assistant_hasMore = Math.ceil(resp.total / 9999) > 1;
        });
    }

    MainServ.reload(curDate, 2, 1).then(function(resp) {
        $scope.assistant_total = resp.total;
        $scope.assistant_rows = resp.rows;
        $scope.assistant_page = 1;
        $scope.assistant_hasMore = Math.ceil(resp.total / 9999) > 1;
    });


    /*$scope.resizeScroll = function(type, page, hasMore) {
        MainServ.curType = type;
        MainServ.curPage = page;
        MainServ.hasMore = hasMore;
        $scope.$broadcast('scroll.resize');
    }*/

    $scope.doRefresh = function() {
        MainServ.reload(MainServ.curDate, MainServ.curType, 1).then(function(resp) {
            if (MainServ.curType == 1) {
                $scope.doctor_total = resp.total;
                $scope.doctor_rows = resp.rows;
                $scope.doctor_page = MainServ.curPage = 1;
                $scope.doctor_hasMore = MainServ.hasMore = Math.ceil(resp.total / 20) > 1;
            } else {
                $scope.assistant_total = resp.total;
                $scope.assistant_rows = resp.rows;
                $scope.assistant_page = MainServ.curPage = 1;
                $scope.assistant_hasMore = MainServ.hasMore = Math.ceil(resp.total / 20) > 1;
            }
            $scope.$broadcast('scroll.refreshComplete');
        })
    }

    $scope.editTodayRec = function(item) {
        item.recommendReg = item.total_use + item.today_rec;
        item.totayRecommendReg = (item.total_use / item.total_rec * 100).toFixed(2) | 0 + '%';
        item.todayRegRecommend = (item.today_reg / item.today_rec * 100).toFixed(2) | 0 + '%';
        item.totayRate = (item.today_use / item.today_reg * 100).toFixed(2) | 0 + '%';
        item.todayUseRecommend = (item.today_use / item.today_rec * 100).toFixed(2) | 0 + '%';
    }

    $scope.edit = function(name, date, item) {
        $ionicPopup.prompt({
            title: '修改' + date + '个管师：' + name + '的推荐数量',
            okText: '确认',
            cancelText: '取消'
        }).then(function(res) {
            if (typeof res != 'undefined') {
                item.today_rec = parseInt(res);
                item.recommendReg = item.total_use + item.today_rec;
                item.totayRecommendReg = ((item.total_use + item.today_rec) / item.total_rec * 100).toFixed(2) | 0 + '%';
                item.todayRegRecommend = (item.today_reg / item.today_rec * 100).toFixed(2) | 0 + '%';
                item.totayRate = (item.today_use / item.today_reg * 100).toFixed(2) | 0 + '%';
                item.todayUseRecommend = (item.today_use / item.today_rec * 100).toFixed(2) | 0 + '%';

                console.log(item.id, item.recommendReg, item.today_rec, item.totayRecommendReg, item.todayRegRecommend, item.totayRate, item.todayUseRecommend)

                MainServ.update(item.id, item.recommendReg, item.today_rec, item.totayRecommendReg, item.todayRegRecommend, item.totayRate, item.todayUseRecommend).then(function(resp) {
                    $ionicPopup.alert({
                        title: "修改成功",
                        template: ""
                    })
                })
            }
        });
    }

    $scope.updateTodayRec = function(name, date, id, recommendReg, today_rec, totayRecommendReg, todayRegRecommend, totayRate, todayUseRecommend) {
        console.log(name, date, id, recommendReg, today_rec, totayRecommendReg, todayRegRecommend, totayRate, todayUseRecommend)
        $ionicPopup.prompt({
            title: '修改' + date + '个管师：' + name + '的推荐数量',
            okText: '确认',
            cancelText: '取消'
        }).then(function(res) {
            if (typeof res != 'undefined') {
                MainServ.update(id, recommendReg, today_rec, totayRecommendReg, todayRegRecommend, totayRate, todayUseRecommend).then(function(resp) {
                    $ionicPopup.alert({
                        title: "修改成功",
                        template: ""
                    })
                })
            }
        });
    }

    /*$scope.loadMore = function() {
        //这里使用定时器是为了缓存一下加载过程，防止加载过快
        $timeout(function() {
            if (!MainServ.hasMore) {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                return;
            }
            MainServ.reload(MainServ.curDate, MainServ.curType, MainServ.curPage, true).then(function(response) {
                MainServ.hasMore = Math.ceil(response.total / 20) > MainServ.curPage;

                if (MainServ.curType == 1) {
                    for (var i = 0; i < response.rows.length; i++) {
                        $scope.doctor_rows.push(response.rows[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    MainServ.curPage++;
                    $scope.doctor_page = MainServ.curPage;
                    $scope.doctor_hasMore = MainServ.hasMore;
                } else {
                    for (var i = 0; i < response.rows.length; i++) {
                        $scope.assistant_rows.push(response.rows[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    MainServ.curPage++;
                    $scope.assistant_page = MainServ.curPage;
                    $scope.assistant_hasMore = MainServ.hasMore;
                }
            });
        }, 1000);
    };
    $scope.hasMore = function() {
        return MainServ.hasMore;
    }
    $scope.$on('stateChangeSuccess', function() {
        $scope.loadMore();
    });
    $ionicListDelegate.showReorder(true);*/
})
