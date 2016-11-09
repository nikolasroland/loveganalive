'use strict';
angular.module('starter.services', [])

.factory('MainServ', function($http, $q, $ionicPopup, $ionicLoading) {
    function _convertAssistant(rows) {
        var data = [];
        for (var i in rows) {
            data[i] = {};
            data[i].id = rows[i].id;
            data[i].name = rows[i].name;
            data[i].account = rows[i].account;
            data[i].total_rec = rows[i].recommend_reg | 0;
            data[i].total_use = rows[i].recommend_use | 0;
            data[i].today_rec = rows[i].today_recommend_reg | 0;
            data[i].today_reg = rows[i].today_reg | 0;
            data[i].today_use = rows[i].today_use | 0;
            data[i].total_use_rate_rec = rows[i].totay_recommend_reg | 0;
            data[i].today_reg_rate_rec = rows[i].today_reg_recommend | 0;
            data[i].today_use_rate_reg = rows[i].totay_rate | 0;
            data[i].today_use_rate_rec = rows[i].today_use_recommend | 0;
        }
        return data;
    }

    function _convertDoctor(rows) {
        var data = [];
        for (var i in rows) {
            data[i] = {};
            data[i].id = rows[i].id;
            data[i].name = rows[i].name;
            data[i].assistant = rows[i].aidname;
            data[i].total_reg = rows[i].total_reg | 0;
            data[i].total_use = rows[i].total_use | 0;
            data[i].today_reg = rows[i].today_reg | 0;
            data[i].today_use = rows[i].today_use | 0;
            data[i].total_use_rate_reg = rows[i].total_rate | 0;
            data[i].today_use_rate_reg = rows[i].totay_rate | 0;
        }
        return data;
    }

    return {
        hasMore: true,
        curPage: 1,
        curType: 2,
        curDate: 1,
        reload: function(reportsDate, type, page, nocover) {
            var deferred = $q.defer();
            if (!nocover)
                $ionicLoading.show();
            $http.post(JAVA_URL + 'reports/reportsStatisticsLogin/findAppStatisticsLogin.htm', {
                    reportsDate: reportsDate,
                    type: type,
                    rows: 9999,
                    page: page,
                    sign: '815ddaef3fb9f020918c29735e10db72'
                })
                .success(function(resp) {
                    if (resp.code == "0") {
                        var result = {};
                        result.total = resp.data.total;
                        result.rows = type == 1 ? _convertDoctor(resp.data.rows) : _convertAssistant(resp.data.rows);
                        deferred.resolve(result);
                        $ionicLoading.hide();
                    } else {
                        $ionicPopup.alert({
                            title: '服务器连接失败',
                            template: ''
                        });
                        $ionicLoading.hide();
                    }
                })
                .error(function(resp) {
                    $ionicPopup.alert({
                        title: '服务器连接失败',
                        template: ''
                    });
                    $ionicLoading.hide();
                })
            return deferred.promise;
        },
        update: function(id, recommendReg, today_rec, totayRecommendReg, todayRegRecommend, totayRate, todayUseRecommend) {
            var deferred = $q.defer();
            $ionicLoading.show();
            $http.post(JAVA_URL + 'reports/reportsStatisticsLogin/updateReportsStatisticsLoginList.htm', {
                    id: id,
                    recommendReg: recommendReg,
                    todayRecommendReg: today_rec,
                    totayRecommendReg: totayRecommendReg,
                    todayRegRecommend: todayRegRecommend,
                    totayRate: totayRate,
                    todayUseRecommend: todayUseRecommend,
                    sign: 'fa763b5ec7b18d5aa8388cc32f6c7ef7'
                })
                .success(function(resp) {
                	console.log(resp)
                    if (resp.code == "0") {
                        deferred.resolve(resp.data);
                        $ionicLoading.hide();
                    } else {
                        $ionicPopup.alert({
                            title: '服务器连接失败',
                            template: ''
                        });
                        $ionicLoading.hide();
                    }
                })
                .error(function(resp) {
                	console.log(resp)
                    $ionicPopup.alert({
                        title: '服务器连接失败',
                        template: ''
                    });
                    $ionicLoading.hide();
                })
            return deferred.promise;
        }
    }
})
