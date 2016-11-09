"use strict";
angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $rootScope, $ionicSlideBoxDelegate, $ionicPlatform, DoctorServ, DiscoverServ, ReferralServ) {
    $ionicPlatform.ready(function() {
        $rootScope.today = (new Date()).getToday();

        if ($rootScope.loginState) {
            Native.getAuth('patient', function(userInfo) {

                ReferralServ.reloadMyPlan(userInfo.patientId).then(function(resp) {
                    $scope.planUrl = resp === '400023' ? '#/tab/home/plan' : '#/tab/home/referral';
                    $rootScope.today = (new Date(resp.visitTime.replace(/-/g, '/'))).getToday();
                })

                DoctorServ.reload(userInfo).then(function(resp) {
                    $scope.doctor = resp;
                })
            })
        } else {
            $scope.planUrl = '#/tab/home/plan';
            $scope.doctor = {
                icon: './img/avatar.png',
                'realname': '选择医生'
            };
        }


        DiscoverServ.getSlide($rootScope.loginState).then(function(resp) {
            for (var i in resp) {
                resp[i].cropImageUrl = JAVA_URL + resp[i].cropImageUrl;
            }
            $scope.slideList = resp;
        })

        DiscoverServ.getHomePageBottom().then(function(resp) {
            for (var i in resp) {
                for (var j in resp[i]) {
                    resp[i][j].cropImageUrl = JAVA_URL + resp[i][j].cropImageUrl;
                }
            }
            $scope.homePageBottom = resp;
        })

        $scope.repeatDone = function() {
            $ionicSlideBoxDelegate.update();
        };

    })
})

.controller('ChatCtrl', function($scope, $rootScope, $ionicPlatform, localStorageService) {
    var im = localStorageService.get('im');
    var imList = [];
    var imGroupList = [];
    for (var i in im) {
        if (im[i].type == 1 && im[i].modelid != 10) {
            imList.push(im[i]);
        } else if (im[i].type == 2) {
            imGroupList.push(im[i]);
        }
    }
    $scope.imList = imList;
    $scope.imGroupList = imGroupList;
})

.controller('BoxCtrl', function($scope, $ionicPlatform, $ionicPopup, $stateParams, $timeout, $ionicScrollDelegate, localStorageService, PatientServ) {
    $ionicPlatform.ready(function() {
        var _curLs = 'chatList-' + window.localStorage.getItem('patientId') + '-' + $stateParams.userid;
        $scope.chatbox = {
            target: getIMInfo($stateParams.userid),
            targetName: $stateParams.nickname,
            list: localStorageService.get(_curLs) || []
        }
        console.log($scope.chatbox.target)

        $scope.cannotSpeak = false;
        Native.getAuth('patient', function(userInfo) {
            PatientServ.getBalance(userInfo.auth).then(function(resp) {
                if (resp.balance > 0 || resp.service_days > 0) {
                    $scope.cannotSpeak = false;
                } else {
                    $scope.cannotSpeak = true;
                }
            })
        })

        $scope.isShowMenu = false;
        $scope.showMenu = function() {
            if ($scope.isShowMenu) {
                $scope.isShowMenu = false;

            } else
                $scope.isShowMenu = true;
        }

        $timeout(function() { $ionicScrollDelegate.scrollBottom(); }, 500)

        /*        RongIMClient.getInstance().hasRemoteUnreadMessages(window.localStorage.getItem('im_token'), {
                    onSuccess: function(hasMessage) {
                        if (hasMessage) {
                            console.log(hasMessage)
                        } else {
                            console.log('noop')
                        }
                    },
                    onError: function(err) {
                        console.log(err)
                    }
                });*/

        $scope.num = 1;
        var loop = function() {
            $scope.num += 1;
            $timeout(function() { loop(); }, 500);
        }
        loop();

        $scope.receiveMessage = function(msg) {
            var _ls = 'chatList-' + window.localStorage.getItem('patientId') + '-' + msg.targetId;
            var user = getIMInfo(msg.targetId)
            var sendUser = getIMInfo(msg.senderUserId);
            var chatInfo = {
                date: new Date(),
                icon: sendUser.icon,
                nickname: sendUser.nickname,
                header: sendUser.header,
                messageType: msg.messageType,
                message: msg.content.content,
                avatar: 'left'
            }
            var _chatInfoList = localStorageService.get(_ls) || [];
            _chatInfoList.push(chatInfo);
            localStorageService.set(_ls, _chatInfoList);

            if (msg.targetId == $stateParams.userid) {
                $scope.chatbox.list.push(chatInfo)
                $timeout(function() {
                    $ionicScrollDelegate.scrollBottom();
                }, 100);
            }
        }

        $scope.sendTextMessage = function(msg, messageType) {
            if ($scope.cannotSpeak) {
                $ionicPopup.confirm({
                    title: '余额不足',
                    template: '',
                    okText: '充值',
                    cancelText: '取消'
                }).then(function(res) {
                    if (res) {
                        Native.run('recharge', []);
                        Native.run('umengLog', ['event', 'detail', 'Recharge']);
                    }
                });
                return;
            }
            messageType = messageType || 'string';
            // 定义消息类型,文字消息使用 RongIMLib.TextMessage
            var msg;

            switch (messageType) {
                case 'string':
                case 'TextMessage':
                    msg = new RongIMLib.TextMessage({ content: msg, extra: "附加信息" });
                    break;
                case 'ImageMessage':
                    msg = new RongIMLib.ImageMessage({ content: msg, extra: "附加信息" });
                    break;
            }
            $scope.chatbox.textContent = '';
            var chatInfo = {
                date: new Date(),
                icon: window.localStorage.getItem('icon'),
                nickname: window.localStorage.getItem('patientNickName'),
                header: window.localStorage.getItem('header') || '同学',
                messageType: messageType,
                message: msg.content,
                avatar: 'right'
            }
            $scope.chatbox.list.push(chatInfo)
            localStorageService.set(_curLs, $scope.chatbox.list);
            $timeout(function() { $ionicScrollDelegate.scrollBottom(); }, 300)

            //或者使用RongIMLib.TextMessage.obtain 方法.具体使用请参见文档
            //var msg = RongIMLib.TextMessage.obtain("hello");
            var conversationtype = $scope.chatbox.target.gid == undefined ? RongIMLib.ConversationType.PRIVATE : RongIMLib.ConversationType.GROUP;
            var targetId = $stateParams.userid; // 目标 Id
            RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
                // 发送消息成功
                onSuccess: function(message) {
                    //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
                    console.log("Send successfully");
                },
                onError: function(errorCode, message) {
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                            info = '未知错误';
                            break;
                        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                            info = '在黑名单中，无法向对方发送消息';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                            info = '不在讨论组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_GROUP:
                            info = '不在群组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                            info = '不在聊天室中';
                            break;
                        default:
                            info = x;
                            break;
                    }
                    console.log('发送失败:' + info);
                }
            });
        }

        function getIMInfo(id) {
            var imList = localStorageService.get('im');
            for (var i in imList) {
                if (imList[i].gid == id) {
                    imList[i].nickname = imList[i].name;
                    return imList[i];
                } else if (imList[i].userid == id) {
                    return imList[i];
                }
            }
        }

        $scope.sendImgMessage = function(e) {
            if ($scope.cannotSpeak) {
                $ionicPopup.confirm({
                    title: '余额不足',
                    template: '',
                    okText: '充值',
                    cancelText: '取消'
                }).then(function(res) {
                    if (res) {
                        Native.run('recharge', []);
                        Native.run('umengLog', ['event', 'detail', 'Recharge']);
                    }
                });
                return;
            }
            var f = document.getElementById('chatImgFile').files[0],
                r = new FileReader();
            r.onloadend = function(e) {
                var uri = e.target.result + '';
                var img = new Image();
                img.src = uri;
                if (img.width > 100) {
                    img.onload = function() {
                        var canvas = document.createElement('canvas');
                        var ctx = canvas.getContext('2d');

                        canvas.width = 100;
                        canvas.height = img.height * 100 / img.width;
                        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
                        var smallUri = canvas.toDataURL(f.fileType);
                        smallUri = smallUri.substr(smallUri.indexOf('base64,') + 7)
                        $scope.sendTextMessage(smallUri, 'ImageMessage');
                    }
                } else {
                    uri = uri.substr(uri.indexOf('base64,') + 7)
                    $scope.sendTextMessage(uri, 'ImageMessage');
                }
            }
            r.readAsDataURL(f);
            $scope.isShowMenu = false;
        }
    })
})

.controller('HistoryCtrl', function($scope, $ionicPlatform, $stateParams, $ionicPopup, $ionicLoading, $ionicModal, $timeout, localStorageService, PatientServ) {
    var thisYear = (new Date).getFullYear()
    var years = [];
    for (var i = 2015; i <= thisYear; i++) {
        years.push(i.toString());
    }

    $scope.history = {
        years: years,
        year: thisYear.toString(),
        pics: []
    }

    $scope.changeYear = function(year) {
        Native.getAuth('patient', function(uesrInfo) {
            PatientServ.getHistory(uesrInfo, year).then(function(resp) {
                var arr = [];
                for (var i in resp.list) {
                    resp.list[i].date = (new Date(resp.list[i][0].inputtime * 1000)).format('yyyy-MM');
                    resp.list[i].month = i;
                    arr.push(resp.list[i])
                }
                $scope.history.pics = arr;
            })
        })
    }

    $scope.changeYear(thisYear.toString());

    $ionicModal.fromTemplateUrl('modal-image.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.imageModal = modal;
    });

    $scope.openImageModal = function(url) {
        $ionicLoading.show();
        $timeout(function() { $scope.imageUrl = url; }, 200);
        if (typeof $scope.imageModal !== 'undefined') {
            $scope.imageModal.show();
        } else {
            $timeout(function() { $scope.imageModal.show() }, 500);
        }
    };
    $scope.closeImageModal = function() {
        $scope.imageModal.hide();
        $scope.imageUrl = '../img/empty-ddd.png';
    };

    $scope.afterImageLoaded = function() {
        $ionicLoading.hide();
    }

    $scope.uploadFile = function(e) {
        $scope.popup = $ionicPopup.show({
            template: '<div class="medical-record-alert">' + '<p text-left>请选择合适照片的标签，以方便医师查看。您也可以编辑照片的名称。</p>' + '<button ng-click="upload(\'化验单\')" class="button button-small button-outline">化验单</button>' + '<button ng-click="upload(\'检查单\')" class="button button-small button-outline">检查单</button>' + '<button ng-click="upload(\'处方\')" class="button button-small button-outline">处方</button>' + '<button ng-click="upload(\'病历\')" class="button button-small button-outline">病历</button>' + '<input type="text" ng-model="customName" placeholder="自定义" /> <button ng-click="upload(customName)" class="button button-small button-outline" style="color:#b4b5b6; border-color:#b4b5b6;">确定</button>' + '</div>',
            scope: $scope,
            cssClass: 'history-popup'
        });
    }

    $scope.upload = function(name) {
        if (name == undefined) {
            $scope.popup.close();
            return;
        }
        var f = document.querySelector('[nav-bar=active]').querySelector('input[type=file]').files[0],
            r = new FileReader();
        r.onloadend = function(e) {
            var uri = e.target.result + '';
            var img = new Image();
            img.src = uri;
            img.onload = function() {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');

                canvas.width = 80;
                canvas.height = 80;
                ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 80, 80);
                var smallUri = canvas.toDataURL(f.fileType);

                Native.getAuth('patient', function(uesrInfo) {
                    uri = uri.substr(uri.indexOf('base64,') + 7)
                    smallUri = smallUri.substr(smallUri.indexOf('base64,') + 7)
                    PatientServ.uploadHistory(uesrInfo.auth, uri, smallUri, name, f.size, f.type.substr(6)).then(function() {
                        $ionicPopup.alert({
                            title: '上传成功',
                            template: ''
                        }).then(function() {
                            $scope.changeYear($scope.history.year)
                        })
                    })
                })
            }

        }
        r.readAsDataURL(f);

        $scope.popup.close();
    }



})

.controller('RateCtrl', function($scope, $rootScope, $timeout, $ionicPlatform, $stateParams, CommentServ) {
    $ionicPlatform.ready(function() {
        $scope.nickname = $stateParams.nickname;
        $scope.targetMode = $stateParams.modeid.replace('11', '个管师').replace('12', '医生');

        $scope.star = ['ion-ios-star', 'ion-ios-star', 'ion-ios-star', 'ion-ios-star', 'ion-ios-star'];
        $scope.rate = {
            score: 5,
            content: ''
        }
        Native.getAuth('patient', function(userInfo) {
            $scope.commitRate = function(score, content) {
                var timestamp = Date.now().toString().substr(0, 10);
                CommentServ.doComment(userInfo.auth, $stateParams.userid, score, content, timestamp).then(function(resp) {
                    $rootScope.historyBack();
                    $timeout(function() { Native.refresh() }, 1200);
                })
            }
        })

        $scope.setRate = function(score) {
            $scope.rate.score = score;
            for (var i = 0; i < 5; i++) {
                $scope.star[i] = score > i ? "ion-ios-star" : "ion-ios-star-outline";
            }
        }

    });
})

