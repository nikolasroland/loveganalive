'use strict';
angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope) {
    umengLog('DoctorView', 'HomeController');
})

.controller('PatientsCtrl', function($scope, $timeout, $ionicListDelegate, $ionicPopup, PatientServ) {
    umengLog('DoctorView', 'PatientsController');
    PatientServ.load().then(function(resp) {
        $scope.patientList = resp;
    })

    $scope.resizeScroll = function() {
        $scope.$broadcast('scroll.resize');
    }

    $scope.doRefresh = function() {
        umengLog('DoctorEvent', 'PatientsRefresh');
        PatientServ.reload().then(function(resp) {
            $scope.patientList = resp;
            $scope.$broadcast('scroll.refreshComplete');
        })
    }

    $scope.startChat = function(id, name) {
        umengLog('DoctorClick', 'ChatWithPatient');
        if (ionic.Platform.isAndroid())
            Device.startChat(id, name);
        else if (ionic.Platform.isIOS())
            window.location.href = 'ios://startChart/' + id + '/' + name;
    }

    $scope.viewHistory = function(e, id) {
        umengLog('DoctorClick', 'ViewPatientHistory');
        e.stopPropagation();
        e.preventDefault();
        if (ionic.Platform.isAndroid())
            Device.viewHistory(id);
        else if (ionic.Platform.isIOS())
            window.location.href = 'ios://viewHistory/' + id;
        return false;
    }

    $scope.setAttention = function(e, id) {
        umengLog('DoctorSubmit', 'SetAttentionPatient');
        e.stopPropagation();
        e.preventDefault();
        PatientServ.setAttention(id).then(function(resp) {
            $ionicPopup.alert({
                title: '已添加关注',
                template: ''
            }).then(function() {
                PatientServ.load().then(function(resp) {
                    $scope.patientList = resp;
                })
            });
        })
        return false;
    }

    $scope.cancelAttention = function(e, id) {
        umengLog('DoctorSubmit', 'CancelAttentionPatient');
        e.stopPropagation();
        e.preventDefault();
        PatientServ.cancelAttention(id).then(function(resp) {
            $ionicPopup.alert({
                title: '已取消关注',
                template: ''
            }).then(function() {
                PatientServ.load().then(function(resp) {
                    $scope.patientList = resp;
                })
            });
        })
        return false;
    }
})

.controller('ReservationCtrl', function($scope, $ionicPopup, ReservationServ) {
    umengLog('DoctorView', 'ReservationController');
    ReservationServ.reload().then(function(resp) {
        $scope.reservationList = resp;

        $scope.msg00 = '暂无待确认预约记录';
        $scope.msg01 = '暂无已确认预约记录';
        for (var i in resp) {
            if (resp[i].status == '00')
                $scope.msg00 = '';
            else if (resp[i].status == '01')
                $scope.msg01 = '';
        }
    })

    $scope.resizeScroll = function() {
        $scope.$broadcast('scroll.resize');
    }

    $scope.doRefresh = function() {
        umengLog('DoctorEvent', 'ReservationRefresh');
        ReservationServ.reload().then(function(resp) {
            $scope.reservationList = resp;

            $scope.msg00 = '暂无待确认预约记录';
            $scope.msg01 = '暂无已确认预约记录';
            for (var i in resp) {
                if (resp[i].status == '00')
                    $scope.msg00 = '';
                else if (resp[i].status == '01')
                    $scope.msg01 = '';
            }

            $scope.$broadcast('scroll.refreshComplete');
        })
    }

    $scope.viewHistory = function(e, id) {
        umengLog('DoctorClick', 'ViewPatientHistory');
        e.stopPropagation();
        e.preventDefault();
        if (ionic.Platform.isAndroid())
            Device.viewHistory(id);
        else if (ionic.Platform.isIOS())
            window.location.href = 'ios://viewHistory/' + id;
        return false;
    }

    $scope.applyReserv = function(id) {
        umengLog('DoctorSubmit', 'ApplyPatientReservation');
        ReservationServ.applyReserv(id).then(function(resp) {
            $ionicPopup.alert({
                title: '已同意本次预约',
                template: ''
            }).then(function() {
                ReservationServ.load().then(function(resp) {
                    $scope.reservationList = resp;

                    $scope.msg00 = '暂无待确认预约记录';
                    $scope.msg01 = '暂无已确认预约记录';
                    for (var i in resp) {
                        if (resp[i].status == '00')
                            $scope.msg00 = '';
                        else if (resp[i].status == '01')
                            $scope.msg01 = '';
                    }
                })
            })
        })
    }

    $scope.rejectReserv = function(id, index) {
        $ionicPopup.confirm({
            title: '提示',
            template: '确定要取消预约吗，预约一但取消不可恢复',
            okText: '确定',
            cancelText: '取消'
        }).then(function(res) {
            if (res) {
                umengLog('DoctorSubmit', 'RejectPatientReservation');
                ReservationServ.rejectReserv(id).then(function(resp) {
                    $ionicPopup.alert({
                        title: '已取消本次预约',
                        template: ''
                    }).then(function() {
                        ReservationServ.load().then(function(resp) {
                            $scope.reservationList = resp;

                            $scope.msg00 = '暂无待确认预约记录';
                            $scope.msg01 = '暂无已确认预约记录';
                            for (var i in resp) {
                                if (resp[i].status == '00')
                                    $scope.msg00 = '';
                                else if (resp[i].status == '01')
                                    $scope.msg01 = '';
                            }
                        })
                    })
                })
            }
        })
    }
})

