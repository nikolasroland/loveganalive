'use strict';
angular.module('starter.controllers', [])

.controller('DoctorPatientsCtrl', function($scope, $ionicPlatform, $ionicPopup, DoctorPatientServ) {
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['07', '0073']);
        Native.getAuth('doctor', function(userInfo) {
            DoctorPatientServ.load(userInfo.doctorId).then(function(resp) {
                $scope.patientList = resp;
            })

            $scope.resizeScroll = function() {
                $scope.$broadcast('scroll.resize');
            }

            $scope.doRefresh = function() {
                DoctorPatientServ.reload().then(function(resp) {
                    $scope.patientList = resp;
                    $scope.$broadcast('scroll.refreshComplete');
                })
            }

            $scope.startChat = function(id, name) {
                Native.run('umengLog', ['event', 'detail', 'DoctorChatWithPatient']);
                Native.run('startChat', [id, name]);
            }

            $scope.viewReferral = function(e, id) {
                Native.run('umengLog', ['event', 'detail', 'DoctorViewPatientReferral']);
                Native.run('html5Log', ['07', '0074']);
                e.stopPropagation();
                e.preventDefault();
                // Native.run('viewHistory', [id]);
                window.location.href = '#tab/doctor/me/referral/' + id;
                return false;
            }

            $scope.setAttention = function(e, id) {
                Native.run('umengLog', ['event', 'detail', 'DoctorSetAttentionPatient']);
                e.stopPropagation();
                e.preventDefault();
                DoctorPatientServ.setAttention(id).then(function(resp) {
                    $ionicPopup.alert({
                        title: '已添加关注',
                        template: ''
                    }).then(function() {
                        DoctorPatientServ.load(userInfo.doctorId).then(function(resp) {
                            $scope.patientList = resp;
                        })
                    });
                })
                return false;
            }

            $scope.cancelAttention = function(e, id) {
                Native.run('umengLog', ['event', 'detail', 'DoctorCancelAttentionPatient']);
                e.stopPropagation();
                e.preventDefault();
                DoctorPatientServ.cancelAttention(id).then(function(resp) {
                    $ionicPopup.alert({
                        title: '已取消关注',
                        template: ''
                    }).then(function() {
                        DoctorPatientServ.load(userInfo.doctorId).then(function(resp) {
                            $scope.patientList = resp;
                        })
                    });
                })
                return false;
            }
        })

    })
})

.controller('DoctorReservationCtrl', function($scope, $ionicPlatform, $ionicPopup, DoctorReservationServ) {
    $ionicPlatform.ready(function() {
        DoctorReservationServ.reload().then(function(resp) {
            Native.run('html5Log', ['08', '0076']);
            $scope.reservationList = resp;

            $scope.msg00 = '暂无待确认预约记录';
            $scope.msg01 = '暂无已确认预约记录';
            for (var i in resp.list) {
                if (resp.list[i].status == '00')
                    $scope.msg00 = '';
                else if (resp.list[i].status == '01')
                    $scope.msg01 = '';
            }
        })

        $scope.resizeScroll = function() {
            $scope.$broadcast('scroll.resize');
        }

        $scope.doRefresh = function() {
            DoctorReservationServ.reload().then(function(resp) {
                $scope.reservationList = resp;

                $scope.msg00 = '暂无待确认预约记录';
                $scope.msg01 = '暂无已确认预约记录';
                for (var i in resp.list) {
                    if (resp.list[i].status == '00')
                        $scope.msg00 = '';
                    else if (resp.list[i].status == '01')
                        $scope.msg01 = '';
                }

                $scope.$broadcast('scroll.refreshComplete');
            })
        }

        $scope.viewReferral = function(e, id) {
                Native.run('umengLog', ['event', 'detail', 'DoctorViewPatientReferral']);
                Native.run('html5Log', ['07', '0074']);
                e.stopPropagation();
                e.preventDefault();
                // Native.run('viewHistory', [id]);
                window.location.href = '#tab/doctor/me/referral/' + id;
                return false;
            }
            /*        $scope.viewHistory = function(e, id) {
                        Native.run('umengLog', ['event', 'detail', 'DoctorViewPatientHistory']);
                        e.stopPropagation();
                        e.preventDefault();
                        Native.run('viewHistory', [id]);
                        return false;
                    }*/

        $scope.applyReserv = function(id) {
            Native.run('umengLog', ['event', 'detail', 'DoctorApplyPatientReservation']);
            DoctorReservationServ.applyReserv(id).then(function(resp) {
                $ionicPopup.alert({
                    title: '已同意本次预约',
                    template: ''
                }).then(function() {
                    DoctorReservationServ.load().then(function(resp) {
                        Native.run('html5Log', ['08', '0077']);
                        $scope.reservationList = resp;

                        $scope.msg00 = '暂无待确认预约记录';
                        $scope.msg01 = '暂无已确认预约记录';
                        for (var i in resp.list) {
                            if (resp.list[i].status == '00')
                                $scope.msg00 = '';
                            else if (resp.list[i].status == '01')
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
                    Native.run('umengLog', ['event', 'detail', 'DoctorRejectPatientReservation']);
                    Native.run('html5Log', ['08', '0078']);
                    DoctorReservationServ.rejectReserv(id).then(function(resp) {
                        $ionicPopup.alert({
                            title: '已取消本次预约',
                            template: ''
                        }).then(function() {
                            DoctorReservationServ.load().then(function(resp) {
                                $scope.reservationList = resp;

                                $scope.msg00 = '暂无待确认预约记录';
                                $scope.msg01 = '暂无已确认预约记录';
                                for (var i in resp.list) {
                                    if (resp.list[i].status == '00')
                                        $scope.msg00 = '';
                                    else if (resp.list[i].status == '01')
                                        $scope.msg01 = '';
                                }
                            })
                        })
                    })
                }
            })
        }
    });
})

.controller('DoctorInfoCtrl', function($scope, $ionicPlatform, $rootScope, $ionicListDelegate, $ionicHistory, $timeout, DoctorDoctorServ, CommentServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['06', '0042']);
        DoctorDoctorServ.reload().then(function(resp) {
            $rootScope.doctor = resp;

        });

        Native.getAuth('doctor', function(userInfo) {
            $scope.commentList = [];
            CommentServ.reserveList(userInfo.doctorId, 1, '00').then(function(response) {
                $scope.comment = response;
                CommentServ.hasmore = response.total / 10 > 1;
                for (var i = 0; i < response.rows.length; i++) {
                    response.rows[i].name = response.rows[i].patientNickName;
                    response.rows[i].star = response.rows[i].eveluateStar;
                    response.rows[i].content = response.rows[i].eveluateContent;
                    $scope.commentList.push(response.rows[i]);
                }
                /*$scope.$broadcast('scroll.infiniteScrollComplete');
                CommentServ.curPage++;
                $ionicScrollDelegate.freezeScroll(false);*/
            });

            $scope.loadMore = function() {
                //这里使用定时器是为了缓存一下加载过程，防止加载过快
                $timeout(function() {
                    if (!CommentServ.hasmore) {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        return;
                    }
                    CommentServ.reserveList(userInfo.doctorId, CommentServ.curPage, '00').then(function(response) {
                        CommentServ.hasmore = response.total / 10 > CommentServ.curPage;
                        for (var i = 0; i < response.rows.length; i++) {
                            response.rows[i].name = response.rows[i].patientNickName;
                            response.rows[i].star = response.rows[i].eveluateStar;
                            response.rows[i].content = response.rows[i].eveluateContent;
                            $scope.commentList.push(response.rows[i]);
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        CommentServ.curPage++;
                        $ionicScrollDelegate.freezeScroll(false);
                    });
                }, 1000);
            };
            $scope.moreDataCanBeLoaded = function() {
                return CommentServ.hasmore;
            }
            $scope.$on('stateChangeSuccess', function() {
                $scope.loadMore();
            });
            //$ionicListDelegate.showReorder(true);
        });
    });
})


.controller('DoctorAssistantCtrl', function($scope, $ionicPlatform, $rootScope, $ionicHistory, $ionicListDelegate, $timeout, DoctorAssistantServ, CommentServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        DoctorAssistantServ.reload().then(function(resp) {
            $rootScope.assistant = resp;
        });
        Native.getAuth('doctor', function(userInfo) {
            CommentServ.reload(userInfo.assistantId, 1).then(function(comment) {
                $scope.comment = comment;
                CommentServ.hasmore = comment.page_total > 1;
            });

            $scope.loadMore = function() {
                //这里使用定时器是为了缓存一下加载过程，防止加载过快
                $timeout(function() {
                    if (!CommentServ.hasmore) {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        return;
                    }
                    CommentServ.reload(userInfo.assistantId, CommentServ.curPage).then(function(response) {
                        CommentServ.hasmore = response.page_total > CommentServ.curPage;
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
            //$ionicListDelegate.showReorder(true);
        })
    });
})


.controller('DoctorVisitCtrl', function($scope, $ionicPlatform, $ionicPopup, $ionicHistory, DoctorDoctorServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['06', '0058']);
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

        DoctorDoctorServ.querySchedule().then(function(resp) {
            $scope.schedule = resp.data;
            $scope.this_weeks = resp.data.this_weeks.split('|');
            $scope.next_weeks = resp.data.next_weeks.split('|');
        })

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

        $scope.setVisit = function(limit, price) {
            if (limit <= 0) {
                $ionicPopup.alert({
                    title: '温馨提示!',
                    template: '人数必须大于0'
                })
                return;
            } else if (price <= 0) {
                $ionicPopup.alert({
                    title: '温馨提示!',
                    template: '费用必须大于0'
                })
                return;
            }
            Native.run('umengLog', ['event', 'detail', 'DoctorSetVisitSettings']);
            DoctorDoctorServ.updateVisit(limit, price, $scope.schedule.this_weeks.replace(/[1-9]/g, '1'), $scope.schedule.next_weeks.replace(/[1-9]/g, '1')).then(function(resp) {
                Native.run('html5Log', ['06', '0059']);
                $ionicPopup.alert({
                    title: '设置成功!',
                    template: ''
                }).then(function() {
                    window.history.back();
                    Native.run('historyBack', []);
                })
            })
        }
    });
})


.controller('DoctorBedCtrl', function($scope, $ionicPlatform, $ionicPopup, $ionicHistory, DoctorDoctorServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['06', '0086']);
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

        DoctorDoctorServ.queryBed().then(function(resp) {
            $scope.schedule = resp.data;
            $scope.this_weeks = resp.data.this_weeks.split('|');
            $scope.next_weeks = resp.data.next_weeks.split('|');
        })

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

        $scope.setVisit = function(limit, price) {
            Native.run('umengLog', ['event', 'detail', 'DoctorSetVisitSettings']);
            DoctorDoctorServ.updateBed(limit, price, $scope.schedule.this_weeks.replace(/[1-9]/g, '1'), $scope.schedule.next_weeks.replace(/[1-9]/g, '1')).then(function(resp) {
                Native.run('html5Log', ['06', '0087']);
                $ionicPopup.alert({
                    title: '设置成功!',
                    template: ''
                }).then(function() {
                    window.history.back();
                })
            })
        }
    });
})


.controller('DoctorEarningCtrl', function($scope, $ionicPlatform, $ionicHistory, DoctorDoctorServ, DoctorEarningServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['06', '0063']);
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

            DoctorEarningServ.reloadTradeAmount(monthFormated).then(function(resp) {
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
                DoctorEarningServ.reloadSubjectAmount(monthFormated).then(function(resp) {
                    var subjectAmount = {};
                    for (var i in resp.data) {
                        subjectAmount[resp.data[i].subjectName] = resp.data[i].tradeAmount;
                    }
                    $scope.subjectAmount = subjectAmount;
                    $scope.isSettlement = resp.isSettlement == '0' ? '未结算' : '已结算';
                })
            })
        }

        // 加载医生信息
        DoctorDoctorServ.reload().then(function(resp) {
            $scope.doctor = resp;
            DoctorDoctorServ.getBalance().then(function(balance) {
                    console.log(balance)
                    $scope.doctor.balances = balance.balance;
                })
                // 取当月的交易总和
            _loadTradeAmount((new Date()).format('yyyy-MM'));
        })



        Native.getAuth('doctor', function(userInfo) {
            $scope.canReservation = userInfo.canReservation;
        });

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
            Native.run('umengLog', ['event', 'detail', 'DoctorViewPrevMonth']);
            var _viewMonth = new Date(date),
                _viewMonthFormated = '';
            _viewMonth.setMonth(_viewMonth.getMonth() - 1);
            _viewMonthFormated = (new Date(_viewMonth)).format('yyyy-MM');
            _loadTradeAmount(_viewMonthFormated);
        }

        // 取下一月的交易总和
        $scope.nextMonth = function(date) {
            Native.run('umengLog', ['event', 'detail', 'DoctorViewNextMonth']);
            var _viewMonth = new Date(date),
                _viewMonthFormated = '';
            _viewMonth.setMonth(_viewMonth.getMonth() + 1);
            _viewMonthFormated = (new Date(_viewMonth)).format('yyyy-MM');
            _loadTradeAmount(_viewMonthFormated);
        }
    });
})