.controller('MeCtrl', function($scope, $rootScope, $ionicPlatform, PatientServ, ReferralServ) {
    $ionicPlatform.ready(function() {
        if ($rootScope.loginState) {
            Native.getAuth('patient', function(userInfo) {
                PatientServ.reload(userInfo).then(function(resp) {
                    $scope.patient = resp;
                })

                ReferralServ.reloadMyPlan(userInfo.patientId).then(function(resp) {
                    $scope.planUrl = resp === '400023' ? '#/tab/me/plan' : '#/tab/me/referral';
                })
            });
        } else {
            $scope.planUrl = '#/tab/me/plan';
        }
    })
})

.controller('SettingsCtrl', function($scope, $rootScope, $ionicPlatform, $ionicModal) {
    $ionicPlatform.ready(function() {

    });
})

.controller('ChangePasswordCtrl', function($scope, $rootScope, $ionicPlatform, $ionicPopup, LoginServ) {
    $ionicPlatform.ready(function() {
        $scope.pwd = {}
        $scope.changePassword = function(oldPwd, newPwd, confirmPwd) {
            if (oldPwd == undefined || newPwd == undefined || confirmPwd == undefined) {
                $ionicPopup.alert({
                    title: '请填写完整',
                    template: ''
                })
                return
            }
            if (newPwd !== confirmPwd) {
                $ionicPopup.alert({
                    title: '两次密码输入不一致，请重新输入',
                    template: ''
                })
                return
            }
            Native.getAuth('patient', function(userInfo) {
                LoginServ.changePassword(userInfo.auth, oldPwd, newPwd).then(function(resp) {
                    $ionicPopup.alert({
                        title: '密码修改成功，请重新登录',
                        template: ''
                    }).then(function() {
                        $rootScope.logout();
                    })
                })
            });
        }
    });
})

.controller('OtherCtrl', function($scope, $ionicPlatform) {})

.controller('DiscoverCtrl', function($scope, $ionicPlatform, $timeout, $ionicLoading, DiscoverServ) {
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
                DiscoverServ.reload($scope.pageState[title].discoverType, $scope.pageState[title].curPage, Native.pageSize, $scope.pageState[title].nameFilter).then(function(response) {
                    $scope.pageState[title].hasLoaded = true;
                    $scope.pageState[title].hasmore = response.total / Native.pageSize > $scope.pageState[title].curPage;
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

.controller('ServiceCtrl', function($scope, $ionicHistory, $ionicPlatform, $timeout, ServiceServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['06', '0029']);
        if (ionic.Platform.platform() === 'ios') {
            $scope.img = function(id, code) {
                switch (id) {
                    case 7:
                        return 'img/1yuan.png';
                    case 8:
                        return 'img/5yuan.png';
                    case 9:
                        return 'img/10yuan.png';
                    default:
                        if (code == '04' || code == '29')
                            return 'img/insurance.png';
                        else
                            return 'img/servicecase.png';
                }
            }
            $scope.name = function(id, productName) {
                switch (id) {
                    case 7:
                        return '打赏1元';
                    case 8:
                        return '打赏5元';
                    case 9:
                        return '打赏10元';
                    default:
                        return productName;
                }
            }
        } else {
            $scope.img = function(id, code) {
                switch (id) {
                    case 7:
                        return 'img/flower.png';
                    case 8:
                        return 'img/flag.png';
                    case 9:
                        return 'img/cup.png';
                    default:
                        if (code == '04' || code == '29')
                            return 'img/insurance.png';
                        else
                            return 'img/servicecase.png';
                }
            }
            $scope.name = function(id, productName) {
                switch (id) {
                    case 7:
                        return '鲜花';
                    case 8:
                        return '锦旗';
                    case 9:
                        return '奖杯';
                    default:
                        return productName;
                }
            }
        }

        $scope.serviceList = []
        ServiceServ.hasmore = true;
        ServiceServ.curPage = 1;

        $scope.loadMore = function() {
            $scope.hasLoaded = false;
            //这里使用定时器是为了缓存一下加载过程，防止加载过快
            $timeout(function() {
                if (!ServiceServ.hasmore) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                Native.getAuth('patient', function(userInfo) {
                    ServiceServ.query(userInfo, ServiceServ.curPage).then(function(response) {
                        $scope.hasLoaded = true;
                        ServiceServ.hasmore = response.total > ServiceServ.curPage;
                        for (var i = 0; i < response.rows.length; i++) {
                            $scope.serviceList.push(response.rows[i]);
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        ServiceServ.curPage++;
                    });
                });
            }, 1000);
        };
        $scope.moreDataCanBeLoaded = function() {
            return ServiceServ.hasmore;
        }
    });
})

.controller('OrderDetailCtrl', function($scope, $stateParams, $ionicPlatform, ServiceServ) {
    $ionicPlatform.ready(function() {
        ServiceServ.reloadInsuranceDetail($stateParams.id).then(function(resp) {
            $scope.orderDetail = resp[0];
        })
    });
})

.controller('OrderMedicalADetailCtrl', function($scope, $stateParams, $ionicPlatform, ServiceServ) {
    $ionicPlatform.ready(function() {
        ServiceServ.reloadInsuranceDetail($stateParams.id).then(function(resp) {
            console.log(resp)
            var orderDetail = resp[0];

            var amount = 0,
                offlineAmount = 0,
                quantity = 0;

            for (var i in orderDetail.setTradeOrderProductList) {
                if (orderDetail.setTradeOrderProductList[i].productTypeCode == '08') {
                    quantity += orderDetail.setTradeOrderProductList[i].productCount;
                    amount += (orderDetail.setTradeOrderProductList[i].doctorManagePrice + orderDetail.setTradeOrderProductList[i].servicePackagePrice) * orderDetail.setTradeOrderProductList[i].productCount;
                } else if (orderDetail.setTradeOrderProductList[i].productTypeCode == '09') {
                    quantity += orderDetail.setTradeOrderProductList[i].productCount;
                    offlineAmount += orderDetail.setTradeOrderProductList[i].price * orderDetail.setTradeOrderProductList[i].productCount;
                }
            }
            $scope.orderDetail = orderDetail;
            $scope.quantity = quantity;
            $scope.amount = amount;
            $scope.offlineAmount = offlineAmount;
        })
    });
})

.controller('OrderMedicalBDetailCtrl', function($scope, $stateParams, $ionicPlatform, ServiceServ) {
    $ionicPlatform.ready(function() {
        ServiceServ.reloadInsuranceDetail($stateParams.id).then(function(resp) {
            $scope.orderDetail = resp[0];
        })
    });
})

.controller('OrderChallengeDetailCtrl', function($scope, $stateParams, $ionicPlatform, ServiceServ) {
    $ionicPlatform.ready(function() {
        ServiceServ.reloadInsuranceDetail($stateParams.id).then(function(resp) {
            $scope.orderDetail = resp[0];
            ServiceServ.getChallengeDetail(resp[0].id).then(function(resp) {
                if (resp.length !== 0) {
                    $scope.orderDetail = resp[0]
                    $scope.orderDetail.user_id = resp[0].userId;
                    $scope.orderDetail.user_name = resp[0].userName;
                    $scope.orderDetail.order_code = resp[0].orderCode;
                    $scope.orderDetail.id = resp[0].orderId;
                }
            })
        })
    });
})

.controller('OrderExpressCtrl', function($scope, $stateParams) {
    $scope.link = 'http://m.kuaidi100.com/index_all.html?type=' + $stateParams.comp + '&postid=' + $stateParams.code + '#result&ui-state=dialog'
})

.controller('ReservationCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicPopup, DoctorServ, ReservationServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['06', '0030']);
        $scope.hasLoaded = false;

        Native.getAuth('patient', function(userInfo) {
            DoctorServ.reload(userInfo).then(function(resp) {
                $scope.doctor = resp;
            })

            ReservationServ.query(userInfo.patientId).then(function(resp) {
                $scope.hasLoaded = true;
                for (var i in resp) {
                    resp[i].datetime = new Date(resp[i].subscribeTime.replace(/-/g, '/')).format('MM月dd日') + (resp[i].amOrPm == 0 ? '上午' : '下午');
                }
                $scope.reservationList = resp;
            });
        });



        $scope.rejectReserv = function(id) {
            $ionicPopup.confirm({
                title: '提示',
                template: '确定要取消预约吗？',
                okText: '确定',
                cancelText: '取消'
            }).then(function(res) {
                if (res) {
                    Native.run('umengLog', ['event', 'detail', 'RejectReservation']);
                    Native.run('html5Log', ['06', '0092']);
                    ReservationServ.rejectReserv(id).then(function(resp) {
                        $ionicPopup.alert({
                            title: '已取消本次预约',
                            template: ''
                        }).then(function() {
                            Native.getAuth('patient', function(userInfo) {
                                ReservationServ.query(userInfo.patientId).then(function(resp) {
                                    $scope.reservationList = resp;
                                });
                            });
                        })
                    })
                }
            })
        }
    });
})

.controller('RewardCtrl', function($scope, $ionicHistory, $ionicPlatform, $rootScope, $stateParams, $ionicPopup, DoctorServ, AssistantServ, RewardServ, $ionicModal) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['06', '0056']);
        if ($rootScope.isIOS) {
            document.getElementById('iosReward').style.display = 'block';
        } else {
            document.getElementById('androidReward').style.display = 'block';
        }

        Native.getAuth('patient', function(userInfo) {
            DoctorServ.reloadById(userInfo, $stateParams.id).then(function(resp) {
                $scope.doctor = resp;
                if (resp.modelid == 12)
                    $scope.rewardTarget = '医生';
                else
                    $scope.rewardTarget = '个管师';
            })
        })

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
                    $scope.img = 'img/flower.png';
                    $scope.productId = 7;
                    break;
                case 1:
                    $scope.img = 'img/flag.png';
                    $scope.productId = 8;
                    break;
                case 2:
                    $scope.img = 'img/cup.png';
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
                        Native.getIdentify(function(mac) {
                            Native.getAuth('patient', function(userInfo) {
                                RewardServ.sendReward(userInfo, $scope.productId, $scope.productCount, $scope.doctor.userid, $scope.doctor.username, $scope.doctor.nickname, mac).then(function() {
                                    Native.run('umengLog', ['event', 'detail', 'RewardSuccess']);
                                    Native.run('html5Log', ['06', '0057']);
                                    $ionicPopup.alert({
                                        title: '打赏成功!',
                                        template: ''
                                    }).then(function() {
                                        //Native.run('goBack', []);
                                        window.history.back();
                                    })
                                })
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
                    $scope.img = 'img/1yuan.png';
                    $scope.productId = 7;
                    break;
                case 1:
                    $scope.img = 'img/5yuan.png';
                    $scope.productId = 8;
                    break;
                case 2:
                    $scope.img = 'img/10yuan.png';
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
                    Native.getIdentify(function(mac) {
                        Native.getAuth('patient', function(userInfo) {
                            RewardServ.sendReward(userInfo, $scope.productId, $scope.productCount, $scope.doctor.userid, $scope.doctor.username, $scope.doctor.nickname, mac).then(function() {
                                Native.run('umengLog', ['event', 'detail', 'RewardSuccess']);
                                Native.run('html5Log', ['06', '0057']);
                                $ionicPopup.alert({
                                    title: '打赏成功!',
                                    template: ''
                                }).then(function() {
                                    //Native.run('goBack', []);
                                    window.history.back();
                                })
                            })
                        })
                    });
                }
            })
        }
    });
})

.controller('BonusCtrl', function($scope, $rootScope, $ionicHistory, $ionicPlatform, $stateParams, $ionicPopup, BonusServ, PatientServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.getAuth('patient', function(userInfo) {
            BonusServ.reload(userInfo, $stateParams.randomCode).then(function(resp) {
                switch (resp.code) {
                    case '0':
                        $scope.check = true;
                        break;
                    case '400031':
                        $scope.check = false;
                        $scope.content = "手慢了，红包已经被抢光了";
                        break;
                    case '400032':
                        $scope.check = false;
                        Native.getAuth('patient', function(userInfo) {
                            PatientServ.reload(userInfo).then(function(patient) {
                                BonusServ.checkBonus(patient.avatar, $stateParams.randomCode).then(function(resp) {
                                    $rootScope.money = resp.money;
                                    $rootScope.recordList = resp.recordList;
                                    $rootScope.totalMoney = resp.totalMoney;
                                    window.location.href = "#/tab/me/bonus-result";
                                });
                            });
                        });
                        break;
                    default:
                        $scope.check = false;
                        $scope.content = "网络似乎不太通畅，一会再试试";
                        break;
                };
            })
        })
        $scope.checkBonus = function() {
            Native.getAuth('patient', function(userInfo) {
                PatientServ.reload(userInfo).then(function(patient) {
                    BonusServ.checkBonus(userInfo, patient.avatar, $stateParams.randomCode).then(function(resp) {
                        $rootScope.money = resp.money;
                        $rootScope.recordList = resp.recordList;
                        $rootScope.totalMoney = resp.totalMoney;
                        window.location.href = "#/tab/me/bonus-result";
                    })
                })
            })
        }
    });
})

