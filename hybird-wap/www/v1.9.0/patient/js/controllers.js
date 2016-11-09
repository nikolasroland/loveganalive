'use strict';
angular.module('starter.controllers', [])

.controller('TabCtrl', function($scope, $state) {
    $scope.state = $state.current.name;
})

.controller('HomeCtrl', function($scope, localStorageService) {
    umengLog('PatientView', 'HomeController');
})

.controller('AdvisoryCtrl', function($scope, $http, $location, localStorageService, DoctorServ, CommentServ) {
    umengLog('PatientView', 'AdvisoryController');
    DoctorServ.reload().then(function(resp) {
        $scope.doctor = resp;

        CommentServ.reload(resp.userid, CommentServ.curPage).then(function(comment) {
            $scope.comment = comment;
        });
    })


    $scope.startChat = function(id, name) {
        umengLog('PatientClick', 'ChatWithDoctor');
        if (ionic.Platform.isAndroid())
            Device.startChat(id, name);
        else if (ionic.Platform.isIOS())
            window.location.href = 'ios://startChart/' + id + '/' + name;
    }
})

.controller('MeCtrl', function($scope, $http, $location, localStorageService, PatientServ) {
    umengLog('PatientView', 'MeController');
    PatientServ.reload().then(function(resp) {
        $scope.patient = resp;
    })
})