.controller('DoctorEarningDetailCtrl', function($scope, $ionicPlatform, $stateParams, $timeout, DoctorDoctorServ, DoctorEarningServ) {
    $ionicPlatform.ready(function() {
        switch ($stateParams.subject) {
            case 'basics':
                $scope.icon = 'amount-img icon ion-cube yellow';
                $scope.title = '服务+';
                Native.run('html5Log', ['06', '0064']);
                break;
            case 'interaction':
                $scope.icon = 'amount-img icon ion-chatbubble-working balanced';
                $scope.title = '咨询';
                Native.run('html5Log', ['06', '0066']);
                break;
            case 'appointment':
                $scope.icon = 'amount-img icon ion-ios-time calm';
                $scope.title = '预约';
                Native.run('html5Log', ['06', '0067']);
                break;
            case 'reward':
                $scope.icon = 'amount-img icon ion-ios-heart assertive';
                $scope.title = '打赏';
                Native.run('html5Log', ['06', '0068']);
                break;
        }
        DoctorEarningServ.reloadSubjectDetail($stateParams.subject, $stateParams.month, 0).then(function(resp) {
            $scope.subjectDetail = resp;
            DoctorEarningServ.hasmore = resp.total / 10 > 1;
        })

        $scope.loadMore = function() {
            //这里使用定时器是为了缓存一下加载过程，防止加载过快
            $timeout(function() {
                if (!DoctorEarningServ.hasmore) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                DoctorEarningServ.reloadSubjectDetail($stateParams.subject, $stateParams.month, DoctorEarningServ.curPage).then(function(response) {
                    DoctorEarningServ.hasmore = response.total / 10 > DoctorEarningServ.curPage + 1;
                    for (var i = 0; i < response.list.length; i++) {
                        $scope.subjectDetail.list.push(response.list[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    DoctorEarningServ.curPage++;
                });
            }, 1000);
        };
        $scope.moreDataCanBeLoaded = function() {
            return DoctorEarningServ.hasmore;
        }
        $scope.$on('stateChangeSuccess', function() {
            $scope.loadMore();
        });
    });
})

.controller('DoctorInfoByIdCtrl', function($scope, $ionicPlatform, $stateParams, $timeout, $ionicHistory, $ionicListDelegate, $ionicScrollDelegate, DoctorDoctorServ, CommentServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        DoctorDoctorServ.reloadById($stateParams.id).then(function(resp) {
            $scope.doctor = resp;
            $scope.commentList = [];
            if ($scope.doctor.modelid == '11') {
                CommentServ.reload($stateParams.id, 1).then(function(comment) {
                    $scope.comment = comment;
                    $scope.commentList = comment.list;
                    CommentServ.hasmore = comment.page_total > 1;
                });
            } else {
                CommentServ.reserveList($stateParams.id, 1, '00').then(function(response) {
                    $scope.comment = response;
                    CommentServ.hasmore = response.total / 10 > 1;
                    console.log(CommentServ.hasmore)
                    for (var i = 0; i < response.rows.length; i++) {
                        response.rows[i].name = response.rows[i].patientNickName;
                        response.rows[i].star = response.rows[i].eveluateStar;
                        response.rows[i].content = response.rows[i].eveluateContent;
                        $scope.commentList.push(response.rows[i]);
                    }
                    /*$scope.$broadcast('scroll.infiniteScrollComplete');
                    CommentServ.curPage++;
                    $ionicScrollDelegate.freezeScroll(false);*/
                });
            }
        })

        $scope.loadMore = function() {
            //这里使用定时器是为了缓存一下加载过程，防止加载过快
            $timeout(function() {
                if (!CommentServ.hasmore) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                if ($scope.doctor.modelid == '11') {
                    CommentServ.reload($stateParams.id, CommentServ.curPage).then(function(response) {
                        CommentServ.hasmore = response.page_total > CommentServ.curPage;
                        for (var i = 0; i < response.list.length; i++) {
                            $scope.commentList.push(response.list[i]);
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        CommentServ.curPage++;
                        $ionicScrollDelegate.freezeScroll(false);
                    });
                } else {
                    CommentServ.reserveList($stateParams.id, CommentServ.curPage, '00').then(function(response) {
                        CommentServ.hasmore = response.total / 10 > CommentServ.curPage;
                        for (var i = 0; i < response.rows.length; i++) {
                            response.rows[i].name = response.rows[i].patientNickName;
                            response.rows[i].star = response.rows[i].eveluateStar;
                            response.rows[i].content = response.rows[i].eveluateContent;
                            $scope.commentList.push(response.rows[i]);
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        CommentServ.curPage++;
                        $ionicScrollDelegate.freezeScroll(false);
                    });
                }
                /*CommentServ.reload($stateParams.id, CommentServ.curPage).then(function(response) {
                    CommentServ.hasmore = response.page_total > CommentServ.curPage;
                    for (var i = 0; i < response.list.length; i++) {
                        $scope.comment.list.push(response.list[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    CommentServ.curPage++;
                });*/
            }, 1000);
        };
        $scope.moreDataCanBeLoaded = function() {
            return CommentServ.hasmore;
        }
        $scope.$on('stateChangeSuccess', function() {
            $scope.loadMore();
        });
        //$ionicListDelegate.showReorder(true);
    });
})

.controller('DoctorInfoEditCtrl', function($scope, $ionicPlatform, $rootScope, $ionicPopup, $location, $stateParams, $ionicHistory, DoctorDoctorServ) {
    $ionicPlatform.ready(function() {
        DoctorDoctorServ.reload().then(function(resp) {
            $scope.doctor = resp;
        })

        $scope.status = $stateParams.id;

        $scope.tit = $stateParams.id.replace('0', '临床职称').replace('1', '擅长').replace('2', '职业经历').replace('3', '简介');

        $scope.cancelBack = function() {
            window.history.back();
        }

        $scope.saveBack = function() {
            DoctorDoctorServ.updateDoctorInfo($scope.doctor.profession, $scope.doctor.adept, $scope.doctor.intro).then(function(resp) {
                $rootScope.doctor.profession = $scope.doctor.profession;
                $rootScope.doctor.adept = $scope.doctor.adept;
                $rootScope.doctor.intro = $scope.doctor.intro;
                window.history.back();
            });
        }
    });
})

.controller('DoctorInfoEditDetailCtrl', function($scope, $ionicPlatform, $rootScope, $ionicPopup, $location, $stateParams, $ionicHistory, DoctorDoctorServ) {
    $ionicPlatform.ready(function() {
        DoctorDoctorServ.reload().then(function(resp) {
            $rootScope.doctor = resp;
        })

        $scope.changeAvatar = function() {
            Native.run('changeAvatar', []);
        }

        $scope.doRefresh = function() {
            DoctorDoctorServ.reload().then(function(resp) {
                $rootScope.doctor = resp;
            })
        }
    });
})

.controller('AssistantInfoEditDetailCtrl', function($scope, $ionicPlatform, $rootScope, $ionicPopup, $location, $stateParams, $ionicHistory, AssistantDoctorServ) {
    $ionicPlatform.ready(function() {
        AssistantDoctorServ.reloadById($stateParams.id).then(function(resp) {
            $rootScope.doctor = resp;
        })
    });
})

.controller('DoctorQaCtrl', function($scope, $ionicPlatform, $ionicHistory, QaServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        QaServ.reload().then(function(resp) {
            $scope.qaList = resp.list;
        })
    });
})

.controller('QaRedCtrl', function($scope, $ionicPlatform, $ionicHistory, QaServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        QaServ.reloadRed().then(function(resp) {
            $scope.qaList = resp.list;
        })
    });
})

.controller('QaDetailCtrl', function($scope, $ionicHistory, $ionicPlatform, $stateParams, QaServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $scope.location = 'http://ag.furuihui.com/article.php?id=' + $stateParams.id;
})

.controller('DoctorQaDetailCtrl', function($scope, $stateParams) {
    $scope.location = 'http://ag.furuihui.com/article.php?id=' + $stateParams.id;
})

.controller('DoctorReferralCtrl', function($scope, $stateParams, $ionicHistory, $ionicPlatform, ReferralServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $scope.myBack = function() {
        $ionicHistory.goBack();
        Native.run('historyBack', []);
    }
    $ionicPlatform.ready(function() {
        $scope.patientId = $stateParams.id;
        ReferralServ.reloadMyPlan($stateParams.id).then(function(resp) {
            $scope.plan = resp;
            if (resp.visitTime) {
                var time = new Date(resp.visitTime)
                $scope.plan.day = time.getDayString();
                $scope.plan.date = time.getDate();
                $scope.plan.month = time.getMonth() + 1;
            }
        })

        ReferralServ.reload($stateParams.id).then(function(resp) {
            $scope.table = resp;
            for (var i in resp.rows) {
                if (resp.rows[i].visitTime) {
                    var time = new Date(resp.rows[i].visitTime)
                    $scope.table.rows[i].day = time.getDayString();
                    $scope.table.rows[i].date = time.getDate();
                    $scope.table.rows[i].month = time.getMonth() + 1;
                }
            }
        })
    });
})

.controller('DoctorResultCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicPopup, $ionicModal, $stateParams, ResultServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicModal.fromTemplateUrl('remark-modal', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $ionicPlatform.ready(function() {
        ResultServ.reload($stateParams.patientId).then(function(resp) {
            $scope.result = resp;

            ResultServ.reloadRemarkList().then(function(remarkList) {
                $scope.remarkList = remarkList;
            })

            $scope.viewHistory = function() {
                Native.run('viewHistory', [$stateParams.patientId]);
            }

            $scope.addRemark = function() {
                $scope.modal.show();
            }

            $scope.addThis = function(item) {
                $scope.result.doctorMessage = item;
                $scope.modal.hide();
            }

            $scope.submit = function(msg) {
                Native.getAuth('doctor', function(userInfo) {
                    ResultServ.updateRemark(userInfo.doctorId, resp.id, msg, 'true').then(function() {
                        Native.run('umengLog', ['event', 'detail', 'updateRemark']);
                        Native.run('html5Log', ['07', '0075']);
                        $ionicPopup.alert({
                            title: '提交成功!',
                            template: ''
                        })
                    })
                });
            }
        })
    });
})

.controller('DoctorResultHistoryCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicPopup, $ionicModal, $stateParams, ResultServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicModal.fromTemplateUrl('remark-modal', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $ionicPlatform.ready(function() {
        ResultServ.reloadById($stateParams.id).then(function(resp) {
            $scope.result = resp;
        })

        ResultServ.reloadRemarkList().then(function(remarkList) {
            $scope.remarkList = remarkList;
        })

        $scope.viewHistory = function() {
            Native.run('viewHistory', [$stateParams.patientId]);
        }

        $scope.addRemark = function() {
            $scope.modal.show();
        }

        $scope.addThis = function(item) {
            $scope.result.doctorMessage = item;
            $scope.modal.hide();
        }

        $scope.submit = function(msg) {
            ResultServ.updateRemark($stateParams.id, msg, 'history').then(function() {
                Native.run('umengLog', ['event', 'detail', 'updateRemark']);
                $ionicPopup.alert({
                    title: '提交成功!',
                    template: ''
                })
            })
        }
    });
})


.controller('DoctorMeCtrl', function($scope, $ionicPlatform) {})






.controller('AssistantMeCtrl', function($scope, $stateParams, $ionicPlatform) {})