.controller('BonusResultCtrl', function($scope, $ionicHistory, $ionicPlatform, $stateParams, $ionicPopup, BonusServ, PatientServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.getAuth('patient', function(userInfo) {
            PatientServ.reload(userInfo).then(function(patient) {
                BonusServ.checkBonus(userInfo, patient.avatar, $stateParams.randomCode).then(function(resp) {
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
        })
    });
})

.controller('DoctorCtrl', function($scope, $rootScope, $state, $stateParams, $ionicLoading, $ionicScrollDelegate, $ionicHistory, $ionicPlatform, $ionicPopup, $ionicListDelegate, $timeout, localStorageService, DoctorServ, CommentServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        $ionicScrollDelegate.freezeScroll(true);
        Native.run('html5Log', ['06', '0031']);
        Native.getAuth('patient', function(userInfo) {
            $rootScope.canReserve = userInfo.canReserve;
            DoctorServ.reloadAllInfo(userInfo, $stateParams.id).then(function(resp) {
                for (var i in resp.answer.list) {
                    resp.answer.list[i].create_time = new Date(resp.answer.list[i].create_time.replace(/-/g, '/'));
                    if (resp.answer.list[i].content.length > 40)
                        resp.answer.list[i].content = resp.answer.list[i].content.substr(0, 40) + "……";
                }
                for (var i in resp.news.list) {
                    resp.news.list[i].time = new Date(resp.news.list[i].time.replace(/-/g, '/'));
                }
                if (resp.consultation == 0) {
                    DoctorServ.getQualityConsult().then(function(consult) {
                        $scope.price = consult[0].price;
                    })
                }
                $scope.doctor = resp;
                console.log(resp);
            })

            $scope.goBind = function(){
              $ionicPopup.show({
                title:'是否绑定医生',
                buttons:[
                  {
                    text: '取消',
                    type: "button-positive",
                    onTap: function () {
                    }
                  },
                  {
                    text:'绑定',
                    type:'button-positive',
                    onTap:function(){
                      var doctorid = $stateParams.id;
                      DoctorServ.bindDoc(doctorid,userInfo).then(function(resp){
                          Native.run('newBindDocSucc',[doctorid]);
                      })
                    }
                  }
                ]
              })
            };

            $scope.stateName = $state.current.name;

            $scope.patient = userInfo;

            $scope.goQrcode = function() {
                localStorageService.set('qrcodeImg', $scope.doctor.code);
                localStorageService.set('qrcodeDoctorName', $scope.doctor.realname);
                window.location.href = $scope.stateName == 'tab.doctor' ? '#/tab/me/qrcode' : '#/tab/home/qrcode';
            }

            $scope.goReward = function() {
                window.location.href = $scope.stateName == 'tab.doctor' ? '#/tab/me/reward/' + $stateParams.id : '#/tab/home/reward/' + $stateParams.id;
            }

            $scope.goNative = function(pageId, param) {
                Native.run('goNative', [pageId, param]);
            }

            $scope.consult = function() {
                if ($scope.doctor.userid == $scope.patient.doctorId && $scope.doctor.consultation == 0) {
                    $ionicPopup.confirm({
                        title: '温馨提示',
                        template: '您免费咨询的条目数已经用光了，您可以选择付费咨询或者购买优惠的套餐。',
                        okText: '购买套餐',
                        cancelText: '付费咨询'
                    }).then(function(res) {
                        if (res) {
                            Native.run('goNative', ['bindDoctor', $scope.doctor]);
                        } else {
                            Native.run('goNative', ['consult', $scope.doctor]);
                        }
                    })
                } else {
                    Native.run('goNative', ['consult', $scope.doctor]);
                }
            }

            $scope.unbindDoctor = function() {
                if (userInfo.hasPassword == '1') {
                    $ionicPopup.prompt({
                        title: '温馨提示',
                        template: '您确定要解除绑定医生吗，解除绑定后您购买的咨询条数（还剩 ' + $scope.doctor.consultation + ' 条）将失效，请输入支付密码进行解绑操作！',
                        inputType: 'password',
                        okText: '确认',
                        cancelText: '取消'
                    }).then(function(res) {
                        console.log(res)
                        if (typeof res != 'undefined') {
                            if (res == '') {
                                $ionicLoading.show({
                                    template: '请输入支付密码',
                                    duration: 1200
                                });
                                return;
                            }
                            DoctorServ.unbindDoctor(userInfo, $scope.doctor.userid, res).then(function(resp) {
                                $ionicPopup.alert({
                                    title: '医生解绑成功'
                                }).then(function() {
                                    Native.run('unbindDoctorSucc', []);
                                })
                            })
                        }
                    });
                } else {
                    $ionicPopup.alert({
                        title: '您尚未设置支付密码，请先进行设置'
                    }).then(function() {
                        Native.run('goNative', ['setPassword']);
                    })
                }
            }

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
                    CommentServ.reserveList($stateParams.id, CommentServ.curPage, '00').then(function(response) {
                        $scope.hasLoaded = true;
                        $scope.comment = response;

                        CommentServ.hasmore = response.total / Native.pageSize > CommentServ.curPage;
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
            $scope.loadMore();

            $scope.moreDataCanBeLoaded = function() {
                return CommentServ.hasmore;
            }
        });

        $scope.changeDoctor = function() {
            Native.run('changeDoctor', [$state.current.name == 'tab.doctor']);
            Native.run('umengLog', ['event', 'detail', 'changeDoctor']);
        }
    });
})

.controller('InfoCtrl', function($scope, $ionicHistory, ionicDatePicker, $ionicPlatform, $ionicPopup, PatientServ, patientReportServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        document.querySelector('body').style.minHeight=window.innerHeight;
        cordova.plugins.Keyboard.disableScroll(true)
        Native.run('html5Log', ['06', '0042']);
        Native.getAuth('patient', function(userInfo) {
            PatientServ.reload(userInfo).then(function(resp) {
                if(resp.birthday == "") {
                    resp.birthday = '1970-01'
                }
                if(['乙肝', '丙肝', '脂肪肝', '肝硬化', '肝癌'].indexOf(resp.main_disease) < 0) {
                    resp.main_disease = '其他';
                }
                $scope.patient = resp;
                $scope.patient.id_card = userInfo.id_card;
                                console.log(resp)
                var ipObj1 = {
                    callback: function(val) { //Mandatory
                        $scope.patient.birthday = new Date(val).format('yyyy-MM-dd');
                        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                    },
                    from: new Date(1900, 1, 1), //Optional
                    to: new Date(), //Optional
                    inputDate: new Date($scope.patient.birthday), //Optional
                    closeOnSelect: false, //Optional
                    templateType: 'popup' //Optional
                };

                $scope.openDatePicker = function() {
                    ionicDatePicker.openDatePicker(ipObj1);
                };

            });
        });

        $scope.maxDate = new Date();

        $scope.infoHistoryBack = function() {
            if(form.$dirty) {
                $ionicPopup.confirm({
                    title: '您的资料已修改，是否保存',
                    template: '',
                    okText: '保存',
                    cancelText: '取消'
                }).then(function(res) {
                    console.log(res)
                    if(res) {
                         $scope.updateUser($scope.patient.nickname, $scope.patient.sex, $scope.patient.birthday, $scope.patient.is_own, $scope.patient.main_disease, $scope.patient.realname, $scope.patient.other_disease,$scope.patient.id_card);
                    } else {
                        Native.run('historyBack', []);
                    }
                });
            } else {
                Native.run('historyBack', []);
            }
        }

        var form = {};

        $scope.contentClick = function(f) {
            form = f;
        }

        $scope.updateUser = function(realname,nickname,sex, birthday, is_own,main_disease,other_disease, id_card) {
            //sex = sex.replace('男', '1').replace('女', '2');
            Native.getAuth('patient', function(userInfo) {
                if(!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(id_card)){
                    
                    $ionicPopup.alert({
                        title: '身份证号格式不正确'
                    });
                } else {
                    PatientServ.update(userInfo.auth, realname, nickname, sex, birthday, is_own,main_disease,other_disease, id_card).then(function() {
                        $ionicPopup.alert({
                            title: '修改成功!',
                            template: ''
                        }).then(function() {
                            Native.run('html5Log', ['06', '0044']);
                            Native.run('updatePatientName', [nickname, realname]);
                            Native.run('updateIdCard', [id_card]); //原生修改id_card
                            Native.run('historyBack', []);
                        })
                    })
                }

            })
        }

        $scope.upload = function() {

            var f = document.querySelector('[nav-view=active]').querySelector('input[type=file]').files[0],
                r = new FileReader();
            r.onloadend = function(e) {
                var uri = e.target.result + '';
                var img = new Image();
                img.src = uri;
                img.onload = function() {
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    canvas.width = 30;
                    canvas.height = 30;
                    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 30, 30);
                    var uri30 = canvas.toDataURL(f.fileType);
                    uri30 = uri30.substr(uri30.indexOf('base64,') + 7)

                    canvas.width = 45;
                    canvas.height = 45;
                    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 45, 45);
                    var uri45 = canvas.toDataURL(f.fileType);
                    uri45 = uri45.substr(uri45.indexOf('base64,') + 7)

                    canvas.width = 90;
                    canvas.height = 90;
                    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 90, 90);
                    var uri90 = canvas.toDataURL(f.fileType);
                    uri90 = uri90.substr(uri90.indexOf('base64,') + 7)

                    canvas.width = 180;
                    canvas.height = 180;
                    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 180, 180);
                    var uri180 = canvas.toDataURL(f.fileType);
                    var icon = uri180;
                    uri180 = uri180.substr(uri180.indexOf('base64,') + 7)

                    Native.getAuth('patient', function(uesrInfo) {
                        PatientServ.uploadAvatar(uesrInfo.auth, uri180, uri90, uri45, uri30).then(function() {
                            $ionicPopup.alert({
                                title: '上传成功',
                                template: ''
                            }).then(function() {
                                $scope.patient.icon = icon;
                            })
                        })
                    })
                }

            }
            r.readAsDataURL(f);
        }

    });
})

.controller('patient-reportCtrl', function($scope, $rootScope,$ionicHistory, $stateParams,localStorageService,$ionicPlatform, $ionicPopup, patientReportServ, patientListServ, PatientServ) {
        $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;

        $ionicPlatform.ready(function() {
            Native.getAuth('patient', function(userInfo) {
                PatientServ.reload(userInfo).then(function(resp) {
                	 $scope.id_card = userInfo.id_card;
                	 console.log(userInfo.id_card)
                	if($scope.id_card==""||$scope.id_card==null){
                		$scope.patientidNo=true;
                		$scope.patientidHas=false;
                	}else{
                		$scope.patientidNo=false;
                		$scope.patientidHas=true;
                	}
                    $scope.patient = resp;
                    $scope.patientid = resp.userid;
                    localStorageService.set('patientid', $scope.patientid);

                })
            })
            $scope.showAlert = function(id_card) {
            	console.log(id_card);
                Native.getAuth('patient', function(userInfo) {                	
                	if(userInfo.id_card=='' || userInfo.id_card == null) {
	                    if(!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(id_card)) {
	                        $ionicPopup.alert({
	                            title: '请填写正确身份证号',
	                        });
	                    } else if(id_card == "" || typeof id_card == "undefined") {
	                        $ionicPopup.alert({
	                            title: '请填写身份证号',
	                        });
	                    } else {
	                    	patientReportServ.completeCard(userInfo.auth, id_card).then(function(resp) {
	                                $rootScope.firstDiv = true;
	                                $rootScope.secondDiv = false;
	                                $rootScope.threeDiv = false;
	                                Native.run('updateIdCard', [id_card]);
             						window.location.href = "#/reportList";
	                           });      
	                    }
                	} else {
                		$rootScope.firstDiv = false;
	                    $rootScope.secondDiv = true;
             			window.location.href = "#/reportList";
                	}
                })

            }
        })
    })

