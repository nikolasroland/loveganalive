var startCtrl = angular.module('starter.consult.controllers', [])

startCtrl.controller('patientMeCtrl', function($scope, $rootScope, DoctorServ) {

})

startCtrl.controller('consultCtrl', function($scope, $rootScope, DoctorServ) {
    if (!window.localStorage.getItem('loginState')) {
        $rootScope.openLoginModal();
        return;
    }

    var auth = localStorage.getItem('auth');
    $scope.doctorId = localStorage.getItem('doctorId');
    if ($scope.doctorId == '' || $scope.doctorId == 0) {
        DoctorServ.getConsultForOneYuan(auth).then(function(resp) {
            $scope.list = resp.list;
        })
        return;
    } else {
        window.location.href = '#/consult/me-doctor-consult/' + $scope.doctorId;
    }
})


startCtrl.controller('doctorSearchCtrl', function($scope, $state, $ionicHistory, $ionicPlatform, $ionicModal, $ionicPopup, $ionicListDelegate, $timeout, DoctorServ) {
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

startCtrl.controller('doctorInfoCtrl', function($scope, $ionicHistory, $ionicPlatform, $ionicPopup, $stateParams, $ionicScrollDelegate, $ionicListDelegate, $timeout, DoctorServ, CommentServ) {
    $scope.showHistoryBack = $ionicHistory.viewHistory().backView === null;
    $ionicPlatform.ready(function() {
        Native.getAuth('patient', function(userInfo) {
            $scope.patient = userInfo;
            DoctorServ.reloadAllInfo(userInfo.auth, $stateParams.id).then(function(resp) {
                $scope.doctor = resp;
            })

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
                    if ($scope.doctor.modelid == '11') {
                        CommentServ.reload(userInfo.auth, $stateParams.id, CommentServ.curPage).then(function(response) {
                            $scope.hasLoaded = true;
                            CommentServ.hasmore = response.page_total > CommentServ.curPage;
                            $scope.comment = response;
                            for (var i = 0; i < response.list.length; i++) {
                                $scope.commentList.push(response.list[i]);
                            }
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            CommentServ.curPage++;
                            $ionicScrollDelegate.freezeScroll(false);
                        });
                    } else {
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
                    }
                }, 1000);
            };

            $scope.moreDataCanBeLoaded = function() {
                return CommentServ.hasmore;
            }

            $scope.delComment = function(commentid, index) {
                $ionicPopup.confirm({
                    title: '确定要删除该条评价吗？',
                    template: '',
                }).then(function(res) {
                    if (res) {
                        CommentServ.delComment(auth, commentid).then(function() {
                            $ionicPopup.alert({
                                title: '删除成功'
                            })
                            $scope.commentList.splice(index, 1);
                            $scope.comment.total--;

                            CommentServ.reload(userInfo.auth, $stateParams.id, CommentServ.curPage).then(function(response) {
                                $scope.comment = response;
                            });
                        })
                    }
                });
            }
        })
    });
})

startCtrl.controller('doctorConsultCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, $ionicLoading, localStorageService, PatientServ, DoctorServ) {
    var auth = window.localStorage.getItem('auth'),
        doctorId = $stateParams.id;

    $scope.consultation = window.localStorage.getItem('consultation');
    $scope.sex = {};
    $scope.sex.type = '1';

    DoctorServ.reload(auth, doctorId).then(function(resp) {
        $scope.doctorInfo = resp;
        window.localStorage.setItem('targetDoctorId', resp.userid);
        window.localStorage.setItem('targetDoctorName', resp.username);
    });

    PatientServ.getQualityConsultProduct().then(function(resp) {
        $scope.consultProduct = resp[0];
        localStorageService.set('consultProduct', resp[0]);
        window.localStorage.setItem('subject', '53');
    });

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
                $ionicLoading.show({
                    template: '正在上传图片',
                    duration: 1200
                });
            }
        });
        return uploadPic;
    }

    $scope.delImg = function() {
        inputPrescription.delImg();
    }

    $scope.goPay = function(casepoint, sex, age) {
        if (typeof casepoint == "undefined" || casepoint.length < 20) {
            $ionicPopup.alert({
                title: '请输入不少于20字病情'
            });
        } else if (typeof sex == "undefined") {
            $ionicPopup.alert({
                title: '请输入性别'
            });
        } else if (typeof age == "undefined" || age < 1 || age > 100) {
            $ionicPopup.alert({
                    title: '请输入正确的年龄'
                })
                /*        } else if (inputPrescription === null || inputPrescription.base64 === null) {
                            $ionicPopup.alert({
                                title: '请上传病情图片'
                            })*/
        } else {
            PatientServ.pubConsult(casepoint, sex, age, inputPrescription, doctorId, auth).then(function(resp) {
                window.localStorage.setItem('questionId', resp.question_id);
                if ($scope.consultation != 0) {
                    $scope.consultation--;
                    window.localStorage.setItem('consultation', $scope.consultation);
                    window.location.href = "#/my-consult-order";
                } else {
                    window.location.href = "#/consult/me-pay";
                }
            })
        }
    }
})