.controller('AssistantReferralCtrl', function($scope, $ionicHistory, $ionicPlatform, $stateParams, ReferralServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $scope.myBack = function() {
        $ionicHistory.goBack();
        Native.run('historyBack', []);
    }
    $ionicPlatform.ready(function() {
        $scope.patientId = $stateParams.id;
        ReferralServ.reloadMyPlan($stateParams.id).then(function(resp) {
            $scope.plan = resp;
            if (resp.visitTime) {
                var time = new Date(resp.visitTime)
                $scope.plan.day = time.getDayString();
                $scope.plan.date = time.getDate();
                $scope.plan.month = time.getMonth() + 1;
            }
        })

        ReferralServ.reload($stateParams.id).then(function(resp) {
            $scope.table = resp;
            for (var i in resp.rows) {
                if (resp.rows[i].visitTime) {
                    var time = new Date(resp.rows[i].visitTime)
                    $scope.table.rows[i].day = time.getDayString();
                    $scope.table.rows[i].date = time.getDate();
                    $scope.table.rows[i].month = time.getMonth() + 1;
                }
            }
        })
    });
})

.controller('AssistantResultCtrl', function($scope, $ionicHistory, $ionicPlatform, $stateParams, ResultServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        ResultServ.reload($stateParams.patientId).then(function(resp) {
            $scope.result = resp;
        })

        $scope.viewHistory = function() {
            Native.run('viewHistory', [$stateParams.patientId]);
        }
    });
})

.controller('AssistantResultHistoryCtrl', function($scope, $ionicHistory, $ionicPlatform, $stateParams, ResultServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        ResultServ.reloadById($stateParams.id).then(function(resp) {
            $scope.result = resp;
        })

        $scope.viewHistory = function() {
            Native.run('viewHistory', [$stateParams.patientId]);
        }
    });
})







.controller('AssistantInfoCtrl', function($scope, $ionicPlatform, $rootScope, $ionicListDelegate, $timeout, $ionicHistory, AssistantAssistantServ, CommentServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['06', '0042']);
        AssistantAssistantServ.reload().then(function(resp) {
            $rootScope.doctor = resp;
        })

        Native.getAuth('assistant', function(userInfo) {
            CommentServ.reload(userInfo.assistantId, 1).then(function(comment) {
                $scope.comment = comment;
                $scope.commentList = comment.list;
                CommentServ.hasmore = comment.page_total > 1;
            });

            $scope.loadMore = function() {
                //这里使用定时器是为了缓存一下加载过程，防止加载过快
                $timeout(function() {
                    if (!CommentServ.hasmore) {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        return;
                    }
                    CommentServ.reload(userInfo.assistantId, CommentServ.curPage).then(function(response) {
                        CommentServ.hasmore = response.page_total > CommentServ.curPage;
                        for (var i = 0; i < response.list.length; i++) {
                            $scope.commentList.push(response.list[i]);
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
            //$ionicListDelegate.showReorder(true);
        })
    });
})

.controller('AssistantMeOrderCtrl', function($scope, $rootScope, $stateParams, $ionicPlatform, $location, $ionicHistory, AssistantInsuranceServ, localStorageService) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.getAuth('assistant', function(userInfo) {
            var userid = null;
            if ($stateParams.id) {
                $scope.tit = $stateParams.name + '的订单';
                userid = $stateParams.id;
            } else {
                $scope.tit = '我的订单'
                userid = userInfo.assistantId;
            }

            AssistantInsuranceServ.reloadInsuranceList(userInfo.auth, userid).then(function(resp) {
                $scope.insuranceList = resp;
            })
            AssistantInsuranceServ.reloadDivList(userInfo.auth, userid).then(function(resp) {
                $scope.divList = resp;
            })

            $scope.doRefresh = function() {
                AssistantInsuranceServ.reloadInsuranceList(userInfo.auth, userid).then(function(resp) {
                    $scope.insuranceList = resp;
                    $scope.$broadcast('scroll.refreshComplete');
                })
                AssistantInsuranceServ.reloadDivList(userInfo.auth, userid).then(function(resp) {
                    $scope.divList = resp;
                    $scope.$broadcast('scroll.refreshComplete');
                })
            }
        });

        /*$scope.img = function(name) {
            switch (name) {
                case '0级':
                    return 'img/lv0.png';
                    break;
                case '2级':
                    return 'img/lv2.png';
                    break;
                case '4级':
                    return 'img/lv4.png';
                    break;
                case '6级':
                    return 'img/lv6.png';
                    break;
                default:
                    return 'img/lv0.png';
                    break;
            }
        }*/

        $scope.viewOrder = function() {
            localStorageService.set('orderlist', this.doctor.data);
        }

        $scope.status = localStorageService.get('ordertab') == 1 ? 1 : 0;
        $scope.resizeScroll = function(status) {
            localStorageService.set('ordertab', status);
            $scope.$broadcast('scroll.resize');
        }
    });
})

.controller('AssistantMeDivCtrl', function($scope, $rootScope, $stateParams, $ionicPlatform, $location, $ionicHistory, AssistantInsuranceServ, localStorageService) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.getAuth('assistant', function(userInfo) {
            var userid = null;
            if ($stateParams.id) {
                $scope.tit = $stateParams.name + '的分级';
                userid = $stateParams.id;
            } else {
                $scope.tit = '我的分级'
                userid = userInfo.assistantId;
            }

            AssistantInsuranceServ.reloadInsuranceList(userInfo.auth, userid).then(function(resp) {
                $scope.insuranceList = resp;
            })
            AssistantInsuranceServ.reloadDivList(userInfo.auth, userid).then(function(resp) {
                $scope.divList = resp;
            })

            $scope.doRefresh = function() {
                AssistantInsuranceServ.reloadInsuranceList(userInfo.auth, userid).then(function(resp) {
                    $scope.insuranceList = resp;
                    $scope.$broadcast('scroll.refreshComplete');
                })
                AssistantInsuranceServ.reloadDivList(userInfo.auth, userid).then(function(resp) {
                    $scope.divList = resp;
                    $scope.$broadcast('scroll.refreshComplete');
                })
            }
        });

        /*$scope.img = function(name) {
            switch (name) {
                case '0级':
                    return 'img/lv0.png';
                    break;
                case '2级':
                    return 'img/lv2.png';
                    break;
                case '4级':
                    return 'img/lv4.png';
                    break;
                case '6级':
                    return 'img/lv6.png';
                    break;
                default:
                    return 'img/lv0.png';
                    break;
            }
        }*/

        $scope.viewOrder = function() {
            localStorageService.set('orderlist', this.doctor.data);
        }

        $scope.status = localStorageService.get('ordertab') == 1 ? 1 : 0;
        $scope.resizeScroll = function(status) {
            localStorageService.set('ordertab', status);
            $scope.$broadcast('scroll.resize');
        }
    });
})

.controller('AssistantMeOrderListCtrl', function($scope, $timeout, $ionicPlatform, $ionicPopup, AssistantInsuranceServ, localStorageService) {
    $ionicPlatform.ready(function() {
        $scope.orderList = localStorageService.get('orderlist');
        var tempOrder = {};
        $scope.viewOrderDetail = function() {
            localStorageService.set('orderdetail', this.order);
        }

        $scope.doRefresh = function(isSuccess) {
            tempOrder.btnDisabled = false;
            if (isSuccess) {
                tempOrder.payment_status = '01';
                tempOrder.paymentStatus = '01';
                tempOrder.paymentStatusName = '已支付';
                localStorageService.set('orderlist', $scope.orderList)
            }
            $scope.$apply("orderList")
        }

        $scope.pay = function(amount, orderCode) {
            tempOrder = this.order;
            this.order.btnDisabled = true;
            Native.run('pay', [amount, orderCode, 29]);
        }
        $scope.cancel = function(orderCode) {
            var me = this;
            $ionicPopup.confirm({
                title: '提示',
                template: '确定要取消预约该订单吗？',
                okText: '确定',
                cancelText: '取消'
            }).then(function(res) {
                if (res) {
                    tempOrder = me.order;
                    me.order.btnDisabled = true;
                    AssistantInsuranceServ.cancelTradeOrder(orderCode).then(function(resp) {
                        tempOrder.payment_status = '03';
                        tempOrder.paymentStatus = '03';
                        tempOrder.paymentStatusName = '已取消';
                        localStorageService.set('orderlist', $scope.orderList)
                        me.order.btnDisabled = false;
                    })
                }
            });
        }
    });
})

.controller('AssistantMeOrderDetailCtrl', function($scope, $rootScope, $ionicPlatform, $ionicHistory, localStorageService) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        $rootScope.orderDetail = localStorageService.get('orderdetail');
    });
})


.controller('AssistantMeOrderDetailByIdCtrl', function($scope, $rootScope, $stateParams, $ionicPlatform, $ionicHistory, AssistantInsuranceServ, localStorageService) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        AssistantInsuranceServ.reloadInsuranceDetail($stateParams.id).then(function(resp) {
            $scope.orderDetail = resp[0];
            localStorageService.set('orderdetail', resp[0]);
        })
    });
})


.controller('AssistantMeOrderExpressCtrl', function($scope, $ionicPlatform, $stateParams, AssistantInsuranceServ, localStorageService) {
    $ionicPlatform.ready(function() {
        /*AssistantInsuranceServ.reloadExpressTrack($stateParams.comp, $stateParams.code).then(function(resp) {
                 console.log(resp)
             })*/
        $scope.link = 'http://m.kuaidi100.com/index_all.html?type=' + $stateParams.comp + '&postid=' + $stateParams.code + '#result&ui-state=dialog'
    });
})

.controller('AssistantMeOrderInvoiceCtrl', function($scope, $rootScope, $ionicPlatform, $ionicPopup, AssistantInsuranceServ, localStorageService) {
    $ionicPlatform.ready(function() {
        $rootScope.orderDetail = localStorageService.get('orderdetail');

        Native.getAuth('assistant', function(userInfo) {
            $scope.invoice = function(proInvoiceTitle, proInvoiceAmount) {
                if (typeof proInvoiceTitle === 'undefined') {
                    $ionicPopup.alert({
                        title: '提示',
                        template: '请填写发票抬头'
                    })
                    return;
                } else if (typeof proInvoiceAmount === 'undefined') {
                    $ionicPopup.alert({
                        title: '提示',
                        template: '发票金额只能为数字'
                    })
                    return;
                }
                AssistantInsuranceServ.updateOrderInvoice(userInfo.assistantId, $rootScope.orderDetail.order_code, proInvoiceTitle, proInvoiceAmount).then(function(resp) {
                    $ionicPopup.alert({
                        title: '提示',
                        template: '申请成功'
                    }).then(function() {
                        $rootScope.orderDetail.proInvoiceTitle = proInvoiceTitle;
                        $rootScope.orderDetail.proInvoiceAmount = proInvoiceAmount;
                        $rootScope.orderDetail.proInvoiceStatus = '02';
                        localStorageService.set('orderdetail', $rootScope.orderDetail);
                        var orderList = localStorageService.get('orderlist');
                        for (var i in orderList) {
                            if (orderList[i].order_code == $rootScope.orderDetail.order_code) {
                                orderList[i].proInvoiceTitle = proInvoiceTitle;
                                orderList[i].proInvoiceAmount = proInvoiceAmount;
                                orderList[i].proInvoiceStatus = '02';
                                break;
                            }
                        }
                        localStorageService.set('orderlist', orderList);

                        window.history.back();
                    })
                })
            }
        });
    });
})

.controller('AssistantMeProductDetailCtrl', function($scope, $ionicPlatform, $stateParams, ProductServ) {
    $ionicPlatform.ready(function() {
        ProductServ.reloadById($stateParams.id).then(function(resp) {
            $scope.remark = resp.remark.replace(/<img src="/g, '<img src="' + JAVA_URL);
        })
    });
})

.controller('AssistantPatientsCtrl', function($scope, $ionicPlatform, $location, AssistantDoctorServ) {
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['06', '0069']);
        Native.getAuth('assistant', function(userInfo) {
            AssistantDoctorServ.loadUseIn(userInfo.assistantId).then(function(resp) {
                $scope.doctorList = resp;
            })
        })

        $scope.nameFilter = '';
        $scope.changeNameFilter = function(nameFilter) {
            $scope.nameFilter = nameFilter;
        }

        $scope.doRefresh = function() {
            if ($scope.nameFilter == '') {
                AssistantDoctorServ.loadUseIn().then(function(resp) {
                    $scope.doctorList = resp;
                    $scope.searchList = {
                        list: []
                    };
                    $scope.$broadcast('scroll.refreshComplete');
                })
            } else {
                AssistantDoctorServ.searchPatients($scope.nameFilter).then(function(resp) {
                    $scope.doctorList = {
                        list: []
                    };
                    $scope.searchList = resp;
                    $scope.$broadcast('scroll.refreshComplete');
                })
            }
        }

        $scope.viewInfo = function(e, id) {
            Native.run('event', 'detail', 'AssistantViewDoctorInfo');
            e.stopPropagation();
            e.preventDefault();
            window.location.href = "#tab/assistant/me/info/" + id
            return false;
        }
    });
})