.controller('reportListCtrl', function($scope, $ionicHistory,$ionicPopup, $rootScope, $timeout, localStorageService,$ionicSlideBoxDelegate, $ionicPlatform, patientListServ) {
   $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
   $ionicPlatform.ready(function() {
   		$scope.viewDetail = function() {
            	localStorageService.set('reportItem', this.list);
            }
        localStorageService.get('patientid')
        function _getReport(count) {
            Native.getAuth('patient', function(userInfo) {
                patientListServ.reportLi(userInfo.auth).then(function(resp) {
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
                    	if(!$rootScope.firstDiv) $scope.secondDiv = true;
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
.controller('reportDetailCtrl', function($scope,$ionicHistory,localStorageService, $ionicPlatform, $ionicSlideBoxDelegate, $timeout, $ionicLoading, $stateParams, patientDetailServ) {
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
.controller('patientFlupCtrl', function($scope, $ionicHistory,$ionicPlatform,$ionicPopup, $ionicSlideBoxDelegate, $timeout, $ionicLoading, $stateParams, patientFlupServ,flupDetailServ) {
         $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
         $ionicPlatform.ready(function() {
                Native.getAuth('patient', function(userInfo) {
                    patientFlupServ.flupInfo(userInfo.auth, $stateParams.id).then(function(resp) {
                        $scope.patientFlup = resp.info;
                        $scope.patientVisit = JSON.parse(resp.info.visit);
                        $scope.upload = function() {
                            
                            var f = document.querySelector('[nav-view=active]').querySelector('input[type=file]').files[0],
                                r = new FileReader();
                                
                            r.onloadend = function(e) {
                                var uri = e.target.result + '';     
                                uri = uri.substr(uri.indexOf('base64,') + 7)
                                    patientFlupServ.flupupload(userInfo.auth,$stateParams.id,uri).then(function() {
                                        $ionicPopup.alert({
                                            title: '上传成功',
                                            template: ''
                                        }).then(function() {
                                            
                                        })
                                    })
                            }
                            r.readAsDataURL(f);
                        }
                    });
                })
            })
})  
.controller('flupDetailCtrl', function($scope,$ionicHistory, $ionicPlatform, $ionicSlideBoxDelegate, $timeout, $ionicLoading, $stateParams,flupDetailServ) {
          $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
          $ionicPlatform.ready(function() {
                Native.getAuth('patient', function(userInfo) {
                    flupDetailServ.flupgetload(userInfo.auth,$stateParams.id).then(function(resp){
                        console.log(resp);
                        $scope.flupDetailW = resp.waiting;
                        $scope.flupDetailR= resp.record;
//                      console.log($scope.flupDetailR.list);
                    })
                })
            })
})      

.controller('DoctorSelectedCtrl', function($scope, $ionicHistory, $ionicPlatform, $rootScope, $ionicLoading, $stateParams, $ionicPopup, $location, DoctorServ, localStorageService) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['06', '0032']);
        $scope.canChangeDoctor = true;
        Native.getAuth('patient', function(userInfo) {
            DoctorServ.reloadById(userInfo, $stateParams.id).then(function(doctor) {
                $scope.doctor = doctor;
                DoctorServ.querySchedule($stateParams.id).then(function(schedule) {
                    $scope.schedule = schedule;
                });
                if ($stateParams.isNew == 'true') {
                    $scope.canChangeDoctor = false;
                    $scope.changeDoctor = function() {
                        if (Native.isWeb) {
                            DoctorServ.bindDoctor(userInfo.auth, doctor.userid).then(function(resp) {
                                $ionicPopup.alert({
                                    title: '医生绑定成功'
                                }).then(function() {
                                    window.location.href = '#/tab/me';
                                    $rootScope.login(userInfo.patientName, localStorageService.get('frno'));
                                })
                            })
                        } else {
                            Native.run('selectDoctor', [$stateParams.id])
                        }
                    }
                } else {
                    DoctorServ.changeDoctorCheck(userInfo).then(function(price) {
                        $scope.canChangeDoctor = false;
                        $scope.changeDoctor = function() {
                            Native.getAuth('patient', function(userInfo) {
                                if (userInfo.hasPassword == '1') {
                                    $ionicPopup.prompt({
                                        title: '选择医生需要支付' + price.price + $rootScope.ticket,
                                        template: '请输入密码',
                                        inputType: 'password',
                                        okText: '确认',
                                        cancelText: '取消'
                                    }).then(function(res) {
                                        console.log(res)
                                        if (typeof res != 'undefined') {
                                            if (res == '') {
                                                $ionicLoading.show({
                                                    template: '请输入密码',
                                                    duration: 1200
                                                });
                                                return;
                                            }
                                            DoctorServ.changeDoctor(userInfo, doctor.userid, doctor.username, doctor.nickname, res).then(function(resp) {
                                                Native.run('html5Log', ['06', '0033']);
                                                Native.run('umengLog', ['event', 'detail', 'ChangeDoctorSuccess'])
                                                if (Native.isWeb) {
                                                    $ionicPopup.alert({
                                                        title: '医生更换成功'
                                                    }).then(function() {
                                                        window.location.href = '#/tab/me';
                                                        $rootScope.login(userInfo.patientName, localStorageService.get('frno'));
                                                    })
                                                } else {
                                                    Native.run('changeDoctorSucc', []);
                                                }
                                            })
                                        }
                                    });
                                } else {
                                    $ionicPopup.alert({
                                        title: '您尚未设置支付密码，请先进行设置'
                                    }).then(function() {
                                        Native.run('goNative', ['setPassword']);
                                    })
                                }
                            })
                        }
                    })
                }
            })
        })
    });
})

.controller('DoctorSearchCtrl', function($scope, $state, $ionicHistory, $ionicPlatform, $ionicModal, $ionicPopup, $ionicListDelegate, $timeout, DoctorServ, CommentServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.getAuth('patient', function(userInfo) {
            $scope.doctorSelectedUrl = $state.current.name == 'tab.doctor-search' ? 'me' : 'home';

            $scope.isNew = userInfo.doctorId === ''

            $scope.search = {
                'searchType': 'name',
                'filter': ''
            }

            $scope.doctorList = [];
            DoctorServ.hasmore = true;
            DoctorServ.curPage = 1;

            $scope.doRefresh = function() {
                $scope.doctorList = [];
                DoctorServ.hasmore = true;
                DoctorServ.curPage = 1;
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
                    if (!DoctorServ.hasmore) {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        return;
                    }
                    DoctorServ.findDoctor(userInfo.auth, 1, $scope.search.searchType, $scope.search.filter, $scope.search.hospitalId).then(function(response) {
                        $scope.hasLoaded = true;
                        DoctorServ.hasmore = response.total_page > DoctorServ.curPage;
                        for (var i = 0; i < response.list.length; i++) {
                            $scope.doctorList.push(response.list[i]);
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        DoctorServ.curPage++;
                    });
                }, 1000);
            };

            $scope.moreDataCanBeLoaded = function() {
                return DoctorServ.hasmore;
            }
        });

        $ionicModal.fromTemplateUrl('modal-citys.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.citysModal = modal;
        });

        $scope.openCitysModal = function() {
            if (typeof $scope.citysModal !== 'undefined') {
                $scope.citysModal.show();
            } else {
                $timeout(function() { $scope.citysModal.show() }, 500);
            }
        };
        $scope.closeCitysModal = function() {
            $scope.citysModal.hide();
        };

        $scope.findCity = function(cityId) {
            $scope.openCitysModal();
            DoctorServ.findCity(cityId).then(function(resp) {
                $scope.cityList = resp;
            })
        }

        $scope.findNext = function(cityId, level, hospitalId) {
            if (level == 1) {
                DoctorServ.findCity(cityId).then(function(resp) {
                    $scope.cityList = resp;
                })
            } else if (level == 2) {
                DoctorServ.findHospital(cityId).then(function(resp) {
                    $scope.cityList = resp;
                })
            } else {
                $scope.closeCitysModal();
                $scope.search = {
                    'searchType': 'hospital_id',
                    'hospitalId': hospitalId
                }
                $scope.doctorList = [];
                DoctorServ.hasmore = true;
                DoctorServ.curPage = 1;
                $scope.loadMore();

            }
        }
    });
})

.controller('SuccCtrl', function($scope, $ionicHistory, $ionicPlatform, $stateParams, DoctorServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.getAuth('patient', function(userInfo) {
            DoctorServ.reloadById(userInfo, $stateParams.id).then(function(doctor) {
                $scope.doctor = doctor;
            })
        });

        $scope.changeDoctorSucc = function() {
            Native.run('changeDoctorSucc', []);
        }
    });
})

.controller('AssistantCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicLoading, $ionicPopup, $state, $ionicListDelegate, $timeout, AssistantServ, CommentServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['06', '0034']);
        Native.getAuth('patient', function(userInfo) {
            AssistantServ.reload(userInfo).then(function(resp) {
                $scope.assistant = resp;
                // console.log(resp==0);
                // console.log(resp!=0);
            })

            $scope.startChat = function(id, name) {
                Native.run('startChat', [id, name]);
            }

            $scope.patient = userInfo;

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
                    CommentServ.reload(userInfo.auth, userInfo.assistantId, CommentServ.curPage).then(function(response) {
                        $scope.hasLoaded = true;
                        $scope.comment = response;
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

            $scope.rate = function(modeid, userid, nickname) {
                Native.run('rate', [modeid, userid, nickname, $state.current.name == 'tab.assistant']);
                Native.run('umengLog', ['event', 'detail', 'rate']);
            }

            $scope.delComment = function(commentid, index) {
                $ionicPopup.confirm({
                    title: '确定要删除该条评价吗？',
                    template: ''
                }).then(function(res) {
                    if (res) {
                        CommentServ.delComment(userInfo.auth, commentid).then(function() {
                            $ionicPopup.alert({
                                title: '删除成功'
                            })
                            $scope.commentList.splice(index, 1);
                            $scope.comment.total--;
                            CommentServ.reload(userInfo.auth, userInfo.assistantId, CommentServ.curPage).then(function(response) {
                                $scope.comment = response;
                            });
                        })
                    }
                });
            }
        });
    });
})

.controller('OrderCtrl', function($scope, $ionicHistory, $ionicPlatform, DoctorServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $scope.isA = true;
    $scope.canReserve = false;
    $ionicPlatform.ready(function() {
        Native.getAuth('patient', function(userInfo) {
            $scope.canReserve = userInfo.canReserve;

            $scope.goNative = function(pageId, param) {
                Native.run('goNative', [pageId, param]);
            }

            DoctorServ.getDoctorCity(userInfo.doctorId).then(function(resp) {
                if (resp == '0') {
                    $scope.isA = true;
                } else {
                    $scope.isA = false;
                }
            })
        })
    });
})

.controller('OrderReservationCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicPopup, $timeout, DoctorServ, ReservationServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        $scope.status = 'all';
        $scope.all = true;

        $scope.statusName = {
            '00': '待确认',
            '01': '已确认',
            '02': '已取消',
            '03': '待审核',
            '04': '已就诊',
            '05': '未就诊'
        }

        $scope.setActive = function(status) {
            $scope.status = status;
            if (status == 'all') {
                $scope.all = true;
            } else {
                $scope.all = false;
            }
        }

        $scope.comment = function(orderCode, e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            this.reservation.btnDisabled = true;
            var _item = this.reservation;
            Native.run('comment', [orderCode]);

            $timeout(function() {
                _item.btnDisabled = false;
            }, 2000)
        }

        $scope.doRefresh = function() {
            Native.getAuth('patient', function(userInfo) {
                DoctorServ.reload(userInfo).then(function(resp) {
                    $scope.doctor = resp;
                })

                ReservationServ.query(userInfo.patientId).then(function(resp) {
                    $scope.hasData = {};
                    $scope.hasLoaded = true;
                    for (var i in resp) {
                        resp[i].datetime = new Date(resp[i].subscribeTime.replace(/-/g, '/')).format('MM月dd日') + (resp[i].amOrPm == 0 ? '上午' : '下午');
                        $scope.hasData[resp[i].status] = true;
                    }
                    $scope.reservationList = resp;
                });
            })
            $scope.$broadcast('scroll.refreshComplete');
        }

        $scope.doRefresh();

        $scope.reservationDetail = function(id) {
            Native.run('goNative', ['reservationDetail', id]);
        }

        $scope.rejectReserv = function(e, id) {
            e.stopImmediatePropagation();
            e.preventDefault();
            $ionicPopup.confirm({
                title: '提示',
                template: '确定要取消预约吗？',
                okText: '确定',
                cancelText: '取消'
            }).then(function(res) {
                if (res) {
                    Native.run('umengLog', ['event', 'detail', 'RejectReservation']);
                    Native.run('html5Log', ['06', '0092']);
                    ReservationServ.rejectReserv(id).then(function(resp) {
                        $ionicPopup.alert({
                            title: '已取消本次预约',
                            template: ''
                        }).then(function() {
                            Native.getAuth('patient', function(userInfo) {
                                ReservationServ.query(userInfo.patientId).then(function(resp) {
                                    $scope.reservationList = resp;
                                });
                            });
                        })
                    })
                }
            })
        }
    });
})