.controller('ServiceCtrl', function($scope, $rootScope, $ionicHistory, localStorageService, PatientServ, ServiceServ) {
    umengLog('PatientView', 'ServiceController');
    if ($rootScope.isIOS) {
        $scope.img = function(id) {
            switch (id) {
                case 7:
                    return '../img/1yuan.png';
                case 8:
                    return '../img/5yuan.png';
                case 9:
                    return '../img/10yuan.png';
                default:
                    return '../img/servicecase.png';
            }
        }
        $scope.name = function(productName) {
            switch (productName) {
                case '鲜花':
                    return '打赏1元';
                case '锦旗':
                    return '打赏5元';
                case '奖杯':
                    return '打赏10元';
                default:
                    return productName;
            }
        }
    } else {
        $scope.img = function(id) {
            switch (id) {
                case 7:
                    return '../img/flower.png';
                case 8:
                    return '../img/flag.png';
                case 9:
                    return '../img/cup.png';
                default:
                    return '../img/servicecase.png';
            }
        }
    }


    $scope.serviceList = localStorageService.get('service');
    PatientServ.reload().then(function(resp) {
        ServiceServ.query(resp.userid).then(function(resp) {
            $scope.serviceList = resp.data;
        })
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

.controller('ReservationCtrl', function($scope, $ionicHistory, localStorageService, ReservationServ, DoctorServ, PatientServ) {
    umengLog('PatientView', 'ReservationController');
    DoctorServ.reload().then(function(resp) {
        $scope.doctor = resp;
    })
    PatientServ.reload().then(function(resp) {
        $scope.reservationList = localStorageService.get('reservation');
        ReservationServ.query(resp.userid).then(function(resp) {
            $scope.reservationList = resp.data;
        });
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

.controller('RewardCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, $location, $ionicHistory, localStorageService, DoctorServ, PatientServ, CasemanagerServ, RewardServ, $ionicModal) {
    umengLog('PatientView', 'RewardController');
    if ($rootScope.isIOS) {
        document.getElementById('iosReward').style.display = 'block';
    } else {
        document.getElementById('androidReward').style.display = 'block';
    }

    if ($stateParams.id == 1) {
        CasemanagerServ.reload().then(function(resp) {
            $scope.doctor = resp;
            $scope.rewardTarget = '个管师';
        })
    } else {
        DoctorServ.reload().then(function(resp) {
            $scope.doctor = resp;
            $scope.rewardTarget = '医生';
        })
    }
    PatientServ.reload().then(function(resp) {
        $scope.patient = resp;
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


    var product = [{
        name: '鲜花',
        price: '1'
    }, {
        name: '锦旗',
        price: '5'
    }, {
        name: '奖杯',
        price: '10'
    }]
    $scope.product = product;
    $scope.productCount = 1;
    $scope.selectCount = '1';
    $scope.index = 0;

    $scope.reward = function(index) {
        $scope.selectShow = true;
        $scope.inputShow = false;
        $scope.index = index;
        switch (index) {
            case 0:
                $scope.img = '../img/flower.png';
                $scope.productId = 7;
                break;
            case 1:
                $scope.img = '../img/flag.png';
                $scope.productId = 8;
                break;
            case 2:
                $scope.img = '../img/cup.png';
                $scope.productId = 9;
                break;
        }
        rewardSet(index);
    };

    $scope.selectNum = function(num) {
        if (num == '0') {
            $scope.selectShow = false;
            $scope.inputShow = true;
            $scope.productCount = 1;
            return;
        }
        $scope.selectCount = num;
        $scope.productCount = parseInt(num);
    };

    function rewardSet(index) {
        $ionicPopup.show({
            // title: product[index].name + 'x1（' + product[index].price + $rootScope.ticket + '）',
            templateUrl: 'selectCount-modal',
            scope: $scope,
            buttons: [{
                text: '取消',
                onTap: function(e) {
                    $scope.selectCount = '1';
                }
            }, {
                text: '打赏',
                type: 'button-positive',
                onTap: function(e) {
                    if ($scope.productCount == null || typeof $scope.productCount == 'undefined') {
                        e.preventDefault();
                        $ionicPopup.alert({
                            title: '请输入数字!',
                        })
                        return;
                    }
                    //提交打赏
                    RewardServ.sendReward('123456', $scope.productId, $scope.productCount, $scope.doctor.userid, $scope.doctor.username, $scope.doctor.nickname, $scope.patient.userid, $scope.patient.username, $scope.patient.nickname).then(function() {
                        umengLog('PatientSubmit', 'RewardSuccess');
                        $ionicPopup.alert({
                            title: '打赏成功!',
                            template: ''
                        }).then(function() {
                            if (ionic.Platform.isAndroid()) {
                                Device.goBack();
                            } else if (ionic.Platform.isIOS()) {
                                window.location.href = 'ios://goBack'
                            }
                        })
                    })

                }
            }]
        });
    }


    $scope.rewardMoney = function(index) {
        $scope.selectShow = true;
        $scope.inputShow = false;
        switch (index) {
            case 0:
                $scope.img = '../img/1yuan.png';
                $scope.productId = 7;
                break;
            case 1:
                $scope.img = '../img/5yuan.png';
                $scope.productId = 8;
                break;
            case 2:
                $scope.img = '../img/10yuan.png';
                $scope.productId = 9;
                break;
        }
        rewardMoneySet(index);
    };

    function rewardMoneySet(index) {
        $ionicPopup.confirm({
            title: '向' + $scope.rewardTarget + '打赏' + product[index].price + $rootScope.ticket,
            template: '',
            okText: '打赏',
            cancelText: '取消'
        }).then(function(res) {
            if (res) {
                //提交打赏
                RewardServ.sendReward('123456', $scope.productId, $scope.productCount, $scope.doctor.userid, $scope.doctor.username, $scope.doctor.nickname, $scope.patient.userid, $scope.patient.username, $scope.patient.nickname).then(function() {
                    umengLog('PatientSubmit', 'RewardSuccess');
                    $ionicPopup.alert({
                        title: '打赏成功!',
                        template: ''
                    }).then(function() {
                        if (ionic.Platform.isAndroid()) {
                            Device.goBack();
                        } else if (ionic.Platform.isIOS()) {
                            window.location.href = 'ios://goBack'
                        }
                    })
                })
            }
        })
    }
})

.controller('WalletCtrl', function($scope, $rootScope, $http, $location, $ionicHistory, localStorageService, PatientServ, RechargeServ) {
    umengLog('PatientView', 'WalletController');
    $scope.patient = localStorageService.get('patient');
    PatientServ.reload().then(function(resp) {
        $scope.patient = resp;
        RechargeServ.reload(resp.userid, resp.username).then(function(resp) {
            $scope.rechargeList = resp;
        })
    });

    $scope.recharge = function() {
        umengLog('PatientClick', 'Recharge');
        if (ionic.Platform.isAndroid()) {
            Device.recharge();
        } else if (ionic.Platform.isIOS()) {
            window.location.href = "ios://recharge";
        }
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

.controller('InfoCtrl', function($scope, $http, $location, $ionicPopup, $ionicLoading, $ionicHistory, localStorageService, PatientServ) {
    umengLog('PatientView', 'InfoController');
    PatientServ.reload().then(function(resp) {
        $scope.patient = resp
    });
    $scope.maxDate = new Date();
    $scope.editState = true;
    $scope.cancelState = false;
    $scope.editButton = false;
    $scope.infoEdit = function() {
        $scope.editState = false;
        $scope.editButton = true;
        $scope.cancelState = true;
    };
    $scope.cancelEdit = function() {
        $scope.editState = true;
        $scope.cancelState = false;
        $scope.editButton = false;
        $scope.patient = localStorageService.get('patient');
    };

    $scope.updateUser = function(nickname, sex, birthday, is_own, disease, realname, telphone) {
        umengLog('PatientSubmit', 'UpdatePatientInfo');
        PatientServ.update(nickname, sex, birthday, is_own, disease, realname, telphone).then(function() {
            $ionicPopup.alert({
                title: '修改成功!',
                template: ''
            }).then(function() {
                if (ionic.Platform.isAndroid()) {
                    Device.updatePatientName(nickname, realname);
                } else if (ionic.Platform.isIOS()) {
                    window.location.href = "ios://updatePatientName/" + nickname + "/" + realname;
                }
                PatientServ.reload();
                if (ionic.Platform.isAndroid()) {
                    Device.historyBack();
                } else if (ionic.Platform.isIOS()) {
                    window.location.href = "ios://historyBack";
                }
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

.controller('VisitCtrl', function($scope, $rootScope, $ionicPopup, localStorageService, DoctorServ, PatientServ) {
    umengLog('PatientView', 'VisitController');
    var today = Date.now(),
        day = [];
    var distance = new Date().getDay() - 1;
    distance = distance == -1 ? 6 : distance;
    $scope.weekday = distance + 1;
    $scope.afternoon = new Date().getHours() > 12;
    day[0] = new Date(today + (3600 * 24 * (0 - distance) * 1000)).format('MM月dd日');
    day[1] = new Date(today + (3600 * 24 * (6 - distance) * 1000)).format('dd日');
    day[2] = new Date(today + (3600 * 24 * (7 - distance) * 1000)).format('MM月dd日');
    day[3] = new Date(today + (3600 * 24 * (13 - distance) * 1000)).format('dd日');

    $scope.week1 = day[0] + '~' + day[1];
    $scope.week2 = day[2] + '~' + day[3];

    DoctorServ.reload().then(function(resp) {
        $scope.doctor = resp;

        $scope.schedule = localStorageService.get('schedule');
        DoctorServ.querySchedule(resp.userid).then(function(resp) {
            $scope.schedule = resp.data;
            if ((resp.data.next_weeks === '0,0|0,0|0,0|0,0|0,0|0,0|0,0' && resp.data.this_weeks === '0,0|0,0|0,0|0,0|0,0|0,0|0,0') || resp.data.limitPeoples == 0) {
                $ionicPopup.alert({
                    title: $scope.doctor.nickname + '医生尚未开放预约加号',
                    template: '您可以通过医生的患友群里或找对应个管师进行询问'
                })
            }
        });
    });

    PatientServ.reload().then(function(resp) {
        $scope.patient = resp;
    })

    $scope.choose = function(week, sxw, active) {
        if (active) {
            $scope.selected = {
                week: week,
                sxw: sxw,
                selectedDate: new Date(today + (3600 * 24 * (0 - distance + week - 1) * 1000)).format('yyyy-MM-dd hh:mm:ss')
            }
        }
    }

    $scope.reserve = function(doctorId, doctorName, doctorNickName, patientId, patientName, patientNickName, amOrPm, subscribeTime, price) {
        $ionicPopup.prompt({
            title: '请输入密码',
            template: '支付' + price + $rootScope.ticket,
            inputType: 'password',
            okText: '确认',
            cancelText: '取消'
        }).then(function(res) {
            if (typeof res != 'undefined') {
                umengLog('PatientSubmit', 'ReserveSuccess');
                DoctorServ.updateReserve(doctorId, doctorName, doctorNickName, patientId, patientName, patientNickName, amOrPm, subscribeTime, res).then(function(resp) {
                    $ionicPopup.alert({
                        title: '预约成功!',
                        template: ''
                    });
                })
            }
        });
    }
})

.controller('HistoryCtrl', function($scope, DoctorServ) {
    umengLog('PatientView', 'HistoryController');
    DoctorServ.reload().then(function(resp) {
        $scope.doctor = resp;
    })
})

.controller('DoctorInfoCtrl', function($scope, $stateParams, $ionicHistory, $ionicListDelegate, $timeout, DoctorServ, CommentServ) {
    umengLog('PatientView', 'DoctorInfoController');
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

.controller('PlanCtrl', function($scope, $ionicHistory, PatientServ, PlanServ, DoctorServ) {
    umengLog('PatientView', 'PlanController');
    DoctorServ.reload().then(function(doctor) {
        umengLog('PatientClick', 'ChoosePlan');
        $scope.changePlan = function() {
            if (ionic.Platform.isAndroid()) {
                Device.changePlan(doctor.userid, doctor.username, doctor.nickname);
            } else if (ionic.Platform.isIOS()) {
                window.location.href = "ios://changePlan/" + doctor.userid + "/" + doctor.username + "/" + doctor.nickname;
            }
        }
    })

    PatientServ.reload().then(function(resp) {
        $scope.patient = resp;
        PlanServ.query(resp.userid).then(function(resp) {
            $scope.remark = resp.remark.replace(/<img src="/g, '<img src="' + JAVA_URL);
        });
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

.controller('PlanDetailCtrl', function($scope, $stateParams, $ionicHistory, $ionicPopup, $ionicLoading, PatientServ, PlanServ) {
    umengLog('PatientView', 'PlanDetailController');
    PatientServ.reload().then(function(resp) {
        $scope.patient = resp;
        PlanServ.reload(resp.userid).then(function(resp) {
            $scope.joinIn = function() {
                umengLog('PatientSubmit', 'JoinInPlan');
                if (resp.productCode == $stateParams.id) {
                    $ionicPopup.alert({
                        title: '更改治疗方案不能与当前方案相同',
                    })
                    return;
                }
                $ionicLoading.show();
                if (ionic.Platform.isAndroid()) {
                    Device.joinIn();
                } else if (ionic.Platform.isIOS()) {
                    window.location.href = "ios://joinIn";
                }
            }

        });
    })

    PlanServ.queryByCode($stateParams.id).then(function(resp) {
        $scope.remark = resp.remark.replace(/<img src="/g, '<img src="' + JAVA_URL);
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

.controller('TipsCtrl', function($scope, $stateParams, $ionicHistory, localStorageService, TipsServ) {
    umengLog('PatientView', 'TipsController');
    TipsServ.query($stateParams.id).then(function(resp) {
        // $scope.remark = resp.remark.replace(/<img src="/g, '<img src="' + JAVA_URL);
        document.getElementById('remark').innerHTML = resp.remark.replace(/<img src="/g, '<img src="' + JAVA_URL);
    });

    $scope.share = function() {
        umengLog('PatientClick', 'ShareTips');
        if (ionic.Platform.isAndroid()) {
            Device.share();
        } else if (ionic.Platform.isIOS()) {
            window.location.href = "ios://share";
        }
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

    if (localStorageService.get('auth') == null) {
        $scope.noHeader = false;
        $scope.noHeaderStyle = {
            top: 0
        };
    } else {
        $scope.noHeader = true;
        $scope.noHeaderStyle = {};
    }
})

.controller('CasemanagerCtrl', function($scope, $rootScope, $ionicListDelegate, $ionicHistory, $timeout, CasemanagerServ, PatientServ, CommentServ) {
    umengLog('PatientView', 'CasemanagerController');
    CasemanagerServ.reload().then(function(resp) {
        $scope.casemanager = resp;
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

    $scope.rate = function(modeid, userid, nickname) {
        if (ionic.Platform.isAndroid()) {
            Device.rate(modeid, userid, nickname);
        } else if (ionic.Platform.isIOS()) {
            window.location.href = "ios://rate/" + modeid + "/" + userid + "/" + nickname;
        }
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

.controller('DoctorCtrl', function($scope, $rootScope, $ionicListDelegate, $ionicHistory, $timeout, DoctorServ, PatientServ, CommentServ) {
    umengLog('PatientView', 'DoctorController');
    DoctorServ.reload().then(function(resp) {
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

    PatientServ.reload().then(function(resp) {
        $scope.changeDoctor = function() {
            umengLog('PatientClick', 'ClickChangeDoctorButton');
            if (ionic.Platform.isAndroid()) {
                Device.changeDoctor();
            } else if (ionic.Platform.isIOS()) {
                window.location.href = "ios://changeDoctor";
            }
        }
    })

    $scope.rate = function(modeid, userid, nickname) {
        if (ionic.Platform.isAndroid()) {
            Device.rate(modeid, userid, nickname);
        } else if (ionic.Platform.isIOS()) {
            window.location.href = "ios://rate/" + modeid + "/" + userid + "/" + nickname;
        }
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

.controller('DoctorSelectedCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, $location, $ionicHistory, DoctorServ, PatientServ) {
    umengLog('PatientView', 'DoctorSelectedController');
    $scope.canChangeDoctor = true;
    DoctorServ.reloadById($stateParams.id).then(function(doctor) {
        $scope.doctor = doctor;
        DoctorServ.reload().then(function(oldDoctor) {
            PatientServ.reload().then(function(patient) {
                DoctorServ.changeDoctorCheck(patient.userid, patient.username).then(function(price) {
                    $scope.canChangeDoctor = false;
                    $scope.changeDoctor = function() {
                        $ionicPopup.prompt({
                            title: '选择医生需要支付' + price.price + $rootScope.ticket,
                            template: '请输入密码',
                            inputType: 'password',
                            okText: '确认',
                            cancelText: '取消'
                        }).then(function(res) {
                            if (typeof res != 'undefined') {
                                umengLog('PatientSubmit', 'ChangeDoctorSuccess');
                                DoctorServ.changeDoctor(oldDoctor.userid, doctor.username, doctor.nickname, patient.userid, patient.username, patient.nickname, $stateParams.id, res).then(function(resp) {
                                    $location.path('tab/succ/' + $stateParams.id)
                                })
                            }
                        });
                    }
                })
            })
        })
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

.controller('SuccCtrl', function($scope, $stateParams, DoctorServ) {
    umengLog('PatientView', 'SuccController');
    DoctorServ.reloadById($stateParams.id).then(function(doctor) {
        $scope.doctor = doctor;
    });

    $scope.changeDoctorSucc = function() {
        if (ionic.Platform.isAndroid()) {
            Device.changeDoctorSucc();
        } else if (ionic.Platform.isIOS()) {
            window.location.href = "ios://changeDoctorSucc";
        }
    }
})

.controller('QaCtrl', function($scope, $ionicHistory, QaServ) {
    umengLog('PatientView', 'QaController');
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
    umengLog('PatientView', 'QaDetailController');
    $scope.location = 'http://ag.furuihui.com/article.php?id=' + $stateParams.id;
})

.controller('SettingsCtrl', function($scope) {
    umengLog('PatientView', 'SettingsController');

})

.controller('AboutusCtrl', function($scope) {
    umengLog('PatientView', 'AboutusController');

})

.controller('EditPasswordCtrl', function($scope) {
    umengLog('PatientView', 'EditPasswordController');

})