.controller('AssistantPatientsListCtrl', function($scope, $ionicPlatform, $stateParams, AssistantDoctorServ) {
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['07', '0073']);
        AssistantDoctorServ.loadPatients($stateParams.id).then(function(resp) {
            $scope.patientList = resp;
        })

        $scope.doRefresh = function() {
            AssistantDoctorServ.reloadPatients($stateParams.id).then(function(resp) {
                $scope.patientList = resp;
                $scope.$broadcast('scroll.refreshComplete');
            })
        }

        $scope.startChat = function(id, name) {
            Native.run('umengLog', ['event', 'detail', 'AssistantChatWithPatient']);
            Native.run('startChat', [id, name]);
        }

        $scope.viewReferral = function(e, id) {
            Native.run('umengLog', ['event', 'detail', 'DoctorViewPatientReferral']);
            Native.run('html5Log', ['07', '0074']);
            e.stopPropagation();
            e.preventDefault();
            window.location.href = '#tab/assistant/me/referral/' + id;
            return false;
        }
    });
})

.controller('AssistantPatientsSearchListCtrl', function($scope, $ionicPlatform, $stateParams, AssistantDoctorServ) {
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['07', '0073']);
        AssistantDoctorServ.loadLocalPatients($stateParams.id).then(function(resp) {
            $scope.patientList = resp;
        })

        $scope.doRefresh = function() {
            console.log('patientList')
            AssistantDoctorServ.loadLocalPatients($stateParams.id).then(function(resp) {
                $scope.patientList = resp;
                $scope.$broadcast('scroll.refreshComplete');
            })
        }

        $scope.startChat = function(id, name) {
            Native.run('umengLog', ['event', 'detail', 'AssistantChatWithPatient']);
            Native.run('startChat', [id, name]);
        }

        $scope.viewReferral = function(e, id) {
            Native.run('umengLog', ['event', 'detail', 'DoctorViewPatientReferral']);
            Native.run('html5Log', ['07', '0074']);
            e.stopPropagation();
            e.preventDefault();
            window.location.href = '#tab/assistant/me/referral/' + id;
            return false;
        }
    });
})

.controller('AssistantReservationCtrl', function($scope, $ionicPlatform, AssistantDoctorServ) {
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['06', '0070']);
        Native.getAuth('assistant', function(userInfo) {
            AssistantDoctorServ.loadUseIn(userInfo.assistantId).then(function(resp) {
                $scope.doctorList = resp;
            })
        })

        $scope.doRefresh = function() {
            AssistantDoctorServ.reloadUseIn().then(function(resp) {
                $scope.doctorList = resp;
                $scope.$broadcast('scroll.refreshComplete');
            })
        }

        $scope.viewInfo = function(e, id) {
            Native.run('umengLog', ['event', 'detail', 'AssistantViewDoctorInfo']);
            e.stopPropagation();
            e.preventDefault();
            window.location.href = "#tab/assistant/me/info/" + id
            return false;
        }
    });
})

.controller('AssistantReservationListCtrl', function($scope, $ionicPlatform, $stateParams, AssistantDoctorServ) {
    $ionicPlatform.ready(function() {
        AssistantDoctorServ.reloadReservation($stateParams.id).then(function(resp) {
            Native.run('html5Log', ['08', '0076']);
            $scope.reservationList = resp;
            $scope.msg00 = '暂无待确认预约记录';
            $scope.msg01 = '暂无已确认预约记录';
            for (var i in resp.list) {
                console.log(resp.list[i])
                if (resp.list[i].status == '00')
                    $scope.msg00 = '';
                else if (resp.list[i].status == '01')
                    $scope.msg01 = '';
            }
        })

        $scope.doRefresh = function() {
            AssistantDoctorServ.reloadReservation($stateParams.id).then(function(resp) {
                $scope.reservationList = resp;

                $scope.msg00 = '暂无待确认预约记录';
                $scope.msg01 = '暂无已确认预约记录';
                for (var i in resp.list) {
                    if (resp.list[i].status == '00')
                        $scope.msg00 = '';
                    else if (resp.list[i].status == '01')
                        $scope.msg01 = '';
                }

                $scope.$broadcast('scroll.refreshComplete');
            })
        }

        $scope.startChat = function(id, name) {
            Native.run('umengLog', ['event', 'detail', 'AssistantChatWithPatient']);
            Native.run('startChat', [id, name]);
        }

        $scope.viewReferral = function(e, id) {
                Native.run('umengLog', ['event', 'detail', 'DoctorViewPatientReferral']);
                Native.run('html5Log', ['07', '0074']);
                e.stopPropagation();
                e.preventDefault();
                // Native.run('viewHistory', [id]);
                window.location.href = '#tab/assistant/me/referral/' + id;
                return false;
            }
            /*$scope.viewHistory = function(e, id) {
                Native.run('umengLog', ['event', 'detail', 'AssistantViewPatientHistory']);
                e.stopPropagation();
                e.preventDefault();
                Native.run('viewHistory', [id]);
                return false;
            }*/
    });
})

.controller('AssistantDoctorsCtrl', function($scope, $ionicPlatform, $ionicHistory, AssistantDoctorServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['06', '0071']);
        Native.run('html5Log', ['06', '0072']);
        Native.getAuth('assistant', function(userInfo) {
            AssistantDoctorServ.load(userInfo.assistantId).then(function(resp) {
                    $scope.doctorList = resp;
                })
                /*AssistantDoctorServ.loadUseIn(userInfo.assistantId).then(function(resp) {
                    $scope.userInDoctorList = resp;
                })*/
        })

        $scope.doRefresh = function() {
            AssistantDoctorServ.reload().then(function(resp) {
                    $scope.doctorList = resp;
                    $scope.$broadcast('scroll.refreshComplete');
                })
                /*AssistantDoctorServ.reloadUseIn().then(function(resp) {
                    $scope.userInDoctorList = resp;
                    $scope.$broadcast('scroll.refreshComplete');
                })*/
        }

        $scope.startChat = function(id, name) {
            Native.run('umengLog', ['event', 'detail', 'AssistantChatWithDoctor']);
            Native.run('startChat', [id, name]);
        }

        /*$scope.startGroupChat = function(id, name) {
            Native.run('umengLog', ['event', 'detail', 'AssistantChatWithDoctorGroup']);
            Native.run('startGroupChat', [id, name]);
        }*/

        $scope.viewInfo = function(e, id) {
            Native.run('umengLog', ['event', 'detail', 'AssistantViewDoctorInfo']);
            e.stopPropagation();
            e.preventDefault();
            window.location.href = "#tab/assistant/me/info/" + id
            return false;
        }
    });
})

.controller('AssistantInfoByIdCtrl', function($scope, $ionicPlatform, $rootScope, $stateParams, $timeout, $ionicScrollDelegate, $ionicListDelegate, $ionicHistory, AssistantDoctorServ, CommentServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        AssistantDoctorServ.reloadById($stateParams.id).then(function(resp) {
            $rootScope.doctor = resp;
            $scope.commentList = [];
            if ($rootScope.doctor.modelid == '11') {
                CommentServ.reload($stateParams.id, 1).then(function(comment) {
                    $scope.comment = comment;
                    $scope.commentList = comment.list;
                    CommentServ.hasmore = comment.page_total > 1;
                });
            } else {
                CommentServ.reserveList($stateParams.id, 1, '00').then(function(response) {
                    $scope.comment = response;
                    CommentServ.hasmore = response.total / 10 > 1;
                    for (var i = 0; i < response.rows.length; i++) {
                        response.rows[i].name = response.rows[i].patientNickName;
                        response.rows[i].star = response.rows[i].eveluateStar;
                        response.rows[i].content = response.rows[i].eveluateContent;
                        $scope.commentList.push(response.rows[i]);
                    }
                    /*$scope.$broadcast('scroll.infiniteScrollComplete');
                    CommentServ.curPage++;
                    $ionicScrollDelegate.freezeScroll(false);*/
                });
            }
        })



        $scope.loadMore = function() {
            //这里使用定时器是为了缓存一下加载过程，防止加载过快
            $timeout(function() {
                if (!CommentServ.hasmore) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                if ($rootScope.doctor.modelid == '11') {
                    CommentServ.reload($stateParams.id, CommentServ.curPage).then(function(response) {
                        CommentServ.hasmore = response.page_total > CommentServ.curPage;
                        for (var i = 0; i < response.list.length; i++) {
                            $scope.commentList.push(response.list[i]);
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        CommentServ.curPage++;
                        $ionicScrollDelegate.freezeScroll(false);
                    });
                } else {
                    CommentServ.reserveList($stateParams.id, CommentServ.curPage, '00').then(function(response) {
                        CommentServ.hasmore = response.total / 10 > CommentServ.curPage;
                        for (var i = 0; i < response.rows.length; i++) {
                            response.rows[i].name = response.rows[i].patientNickName;
                            response.rows[i].star = response.rows[i].eveluateStar;
                            response.rows[i].content = response.rows[i].eveluateContent;
                            $scope.commentList.push(response.rows[i]);
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        CommentServ.curPage++;
                        $ionicScrollDelegate.freezeScroll(false);
                    });
                }
                /*CommentServ.reload($stateParams.id, CommentServ.curPage).then(function(response) {
                    CommentServ.hasmore = response.page_total > CommentServ.curPage;
                    for (var i = 0; i < response.list.length; i++) {
                        $scope.comment.list.push(response.list[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    CommentServ.curPage++;
                });*/
            }, 1000);
        };
        $scope.moreDataCanBeLoaded = function() {
            return CommentServ.hasmore;
        }
        $scope.$on('stateChangeSuccess', function() {
            $scope.loadMore();
        });
        //$ionicListDelegate.showReorder(true);
    });
})

.controller('AssistantInfoEditCtrl', function($scope, $ionicPlatform, $rootScope, $stateParams, $ionicPopup, AssistantDoctorServ) {
    $ionicPlatform.ready(function() {
        AssistantDoctorServ.reloadById($stateParams.id).then(function(resp) {
            $scope.doctor = resp;
        })

        $scope.userid = $stateParams.id;
        $scope.status = $stateParams.status;
        $scope.tit = $stateParams.status.replace('0', '临床职称').replace('1', '擅长').replace('2', '职业经历').replace('3', '简介');

        $scope.cancelBack = function() {
            window.history.back();
        }

        $scope.saveBack = function() {
            if ($scope.doctor.modelid == 11) {
                AssistantDoctorServ.updateAssistantInfo($scope.doctor.brief).then(function(resp) {
                    $rootScope.doctor.brief = $scope.doctor.brief;
                    window.history.back();
                });
            } else {
                AssistantDoctorServ.updateDoctorInfo($scope.userid, $scope.doctor.profession, $scope.doctor.adept, $scope.doctor.intro).then(function(resp) {
                    $rootScope.doctor.profession = $scope.doctor.profession;
                    $rootScope.doctor.adept = $scope.doctor.adept;
                    $rootScope.doctor.intro = $scope.doctor.intro;
                    window.history.back();
                });
            }
        }
    });
})


.controller('AssistantEarningCtrl', function($scope, $ionicPlatform, $ionicHistory, AssistantAssistantServ, AssistantEarningServ, DoctorDoctorServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {

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

            AssistantEarningServ.reloadTradeAmount(monthFormated).then(function(resp) {
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
                AssistantEarningServ.reloadSubjectAmount(monthFormated).then(function(resp) {
                    var subjectAmount = {};
                    for (var i in resp.data) {
                        subjectAmount[resp.data[i].subjectName] = resp.data[i].tradeAmount;
                    }
                    $scope.subjectAmount = subjectAmount;
                    $scope.isSettlement = resp.isSettlement == '0' ? '未结算' : '已结算';
                })
            })
        }

        // 加载医生信息
        AssistantAssistantServ.reload().then(function(resp) {
            $scope.doctor = resp;

            DoctorDoctorServ.getBalance().then(function(balance) {
                    $scope.doctor.balances = balance.balance;
                })
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
            Native.run('umengLog', ['event', 'detail', 'AssistantViewPrevMonth']);
            var _viewMonth = new Date(date),
                _viewMonthFormated = '';
            _viewMonth.setMonth(_viewMonth.getMonth() - 1);
            _viewMonthFormated = (new Date(_viewMonth)).format('yyyy-MM');
            _loadTradeAmount(_viewMonthFormated);
        }

        // 取下一月的交易总和
        $scope.nextMonth = function(date) {
            Native.run('umengLog', ['event', 'detail', 'AssistantViewNextMonth']);
            var _viewMonth = new Date(date),
                _viewMonthFormated = '';
            _viewMonth.setMonth(_viewMonth.getMonth() + 1);
            _viewMonthFormated = (new Date(_viewMonth)).format('yyyy-MM');
            _loadTradeAmount(_viewMonthFormated);
        }
    });
})