.controller('OrderMedicalACtrl', function($scope, $ionicHistory, $timeout, $ionicPopup, $ionicPlatform, ServiceServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        $scope.status = 'all';
        $scope.all = true;
        $scope.setActive = function(status) {
            $scope.status = status;
            if (status == 'all') {
                $scope.all = true;
            } else {
                $scope.all = false;
            }
        }

        $scope.doRefresh = function() {
            Native.getAuth('patient', function(userInfo) {
                ServiceServ.reloadMedicalAList(userInfo.patientId).then(function(resp) {
                    $scope.hasData = {};
                    $scope.hasLoaded = true;
                    console.log(resp);
                    for (var i in resp) {
                        if (resp[i].paymentStatus == '01' && resp[i].oneQuarterExpressNo) {
                            resp[i].paymentStatus = '02';
                        }
                        $scope.hasData[resp[i].paymentStatus] = true;
                    }
                    $scope.list = resp;
                });
            })
            $scope.$broadcast('scroll.refreshComplete');
        }

        $scope.doRefresh();

        $scope.comment = function(orderCode, e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            this.item.btnDisabled = true;
            var _item = this.item;
            Native.run('comment', [orderCode]);

            $timeout(function() {
                _item.btnDisabled = false;
            }, 2000)
        }

        $scope.pay = function(amount, orderCode, subjectName, e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            this.item.btnDisabled = true;
            var _item = this.item;
            Native.run('pay', [amount, orderCode, 45, orderCode])

            $timeout(function() {
                _item.btnDisabled = false;
            }, 2000)
        }

        $scope.cancel = function(orderCode, e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            $ionicPopup.confirm({
                title: '温馨提示',
                template: '确定要取消该订单吗？'
            }).then(function(res) {
                if (res) {
                    ServiceServ.cancelOrder(orderCode).then(function(resp) {
                        $scope.doRefresh();
                    })
                }
            })
        }
    });
})

.controller('OrderMedicalBCtrl', function($scope, $ionicHistory, $timeout, $ionicPopup, $ionicPlatform, $ionicLoading, ServiceServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        $scope.status = 'all';
        $scope.all = true;

        $scope.setActive = function(status) {
            $scope.status = status;
            if (status == 'all') {
                $scope.all = true;
            } else {
                $scope.all = false;
            }
        }


        $scope.joinIn = function(orderCode, e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            ServiceServ.joinInOrder(orderCode).then(function(resp) {
                $scope.doRefresh();
                $ionicLoading.show({
                    template: '成功加入服务',
                    duration: 2200
                });
            })
        }

        $scope.comment = function(orderCode, e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            this.item.btnDisabled = true;
            var _item = this.item;
            Native.run('comment', [orderCode]);

            $timeout(function() {
                _item.btnDisabled = false;
            }, 2000)
        }

        $scope.doRefresh = function() {
            Native.getAuth('patient', function(userInfo) {
                ServiceServ.reloadMedicalBList(userInfo.patientId).then(function(resp) {
                    $scope.hasData = {};
                    $scope.hasLoaded = true;
                    for (var i in resp) {
                        if (resp[i].paymentStatus == '01' && resp[i].oneQuarterExpressNo) {
                            resp[i].paymentStatus = '02';
                        }
                        $scope.hasData[resp[i].paymentStatus] = true;
                    }
                    $scope.list = resp;
                });
            })
            $scope.$broadcast('scroll.refreshComplete');
        }

        $scope.doRefresh();

        $scope.pay = function(amount, orderCode, subjectName, e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            this.item.btnDisabled = true;
            var _item = this.item;
            Native.run('pay', [amount, orderCode, 45, orderCode])

            $timeout(function() {
                _item.btnDisabled = false;
            }, 2000)
        }

        $scope.cancel = function(orderCode, e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            $ionicPopup.confirm({
                title: '温馨提示',
                template: '确定要取消该订单吗？'
            }).then(function(res) {
                if (res) {
                    ServiceServ.cancelOrder(orderCode).then(function(resp) {
                        $scope.doRefresh();
                    })
                }
            })
        }
    });
})

.controller('OrderChallengeCtrl', function($scope, $ionicHistory, $rootScope, $timeout, $ionicPlatform, ServiceServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {

        $scope.doRefresh = function() {
            Native.getAuth('patient', function(userInfo) {
                ServiceServ.reloadHeartSchemeList(userInfo.patientId).then(function(resp) {
                    $scope.hasLoaded = true;
                    $scope.list = resp;
                });
            })
            $scope.$broadcast('scroll.refreshComplete');
        }

        $scope.doRefresh();

        $scope.challenge = function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            ServiceServ.challenge(this.item.user_name, this.item.order_code).then(function(resp) {
                console.log(resp)
                if ($rootScope.isIOS) {
                    Native.run('redirect', [resp.values.url + '?sessionId=' + resp.values.sessionId]);
                } else
                    window.location.href = resp.values.url + '?sessionId=' + resp.values.sessionId;
            })
        }
    });
})


.controller('OrderOverseasCtrl', function($scope, $ionicHistory, $rootScope, $timeout, $ionicPlatform, localStorageService, ServiceServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        $scope.doRefresh = function() {
            Native.getAuth('patient', function(userInfo) {
                ServiceServ.reloadOverseasList(userInfo.patientId).then(function(resp) {
                    var arr = [];
                    for (var i in resp) {
                        if (resp[i].paymentStatus != '00')
                            arr.push(resp[i]);
                    }
                    $scope.hasLoaded = true;
                    $scope.list = arr;
                });
            })
            $scope.$broadcast('scroll.refreshComplete');
        }
        $scope.viewDetail = function() {
            localStorageService.set('overseasDetail', this.item)
        }
        $scope.doRefresh();
    });
})


.controller('OrderOverseasDetailCtrl', function($scope, $rootScope, $stateParams, $ionicPlatform, localStorageService, ServiceServ) {
    $ionicPlatform.ready(function() {
        $rootScope.orderDetail = localStorageService.get('overseasDetail');
        console.log($scope.orderDetail)
    });
})


.controller('OrderOverseasDetailEditCtrl', function($scope, $rootScope, $stateParams, $ionicPlatform, localStorageService, ServiceServ) {
    $ionicPlatform.ready(function() {
        $scope.division = division;
        $scope.orderDetail = localStorageService.get('overseasDetail');
        $scope.status = $stateParams.status;
        $scope.title = $stateParams.status.replace('1', '患者姓名').replace('2', '手机号码').replace('3', '地址')
        $scope.cancelBack = function() {
            window.history.back();
        }

        $scope.saveBack = function() {
            ServiceServ.updateOverseasInfo($scope.orderDetail.orderId, $scope.orderDetail.insurancePeople, $scope.orderDetail.insuranceMobile, $scope.orderDetail.insuranceProvince, $scope.orderDetail.insuranceCity, $scope.orderDetail.insuranceAddress).then(function(resp) {
                $rootScope.orderDetail.insurancePeople = $scope.orderDetail.insurancePeople;
                $rootScope.orderDetail.insuranceMobile = $scope.orderDetail.insuranceMobile;
                $rootScope.orderDetail.insuranceProvince = $scope.orderDetail.insuranceProvince;
                $rootScope.orderDetail.insuranceCity = $scope.orderDetail.insuranceCity;
                $rootScope.orderDetail.insuranceAddress = $scope.orderDetail.insuranceAddress;
                localStorageService.set('overseasDetail', $scope.orderDetail);
                window.history.back();
            });
        }
    });
})


.controller('AccountCtrl', function($scope, $ionicHistory, $timeout, $ionicPlatform, PatientServ, RechargeServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['06', '0035']);
        Native.getAuth('patient', function(userInfo) {
            PatientServ.reload(userInfo).then(function(resp) {
                $scope.patient = resp;
            });
        });

        $scope.recharge = function() {
            Native.run('recharge', []);
            Native.run('umengLog', ['event', 'detail', 'Recharge']);
        }
    });
})

.controller('WalletCtrl', function($scope, $ionicHistory, $timeout, $ionicScrollDelegate, $ionicPlatform, PatientServ, RechargeServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['06', '0035']);

        $scope.viewDetail = function() {

        }

        $scope.rechargeList = [];
        RechargeServ.hasmore = true;
        RechargeServ.curPage = 0;

        $scope.loadMore = function() {
            $scope.hasLoaded = false;
            //这里使用定时器是为了缓存一下加载过程，防止加载过快
            $timeout(function() {
                if (!RechargeServ.hasmore) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                Native.getAuth('patient', function(userInfo) {
                    RechargeServ.reload(userInfo, RechargeServ.curPage).then(function(response) {
                        $scope.hasLoaded = true;
                        RechargeServ.hasmore = response.total / Native.pageSize > RechargeServ.curPage + 1;
                        for (var i = 0; i < response.list.length; i++) {
                            $scope.rechargeList.push(response.list[i]);
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        RechargeServ.curPage++;
                    });
                });
            }, 1000);
        };
        $scope.moreDataCanBeLoaded = function() {
            return RechargeServ.hasmore;
        }
    });
})

.controller('InfoCtrl', function($scope, $ionicHistory, ionicDatePicker, $ionicPlatform, $ionicPopup, PatientServ, patientReportServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['06', '0042']);
        Native.getAuth('patient', function(userInfo) {
            PatientServ.reload(userInfo).then(function(resp) {
                if(resp.birthday == "") {
                    resp.birthday = '1970-01'
                }
                if(['乙肝', '丙肝', '脂肪肝', '肝硬化', '肝癌'].indexOf(resp.main_disease) < 0) {
                    resp.main_disease = '其他';
                }
                $scope.patient = resp;
                $scope.patient.id_card = userInfo.id_card;
                                console.log(resp)
                var ipObj1 = {
                    callback: function(val) { //Mandatory
                        $scope.patient.birthday = new Date(val).format('yyyy-MM-dd');
                        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                    },
                    from: new Date(1900, 1, 1), //Optional
                    to: new Date(), //Optional
                    inputDate: new Date($scope.patient.birthday), //Optional
                    closeOnSelect: false, //Optional
                    templateType: 'popup' //Optional
                };

                $scope.openDatePicker = function() {
                    ionicDatePicker.openDatePicker(ipObj1);
                };

            });
        });

        $scope.maxDate = new Date();

        $scope.infoHistoryBack = function() {
            if(form.$dirty) {
                $ionicPopup.confirm({
                    title: '您的资料已修改，是否保存',
                    template: '',
                    okText: '保存',
                    cancelText: '取消'
                }).then(function(res) {
                    console.log(res)
                    if(res) {
                         $scope.updateUser($scope.patient.nickname, $scope.patient.sex, $scope.patient.birthday, $scope.patient.is_own, $scope.patient.main_disease, $scope.patient.realname, $scope.patient.other_disease,$scope.patient.id_card);
                    } else {
                        Native.run('historyBack', []);
                    }
                });
            } else {
                Native.run('historyBack', []);
            }
        }

        var form = {};

        $scope.contentClick = function(f) {
            form = f;
        }

        $scope.updateUser = function(realname,nickname, sex, birthday, is_own,main_disease,other_disease, id_card) {
            //sex = sex.replace('男', '1').replace('女', '2');
            Native.getAuth('patient', function(userInfo) {
                if(!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(id_card)){
                    
                    $ionicPopup.alert({
                        title: '身份证号格式不正确'
                    });
                } else {
                    PatientServ.update(userInfo.auth, realname, nickname, sex, birthday, is_own,main_disease,other_disease, id_card).then(function() {

                        $ionicPopup.alert({
                            title: '修改成功!',
                            template: ''
                        }).then(function() {
                            Native.run('html5Log', ['06', '0044']);
                            Native.run('updatePatientName', [nickname, realname]);
                            Native.run('updateIdCard', [id_card]); //原生修改id_card
                            Native.run('historyBack', []);
                        })
                    })
                }

            })
        }

        $scope.upload = function() {

            var f = document.querySelector('[nav-view=active]').querySelector('input[type=file]').files[0],
                r = new FileReader();
            r.onloadend = function(e) {
                var uri = e.target.result + '';
                var img = new Image();
                img.src = uri;
                img.onload = function() {
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    canvas.width = 30;
                    canvas.height = 30;
                    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 30, 30);
                    var uri30 = canvas.toDataURL(f.fileType);
                    uri30 = uri30.substr(uri30.indexOf('base64,') + 7)

                    canvas.width = 45;
                    canvas.height = 45;
                    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 45, 45);
                    var uri45 = canvas.toDataURL(f.fileType);
                    uri45 = uri45.substr(uri45.indexOf('base64,') + 7)

                    canvas.width = 90;
                    canvas.height = 90;
                    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 90, 90);
                    var uri90 = canvas.toDataURL(f.fileType);
                    uri90 = uri90.substr(uri90.indexOf('base64,') + 7)

                    canvas.width = 180;
                    canvas.height = 180;
                    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 180, 180);
                    var uri180 = canvas.toDataURL(f.fileType);
                    var icon = uri180;
                    uri180 = uri180.substr(uri180.indexOf('base64,') + 7)

                    Native.getAuth('patient', function(uesrInfo) {
                        PatientServ.uploadAvatar(uesrInfo.auth, uri180, uri90, uri45, uri30).then(function() {
                            $ionicPopup.alert({
                                title: '上传成功',
                                template: ''
                            }).then(function() {
                                $scope.patient.icon = icon;
                            })
                        })
                    })
                }

            }
            r.readAsDataURL(f);
        }

    });
})