startCtrl.controller('quickConsultCtrl', function($scope, $rootScope, $ionicLoading, $ionicPopup, localStorageService, PatientServ, DoctorServ) {

    var doctorId = window.localStorage.getItem('doctorId'),
        auth = window.localStorage.getItem('auth');

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
                $ionicLoading.show({
                    template: '正在上传图片',
                    duration: 1200
                });
            }
        });
        return uploadPic;
    };

    PatientServ.getOneConsultProduct().then(function(resp) {
        $scope.consultProduct = resp[0];
        localStorageService.set('consultProduct', resp[0]);
        window.localStorage.setItem('targetDoctorId', 0);
        window.localStorage.setItem('targetDoctorName', '');
        window.localStorage.setItem('subject', '52');
    });

    $scope.sex = {};
    $scope.sex.type = '1';

    $scope.goPay = function(casepoint, sex, age) {
        console.log(casepoint);
        if (typeof casepoint == "undefined" || casepoint.length < 20) {
            $ionicPopup.alert({
                title: '请输入不少于20字病情'
            });
        } else if (typeof sex == "undefined") {
            $ionicPopup.alert({
                title: '请输入性别'
            });
        } else if (typeof age == "undefined" || age < 1 || age > 100) {
            $ionicPopup.alert({
                title: '请输入正确的年龄'
            })
        }
        /*else if (inputPrescription === null || inputPrescription.base64 === null) {
                   $ionicPopup.alert({
                       title: '请上传病情图片'
                   })
               }*/
        else {
            PatientServ.pubConsult(casepoint, sex, age, inputPrescription, auth).then(function(resp) {
                window.localStorage.setItem('questionId', resp.question_id);
                window.location.href = "#/consult/me-pay";
            })
        }
    }
})