.controller('AssistantEarningDetailCtrl', function($scope, $timeout, $ionicPlatform, $stateParams, AssistantAssistantServ, AssistantEarningServ) {
    $ionicPlatform.ready(function() {
        $scope.subject = $stateParams.subject;
        switch ($stateParams.subject) {
            case 'insurance':
                $scope.icon = 'amount-img icon ion-cube yellow';
                $scope.title = '订单';
                break;
                /*            case 'interaction':
                                $scope.icon = 'amount-img icon ion-chatbubble-working balanced';
                                $scope.title = '互动';
                                break;
                            case 'appointment':
                                $scope.icon = 'amount-img icon ion-ios-time calm';
                                $scope.title = '预约';
                                break;*/
            case 'reward':
                $scope.icon = 'amount-img icon ion-ios-heart assertive';
                $scope.title = '打赏';
                break;
        }

        AssistantEarningServ.reloadSubjectDetail($stateParams.subject, $stateParams.month, 0).then(function(resp) {
            $scope.subjectDetail = resp;
            AssistantEarningServ.hasmore = resp.total / 10 > 1;
        })

        $scope.loadMore = function() {
            //这里使用定时器是为了缓存一下加载过程，防止加载过快
            $timeout(function() {
                if (!AssistantEarningServ.hasmore) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                AssistantEarningServ.reloadSubjectDetail($stateParams.subject, $stateParams.month, AssistantEarningServ.curPage).then(function(response) {
                    AssistantEarningServ.hasmore = response.total / 10 > AssistantEarningServ.curPage + 1;
                    for (var i = 0; i < response.list.length; i++) {
                        $scope.subjectDetail.list.push(response.list[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    AssistantEarningServ.curPage++;
                });
            }, 1000);
        };
        $scope.moreDataCanBeLoaded = function() {
            return AssistantEarningServ.hasmore;
        }
        $scope.$on('stateChangeSuccess', function() {
            $scope.loadMore();
        });
    });
})

.controller('AssistantQaCtrl', function($scope, $ionicPlatform, $ionicHistory, QaServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        QaServ.reload().then(function(resp) {
            $scope.qaList = resp.list;
        })
    });
})

.controller('AssistantQaDetailCtrl', function($scope, $stateParams) {
    $scope.location = 'http://ag.furuihui.com/article.php?id=' + $stateParams.id;
})

.controller('MeCtrl', function() {})

.controller('BonusResultCtrl', function($scope, $ionicHistory, $ionicPlatform, $stateParams, $ionicPopup, BonusServ, DoctorDoctorServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        DoctorDoctorServ.reload().then(function(doctor) {
            BonusServ.checkBonus(doctor.avatar, $stateParams.randomCode, doctor.userid, doctor.username, doctor.nickname).then(function(resp) {
                if (resp.money == 0) {
                    $scope.showContent = true;
                    $scope.content = "手慢了，红包已经被抢光了";
                } else {
                    $scope.showContent = false;
                    $scope.money = resp.money;
                }
                $scope.recordList = resp.recordList;
            })
        })
    });
})