.controller('TipsCtrl', function($scope, $ionicPlatform, $stateParams, $ionicHistory, localStorageService, TipsServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        TipsServ.query($stateParams.id).then(function(resp) {
            document.getElementById('remark').innerHTML = resp.remark.replace(/<img src="/g, '<img src="' + JAVA_URL);
        });

        $scope.share = function() {
            Native.run('umengLog', ['event', 'detail', 'ShareTips']);
            Native.run('share', []);
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
    });
})

.controller('VisitCtrl', function($scope, $rootScope, $ionicHistory, $stateParams, $ionicPlatform, $ionicPopup, localStorageService, DoctorServ, PatientServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['06', '0054']);

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
        $scope.changeStatus = function(status) {
            $rootScope.status = status;
        }

        $scope.week1 = day[0] + '~' + day[1];
        $scope.week2 = day[2] + '~' + day[3];

        Native.getAuth('patient', function(userInfo) {
            $scope.userInfo = userInfo;
            DoctorServ.querySchedule($stateParams.id).then(function(resp) {
                $rootScope.schedule = resp;
                if ((resp.next_weeks === '0,0|0,0|0,0|0,0|0,0|0,0|0,0' && resp.this_weeks === '0,0|0,0|0,0|0,0|0,0|0,0|0,0') || resp.limitPeoples == 0) {
                    $ionicPopup.alert({
                        title: '该医生尚未开放预约加号',
                        template: ''
                    })
                }
            });

            DoctorServ.reloadById(userInfo, $stateParams.id).then(function(doctor) {
                $rootScope.reserve = function(amOrPm, subscribeTime, price) {
                    Native.run('goNative', ['reservation', {
                        doctorId: doctor.userid,
                        doctorName: doctor.username,
                        doctorNickName: doctor.realname,
                        icon: doctor.icon,
                        hospital: doctor.hospital,
                        profession: doctor.profession,
                        department: doctor.offices,
                        introduction: doctor.adept,
                        intro: doctor.intro,
                        amOrPm: amOrPm,
                        subscribeTime: subscribeTime,
                        price: price
                    }])
                }
            })
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
    });
})

.controller('QrcodeCtrl', function($scope, $ionicHistory, $ionicPlatform, localStorageService) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        $scope.qrcodeImg = localStorageService.get('qrcodeImg');
        $scope.qrcodeDoctorName = localStorageService.get('qrcodeDoctorName');
    });
})

.controller('QaCtrl', function($scope, $ionicHistory, $ionicPlatform, QaServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['06', '0045']);
        $scope.hasLoaded = false;
        QaServ.reload().then(function(resp) {
            $scope.hasLoaded = true;
            $scope.qaList = resp.list;
        })
    });
})

.controller('QaRedCtrl', function($scope, $ionicHistory, $ionicPlatform, QaServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['06', '0045']);
        $scope.hasLoaded = false;
        QaServ.reloadRed().then(function(resp) {
            $scope.hasLoaded = true;
            $scope.qaList = resp.list;
        })
    });
})

.controller('QaDetailCtrl', function($scope, $ionicHistory, $ionicPlatform, $stateParams, QaServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $scope.location = 'http://ag.furuihui.com/article.php?id=' + $stateParams.id;
})

.controller('ReferralCtrl', function($scope, $rootScope, $timeout, $ionicHistory, $ionicPlatform, ReferralServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['03', '0005']);

        Native.getAuth('patient', function(userInfo) {
            ReferralServ.reloadMyPlan(userInfo.patientId).then(function(resp) {
                $scope.plan = resp;
                if (resp.visitTime) {
                    console.log(resp.visitTime)
                    var time = new Date(resp.visitTime)
                    $scope.plan.day = time.getDayString();
                    $scope.plan.date = time.getDate();
                    $scope.plan.month = time.getMonth() + 1;
                }
            })
        });

        $scope.rows = [];
        ReferralServ.hasmore = true;
        ReferralServ.curPage = 1;
        $scope.loadMore = function() {
            $scope.hasLoaded = false;
            //这里使用定时器是为了缓存一下加载过程，防止加载过快
            $timeout(function() {
                if (!ReferralServ.hasmore) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                Native.getAuth('patient', function(userInfo) {
                    ReferralServ.reload(userInfo.patientId, ReferralServ.curPage).then(function(response) {
                        $scope.hasLoaded = true;
                        ReferralServ.hasmore = response.total / Native.pageSize > ReferralServ.curPage;
                        for (var i = 0; i < response.rows.length; i++) {
                            if (typeof response.rows[i]['visitTime'] != 'undefined') {
                                var time = new Date(response.rows[i]['visitTime'])
                                response.rows[i].day = time.getDayString();
                                response.rows[i].date = time.getDate();
                                response.rows[i].month = time.getMonth() + 1;
                                $scope.rows.push(response.rows[i]);
                            }
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        ReferralServ.curPage++;
                    });
                }, 1000);
            });
        };

        $scope.moreDataCanBeLoaded = function() {
            return ReferralServ.hasmore;
        }
    });
})

.controller('ResultCtrl', function($scope, $ionicPlatform, $ionicHistory, ResultServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['03', '0006']);
        Native.getAuth('patient', function(userInfo) {
            ResultServ.reload(userInfo.patientId).then(function(resp) {
                $scope.result = resp;
            })
        })
        if (Native.isWeb) {
            $scope.historyBack = function() {
                window.location.href = "#/tab/home";
                window.location.reload();
            }
        }
    });
})


.controller('ResultHistoryCtrl', function($scope, $ionicPlatform, $ionicHistory, $stateParams, ResultServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        ResultServ.reloadById($stateParams.id).then(function(resp) {
            $scope.result = resp;
        })
    });
})

.controller('PlanCtrl', function($scope, $ionicHistory, $ionicPlatform, PlanServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['03', '0009']);
        PlanServ.reload().then(function(resp) {
            $scope.table = resp;
        })
    });
})

.controller('PlanLogicCtrl', function($scope, $rootScope, ionicDatePicker, $ionicHistory, $ionicPlatform, $stateParams, $state, $ionicPopup, PlanServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['03', '0007']);
        $scope.tit = $stateParams.name;
        $scope.currDate = Date.now();
        $scope.setDate = new Date(Date.now() + 3600 * 24 * 30 * 1000);
        var _logicList = [];
        PlanServ.reloadLogic($stateParams.id).then(function(resp) {
            _logicList = JSON.parse(resp[0].optionData);
            $scope.logic = _findLogic('1');
            $scope.logic.choice = 0;
        })

        $scope.next = function() {
            var nextTitNum = $scope.logic.titNum + '.' + $scope.logic.choice
            $scope.logic = _findLogic(nextTitNum);
            $scope.logic.choice = 0;
        }

        $scope.prev = function() {
            var prevTitNum = $scope.logic.titNum.substr(0, $scope.logic.titNum.lastIndexOf('.'));
            $scope.logic = _findLogic(prevTitNum);
            $scope.logic.choice = 0;
        }

        var ipObj1 = {
            callback: function(res) { //Mandatory
                res = new Date(res).format('yyyy-MM-dd');
                Native.run('umengLog', ['event', 'detail', 'addReferralDate']);
                if ($stateParams.isUpdate == 'true') {
                    Native.getAuth('patient', function(userInfo) {
                        PlanServ.updatePlan(userInfo, res, $scope.logic.detail).then(function(resp) {
                            var nativeDate = new Date(res).valueOf() / 1000;
                            Native.run('updateReferralDate', [nativeDate]);
                            $ionicPopup.alert({
                                title: '更新成功!',
                                template: ''
                            }).then(function() {
                                $scope.logic = _findLogic('1');
                                $scope.logic.choice = 0;
                                $rootScope.today = (new Date(res)).getToday();
                                if ($state.current.name === 'tab.plan-logic' || $state.current.name === 'tab.plan-logic-update')
                                    window.location.href = '#tab/home/result';
                                else
                                    window.location.href = '#tab/me/result';
                            })
                        })
                    })
                } else {
                    Native.getAuth('patient', function(userInfo) {
                        PlanServ.joinPlan(userInfo, $stateParams.id, res, $scope.logic.detail).then(function(resp) {
                            var nativeDate = new Date(res).valueOf() / 1000;
                            Native.run('joinInPlan', [nativeDate]);
                            $ionicPopup.alert({
                                title: '加入成功!',
                                template: ''
                            }).then(function() {
                                $scope.logic = _findLogic('1');
                                $scope.logic.choice = 0;
                                if ($state.current.name === 'tab.plan-logic' || $state.current.name === 'tab.plan-logic-update')
                                    window.location.href = '#tab/home/result';
                                else
                                    window.location.href = '#tab/me/result';
                            })
                        })
                    })
                }
            },
            from: new Date(), //Optional
            inputDate: new Date(), //Optional
            closeOnSelect: false, //Optional
            templateType: 'popup' //Optional
        };

        $scope.openDatePicker = function() {
            ionicDatePicker.openDatePicker(ipObj1);
        };

        $scope.addReferralDate = function() {
            Native.run('html5Log', ['03', '0008']);
            ionicDatePicker.openDatePicker(ipObj1);
        }

        function _findLogic(titNum) {
            for (var i in _logicList) {
                if (titNum === _logicList[i].titNum) {
                    return _logicList[i];
                }
            }
        }
    });
})

.controller('ActCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicListDelegate, $timeout, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['04', '0015']);

        $scope.rows = [];
        DiscoverServ.hasmore = true;
        DiscoverServ.curPage = 1;

        $scope.loadMore = function() {
            $scope.hasLoaded = false;
            //这里使用定时器是为了缓存一下加载过程，防止加载过快
            $timeout(function() {
                if (!DiscoverServ.hasmore) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                DiscoverServ.reload('00', DiscoverServ.curPage, Native.pageSize).then(function(response) {
                    $scope.hasLoaded = true;
                    DiscoverServ.hasmore = response.total / Native.pageSize > DiscoverServ.curPage;
                    for (var i = 0; i < response.rows.length; i++) {
                        $scope.rows.push(response.rows[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    DiscoverServ.curPage++;
                });
            }, 1000);
        };
        $scope.moreDataCanBeLoaded = function() {
            return DiscoverServ.hasmore;
        }
    });
})

.controller('ActDetailCtrl', function($scope, $rootScope, $ionicHistory, $ionicPopup, $ionicPlatform, $stateParams, DiscoverServ, RechargeServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;

    $scope.frameLogin = function() {
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

                if (Native.isWeixin) {
                    RechargeServ.getJSApiTicket(window.location.href).then(function(jsTicket) {
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: 'wxe53e0da58a661bac', // 必填，公众号的唯一标识
                            timestamp: jsTicket.timestamp, // 必填，生成签名的时间戳
                            nonceStr: jsTicket.noncestr, // 必填，生成签名的随机串
                            signature: jsTicket.sign, // 必填，签名，见附录1
                            jsApiList: [
                                    'checkJsApi',
                                    'onMenuShareTimeline',
                                    'onMenuShareAppMessage',
                                    'onMenuShareQQ',
                                    'onMenuShareWeibo'
                                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        });
                        wx.ready(function() {
                            wx.onMenuShareTimeline({
                                title: resp.title, // 分享标题
                                link: resp.link, // 分享链接
                                imgUrl: icon, // 分享图标
                                success: function() {
                                    // 用户确认分享后执行的回调函数
                                },
                                cancel: function() {
                                    // 用户取消分享后执行的回调函数
                                }
                            });

                            wx.onMenuShareAppMessage({
                                title: resp.title, // 分享标题
                                desc: resp.introduction, // 分享描述
                                link: resp.link, // 分享链接
                                imgUrl: icon, // 分享图标
                                type: '', // 分享类型,music、video或link，不填默认为link
                                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                success: function() {
                                    // 用户确认分享后执行的回调函数
                                },
                                cancel: function() {
                                    // 用户取消分享后执行的回调函数
                                }
                            });

                            wx.onMenuShareQQ({
                                title: resp.title, // 分享标题
                                desc: resp.introduction, // 分享描述
                                link: resp.link, // 分享链接
                                imgUrl: icon, // 分享图标
                                success: function() {
                                    // 用户确认分享后执行的回调函数
                                },
                                cancel: function() {
                                    // 用户取消分享后执行的回调函数
                                }
                            });

                            wx.onMenuShareWeibo({
                                title: resp.title, // 分享标题
                                desc: resp.introduction, // 分享描述
                                link: resp.link, // 分享链接
                                imgUrl: icon, // 分享图标
                                success: function() {
                                    // 用户确认分享后执行的回调函数
                                },
                                cancel: function() {
                                    // 用户取消分享后执行的回调函数
                                }
                            });
                        });
                    });
                }

                resp.remark = resp.remark.replace(/<img src="/g, '<img src="' + JAVA_URL);
                $scope.detail = resp;
                $scope.tit = resp.title;
                $scope.link = resp.link + userInfo.patientId;
            })
        })
    });
})

