'use strict';
angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope) {
    umengLog('AssistantView', 'HomeController');
})

.controller('InfoCtrl', function($scope, $rootScope, $ionicListDelegate, $timeout, $ionicHistory, CaseManagerServ, CommentServ) {
    umengLog('AssistantView', 'InfoController');
    CaseManagerServ.reload().then(function(resp) {
        $rootScope.casemanager = resp;
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

.controller('PatientsCtrl', function($scope, $location, DoctorServ) {
    umengLog('AssistantView', 'PatientsController');
    DoctorServ.loadUseIn().then(function(resp) {
        $scope.doctorList = resp;
    })

    $scope.doRefresh = function() {
        umengLog('AssistantEvent', 'PatientsRefresh');
        DoctorServ.reloadUseIn().then(function(resp) {
            $scope.doctorList = resp;
            $scope.$broadcast('scroll.refreshComplete');
        })
    }

    $scope.viewInfo = function(e, id) {
        umengLog('AssistantClick', 'ViewDoctorInfo');
        e.stopPropagation();
        e.preventDefault();
        window.location.href = "#tab/me/doctor-info/" + id
        return false;
    }
})

.controller('PatientsListCtrl', function($scope, $stateParams, DoctorServ) {
    umengLog('AssistantView', 'PatientsListController');
    DoctorServ.loadPatients($stateParams.id).then(function(resp) {
        $scope.patientList = resp;
    })

    $scope.doRefresh = function() {
        umengLog('AssistantEvent', 'PatientsRefresh');
        DoctorServ.reloadPatients($stateParams.id).then(function(resp) {
            $scope.patientList = resp;
            $scope.$broadcast('scroll.refreshComplete');
        })
    }

    $scope.startChat = function(id, name) {
        umengLog('AssistantClick', 'ChatWithPatient');
        if (ionic.Platform.isAndroid())
            Device.startChat(id, name);
        else if (ionic.Platform.isIOS())
            window.location.href = 'ios://startChart/' + id + '/' + name;
    }

    $scope.viewHistory = function(e, id) {
        umengLog('AssistantClick', 'ViewPatientHistory');
        e.stopPropagation();
        e.preventDefault();
        if (ionic.Platform.isAndroid())
            Device.viewHistory(id);
        else if (ionic.Platform.isIOS())
            window.location.href = 'ios://viewHistory/' + id;
        return false;
    }

})

.controller('ReservationCtrl', function($scope, DoctorServ) {
    umengLog('AssistantView', 'ReservationController');
    DoctorServ.loadUseIn().then(function(resp) {
        $scope.doctorList = resp;
    })

    $scope.doRefresh = function() {
        umengLog('AssistantEvent', 'DoctorUseInRefresh');
        DoctorServ.reloadUseIn().then(function(resp) {
            $scope.doctorList = resp;
            $scope.$broadcast('scroll.refreshComplete');
        })
    }

    $scope.viewInfo = function(e, id) {
        umengLog('AssistantClick', 'ViewDoctorInfo');
        e.stopPropagation();
        e.preventDefault();
        window.location.href = "#tab/me/doctor-info/" + id
        return false;
    }
})

.controller('ReservationListCtrl', function($scope, $stateParams, DoctorServ) {
    umengLog('AssistantView', 'ReservationListController');
    DoctorServ.reloadReservation($stateParams.id).then(function(resp) {
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

    $scope.doRefresh = function() {
        umengLog('AssistantEvent', 'ReservationListRefresh');
        DoctorServ.reloadReservation($stateParams.id).then(function(resp) {
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

    $scope.startChat = function(id, name) {
        umengLog('AssistantClick', 'ChatWithPatient');
        if (ionic.Platform.isAndroid())
            Device.startChat(id, name);
        else if (ionic.Platform.isIOS())
            window.location.href = 'ios://startChart/' + id + '/' + name;
    }

    $scope.viewHistory = function(e, id) {
        umengLog('AssistantClick', 'ViewPatientHistory');
        e.stopPropagation();
        e.preventDefault();
        if (ionic.Platform.isAndroid())
            Device.viewHistory(id);
        else if (ionic.Platform.isIOS())
            window.location.href = 'ios://viewHistory/' + id;
        return false;
    }

})

.controller('DoctorsCtrl', function($scope, $ionicHistory, DoctorServ) {
    umengLog('AssistantView', '医生信息控制器');
    DoctorServ.load().then(function(resp) {
        $scope.doctorList = resp;
    })
    DoctorServ.loadUseIn().then(function(resp) {
        $scope.userInDoctorList = resp;
    })

    $scope.doRefresh = function() {
        umengLog('AssistantEvent', 'DoctorsRefresh');
        DoctorServ.reload().then(function(resp) {
            $scope.doctorList = resp;
            $scope.$broadcast('scroll.refreshComplete');
        })
        DoctorServ.reloadUseIn().then(function(resp) {
            $scope.userInDoctorList = resp;
            $scope.$broadcast('scroll.refreshComplete');
        })
    }

    $scope.startChat = function(id, name) {
        umengLog('AssistantClick', 'ChatWithDoctor');
        if (ionic.Platform.isAndroid())
            Device.startChat(id, name);
        else if (ionic.Platform.isIOS())
            window.location.href = 'ios://startChart/' + id + '/' + name;
    }

    $scope.startGroupChat = function(id, name) {
        umengLog('AssistantClick', 'ChatWithDoctorGroup');
        if (ionic.Platform.isAndroid())
            Device.startGroupChat(id, name);
        else if (ionic.Platform.isIOS())
            window.location.href = 'ios://startGroupChat/' + id + '/' + name;
    }

    $scope.viewInfo = function(e, id) {
        umengLog('AssistantClick', 'ViewDoctorInfo');
        e.stopPropagation();
        e.preventDefault();
        window.location.href = "#tab/me/doctor-info/" + id
        return false;
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

.controller('DoctorInfoCtrl', function($scope, $rootScope, $stateParams, $timeout, $ionicListDelegate, $ionicHistory, DoctorServ, CommentServ) {
    umengLog('AssistantView', 'DoctorInfoController');
    DoctorServ.reloadById($stateParams.id).then(function(resp) {
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

.controller('DoctorInfoEditCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, DoctorServ) {
    umengLog('AssistantView', 'DoctorInfoEditController');
    DoctorServ.reloadById($stateParams.id).then(function(resp) {
        $scope.doctor = resp;
    })

    $scope.updateDoctorInfo = function(userid, profession, adept, intro) {
        umengLog('AssistantSubmit', 'UpdateDoctorInfo');
        DoctorServ.updateDoctorInfo(userid, profession, adept, intro).then(function(resp) {
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

    $scope.updateCaseManagerInfo = function(brief) {
        umengLog('AssistantSubmit', 'UpdateAssistantInfo');
        DoctorServ.updateCaseManagerInfo(brief).then(function(resp) {
            $ionicPopup.alert({
                title: '提示',
                template: '修改成功'
            }).then(function() {
                $rootScope.casemanager.brief = brief;
                window.history.back();
            })
        });
    }
})

.controller('MeCtrl', function($scope) {
    umengLog('AssistantView', 'MeController');
})

.controller('EarningCtrl', function($scope, $ionicHistory, CaseManagerServ, EarningServ) {
    umengLog('CasemanagerView', 'EarningController');
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
    CaseManagerServ.reload().then(function(resp) {
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
        umengLog('CasemanagerClick', 'ViewPrevMonth');
        var _viewMonth = new Date(date),
            _viewMonthFormated = '';
        _viewMonth.setMonth(_viewMonth.getMonth() - 1);
        _viewMonthFormated = (new Date(_viewMonth)).format('yyyy-MM');
        _loadTradeAmount(_viewMonthFormated);
    }

    // 取下一月的交易总和
    $scope.nextMonth = function(date) {
        umengLog('CasemanagerClick', 'ViewNextMonth');
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

.controller('EarningDetailCtrl', function($scope, $stateParams, CaseManagerServ, EarningServ) {
    umengLog('CasemanagerView', 'EarningDetailController');
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
    CaseManagerServ.reload().then(function(resp) {
        EarningServ.reloadSubjectDetail(resp.userid, resp.username, $stateParams.subject, $stateParams.month).then(function(resp) {
            $scope.subjectDetail = resp;
        })
    })
})

.controller('QaCtrl', function($scope, $ionicHistory, QaServ) {
    umengLog('CasemanagerView', 'QaController');
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
    umengLog('CasemanagerView', 'QaDetailController');
    $scope.location = 'http://ag.furuihui.com/article.php?id=' + $stateParams.id;
})