.controller('DiscoverCtrl', function($scope, $rootScope, $ionicPlatform, $timeout, $ionicLoading, DiscoverServ) {
    $ionicPlatform.ready(function() {
        DiscoverServ.getDiscoverList().then(function(resp) {
            if (resp.length > 0) {
                $scope.discoverTitle = resp[0].imageCode;
                resp[0].isActive = true;
            }

            $scope.discoverList = resp;
        })

        $scope.pageState = {
            '00': { title: '活动', discoverType: '00', hasLoaded: false, rows: [], hasmore: true, curPage: 1 },
            '03': { title: '游戏', discoverType: '03', hasLoaded: false, rows: [], hasmore: true, curPage: 1 },
            '06': { title: '医院', discoverType: '06', hasLoaded: false, rows: [], hasmore: true, curPage: 1 },
            '04': { title: '知识', discoverType: '04', hasLoaded: false, rows: [], hasmore: true, curPage: 1 },
            '05': { title: '患友故事', discoverType: '05', hasLoaded: false, rows: [], hasmore: true, curPage: 1 },
            '02': { title: '药品', discoverType: '02', hasLoaded: false, rows: [], hasmore: true, curPage: 1 }
        }

        $scope.search = function(title) {
            console.log($scope.pageState[title].nameFilter)
            if (typeof($scope.pageState[title].nameFilter) === 'undefined' || $scope.pageState[title].nameFilter === '') {
                $ionicLoading.show({
                    template: '请输入搜索内容',
                    duration: 1200
                });
            }

            $scope.doRefresh(title);
        }

        $scope.doRefresh = function(title) {
            $scope.pageState[title].hasLoaded = false;
            $scope.pageState[title].rows = [];
            $scope.pageState[title].hasmore = true;
            $scope.pageState[title].curPage = 1;
            $scope.loadMore(title);
        }

        $scope.setActive = function(list) {
            for (var i in list) {
                list[i].isActive = false;
            }
            this.item.isActive = true;
            $scope.discoverTitle = this.item.imageCode;
            $scope.loadMore(this.item.imageCode);
        }

        var _lock = false;
        $scope.loadMore = function(title) {

            if (_lock) return;
            _lock = true;
            $scope.pageState[title].hasLoaded = false;
            //这里使用定时器是为了缓存一下加载过程，防止加载过快
            $timeout(function() {
                _lock = false;
                if (!$scope.pageState[title].hasmore) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                DiscoverServ.reload($scope.pageState[title].discoverType, $scope.pageState[title].curPage, 10, $scope.pageState[title].nameFilter).then(function(response) {
                    $scope.pageState[title].hasLoaded = true;
                    $scope.pageState[title].hasmore = response.total / 10 > $scope.pageState[title].curPage;
                    for (var i = 0; i < response.rows.length; i++) {
                        $scope.pageState[title].rows.push(response.rows[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.pageState[title].curPage++;
                });
            }, 1000);
        };
        $scope.moreDataCanBeLoaded = function(title) {
            return typeof title !== 'undefined' && $scope.pageState[title].hasmore;
        }
    })
})

.controller('ActDetailCtrl', function($scope, $ionicHistory, $ionicPlatform, $stateParams, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;

    $scope.doRefresh = function() {
        window.location.reload();
    }

    $scope.frameHistoryBack = function() {
        if ($ionicHistory.viewHistory().backView === null) {
            Native.run('historyBack', []);
        } else {
            $ionicHistory.goBack();
        }
    }
    $scope.detail = {};
    $scope.detail.discoveryType = '01';

    $ionicPlatform.ready(function() {
        $scope.$on('$ionicView.enter', function() {
            if (window.frames.length > 0) {
                window.frames[window.frames.length - 1].postMessage({
                    'func': 'doRefresh',
                    'resp': {}
                }, '*');
            }
        })

        var icon = '';
        Native.getAuth('patient', function(userInfo) {
            DiscoverServ.reloadDetail($stateParams.id, userInfo.patientId).then(function(resp) {
                switch (resp.discoveryType) {
                    case '00':
                        Native.run('html5Log', ['04', '0010']);
                        icon = WX_URL + 'img/icon/act.png';
                        break;
                    case '01':
                        Native.run('html5Log', ['03', '0012']);
                        icon = WX_URL + 'img/icon/logo.png';
                        break;
                    case '02':
                        Native.run('html5Log', ['04', '0020']);
                        icon = WX_URL + 'img/icon/medicine.png';
                        break;
                    case '03':
                        Native.run('html5Log', ['04', '0022']);
                        icon = WX_URL + 'img/icon/game.png';
                        break;
                    case '04':
                        Native.run('html5Log', ['04', '0013']);
                        icon = WX_URL + 'img/icon/knowledge.png';
                        break;
                    case '05':
                        Native.run('html5Log', ['04', '0011']);
                        icon = WX_URL + 'img/icon/story.png';
                        break;
                    case '06':
                        Native.run('html5Log', ['04', '0016']);
                        icon = WX_URL + 'img/icon/hospital.png';
                        break;
                    default:
                        break;
                }

                if (resp.subject != "") {
                    icon = WX_URL + 'img/icon/logo.png';
                }

                $scope.frameHistoryBack = function() {
                    if (resp.slideType == '01') {
                        window.frames[window.frames.length - 1].postMessage({
                            'func': 'historyBack',
                            'resp': null
                        }, '*');
                        window.Timer = setTimeout(function() {
                            if ($ionicHistory.viewHistory().backView === null) {
                                Native.run('historyBack', []);
                            } else {
                                $ionicHistory.goBack();
                            }
                        }, 500);
                    } else if ($ionicHistory.viewHistory().backView === null) {
                        Native.run('historyBack', []);
                    } else {
                        $ionicHistory.goBack();
                    }
                }

                resp.remark = resp.remark.replace(/<img src="/g, '<img src="' + JAVA_URL);
                $scope.detail = resp;
                $scope.tit = resp.title;
                $scope.link = resp.link + userInfo.patientId;
            })
        })
    });
})

.controller('ActCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicListDelegate, $timeout, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['04', '0015']);
        DiscoverServ.reload('00', 1, 10).then(function(resp) {
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
        //$ionicListDelegate.showReorder(true);
    });
})


.controller('GameCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicListDelegate, $timeout, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['04', '0021']);
        DiscoverServ.reload('03', 1, 10).then(function(resp) {
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
                DiscoverServ.reload('03', DiscoverServ.curPage, 10).then(function(response) {
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
        //$ionicListDelegate.showReorder(true);
    });
})


.controller('HospitalCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicListDelegate, $timeout, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['04', '0016']);
        DiscoverServ.reload('06', 1, 10).then(function(resp) {
            $scope.table = resp;
            DiscoverServ.hasmore = resp.total / 10 > 1;
        })

        function utf16toEntities(str) {
            var patt = /[\ud800-\udbff][\udc00-\udfff]/g;
            // 检测utf16字符正则 
            str = str.replace(patt, function(char) {
                var H, L, code;
                if (char.length === 2) {
                    H = char.charCodeAt(0);
                    // 取出高位 
                    L = char.charCodeAt(1);
                    // 取出低位
                    code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00;
                    // 转换算法
                    return "&#" + code + ";";
                } else {
                    return char;
                }
            });
            return str;
        }
        $scope.nameFilter = '';
        $scope.changeNameFilter = function(nameFilter) {
            $scope.nameFilter = nameFilter;
        }

        $scope.doRefresh = function() {
            DiscoverServ.reload('06', 1, 10, $scope.nameFilter).then(function(resp) {
                $scope.table = resp;
                DiscoverServ.hasmore = resp.total / 10 > 1;
                $scope.$broadcast('scroll.refreshComplete');
            })
        }

        $scope.loadMore = function() {
            //这里使用定时器是为了缓存一下加载过程，防止加载过快
            $timeout(function() {
                if (!DiscoverServ.hasmore) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                DiscoverServ.reload('06', DiscoverServ.curPage, 10, $scope.nameFilter).then(function(response) {
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
        //$ionicListDelegate.showReorder(true);
    });
})


.controller('KnowledgeCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicListDelegate, $timeout, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['04', '0017']);
        DiscoverServ.reload('04', 1, 10).then(function(resp) {
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
                DiscoverServ.reload('04', DiscoverServ.curPage, 10).then(function(response) {
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
        //$ionicListDelegate.showReorder(true);
    });
})


.controller('MedicineCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicListDelegate, $timeout, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['04', '0019']);
        DiscoverServ.reload('02', 1, 10).then(function(resp) {
            $scope.table = resp;
            DiscoverServ.hasmore = resp.total / 10 > 1;
        })

        $scope.nameFilter = '';
        $scope.changeNameFilter = function(nameFilter) {
            $scope.nameFilter = nameFilter;
        }

        $scope.doRefresh = function() {
            DiscoverServ.reload('02', 1, 10, $scope.nameFilter).then(function(resp) {
                $scope.table = resp;
                DiscoverServ.hasmore = resp.total / 10 > 1;
                $scope.$broadcast('scroll.refreshComplete');
            })
        }

        $scope.loadMore = function() {
            //这里使用定时器是为了缓存一下加载过程，防止加载过快
            $timeout(function() {
                if (!DiscoverServ.hasmore) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                DiscoverServ.reload('02', DiscoverServ.curPage, 10, $scope.nameFilter).then(function(response) {
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
        //$ionicListDelegate.showReorder(true);
    });
})


.controller('StoryCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicListDelegate, $timeout, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['04', '0018']);
        DiscoverServ.reload('05', 1, 10).then(function(resp) {
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
                DiscoverServ.reload('05', DiscoverServ.curPage, 10).then(function(response) {
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
        //$ionicListDelegate.showReorder(true);
    });
})

.controller('SchoolCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicListDelegate, $timeout, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.getAuth('doctor', function(userInfo) {

                DiscoverServ.reloadPhp(userInfo.auth, 1, 1, 10).then(function(resp) {
                    $scope.table = resp.list;
                    DiscoverServ.hasmore = resp.pageinfo.total_page > 1;
                })

                $scope.loadMore = function() {
                    //这里使用定时器是为了缓存一下加载过程，防止加载过快
                    $timeout(function() {
                        if (!DiscoverServ.hasmore) {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            return;
                        }
                        DiscoverServ.reloadPhp(userInfo.auth, 1, DiscoverServ.curPage, 10).then(function(response) {
                            DiscoverServ.hasmore = response.pageinfo.total_page > DiscoverServ.curPage;
                            for (var i = 0; i < response.list.length; i++) {
                                $scope.table.push(response.list[i]);
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
            })
            //$ionicListDelegate.showReorder(true);
    });
})


.controller('PlanCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicListDelegate, $timeout, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.getAuth('doctor', function(userInfo) {

                DiscoverServ.reloadPhp(userInfo.auth, 2, 1, 10).then(function(resp) {
                    $scope.table = resp.list;
                    DiscoverServ.hasmore = resp.pageinfo.total_page > 1;
                })

                $scope.loadMore = function() {
                    //这里使用定时器是为了缓存一下加载过程，防止加载过快
                    $timeout(function() {
                        if (!DiscoverServ.hasmore) {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            return;
                        }
                        DiscoverServ.reloadPhp(userInfo.auth, 2, DiscoverServ.curPage, 10).then(function(response) {
                            DiscoverServ.hasmore = response.pageinfo.total_page > DiscoverServ.curPage;
                            for (var i = 0; i < response.list.length; i++) {
                                $scope.table.rows.push(response.list[i]);
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
            })
            //$ionicListDelegate.showReorder(true);
    });
})

.controller('ArticleCtrl', function($scope, $rootScope, $ionicHistory, $ionicPopup, $ionicPlatform, $stateParams, $timeout, localStorageService, DiscoverServ, CommentServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $scope.hasQuestion = false;
    $scope.hasPager = $stateParams.hasPager == 1;
    $scope.have = 'yes';
    $ionicPlatform.ready(function() {
        Native.getAuth('patient', function(userInfo) {
            $scope.chatbox = { 'textContent': '' };

            DiscoverServ.reloadDetailPhp(userInfo.auth, $stateParams.id).then(function(resp) {
                $scope.detail = resp;
                $scope.tit = resp.info.title;
                $scope.hasQuestion = resp.question != '';
                $scope.have = resp.have;
            })

            $scope.myBack = function() {
                if ($scope.hasQuestion && $scope.have == 'no') {
                    $ionicPopup.confirm({
                        title: '提示',
                        template: '您确定看完这篇文章了吗？看完文章可以去答题领取奖励哦！',
                        okText: '去答题',
                        cancelText: '不答题'
                    }).then(function(res) {
                        if (res) {
                            localStorageService.set('exam', $scope.detail);
                            window.location.href = "#/tab/discover/question/" + $stateParams.id;
                        } else {
                            if ($ionicHistory.viewHistory().backView === null)
                                Native.run('historyBack', []);
                            else
                                $ionicHistory.goBack();

                        }
                    })
                } else {
                    if ($ionicHistory.viewHistory().backView === null)
                        Native.run('historyBack', []);
                    else
                        $ionicHistory.goBack();
                }
            }

            $scope.praise = function() {
                DiscoverServ.praisePhp(userInfo.auth, $stateParams.id).then(function(resp) {
                    $scope.detail.praise = 'yes';
                    $scope.detail.info.praisenum++;
                })
            }

            $scope.sendTextMessage = function(message) {
                DiscoverServ.commentArticlePhp(userInfo.auth, $stateParams.id, message).then(function(resp) {
                    $scope.comment.list.unshift({ content: message, create_time: (new Date()).format('yyyy-MM-dd hh:mm:ss') })
                    $scope.comment.pageinfo.total++;
                    $scope.chatbox.textContent = '';
                })
            }

            $scope.exam = function() {
                localStorageService.set('exam', $scope.detail);
                window.location.href = "#/tab/discover/question/" + $stateParams.id;
            }

            $scope.viewAnswer = function() {
                localStorageService.set('exam', $scope.detail);
                window.location.href = "#/tab/discover/question/" + $stateParams.id;
            }

            DiscoverServ.getCommentList(userInfo.auth, $stateParams.id, 1, 10).then(function(comment) {
                $scope.comment = comment;
                DiscoverServ.hasmore = comment.pageinfo.total_page > 1;
            });

            $scope.loadMore = function() {
                //这里使用定时器是为了缓存一下加载过程，防止加载过快
                $timeout(function() {
                    if (!DiscoverServ.hasmore) {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        return;
                    }
                    DiscoverServ.getCommentList(userInfo.auth, $stateParams.id, DiscoverServ.curPage, 10).then(function(response) {
                        DiscoverServ.hasmore = response.pageinfo.total_page > DiscoverServ.curPage;
                        for (var i = 0; i < response.list.length; i++) {
                            $scope.comment.list.push(response.list[i]);
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
        })

    });
})

.controller('QuestionCtrl', function($scope, $rootScope, $location, $ionicScrollDelegate, $ionicHistory, $ionicPlatform, $stateParams, $timeout, localStorageService, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;

    var colorArr = [
        ['#189ec1', '#97e9ff'],
        ['#ff6418', '#ffac83'],
        ['#ffbb18', '#ffdd8b'],
        ['#51c567', '#88ff9f'],
        ['#ff9037', '#ffcfa8']
    ];
    var _getRandomColor = function() {
        var _color = colorArr[Math.floor(Math.random() * colorArr.length)];
        $scope.bgColor = {
            'backgroundColor': _color[0]
        };
        $scope.foreColor = {
            'backgroundColor': _color[1]
        };
    }

    $scope.isFirst = false;
    $scope.isAnalyze = false;
    $scope.isStart = false;
    $scope.isResult = false;
    $scope.isEnter = false;

    function randomsort(a, b) {
        return Math.random() > .5 ? -1 : 1;
    }

    $scope.exam = localStorageService.get('exam');
    $scope.isEnter = true;
    /*        if (resp.code == 514) {
                $scope.isFirst = false;
                $scope.isStart = false;
                $scope.isResult = true;
                $scope.result = resp.data;
                return;
            }*/
    $scope.isStart = true;
    $scope.isFirst = true;
    $scope.exam.question.forEach(function(item) {
        item.choice = 'empty';
        // type
        if (item.type == 2) {
            item.question += '（多选）';
        }

        item.selected = [];
        item.sel = [];
        // options
        item.opts = [];
        for (var i in item.option) {
            item.opts.push([i, item.option[i]]);
        }
        item.opts = item.opts.sort(randomsort);

        // analyze
        if (item.answer) {
            item.analyzeOpts = [];
            var answerArr = item.answer.split(',');
            for (var i = 0; i < item.opts.length; i++) {

                if (answerArr.indexOf(item.opts[i][0]) > -1) {
                    item.analyzeOpts.push([i, item.opts[i]]);
                }
            }
        }

    });
    $scope.list = $scope.exam.question.sort(randomsort);
    $scope.len = $scope.exam.question.length;

    $scope.curr = 0;
    $scope.startTime = Date.now().toString().substr(0, 10);

    $scope.subNo = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十'];
    $scope.answer = [];

    if ($scope.exam.have == 'yes') {
        /*        $scope.isAnalyze = true;
                $scope.isResult = false;*/
        $scope.isStart = false;
        $scope.isResult = true;
        $scope.result = {
            allscore: $scope.exam.allscore,
            score: $scope.exam.score
        }
    }

    $scope.prev = function() {
        $scope.isResult || $scope.answer.pop();
        $scope.curr--;
        _getRandomColor();
        $scope.$broadcast('scroll.resize');
        $scope.scrollToMain();
    }

    $scope.next = function(id, choice) {
        $scope.curr++;
        $scope.isResult || $scope.answer.push(id + '-' + choice);
        _getRandomColor();
        $scope.$broadcast('scroll.resize');
        $scope.scrollToMain();
    }

    $scope.isSelected = function(id) {
        return $scope.list[$scope.curr].selected.indexOf(id) >= 0;
    }

    var updateSelected = function(action, id) {
        if (action == 'add' && $scope.list[$scope.curr].sel.indexOf(id) == -1) {
            $scope.list[$scope.curr].sel.push(id);
            $scope.list[$scope.curr].choice = $scope.list[$scope.curr].sel.join(',');
        }
        if (action == 'remove' && $scope.list[$scope.curr].sel.indexOf(id) != -1) {
            var idx = $scope.list[$scope.curr].sel.indexOf(id);
            $scope.list[$scope.curr].sel.splice(idx, 1);
            $scope.list[$scope.curr].choice = $scope.list[$scope.curr].sel.join(',');
        }
    }

    $scope.updateSelection = function($event, id) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id);
    }

    $scope.submit = function(id, choice) {
        _getRandomColor();
        $scope.answer.push(id + '-' + choice);
        var result = $scope.answer.join('|');
        Native.getAuth('doctor', function(userInfo) {
            DiscoverServ.saveAnswerPhp(userInfo.auth, $stateParams.id, result).then(function(resp) {
                $scope.result = resp;
                $scope.isResult = true;
                $scope.isStart = false;
            })
        })
        $scope.$broadcast('scroll.resize');
        $scope.scrollToMain();
    }

    $scope.showAnalyze = function() {
        $scope.curr = 0;
        $scope.isAnalyze = true;
        $scope.isResult = false;
        $scope.$broadcast('scroll.resize');
        $scope.scrollToMain();
    }

    $scope.viewResult = function() {
        $scope.isResult = true;
        $scope.isAnalyze = false;
        $scope.$broadcast('scroll.resize');
        $scope.scrollToMain();
    }

    $scope.scrollToMain = function() {
        $location.hash("container");
        $ionicScrollDelegate.anchorScroll(true);
    }
})

.controller('DoctorOrderYiganCtrl', function($scope, $ionicPlatform, $ionicHistory, localStorageService, OrderServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;

    $ionicPlatform.ready(function() {
        $scope.startChat = function(id, name) {
            Native.run('umengLog', ['event', 'detail', 'DoctorChatWithPatient']);
            Native.run('startChat', [id, name]);
        }
        Native.getAuth('doctor', function(userInfo) {
            /*OrderServ.getProductPatients(userInfo.auth, 2).then(function(resp) {
                $scope.hasLoaded = true;
                $scope.patientList = resp;
            })*/
            OrderServ.getYiganOrderList(userInfo.doctorId).then(function(resp) {
                var arr = [];
                for (var i in resp) {
                    if (resp[i].subject != '59' && resp[i].subject != '63' && resp[i].subject != '67')
                        arr.push(resp[i])
                }
                $scope.orderList = arr;
                $scope.hasLoaded = true;
            })

            OrderServ.getDoctorCity(userInfo.doctorId).then(function(isA) {
                if (isA == '0') {
                    $scope.isA = true;

                    OrderServ.reloadMedicalAList(userInfo.doctorId).then(function(resp) {
                        $scope.shop = resp;
                        $scope.hasLoaded = true;
                    })

                    $scope.viewDetail = function() {
                        localStorageService.set('productDetail', this.item);
                        window.location.href = "#/tab/doctor/me/order-yigan-detail-a";
                    }
                } else {
                    $scope.isB = true;

                    $scope.search = function(item) {
                        return (item.productTypeCode != '15' && item.productTypeCode != '16' && item.productTypeCode != '17') && $scope.pro.status === 'all' || item.productSubTypeCode === $scope.pro.status;
                    }
                    OrderServ.reloadMedicalBList(userInfo.doctorId).then(function(resp) {
                        $scope.list = resp;
                        $scope.hasLoaded = true;
                    })
                    $scope.pro = {};
                    $scope.pro.status = 'all';
                    $scope.setActive = function(status) {
                        $scope.pro.status = status;
                    }

                    $scope.viewDetail = function() {
                        localStorageService.set('productDetail', this.item);
                        window.location.href = "#/tab/doctor/me/order-yigan-detail-b";
                    }

                }
            });
        })
    });

})

.controller('DoctorOrderYiganDetailACtrl', function($scope, $rootScope, $timeout, $ionicScrollDelegate, localStorageService, CommentServ) {
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
            CommentServ.reserveList($scope.productDetail.id, CommentServ.curPage, '01').then(function(response) {
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

.controller('DoctorOrderYiganDetailBCtrl', function($scope, $rootScope, $timeout, $ionicScrollDelegate, localStorageService, CommentServ) {
    $scope.productDetail = localStorageService.get('productDetail');
    $scope.productDetail.remark = $scope.productDetail.remark.replace(/<img src="/g, '<img src="' + JAVA_URL);

    $scope.award = $scope.productDetail.mark == '2' ? '84.00' : $scope.productDetail.mark == '1' ? '28.00' : '365.00';
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
                CommentServ.reserveList($scope.productDetail.id, CommentServ.curPage, '01').then(function(response) {
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
})

.controller('DoctorOrderBingganCtrl', function($scope, $ionicHistory, $ionicPlatform, OrderServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        $scope.startChat = function(id, name) {
            Native.run('umengLog', ['event', 'detail', 'DoctorChatWithPatient']);
            Native.run('startChat', [id, name]);
        }
        Native.getAuth('doctor', function(userInfo) {
            /*OrderServ.getProductPatients(userInfo.auth, 3).then(function(resp) {
                $scope.hasLoaded = true;
                $scope.patientList = resp;
            })*/

            OrderServ.getBingganOrderList(userInfo.doctorId).then(function(resp) {
                $scope.orderList = resp;
                $scope.hasLoaded = true;
            })
        })
    })
})

.controller('DoctorOrderZhifangganCtrl', function($scope, $ionicHistory, $ionicPlatform, localStorageService, OrderServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        $scope.pro = {};
        $scope.pro.status = 'all';

        $scope.searchProductTypeCode = function(item) {
            return item.productTypeCode == '16' || item.productTypeCode == '17';

        }
        $scope.setActive = function(status) {
            $scope.pro.status = status;
        }

        Native.getAuth('doctor', function(userInfo) {
            OrderServ.getZhifangganOrderList(userInfo.doctorId).then(function(resp) {
                // console.log(resp);
                var arr = [];
                for (var i in resp) {
                    if (resp[i].subject == '63' || resp[i].subject == '67')
                        arr.push(resp[i]);
                    console.log(arr);
                }
                $scope.orderList = arr;
                $scope.hasLoaded = true;
            })

            OrderServ.reloadMedicalBList().then(function(resp) {
                $scope.list = resp;
            })
        })

        $scope.viewDetail = function() {
            localStorageService.set('productDetail', this.item);
            window.location.href = "#/tab/doctor/me/order-yigan-detail-a";
        }

    })
})

.controller('DoctorOrderGanaiCtrl', function($scope, $ionicHistory, $ionicPlatform, localStorageService, OrderServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;

    $ionicPlatform.ready(function() {
        $scope.pro = {};
        $scope.pro.status = 'all';
        $scope.setActive = function(status) {
            $scope.pro.status = status;
        }

        Native.getAuth('doctor', function(userInfo) {
            OrderServ.getYiganOrderList(userInfo.doctorId).then(function(resp) {
                var arr = [];
                for (var i in resp) {
                    console.log(resp[i].subject)
                    if (resp[i].subject == '59')
                        arr.push(resp[i])
                }
                $scope.orderList = arr;
                $scope.hasLoaded = true;
            })

            OrderServ.reloadMedicalBList().then(function(resp) {
                $scope.list = resp;
            })
        })

        $scope.viewDetail = function() {
            localStorageService.set('productDetail', this.item);
            window.location.href = "#/tab/doctor/me/order-yigan-detail-a";
        }
    });

})

.controller('DoctorOrderYingxiangCtrl', function($scope, $ionicHistory, $ionicPlatform) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;

})

.controller('DoctorFollowupCtrl', function($scope, $ionicHistory, $ionicPlatform, $stateParams, $ionicPopup, localStorageService, FollowupServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        $scope.patientId = $stateParams.patientId;
        Native.getAuth('doctor', function(userInfo) {
            FollowupServ.getTemplates(userInfo.auth).then(function(resp) {
                $scope.list = resp;
                for (var i in resp) {
                    localStorageService.set('followup' + resp[i].catid, resp[i]);
                }
            })
            $scope.drugcure = JSON.stringify(localStorageService.get('drugcure'));
            $scope.sports = JSON.stringify(localStorageService.get('sports'));
            if(localStorageService.get('sportssug') == null){
                $scope.sportssug == '';
            }else{
                $scope.sportssug = JSON.stringify(localStorageService.get('sportssug'));
            }
            $scope.mental = JSON.stringify(localStorageService.get('mental'));
            if(localStorageService.get('mentalsug') == null){
                $scope.mentalsug == '';
            }else{
                $scope.mentalsug = JSON.stringify(localStorageService.get('mentalsug'));
            }           
            $scope.nutrition = JSON.stringify(localStorageService.get('nutrition'));
            if(localStorageService.get('nutritionsug') == null){
                $scope.nutritionsug == '';
            }else{
                $scope.nutritionsug = JSON.stringify(localStorageService.get('nutritionsug'));
            }
            $scope.visit = localStorageService.get('visit');

            console.log($scope.sportssug);

            $scope.confirmLeave = function(){
                var planArr = [$scope.sports, $scope.mental,$scope.nutrition,$scope.jsonvisit];
                for(var i in planArr){
                    if($scope.drugcure && (planArr[i]==null)){
                        $ionicPopup.show({
                            title:'您离成功创建随访计划只差一点点距离了,确定要放弃吗？',
                            scope:$scope,
                            buttons:[
                                {
                                    text:'放弃',
                                    type:'button-positive',
                                    onTap:function(){
                                        Native.run('selectPatient',[]);
                                    }
                                },
                                {   
                                    text:'继续添加',
                                    type:'button-positive',
                                }
                            ]
                        })
                    }
                }
            }

            $scope.save = function() {                
                // console.log($scope.visit.content);
                $scope.jsonvisit = JSON.stringify($scope.visit);
                FollowupServ.saveFollowupPlan($stateParams.patientId,$scope.drugcure,  
                    $scope.nutrition,$scope.nutritionsug,$scope.sports, $scope.sportssug,$scope.mental,$scope.mentalsug,$scope.jsonvisit,userInfo.auth).then(function(resp) {
                    $ionicPopup.alert({
                        title: '计划添加成功'
                    }).then(function() {
                        localStorageService.remove('drugcure');
                        localStorageService.remove('nutrition');
                        localStorageService.remove('nutritionsug');
                        localStorageService.remove('sports');
                        localStorageService.remove('sportssug');
                        localStorageService.remove('mental');
                        localStorageService.remove('mentalsug');
                        localStorageService.remove('visit');
                        localStorageService.remove('planid');
                        Native.run('followUpdateSucc', []);
                        Native.run('historyBack', []);

                    })
                })
            }
        })
    })
})

.controller('DoctorFollowupChildPlanCtrl', function($scope, $ionicHistory, $ionicPlatform, $stateParams, localStorageService, FollowupServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.getAuth('doctor', function(userInfo) {
            $scope.id = parseInt($stateParams.id);
            $scope.patientId = $stateParams.patientId;
            $scope.planList = localStorageService.get('followup'+$stateParams.id);
            $scope.planListChild = [];
            for(var i in  $scope.planList.child){
                $scope.planListChild.push($scope.planList.child[i]);
            }
            $scope.setActive = function(index){                
                $scope.list = _recursivePlanChildren(this.item.child);  
                $scope.selected = index;
                function _recursivePlanChildren(list) {
                    var arr = [];
                    for(var i in list) {
                        arr.push(list[i]);
                        arr.concat(_recursivePlanChildren(list[i].child));
                    }
                    return arr;
                }   
                // console.log($scope.list);
            }

            $scope.group = [];
            $scope.group.show = false;

            $scope.toggleSlide = function(group){
                group.show = !group.show;
            }

            $scope.isMenuShown = function(group){
                return group.show;
            }

            $scope.goEdit = function(index){
                $scope.templateid = [];
                for(var i in this.list.template_name){
                   $scope.templateid.push(this.list.template_name[i].id);
                }
                console.log($scope.templateid);
                if (this.list.template_name) {
                    if ($stateParams.id == '1' || $stateParams.id == '4' || $stateParams.id == '5' ) {
                        FollowupServ.getTemplateById($scope.templateid[index],userInfo.auth).then(function(resp){
                                localStorageService.set('followupcontent',resp.content);
                                window.location.href="#/tab/doctor/me/followup-plan-edit/"+$stateParams.id+"/"+$stateParams.patientId;
                            })                     
                    } else if($stateParams.id == '2' ){
                        FollowupServ.getTemplateById($scope.templateid[index],userInfo.auth).then(function(resp){      
                            localStorageService.set('followupcontentdrugTem',resp.content);
                            window.location.href="#/tab/doctor/me/followup-plan-edit-drug/"+$stateParams.id+"/"+$stateParams.patientId;
                        }) 
                    }else{
                         FollowupServ.getTemplateById($scope.templateid[index],userInfo.auth).then(function(resp){
                            localStorageService.set('followupcontent',resp);
                            // localStorageService.set('planid',$scope.templateid[index]);
                            window.location.href="#/tab/doctor/me/followup-visit-plan/"+$stateParams.id+"/"+$stateParams.patientId;
                        }) 
                    }
                } 
            }
        })
    })
})

.controller('DoctorFollowupPlanEditCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicPopup, $stateParams, localStorageService, FollowupServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        $scope.followupTemplate = localStorageService.get('followupcontent');
        // $scope.data = { content: $scope.followupTemplate.content};
        $scope.save = function(content) {
            switch ($stateParams.id) {
                case '1':
                    localStorageService.set('nutrition', $scope.followupTemplate);                
                    localStorageService.set('nutritionsug',content);    
                    break;
                case '4':
                    localStorageService.set('sports', $scope.followupTemplate);                
                    localStorageService.set('sportssug',content);
                    break;
                case '5':
                    localStorageService.set('mental', $scope.followupTemplate);
                    localStorageService.set('mentalsug',content);
                    break;
            }
            var popAlert = $ionicPopup.alert({
                title:'添加成功！',
            });
            popAlert.then(function(){
                window.location.href = "#/tab/doctor/me/followup/" + $stateParams.patientId;
            })
        }
    })
})

.controller('DoctorFollowupPlanEditDrugCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicPopup, $stateParams, localStorageService, FollowupServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        $scope.drugTemplate = localStorageService.get('followupcontentdrugTem');
        $scope.save = function(){
            localStorageService.set('drugcure',$scope.drugTemplate);
            var popAlert = $ionicPopup.alert({
                title:'添加成功！',
            });
            popAlert.then(function(){
                 window.location.href = "#/tab/doctor/me/followup/" + $stateParams.patientId;
            })
        }
        $scope.editTem = function(){
            console.log(1);
            window.location.href="#/tab/doctor/me/followup-plan-drug-edit";
        }
    })
})


.controller('DoctorFollowupPlanDrugEditCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicPopup, $stateParams, localStorageService, FollowupServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
         $scope.drugTemplateEdit = localStorageService.get('followupcontentdrugTem');
         $scope.saveDrug = function(drugTemplate){
            console.log(drugTemplate);
            localStorageService.set('followupcontentdrugTem',drugTemplate);
            localStorageService.set('drugcure',drugTemplate);
            $ionicPopup.alert({
                title:'保存成功',
            }).then(function(){
               window.location.href = "#/tab/doctor/me/followup/" + $stateParams.patientId;
            })
         }
    })
})

.controller('DoctorFollowupVisitPlanCtrl', function($scope, $ionicHistory,$ionicPopup, $ionicPlatform, $stateParams, localStorageService, FollowupServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $scope.patientId = $stateParams.patientId;
    $ionicPlatform.ready(function() {
        $scope.cnnum = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十'];
        $scope.iffollowupVisitTemplate = localStorageService.get('followupcontent');     
        if(typeof $scope.iffollowupVisitTemplate.id == 'undefined'){
            $scope.followupVisitTemplate = localStorageService.get('followupcontent');
        }else{
            $scope.followupVisitTemplate = localStorageService.get('followupcontent').content;
        }
        $scope.addVisit = function() {
            localStorageService.set('addFollowupTemplate', { time: new Date().format('yyyy-MM-dd'), content: '', index: -1 });
            window.location.href = "#/tab/doctor/me/followup-visit-plan-edit/" + $stateParams.id + "/" + $stateParams.patientId;
        }

        $scope.editVisit = function(index) {
            localStorageService.set('addFollowupTemplate', { time: this.visitlist.time, content: this.visitlist.content, index: index });
            window.location.href = "#/tab/doctor/me/followup-visit-plan-edit/" + $stateParams.id + "/" + $stateParams.patientId;

        }

        $scope.save = function() {
            if(typeof localStorageService.get('followupcontent').id == 'undefined'){
                localStorageService.set('visit', localStorageService.get('followupcontent'));
            }else{
                localStorageService.set('visit', localStorageService.get('followupcontent').content);
            }
            $ionicPopup.alert({
                title:'添加成功！'
            }).then(function(){
                window.location.href = "#/tab/doctor/me/followup/" + $stateParams.patientId;
            })
        }
    })
})

.controller('DoctorFollowupVisitPlanEditCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicPopup, $stateParams, ionicDatePicker, localStorageService, FollowupServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        $scope.patientId = $stateParams.patientId;
        if(typeof localStorageService.get('followupcontent').id == 'undefined'){
            var _tempFollowTemplate = localStorageService.get('followupcontent');
        }else{
            var _tempFollowTemplate = localStorageService.get('followupcontent').content;
        }
        $scope.data = localStorageService.get('addFollowupTemplate');
        $scope.save = function() {
            if (!$scope.data.time) {
                $ionicPopup.alert({
                    title: '请填写复诊时间'
                });
                return;
            } else if (!$scope.data.content) {
                $ionicPopup.alert({
                    title: '请填写内容'
                });
                return;
            }
            if ($scope.data.index == -1) {
                _tempFollowTemplate.push($scope.data);
            } else {
                _tempFollowTemplate[$scope.data.index] = $scope.data;
            }
            _tempFollowTemplate.sort(function(a, b) {
                var x = new Date(a.time.replace(/-/g, '/'));
                var y = new Date(b.time.replace(/-/g, '/'));
                return x - y;
            })
            console.log(_tempFollowTemplate);
            localStorageService.set('followupcontent', _tempFollowTemplate);
            window.location.href = "#/tab/doctor/me/followup-visit-plan/" + $stateParams.id + "/" + $stateParams.patientId;
        }

        $scope.del = function() {
            $ionicPopup.confirm({
                title: '提示',
                template: '确定要删除本条复诊信息吗？',
                okText: '删除',
                cancelText: '取消'
            }).then(function(res) {
                if (res) {
                    _tempFollowTemplate.splice($scope.data.index, 1 );
                    localStorageService.set('followupcontent', _tempFollowTemplate);
                    window.location.href = "#/tab/doctor/me/followup-visit-plan/" + $stateParams.id + "/" + $stateParams.patientId;
                }
            })
        }

        var ipObj1 = {
            callback: function(val) { //Mandatory
                $scope.data.time = new Date(val).format('yyyy-MM-dd');
                console.log('Return value from the datepicker popup is : ' + val, new Date(val));
            },
            from: new Date(), //Optional
            to: new Date('2020/12/31'), //Optional
            inputDate: new Date($scope.data.time.replace(/-/g, '/')), //Optional
            closeOnSelect: true, //Optional
            templateType: 'popup' //Optional
        };

        $scope.openDatePicker = function() {
            console.log(ionicDatePicker)
            ionicDatePicker.openDatePicker(ipObj1);
        };
    })
})

.controller('doctorFlupCtrl', function($scope, $rootScope, $ionicHistory, $ionicPlatform, $stateParams, localStorageService, doctorFlupServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        $scope.tel = function(phoneNo) {
            Native.run('tel', [phoneNo]);
        }
        Native.getAuth('doctor', function(userInfo) {
            doctorFlupServ.doctorFlupInfo(userInfo.auth, $stateParams.id).then(function(resp) {
                $rootScope.doctorFlup = resp.info;
                $rootScope.doctorVisit = JSON.parse(resp.info.visit);
                localStorageService.set('doctorFlup', resp.info)
                localStorageService.set('doctorVisit', JSON.parse(resp.info.visit))
                $scope.goChangeDrug = function(state) {

                    window.location.href = "#/doctortemplateChange/" + $stateParams.id + "/" + $stateParams.patientId + "&" + state;

                }
            })
        })

    })
})