.controller('GameCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicListDelegate, $timeout, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['04', '0021']);

        $scope.rows = [];
        DiscoverServ.hasmore = true;
        DiscoverServ.curPage = 1;

        $scope.loadMore = function() {
            $scope.hasLoaded = false;
            //这里使用定时器是为了缓存一下加载过程，防止加载过快
            $timeout(function() {
                if (!DiscoverServ.hasmore) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                DiscoverServ.reload('03', DiscoverServ.curPage, Native.pageSize).then(function(response) {
                    $scope.hasLoaded = true;
                    DiscoverServ.hasmore = response.total / Native.pageSize > DiscoverServ.curPage;
                    for (var i = 0; i < response.rows.length; i++) {
                        $scope.rows.push(response.rows[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    DiscoverServ.curPage++;
                });
            }, 1000);
        };
        $scope.moreDataCanBeLoaded = function() {
            return DiscoverServ.hasmore;
        }
    });
})

.controller('GameDetailCtrl', function($scope, $ionicHistory, $ionicPlatform, $stateParams, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        DiscoverServ.reloadDetail($stateParams.id).then(function(resp) {
            $scope.tit = resp.title;
            document.getElementById('remark').innerHTML = resp.remark.replace(/<img src="/g, '<img src="' + JAVA_URL);
        })
    });
})

.controller('HospitalCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicListDelegate, $timeout, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['04', '0016']);

        $scope.rows = [];
        DiscoverServ.hasmore = true;
        DiscoverServ.curPage = 1;

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
            $scope.rows = [];
            DiscoverServ.hasmore = true;
            DiscoverServ.curPage = 1;
            $scope.loadMore();

        }

        $scope.loadMore = function() {
            $scope.hasLoaded = false;
            //这里使用定时器是为了缓存一下加载过程，防止加载过快
            $timeout(function() {
                if (!DiscoverServ.hasmore) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                DiscoverServ.reload('06', DiscoverServ.curPage, Native.pageSize, $scope.nameFilter).then(function(response) {
                    $scope.hasLoaded = true;
                    DiscoverServ.hasmore = response.total / Native.pageSize > DiscoverServ.curPage;
                    for (var i = 0; i < response.rows.length; i++) {
                        $scope.rows.push(response.rows[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    DiscoverServ.curPage++;
                });
            }, 1000);
        };
        $scope.moreDataCanBeLoaded = function() {
            return DiscoverServ.hasmore;
        }
    });
})

.controller('HospitalDetailCtrl', function($scope, $ionicHistory, $ionicPlatform, $stateParams, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        DiscoverServ.reloadDetail($stateParams.id).then(function(resp) {
            $scope.tit = resp.title;
            document.getElementById('remark').innerHTML = resp.remark.replace(/<img src="/g, '<img src="' + JAVA_URL);
        })
    });
})

.controller('KnowledgeCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicListDelegate, $timeout, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['04', '0017']);

        $scope.rows = [];
        DiscoverServ.hasmore = true;
        DiscoverServ.curPage = 1;

        $scope.loadMore = function() {
            $scope.hasLoaded = false;
            //这里使用定时器是为了缓存一下加载过程，防止加载过快
            $timeout(function() {
                if (!DiscoverServ.hasmore) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                DiscoverServ.reload('04', DiscoverServ.curPage, Native.pageSize).then(function(response) {
                    $scope.hasLoaded = true;
                    DiscoverServ.hasmore = response.total / Native.pageSize > DiscoverServ.curPage;
                    for (var i = 0; i < response.rows.length; i++) {
                        $scope.rows.push(response.rows[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    DiscoverServ.curPage++;
                });
            }, 1000);
        };
        $scope.moreDataCanBeLoaded = function() {
            return DiscoverServ.hasmore;
        }
    });
})

.controller('KnowledgeDetailCtrl', function($scope, $ionicHistory, $ionicPlatform, $stateParams, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        DiscoverServ.reloadDetail($stateParams.id).then(function(resp) {
            $scope.tit = resp.title;
            document.getElementById('remark').innerHTML = resp.remark.replace(/<img src="/g, '<img src="' + JAVA_URL);
        })
    });
})

.controller('MedicineCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicListDelegate, $timeout, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['04', '0019']);

        $scope.rows = [];
        DiscoverServ.hasmore = true;
        DiscoverServ.curPage = 1;

        $scope.nameFilter = '';
        $scope.changeNameFilter = function(nameFilter) {
            $scope.nameFilter = nameFilter;
        }

        $scope.doRefresh = function() {
            $scope.rows = [];
            DiscoverServ.hasmore = true;
            DiscoverServ.curPage = 1;
            $scope.loadMore();
        }

        $scope.loadMore = function() {
            $scope.hasLoaded = false;
            //这里使用定时器是为了缓存一下加载过程，防止加载过快
            $timeout(function() {
                if (!DiscoverServ.hasmore) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                DiscoverServ.reload('02', DiscoverServ.curPage, Native.pageSize, $scope.nameFilter).then(function(response) {
                    $scope.hasLoaded = true;
                    DiscoverServ.hasmore = response.total / Native.pageSize > DiscoverServ.curPage;
                    for (var i = 0; i < response.rows.length; i++) {
                        $scope.rows.push(response.rows[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    DiscoverServ.curPage++;
                });
            }, 1000);
        };
        $scope.moreDataCanBeLoaded = function() {
            return DiscoverServ.hasmore;
        }
    });
})

.controller('MedicineDetailCtrl', function($scope, $ionicHistory, $ionicPlatform, $stateParams, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        DiscoverServ.reloadDetail($stateParams.id).then(function(resp) {
            $scope.tit = resp.title;
            document.getElementById('remark').innerHTML = resp.remark.replace(/<img src="/g, '<img src="' + JAVA_URL);
        })
    });
})

.controller('StoryCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicListDelegate, $timeout, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.run('html5Log', ['04', '0018']);

        $scope.rows = [];
        DiscoverServ.hasmore = true;
        DiscoverServ.curPage = 1;

        $scope.loadMore = function() {
            $scope.hasLoaded = false;
            //这里使用定时器是为了缓存一下加载过程，防止加载过快
            $timeout(function() {
                if (!DiscoverServ.hasmore) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                DiscoverServ.reload('05', DiscoverServ.curPage, Native.pageSize).then(function(response) {
                    $scope.hasLoaded = true;
                    DiscoverServ.hasmore = response.total / Native.pageSize > DiscoverServ.curPage;
                    for (var i = 0; i < response.rows.length; i++) {
                        $scope.rows.push(response.rows[i]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    DiscoverServ.curPage++;
                });
            }, 1000);
        };
        $scope.moreDataCanBeLoaded = function() {
            return DiscoverServ.hasmore;
        }
    });
})

.controller('StoryDetailCtrl', function($scope, $ionicHistory, $ionicPlatform, $stateParams, DiscoverServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        DiscoverServ.reloadDetail($stateParams.id).then(function(resp) {
            $scope.tit = resp.title;
            document.getElementById('remark').innerHTML = resp.remark.replace(/<img src="/g, '<img src="' + JAVA_URL);
        })
    });
})

.controller('PayCtrl', function($scope, $rootScope, $ionicHistory, $ionicPopup, $ionicPlatform, $ionicListDelegate, $timeout, RechargeServ) {
    $ionicPlatform.ready(function() {
        $scope.amount = window.localStorage.getItem('payAmount');
        $scope.orderCode = window.localStorage.getItem('payOrderCode');
        $scope.proName = window.localStorage.getItem('payProName');
        $scope.hasWeixinPay = Native.isWeixin;
        $scope.type = '1';
        Native.getAuth('patient', function(userInfo) {
            RechargeServ.getCash(userInfo.patientName).then(function(resp) {
                $scope.balance = resp.balance;
                $scope.insuranceAccount = resp.insuranceAccount;
                $scope.cashAccount = resp.cashAccount;
            })

            $scope.pay = function(type) {
                switch (type) {
                    case '0':
                        if ($scope.cashAccount < $scope.amount) {
                            $ionicPopup.confirm({
                                title: '余额不足',
                                template: '',
                                okText: '充值',
                                cancelText: '取消'
                            }).then(function(res) {
                                if (res) {
                                    Native.run('recharge', []);
                                    Native.run('umengLog', ['event', 'detail', 'Recharge']);
                                }
                            });
                        } else {
                            $ionicPopup.prompt({
                                title: '使用帐户余额支付' + $scope.amount + ' 元',
                                template: '请输入密码',
                                inputType: 'password',
                                okText: '确认',
                                cancelText: '取消'
                            }).then(function(res) {
                                if (typeof res != 'undefined') {
                                    RechargeServ.payByBalance(userInfo.patientId, userInfo.patientName, 1, $scope.orderCode, res).then(function(resp) {
                                        $ionicPopup.alert({
                                            title: '支付成功'
                                        }).then(function() {
                                            window.history.back();
                                        })
                                    })
                                }
                            });
                        }
                        break;
                    case '1':
                        if ($scope.balance < $scope.amount) {
                            $ionicPopup.confirm({
                                title: '余额不足',
                                template: '',
                                okText: '充值',
                                cancelText: '取消'
                            }).then(function(res) {
                                if (res) {
                                    Native.run('recharge', []);
                                    Native.run('umengLog', ['event', 'detail', 'Recharge']);
                                }
                            });
                        } else {
                            $ionicPopup.prompt({
                                title: '使用帐户余额支付' + $scope.amount + ' 元',
                                template: '请输入密码',
                                inputType: 'password',
                                okText: '确认',
                                cancelText: '取消'
                            }).then(function(res) {
                                if (typeof res != 'undefined') {
                                    RechargeServ.payByBalance(userInfo.patientId, userInfo.patientName, 0, $scope.orderCode, res).then(function(resp) {
                                        $ionicPopup.alert({
                                            title: '支付成功'
                                        }).then(function() {
                                            window.history.back();
                                        })
                                    })
                                }
                            });
                        }
                        break;
                    case '2':
                        var jsonData = {
                            'orderData': {
                                'uI': userInfo.patientId,
                                'uN': userInfo.patientName,
                                'nN': userInfo.patientNickName,
                                'pR': 'H5',
                                'oC': $scope.orderCode,
                                'pF': '00'
                            },
                            'tenpayData': {
                                'body': '保险服务',
                                'total_fee': $scope.amount * 100,
                                'remoteAddr': '196.168.1.1',
                                'tradeType': 'JSAPI',
                                'openid': $rootScope.openid
                            }
                        }
                        RechargeServ.payByWeixin(JSON.stringify(jsonData)).then(function(resp) {
                            if (resp == 'error') {
                                $ionicPopup.alert({
                                    title: '微信支付出现了网络错误'
                                });
                                return;
                            }
                            wx.config({
                                // debug: true,
                                appId: 'wxe53e0da58a661bac', // 必填，公众号的唯一标识
                                timestamp: Date.now().toString().substr(0, 10), // 必填，生成签名的时间戳
                                nonceStr: resp.xml.nonce_str[0], // 必填，生成签名的随机串
                                signature: resp.xml.sign[0], // 必填，签名，见附录1
                                jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                            })

                            wx.ready(function() {
                                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                                wx.chooseWXPay({
                                    timestamp: resp.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                                    nonceStr: resp.nonceStr, // 支付签名随机串，不长于 32 位
                                    package: resp.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                                    signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                                    paySign: resp.signHfive, // 支付签名
                                    success: function(res) {
                                        window.history.back();
                                        console.log('scccccuuu')
                                    }
                                });
                            });
                        })
                        break;
                }
            }
        })
    });

})