startCtrl.controller('mePayCtrl', function($scope, $rootScope, $ionicPopup, localStorageService, RechargeServ) {
    $scope.consultProduct = localStorageService.get('consultProduct');
    console.log($rootScope.openid)
    var patientId = window.localStorage.getItem('patientId'),
        patientName = window.localStorage.getItem('patientName'),
        patientNickName = window.localStorage.getItem('patientNickName'),
        doctorId = window.localStorage.getItem('targetDoctorId'),
        doctorName = window.localStorage.getItem('targetDoctorName'),
        subject = window.localStorage.getItem('subject'),
        questionId = window.localStorage.getItem('questionId'),
        hasPassword = window.localStorage.getItem('hasPassword');
    RechargeServ.getCash(patientName).then(function(resp) {
        $scope.balance = resp.balance;
        $scope.insuranceAccount = resp.insuranceAccount;
        $scope.cashAccount = resp.cashAccount;

        $scope.pay = function(type) {
            if (hasPassword == '1') {
                switch (type) {
                    case '0':
                        if ($scope.cashAccount < $scope.consultProduct.price) {
                            $ionicPopup.confirm({
                                title: '余额不足',
                                template: '',
                                okText: '充值',
                                cancelText: '取消'
                            }).then(function(res) {
                                if (res) {
                                    $rootScope.openRechargeModal();
                                }
                            });
                        } else {
                            $ionicPopup.prompt({
                                title: '使用帐户余额支付' + $scope.consultProduct.price + ' 元',
                                template: '请输入支付密码',
                                inputType: 'password',
                                okText: '确认',
                                cancelText: '取消'
                            }).then(function(res) {
                                if (typeof res != 'undefined') {
                                    RechargeServ.payConsultByBalance(patientId, patientName, 1, '', res, subject, $scope.consultProduct.id, doctorId, doctorName, patientId, patientName, questionId).then(function(resp) {
                                        $ionicPopup.alert({
                                            title: '支付成功'
                                        }).then(function() {
                                            if ($scope.consultProduct.price == 1) {
                                                window.location.href = '#/consult/me-pay-over';
                                            } else {
                                                window.location.href = '#/reserv/me-pay-res-over';
                                            }
                                        })
                                    })
                                }
                            });
                        }
                        break;
                    case '1':
                        if ($scope.balance < $scope.consultProduct.price) {
                            $ionicPopup.confirm({
                                title: '余额不足',
                                template: '',
                                okText: '充值',
                                cancelText: '取消'
                            }).then(function(res) {
                                if (res) {
                                    $rootScope.openRechargeModal();
                                }
                            });
                        } else {
                            $ionicPopup.prompt({
                                title: '使用帐户余额支付' + $scope.consultProduct.price + ' 元',
                                template: '请输入支付密码',
                                inputType: 'password',
                                okText: '确认',
                                cancelText: '取消'
                            }).then(function(res) {
                                if (typeof res != 'undefined') {
                                    RechargeServ.payConsultByBalance(patientId, patientName, 0, '', res, subject, $scope.consultProduct.id, doctorId, doctorName, patientId, patientName, questionId).then(function(resp) {
                                        $ionicPopup.alert({
                                            title: '支付成功'
                                        }).then(function() {
                                            window.location.href = '#/consult/me-pay-over';
                                        })
                                    })
                                }
                            });
                        }
                        break;
                    case '2':
                        var jsonData = {
                            'orderData': {
                                'uI': patientId,
                                'uN': patientName,
                                'nN': patientNickName,
                                'pR': 'H5',
                                'oC': '',
                                'pF': '00'
                            },
                            'tenpayData': {
                                'body': '咨询',
                                'total_fee': $scope.consultProduct.price * 100,
                                'remoteAddr': '196.168.1.1',
                                'tradeType': 'JSAPI',
                                'openid': $rootScope.openid
                            },
                            // 'productData': {
                            //     subject: subject,
                            //     productId: $scope.consultProduct.id,
                            //     doctorId: doctorId,
                            //     doctorName: doctorName,
                            //     patientId: patientId,
                            //     patientName: patientName,
                            //     questionId: questionId
                            // }
                        };
                        var productData = {
                            subject: subject,
                            productId: $scope.consultProduct.id,
                            doctorId: doctorId,
                            doctorName: doctorName,
                            patientId: patientId,
                            patientName: patientName,
                            questionId: questionId
                        };
                        RechargeServ.payByWeixin(JSON.stringify(jsonData), JSON.stringify(productData)).then(function(resp) {
                            if (resp == 'error') {
                                $ionicPopup.alert({
                                    title: '微信支付出现了网络错误'
                                });
                                return;
                            }
                            wx.config({
                                // debug: true,
                                appId: APP_ID, // 必填，公众号的唯一标识
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
                                        window.location.href = '#/consult/me-pay-over';
                                        console.log('scccccuuu')
                                    }
                                });
                            });
                        })
                        break;
                }
            } else {
                $ionicPopup.alert({
                    title: '您尚未设置支付密码，请先进行设置'
                }).then(function() {
                    window.location.href = '#/set-password-receivecode';
                })
            }
        }
    });

})

startCtrl.controller('mePayOverCtrl', function($scope, $ionicPlatform, $ionicPopup, $timeout) {
    $ionicPlatform.ready(function() {})

})

startCtrl.controller('myConsultOrderCtrl', function($scope, $ionicPopup, conOrderServ, $rootScope, localStorageService) {
    var auth = localStorage.getItem('auth');

    if (!window.localStorage.getItem('loginState')) {
        $rootScope.openLoginModal();
    }

    conOrderServ.myConsultOrder(auth).then(function(resp) {
        $scope.list = resp;
    })

    $scope.viewDetail = function() {
        localStorageService.set('consultDetail', this.item);
    }
})

startCtrl.controller('myConsultOrderDetailCtrl', function($scope, $stateParams, $ionicPopup, $timeout, conOrderServ, localStorageService) {
    var auth = localStorage.getItem('auth');
    if (!$stateParams.status) {
        conOrderServ.myConsultOrderDetail(auth, $stateParams.id).then(function(resp) {
            $scope.list = resp;
        })
    } else {
        $scope.list = [];
        $scope.list.push(localStorageService.get('consultDetail'));
        $scope.msg = $stateParams.status == 'waitting' ? '我们将尽力联系医生在24小时内回复您，请耐心等待。' : '';
    }
})