.controller('doctortemplateChangeCtrl', function($scope, $rootScope, ionicDatePicker, $ionicHistory, $ionicPlatform, $stateParams, localStorageService, doctorFlupServ, doctorFlupChangeServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {

        $rootScope.doctorFlup = localStorageService.get('doctorFlup')
        $rootScope.doctorVisit = localStorageService.get('doctorVisit')
        console.log($rootScope.doctorFlup)
        Native.getAuth('doctor', function(userInfo) {
            $scope.state = window.location.hash.substring(window.location.hash.lastIndexOf('&') + 1, window.location.hash.length);

            if($scope.state == 4) {

                $scope.doctorAdd = true;
                $rootScope.doctorVisit.push({
                    time: (new Date()).format('yyyy-MM-dd'),
                    content: ''
                });
                console.log($rootScope.doctorVisit)
                $scope.newIndex = $rootScope.doctorVisit.length - 1;
                var ipObj1 = {
                    callback: function(val) { //Mandatory
                        $scope.doctorVisit[$scope.newIndex].time = new Date(val).format('yyyy-MM-dd');
                        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                    },
                    from: new Date(), //Optional
                    inputDate: new Date($rootScope.doctorVisit[$scope.newIndex].time), //Optional
                    closeOnSelect: false, //Optional
                    templateType: 'popup' //Optional
                }
                $scope.openDatePicker = function() {
                    ionicDatePicker.openDatePicker(ipObj1);
                };
                $scope.minDate = new Date();
            }
            if($scope.state.indexOf(',') !== -1) {
                console.log($scope.state)
                $scope.doctorRemind = true;
                $scope.arrIndex = $scope.state.split(',')[1];
                $scope.state = $scope.state.split(',')[0];
                var ipObj1 = {
                    callback: function(val) { //Mandatory
                        $scope.doctorVisit[$scope.arrIndex].time = new Date(val).format('yyyy-MM-dd');
                        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                    },
                    from: new Date(), //Optional
                    inputDate: new Date($rootScope.doctorVisit[$scope.arrIndex].time), //Optional
                    closeOnSelect: false, //Optional
                    templateType: 'popup' //Optional
                }
                $scope.openDatePicker = function() {
                    ionicDatePicker.openDatePicker(ipObj1);
                };
                $scope.minDate = new Date();

            }
            $scope.save = function(doctorFlup, doctorVisit) {
                if($rootScope.doctorFlup.drug == ""){
                    $rootScope.doctorFlup.drug = "暂无";
                }
                if($rootScope.doctorFlup.non_drug == ""){
                    $rootScope.doctorFlup.non_drug = "暂无";
                }
                if($rootScope.doctorFlup.non_drug_remark == ""||$rootScope.doctorFlup.non_drug_remark == null){
                    $rootScope.doctorFlup.non_drug_remark = "暂无";
                }
                if($rootScope.doctorFlup.mind == "") {
                    $rootScope.doctorFlup.mind = "暂无";
                }
                if($rootScope.doctorFlup.mind_remark == ""||$rootScope.doctorFlup.mind_remark == null) {
                    $rootScope.doctorFlup.mind_remark = "暂无";
                }
                if($rootScope.doctorFlup.sport == "") {
                    $rootScope.doctorFlup.sport = "暂无";
                }
                if($rootScope.doctorFlup.sport_remark == ""||$rootScope.doctorFlup.sport_remark == null) {
                    $rootScope.doctorFlup.sport_remark = "暂无";
                }
                doctorFlup.visit = JSON.stringify(doctorVisit);
                doctorFlupChangeServ.doctorFlupChange(userInfo.auth, doctorFlup).then(function(resp) {
                    localStorageService.set('doctorFlup', doctorFlup)
                    localStorageService.set('doctorVisit', doctorVisit)
                })
                window.history.go(-1);
            }

            switch($scope.state) {
                case '0':
                    $scope.tit = "药物治疗方案编辑";
                    break;
                case '1':
                    $scope.tit = "营养方案编辑";
                    break;
                case '2':
                    $scope.tit = "运动方案编辑";
                    break;
                case '3':
                    $scope.tit = "心理方案编辑";
                    break;
                case '4':
                    $scope.tit = $scope.doctorRemind ? "复诊提醒编辑" : "新增复诊提醒";
                    break;
            }
        })

    })
})