.controller('MedicalBShopCtrl', function($scope, $rootScope, $location, $ionicPlatform, $ionicHistory, localStorageService, MedicalBServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        $scope.iosTop = $rootScope.isIOS ? { 'top': '64px' } : {};
        Native.getAuth('patient', function(userInfo) {
            MedicalBServ.reloadProducts().then(function(resp) {
                $scope.list = resp;
                console.log(resp)
            });
        })

        $scope.status = 'all';
        $scope.setActive = function(status) {
            $scope.status = status;
        }

        $scope.viewDetail = function() {
            localStorageService.set('productDetail', this.item);
            if ($rootScope.isIOS)
                window.location.href = "#/tab/me/medical-b-detail";
            else
                Native.run('goWebView', ["index.html#/tab/me/medical-b-detail"]);
        }

        $scope.reserve = function(e, id, title, mark, productTypeCode) {
            e.stopImmediatePropagation();
            if ($rootScope.isIOS)
                window.location.href = "#/tab/me/medical-b-settle/" + id + "/" + title + "/" + mark+"/"+productTypeCode;
            else
                Native.run('goWebView', ["index.html#/tab/me/medical-b-settle/" + id + "/" + title + "/" + mark+"/"+productTypeCode]);
        }
    });
})

.controller('MedicalBSettleCtrl', function($scope, $rootScope, $ionicHistory, $ionicPlatform, $ionicPopup, $ionicLoading, $timeout, $stateParams, localStorageService, MedicalBServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        // mark = 0 按年  mark = 1 按月  mark = 2 按季
        Native.getAuth('patient', function(userInfo) {
            if ($stateParams.mark == '0') {
                $scope.isOnce = false;
            } else {
                $scope.isOnce = true;
            }
            var userName, realName;
            userName = userInfo.patientName;
            realName = userInfo.patientRealName;
            var address = window.localStorage.getItem('address') || '',
                idCard = window.localStorage.getItem('idCard') || '';
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
            var productTypeCode = $stateParams.productTypeCode;
            console.log(productTypeCode);
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

            $scope.saveProduct = function(insurancePeople, insuranceMobile, insuranceAddress, insuranceIdCard, insuranceDistribution, detail) {
              console.log(inputPrescription);
              if (typeof insurancePeople === 'undefined' || insurancePeople === '') {
                    $ionicPopup.alert({
                        title: '请填写收件人'
                    });
                } else if (typeof insuranceMobile === 'undefined' || insuranceMobile === '') {
                    $ionicPopup.alert({
                        title: '请填写联系电话'
                    });
                } else if (typeof insuranceAddress === 'undefined' || insuranceAddress === '') {
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
                } else if (typeof insuranceIdCard !== 'undefined' && insuranceIdCard!=='' && !/^\s{0}$|(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(insuranceIdCard)) {
                    $ionicPopup.alert({
                        title: '身份证号格式不正确'
                    });
                } else if ((['15','16','17'].indexOf(productTypeCode)===-1) && (inputPrescription === null || inputPrescription.base64 === null )) {
                    $ionicPopup.alert({
                        title: '请上传处方照片'
                    });
                } else {
                    MedicalBServ.buyProduct(userInfo.patientId, userInfo.patientName, userInfo.patientNickName, insurancePeople, insuranceMobile, insuranceAddress, insuranceIdCard, insuranceDistribution, $stateParams.id, inputPrescription.input.files[0], detail).then(function(resp) {
                        window.localStorage.setItem('address', insuranceAddress);
                        window.localStorage.setItem('idCard', insuranceIdCard);
                        $ionicPopup.alert({
                            title: '预订成功!',
                            template: ''
                        }).then(function() {
                            window.location.href = '#/tab/me/order-medical-b';
                        })
                    })
                }
                return;
            }
        })
    })
})

.controller('MedicalBDetailCtrl', function($scope, $rootScope, $ionicPlatform, $timeout, $ionicScrollDelegate, localStorageService, CommentServ) {
    $ionicPlatform.ready(function() {
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

        $scope.reserve = function(id, title, mark,productTypeCode) {
                window.location.href = "#/tab/me/medical-b-settle/" + id + "/" + title + "/" + mark+"/"+productTypeCode;
        }
    })
})


.controller('MedicalAShopCtrl', function($scope, $rootScope, $ionicPopup, $ionicPlatform, localStorageService, MedicalAServ) {
    $ionicPlatform.ready(function() {
        $scope.iosBottom = $rootScope.isIOS ? { 'bottom': '44px' } : {};
        Native.getAuth('patient', function(userInfo) {
            MedicalAServ.reloadProducts(userInfo.doctorId).then(function(resp) {
                for (var i in resp.serviceProduct) {
                    resp.serviceProduct[i].quantity = 0;
                    resp.serviceProduct[i].price = resp.serviceProduct[i].servicePackagePrice + resp.serviceProduct[i].doctorManagePrice;
                }
                for (var i in resp.drugProduct) {
                    resp.drugProduct[i].quantity = 0;
                    resp.drugProduct[i].price;
                }

                $scope.shop = resp;
            })
            $scope.canBuyDrug = false;
            MedicalAServ.getAppSetInfo().then(function(appInfo) {
                if (appInfo == 1) {
                    MedicalAServ.getBalance(userInfo.auth).then(function(resp) {
                        if (resp.service_days > 0) {
                            $scope.canBuyDrug = true;
                        }
                    })
                } else {
                    $scope.canBuyDrug = true;
                }
            })
        })

        $scope.amount = 0;
        $scope.serviceQuantity = 0;
        $scope.minus = function() {
            this.item.quantity--;
            $scope.amount = $scope.amount - this.item.price;
            $scope.serviceQuantity--;
        }
        $scope.plus = function() {
            this.item.quantity++;
            $scope.amount = $scope.amount + this.item.price;
            $scope.serviceQuantity++;
        }
        $scope.offlineAmount = 0;
        $scope.offlineMinus = function() {
            this.item.quantity--;
            $scope.offlineAmount = $scope.offlineAmount - this.item.price;
        }
        $scope.offlinePlus = function() {
            this.item.quantity++;
            $scope.offlineAmount = $scope.offlineAmount + this.item.price;
        }
        $scope.pay = function() {
            if ($scope.amount == 0) {
                $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '您预定的药品服务将货到付款，线上总金额为0'
                }).then(function(res) {
                    if (res) {
                        localStorageService.set('cart', $scope.shop);
                        if ($rootScope.isIOS)
                            window.location.href = '#/tab/me/medical-a-settle';
                        else
                            Native.run('goWebView', ['index.html#/tab/me/medical-a-settle']);
                    }
                })
            } else {
                localStorageService.set('cart', $scope.shop);
                if ($rootScope.isIOS)
                    window.location.href = '#/tab/me/medical-a-settle';
                else
                    Native.run('goWebView', ['index.html#/tab/me/medical-a-settle']);
            }
        }

        $scope.viewDetail = function() {
            localStorageService.set('productDetail', this.item);
            if ($rootScope.isIOS)
                window.location.href = '#/tab/me/medical-a-detail';
            else
                Native.run('goWebView', ['index.html#/tab/me/medical-a-detail']);
        }
    });
})

.controller('MedicalASettleCtrl', function($scope, $rootScope, $ionicHistory, $ionicPlatform, $ionicPopup, $ionicLoading, $timeout, localStorageService, MedicalAServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.getAuth('patient', function(userInfo) {

            var cart = localStorageService.get('cart')
            var products = [],
                jsonData = [],
                amount = 0,
                offlineAmount = 0,
                quantity = 0,
                hasServiceProduct = false,
                doctorId = userInfo.doctorId;

            $scope.serviceQuantity = 0

            for (var i in cart.serviceProduct) {
                if (cart.serviceProduct[i].quantity > 0) {
                    products.push(cart.serviceProduct[i]);
                    jsonData.push({ "productId": cart.serviceProduct[i].id, "productCount": cart.serviceProduct[i].quantity, "doctorId": doctorId })
                    quantity++;
                    amount += cart.serviceProduct[i].price * cart.serviceProduct[i].quantity;
                    hasServiceProduct = true;
                    $scope.serviceQuantity += cart.serviceProduct[i].quantity;
                }
            }
            for (var i in cart.drugProduct) {
                if (cart.drugProduct[i].quantity > 0) {
                    cart.drugProduct[i].isDrug = true;
                    products.push(cart.drugProduct[i]);
                    jsonData.push({ "productId": cart.drugProduct[i].id, "productCount": cart.drugProduct[i].quantity, "doctorId": doctorId })
                    quantity++;
                    offlineAmount += cart.drugProduct[i].price * cart.drugProduct[i].quantity;
                }
            }
            $scope.products = products;
            $scope.quantity = quantity;
            if ($scope.serviceQuantity >= 6 && $scope.serviceQuantity <= 11)
                amount -= 100;
            else if ($scope.serviceQuantity >= 12)
                amount -= 200;
            $scope.amount = amount;
            $scope.offlineAmount = offlineAmount;
            $scope.info = {};
            var userName = userInfo.patientName,
                realName = userInfo.patientRealName,
                address = window.localStorage.getItem('address'),
                idCard = window.localStorage.getItem('idCard');
            if (/[0-9\*]/.test(realName) || realName.length < 2)
                $scope.info.insurancePeople = '';
            else
                $scope.info.insurancePeople = realName;
            $scope.info.insuranceMobile = userName;
            $scope.info.insuranceAddress = address;
            if (!/^\s{0}$|(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard)) {
                $scope.info.insuranceIdCard = ''
            } else {
                $scope.info.insuranceIdCard = idCard;
            }
            $scope.info.detail = '';

            $scope.pay = function(insurancePeople, insuranceMobile, insuranceAddress, insuranceIdCard, detail) {

                if (inputPrescription === null || inputPrescription.base64 === null) {
                    $ionicPopup.alert({
                        title: '请上传处方照片'
                    });
                } else if (typeof insurancePeople === 'undefined' || insurancePeople === '') {
                    $ionicPopup.alert({
                        title: '请填写收件人'
                    });
                } else if (typeof insuranceMobile === 'undefined'|| insuranceMobile === '') {
                    $ionicPopup.alert({
                        title: '请填写联系电话'
                    });
                } else if (typeof insuranceIdCard !== 'undefined' && insuranceIdCard!=='' && !/^\s{0}$|(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(insuranceIdCard)) {
                  $ionicPopup.alert({
                    title: '身份证号格式不正确'
                  });
                } else if (typeof insuranceAddress === 'undefined'|| insuranceAddress === '') {
                    $ionicPopup.alert({
                        title: '请填写详细地址'
                    });
                } else {
                    // 您预定的药品服务将货到付款，线上总金额为0
                    MedicalAServ.buyProduct(userInfo.patientId, userInfo.patientName, userInfo.patientNickName, insurancePeople, insuranceMobile, insuranceAddress, insuranceIdCard, jsonData, inputPrescription.input.files[0], detail).then(function(resp) {
                        window.localStorage.setItem('address', insuranceAddress);
                        window.localStorage.setItem('idCard', insuranceIdCard);
                        $ionicLoading.show({
                            template: '等待支付...'
                        });
                        $timeout(function() {
                            $ionicLoading.hide();
                            window.location.href = '#/tab/me/order-medical-a';
                        }, 2000)
                        Native.run('pay', [amount, resp, 45, hasServiceProduct ? '医事服务+' : '医药服务'])
                    })
                }
                return;
            }

            $scope.reserve = function(insurancePeople, insuranceMobile, insuranceAddress, insuranceIdCard, detail) {

                if (inputPrescription === null || inputPrescription.base64 === null) {
                    $ionicPopup.alert({
                        title: '请上传处方照片'
                    });
                } else if (typeof insurancePeople === 'undefined' || insurancePeople === '') {
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
                } else {
                    // 您预定的药品服务将货到付款，线上总金额为0
                    MedicalAServ.buyProduct(userInfo.patientId, userInfo.patientName, userInfo.patientNickName, insurancePeople, insuranceMobile, insuranceAddress, insuranceIdCard, jsonData, inputPrescription.input.files[0], detail).then(function(resp) {
                        window.localStorage.setItem('address', insuranceAddress);
                        window.localStorage.setItem('idCard', insuranceIdCard);
                        window.location.href = '#/tab/me/order-medical-a';
                    })
                }
                return;
            }

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
        });
    });
})

.controller('MedicalADetailCtrl', function($scope, $rootScope, $ionicPlatform, $timeout, $ionicScrollDelegate, localStorageService, CommentServ) {
    $ionicPlatform.ready(function() {
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
    });
})

.controller('ArticleCtrl', function($scope, $rootScope, $ionicHistory, $ionicPopup, $ionicLoading, $ionicPlatform, $stateParams, $timeout, localStorageService, DiscoverServ, CommentServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.getAuth('patient', function(userInfo) {
            DiscoverServ.reloadDetailPhp(userInfo.auth, $stateParams.id).then(function(resp) {
                $scope.detail = resp;
                $scope.tit = resp.info.title;
            })

            $scope.praise = function() {
                if (userInfo.patientId != '' && userInfo.patientId != '0') {
                    DiscoverServ.praisePhp(userInfo.auth, $stateParams.id).then(function(resp) {
                        $scope.detail.praise = 'yes';
                        $scope.detail.info.praisenum++;
                    })
                } else {
                    $ionicLoading.show({
                        template: '登录后才可以点赞哦',
                        duration: 1200
                    });
                }
            }

        })

    });
})