.controller('DoctorInfoCtrl', function($scope, $rootScope, $ionicListDelegate, $ionicHistory, $timeout, DoctorServ, CommentServ) {
    umengLog('DoctorView', 'DoctorInfoController');
    DoctorServ.reload().then(function(resp) {
        $rootScope.doctor = resp;
        CommentServ.reload(resp.userid, CommentServ.curPage).then(function(comment) {
            $scope.comment = comment;
            CommentServ.hasmore = comment.pagecount > CommentServ.curPage;
        });

        $scope.loadMore = function() {
            //这里使用定时器是为了缓存一下加载过程，防止加载过快
            $timeout(function() {
                if (!CommentServ.hasmore) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                CommentServ.reload(resp.userid, CommentServ.curPage).then(function(response) {
                    CommentServ.hasmore = response.pagecount > CommentServ.curPage;
                    for (var i = 0; i < response.list.length; i++) {
                        $scope.comment.list.push(response.list[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    CommentServ.curPage++;
                });
            }, 1000);
        };
        $scope.moreDataCanBeLoaded = function() {
            return CommentServ.hasmore;
        }
        $scope.$on('stateChangeSuccess', function() {
            $scope.loadMore();
        });
        $ionicListDelegate.showReorder(true);
    });

    $scope.isAndroid = ionic.Platform.isAndroid();
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;

    $scope.historyBack = function() {
        if (ionic.Platform.isAndroid()) {
            Device.historyBack();
        } else if (ionic.Platform.isIOS()) {
            window.location.href = "ios://historyBack";
        }
    }
})

.controller('CasemanagerCtrl', function($scope, $rootScope, $ionicHistory, $ionicListDelegate, $timeout, CasemanagerServ, CommentServ) {
    umengLog('CasemanagerView', 'CasemanagerController');
    CasemanagerServ.reload().then(function(resp) {
        $rootScope.casemanager = resp.zhuli;
        CommentServ.reload(resp.zhuli.userid, CommentServ.curPage).then(function(comment) {
            $scope.comment = comment;
            CommentServ.hasmore = comment.pagecount > CommentServ.curPage;
        });

        $scope.loadMore = function() {
            //这里使用定时器是为了缓存一下加载过程，防止加载过快
            $timeout(function() {
                if (!CommentServ.hasmore) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                CommentServ.reload(resp.zhuli.userid, CommentServ.curPage).then(function(response) {
                    CommentServ.hasmore = response.pagecount > CommentServ.curPage;
                    for (var i = 0; i < response.list.length; i++) {
                        $scope.comment.list.push(response.list[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    CommentServ.curPage++;
                });
            }, 1000);
        };
        $scope.moreDataCanBeLoaded = function() {
            return CommentServ.hasmore;
        }
        $scope.$on('stateChangeSuccess', function() {
            $scope.loadMore();
        });
        $ionicListDelegate.showReorder(true);
    });

    $scope.isAndroid = ionic.Platform.isAndroid();
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;

    $scope.historyBack = function() {
        if (ionic.Platform.isAndroid()) {
            Device.historyBack();
        } else if (ionic.Platform.isIOS()) {
            window.location.href = "ios://historyBack";
        }
    }
})

.controller('VisitCtrl', function($scope, $ionicPopup, $ionicHistory, DoctorServ) {
    umengLog('DoctorView', 'VisitController');
    var today = Date.now(),
        day = [];
    var distance = new Date().getDay() - 1;
    distance = distance == -1 ? 6 : distance;
    $scope.weekday = distance + 1;
    $scope.afternoon = new Date().getHours() > 12;
    $scope.this_weeks = [];
    $scope.next_weeks = [];
    day[0] = new Date(today + (3600 * 24 * (0 - distance) * 1000)).format('MM月dd日');
    day[1] = new Date(today + (3600 * 24 * (6 - distance) * 1000)).format('dd日');
    day[2] = new Date(today + (3600 * 24 * (7 - distance) * 1000)).format('MM月dd日');
    day[3] = new Date(today + (3600 * 24 * (13 - distance) * 1000)).format('dd日');

    $scope.week1 = day[0] + '~' + day[1];
    $scope.week2 = day[2] + '~' + day[3];

    DoctorServ.reload().then(function(resp) {
        $scope.doctor = resp;
        DoctorServ.querySchedule(resp.userid).then(function(resp) {
            $scope.schedule = resp.data;
            $scope.this_weeks = resp.data.this_weeks.split('|');
            $scope.next_weeks = resp.data.next_weeks.split('|');
        })
    });

    $scope.setThisWeek = function(i, amOrPm) {
        if ($scope.weekday > i || ($scope.weekday == i && amOrPm == 0) || ($scope.weekday == i && $scope.afternoon)) {
            $ionicPopup.alert({
                title: '此刻已过期',
                template: ''
            })
            return false;
        }

        var state = $scope.this_weeks[i - 1];
        var value = '1';
        switch (state.split(',')[amOrPm]) {
            case '0':
                value = '1';
                break;
            case '1':
                value = '0';
                break;
            case '2':
                $ionicPopup.alert({
                    title: '此刻已有患者预约',
                    template: ''
                })
                return false;
                break;
            case '3':
                if ($scope.schedule.limitPeoples === 0) {
                    value = '0';
                } else {
                    $ionicPopup.alert({
                        title: '此刻已有患者预约',
                        template: ''
                    })
                    return false;
                }
                break;
            case '4':
                $ionicPopup.alert({
                    title: '此刻已过期',
                    template: ''
                })
                return false;
                break;
        }
        if (amOrPm == 0) {
            $scope.this_weeks[i - 1] = value + state.substr(1);
        } else {
            $scope.this_weeks[i - 1] = state.substr(0, 2) + value;
        }
        $scope.schedule.this_weeks = $scope.this_weeks.join('|');
    }

    $scope.setNextWeek = function(i, amOrPm) {
        var state = $scope.next_weeks[i - 1];
        var value = '1';
        switch (state.split(',')[amOrPm]) {
            case '0':
                value = '1';
                break;
            case '1':
                value = '0';
                break;
            case '2':
                $ionicPopup.alert({
                    title: '此刻已有患者预约',
                    template: ''
                })
                return false;
                break;
            case '3':
                if ($scope.schedule.limitPeoples === 0) {
                    value = '0';
                } else {
                    $ionicPopup.alert({
                        title: '此刻已有患者预约',
                        template: ''
                    })
                    return false;
                }
                break;
            case '4':
                $ionicPopup.alert({
                    title: '此刻已过期',
                    template: ''
                })
                return false;
                break;
        }
        if (amOrPm == 0) {
            $scope.next_weeks[i - 1] = value + state.substr(1);
        } else {
            $scope.next_weeks[i - 1] = state.substr(0, 2) + value;
        }
        $scope.schedule.next_weeks = $scope.next_weeks.join('|');
    }

    $scope.setVisit = function(doctorid, username, nickname, limit, price) {
        umengLog('DoctorSubmit', 'SetVisitSettings');
        DoctorServ.updateVisit(doctorid, username, nickname, limit, price, $scope.schedule.this_weeks.replace(/[1-9]/g, '1'), $scope.schedule.next_weeks.replace(/[1-9]/g, '1')).then(function(resp) {
            $ionicPopup.alert({
                title: '设置成功!',
                template: ''
            }).then(function() {
                window.history.back();
            })
        })
    }
    $scope.isAndroid = ionic.Platform.isAndroid();
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;

    $scope.historyBack = function() {
        if (ionic.Platform.isAndroid()) {
            Device.historyBack();
        } else if (ionic.Platform.isIOS()) {
            window.location.href = "ios://historyBack";
        }
    }

})

.controller('EarningCtrl', function($scope, $ionicHistory, DoctorServ, EarningServ) {
    umengLog('DoctorView', 'EarningController');
    // x轴坐标根据月份获取当月天数
    var _getCountDays = function(date, isCurMonth) {
        var curDate = new Date(date),
            countDays = 0,
            days = [];
        if (isCurMonth) {
            var curDays = (new Date()).getDate();
            countDays = curDays < 7 ? 7 : curDays;
        } else {
            curDate.setMonth(curDate.getMonth() + 1);
            curDate.setDate(0);
            countDays = curDate.getDate();
        }

        for (var i = 1; i <= countDays; i++) {
            days.push(i);
        }
        return days;
    }

    // y轴坐标五等分
    var _getQuarters = function(maxNum) {
        maxNum = maxNum > 100 ? maxNum : 100;
        var quarters = [];

        for (var i = 4; i > 0; i--) {
            quarters.push(maxNum / 4 * i);
        }
        return quarters;
    }

    // 绘制图表
    var _drawChat = function(days, tradeAmount, amount) {
        var STARTPOINT = 0,
            ENDPOINT = 200.5,
            CHARTHEIGHT = 160,
            obj = {},
            arr = [],
            points = [],
            x = 0,
            y = 0,
            str = '';
        for (var i in tradeAmount) {
            var day = (new Date(tradeAmount[i].date)).getDate();
            obj[day] = tradeAmount[i].tradeAmount;
        }

        for (var i = 1; i <= days.length; i++) {
            y = (typeof obj[i] === 'undefined') ? ENDPOINT : (ENDPOINT - ((obj[i] / amount) * CHARTHEIGHT));

            var everyPoint = {
                'x': x,
                'y': y
            }
            points.push(everyPoint);

            if (i != days.length)
                x += 40;
            arr.push(y + 'L' + x);
        }

        points.splice(0, 1);
        $scope.points = points;
        str = arr.join(',');

        return 'M' + STARTPOINT + ',' + str;
    }

    // 按月加载交易数据
    var _loadTradeAmount = function(monthFormated) {
        $scope.pointShow = false;
        $scope.month = monthFormated;
        $scope.end = new Date(monthFormated) >= new Date((new Date()).format('yyyy-MM'));
        $scope.days = _getCountDays(monthFormated, $scope.end);
        $scope.svgWidth = $scope.days.length * 40;

        EarningServ.reloadTradeAmount($scope.doctor.userid, $scope.doctor.username, monthFormated).then(function(resp) {
            var curAmount = 0,
                curMax = 0;
            $scope.tradeAmount = resp;
            for (var i in resp) {
                curAmount += resp[i].tradeAmount;
                curMax = resp[i].tradeAmount > curMax ? resp[i].tradeAmount : curMax;
            }
            curMax = Math.ceil(curMax / 100) * 100;
            $scope.curAmount = curAmount;
            $scope.quarters = _getQuarters(curMax);
            $scope.path = _drawChat($scope.days, $scope.tradeAmount, curMax);

        }).then(function() {
            EarningServ.reloadSubjectAmount($scope.doctor.userid, $scope.doctor.username, monthFormated).then(function(resp) {
                var subjectAmount = {};
                for (var i in resp) {
                    subjectAmount[resp[i].subjectName] = resp[i].tradeAmount;
                }
                $scope.subjectAmount = subjectAmount;
            })
        })
    }

    // 加载医生信息
    DoctorServ.reload().then(function(resp) {
        $scope.doctor = resp;
        // 取当月的交易总和
        _loadTradeAmount((new Date()).format('yyyy-MM'));
    })

    // 鼠标点击显示金额
    $scope.showPoint = function(i, x, y) {
        if (typeof $scope.tradeAmount[i + 1] === 'undefined')
            return;
        $scope.pointShow = true;
        $scope.curPoint = {
            earning: $scope.tradeAmount[i + 1].tradeAmount,
            top: y - 40,
            left: x
        }
    }


    // 取前一月的交易总和
    $scope.prevMonth = function(date) {
        umengLog('DoctorClick', 'ViewPrevMonth');
        var _viewMonth = new Date(date),
            _viewMonthFormated = '';
        _viewMonth.setMonth(_viewMonth.getMonth() - 1);
        _viewMonthFormated = (new Date(_viewMonth)).format('yyyy-MM');
        _loadTradeAmount(_viewMonthFormated);
    }

    // 取下一月的交易总和
    $scope.nextMonth = function(date) {
        umengLog('DoctorClick', 'ViewNextMonth');
        var _viewMonth = new Date(date),
            _viewMonthFormated = '';
        _viewMonth.setMonth(_viewMonth.getMonth() + 1);
        _viewMonthFormated = (new Date(_viewMonth)).format('yyyy-MM');
        _loadTradeAmount(_viewMonthFormated);
    }

    $scope.isAndroid = ionic.Platform.isAndroid();
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;

    $scope.historyBack = function() {
        if (ionic.Platform.isAndroid()) {
            Device.historyBack();
        } else if (ionic.Platform.isIOS()) {
            window.location.href = "ios://historyBack";
        }
    }
})

.controller('EarningDetailCtrl', function($scope, $stateParams, DoctorServ, EarningServ) {
    umengLog('DoctorView', 'EarningDetailController');
    switch ($stateParams.subject) {
        case 'basics':
            $scope.icon = 'amount-img icon ion-cube yellow';
            $scope.title = '基础';
            break;
        case 'interaction':
            $scope.icon = 'amount-img icon ion-chatbubble-working balanced';
            $scope.title = '互动';
            break;
        case 'appointment':
            $scope.icon = 'amount-img icon ion-ios-time calm';
            $scope.title = '预约';
            break;
        case 'reward':
            $scope.icon = 'amount-img icon ion-ios-heart assertive';
            $scope.title = '打赏';
            break;
    }
    DoctorServ.reload().then(function(resp) {
        EarningServ.reloadSubjectDetail(resp.userid, resp.username, $stateParams.subject, $stateParams.month).then(function(resp) {
            $scope.subjectDetail = resp;
        })
    })
})

.controller('DoctorInfoByIdCtrl', function($scope, $stateParams, $timeout, $ionicHistory, $ionicListDelegate, DoctorServ, CommentServ) {
    umengLog('DoctorView', 'DoctorInfoByIdController');
    DoctorServ.reloadById($stateParams.id).then(function(resp) {
        $scope.doctor = resp;
        CommentServ.reload(resp.userid, CommentServ.curPage).then(function(comment) {
            $scope.comment = comment;
            CommentServ.hasmore = comment.pagecount > CommentServ.curPage;
        });

        $scope.loadMore = function() {
            //这里使用定时器是为了缓存一下加载过程，防止加载过快
            $timeout(function() {
                if (!CommentServ.hasmore) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                CommentServ.reload(resp.userid, CommentServ.curPage).then(function(response) {
                    CommentServ.hasmore = response.pagecount > CommentServ.curPage;
                    for (var i = 0; i < response.list.length; i++) {
                        $scope.comment.list.push(response.list[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    CommentServ.curPage++;
                });
            }, 1000);
        };
        $scope.moreDataCanBeLoaded = function() {
            return CommentServ.hasmore;
        }
        $scope.$on('stateChangeSuccess', function() {
            $scope.loadMore();
        });
        $ionicListDelegate.showReorder(true);
    })

    $scope.isAndroid = ionic.Platform.isAndroid();
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;

    $scope.historyBack = function() {
        if (ionic.Platform.isAndroid()) {
            Device.historyBack();
        } else if (ionic.Platform.isIOS()) {
            window.location.href = "ios://historyBack";
        }
    }
})

.controller('DoctorInfoEditCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, $location, DoctorServ) {
    umengLog('DoctorView', 'DoctorInfoEditController');
    DoctorServ.reloadById($stateParams.id).then(function(resp) {
        $scope.doctor = resp;
    })

    $scope.updateDoctorInfo = function(profession, adept, intro) {
        umengLog('DoctorSubmit', 'UpdateDoctorInfo');
        DoctorServ.updateDoctorInfo(profession, adept, intro).then(function(resp) {
            $ionicPopup.alert({
                title: '提示',
                template: '修改成功'
            }).then(function() {
                $rootScope.doctor.profession = profession;
                $rootScope.doctor.adept = adept;
                $rootScope.doctor.intro = intro;
                window.history.back();
            })
        });
    }
})

.controller('QaCtrl', function($scope, $ionicHistory, QaServ) {
    umengLog('DoctorView', 'QaController');
    QaServ.reload().then(function(resp) {
        $scope.qaList = resp.list;
    })

    $scope.isAndroid = ionic.Platform.isAndroid();
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;

    $scope.historyBack = function() {
        if (ionic.Platform.isAndroid()) {
            Device.historyBack();
        } else if (ionic.Platform.isIOS()) {
            window.location.href = "ios://historyBack";
        }
    }
})

.controller('QaDetailCtrl', function($scope, $stateParams, QaServ) {
    umengLog('DoctorView', 'QaDetailController');
    $scope.location = 'http://ag.furuihui.com/article.php?id=' + $stateParams.id;
})

.controller('CustomerServiceCtrl', function($scope) {
    umengLog('DoctorView', 'CustomerServiceController');

})

.controller('MeCtrl', function($scope) {
    umengLog('DoctorView', 'MeController');
})