.controller('doctorFlupDetailCtrl', function($scope, $ionicHistory, $ionicPlatform, $stateParams, localStorageService, doctorFlupDetailServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.getAuth('doctor', function(userInfo) {
            doctorFlupDetailServ.doctorFlupDetail(userInfo.auth, $stateParams.id).then(function(resp) {
                if(resp.record.length == "0" && resp.waiting.length == "0") {
                    $scope.detailFlupNo = true;
                    $scope.detailFlupYes = false;
                } else {
                    $scope.detailFlupNo = false;
                    $scope.detailFlupYes = true;
                }
                $scope.flupDetailR = resp.record;
                // console.log($scope.flupDetailR.list);
            })
        })

    })
})

.controller('reportListCtrl', function($scope, $stateParams, $ionicHistory, $ionicPopup, $rootScope, $timeout, localStorageService, $ionicSlideBoxDelegate, $ionicPlatform, patientListServ) {
        $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
        $ionicPlatform.ready(function() {
            $scope.viewDetail = function() {
            	localStorageService.set('reportItem', this.list);
            }
               localStorageService.get('patientid')
            function _getReport(count) {
                Native.getAuth('patient', function(userInfo) {
                    console.log(userInfo.auth)
                    patientListServ.reportLi(userInfo.auth, $stateParams.patientid).then(function(resp) {
                        $scope.patientList = resp.list;
                        for(var i in $scope.patientList) {
                            if($scope.patientList[i].testlist.length >= "10") {
                                $scope.patientList[i].testlist = $scope.patientList[i].testlist.substring(0, 10) + "...";
                            }
                        }
                        if($scope.patientList.length != 0) {
                            $scope.firstDiv = false;
                            $scope.secondDiv = false;
                            $rootScope.threeDiv = true;
                            if(count > 0) {
                                $ionicPopup.alert({
                                    template: '您的化验单报告结果已经加载完成！'
                                })
                            }
                        }
                        if($scope.patientList.length == 0) {
                        	$scope.firstDiv = false;
                        	$scope.secondDiv = true;
                            $timeout(function() {
                                _getReport(++count)
                            }, 10000);
                        }

                    })
                })

            }
            _getReport(0);
        })
    })
    .controller('reportDetailCtrl', function($scope, $ionicHistory, $ionicPlatform, localStorageService,$ionicSlideBoxDelegate, $timeout, $ionicLoading, $stateParams, patientDetailServ) {
        $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
        $ionicPlatform.ready(function() {
            $scope.reportItem = localStorageService.get('reportItem');
            if($scope.reportItem.testlist.length >= "6"){
            	$scope.reportItem.testlist = $scope.reportItem.testlist.substring(0,6)+"..."
            }           
            Native.getAuth('patient', function(userInfo) {
                patientDetailServ.reportDetail(userInfo.auth, $stateParams.id).then(function(resp) {
                    $scope.patientInfo = resp.info;
                    $scope.reportOne = true;
                    if($scope.patientInfo.type == 1) {
                        $scope.reportOne = true;
                        $scope.reportTwo = false;
                        $scope.reportThree = false;
                    }
                })
            })
        })
    })