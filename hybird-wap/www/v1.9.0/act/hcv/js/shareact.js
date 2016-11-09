$(document).ready(function() {
    var scroll = new IScroll('#scroll-web', {probeType: 3, bounce: false});

    $("#btn-share").swipe({
        tap: function () {
            alert("请点击右上角分享");
        }
    });

    var doctorName = localStorage.getItem("doctorName");
    $(".sharecenter p i").text(doctorName);

    //配置分享内容
    var shareContent = {
        url: "testwap.aiganyisheng.net/v1.9.0/act/hcv/index.html?userName=" + userName,
        title: "丙肝活动",
        content: "我正参加“保驾护航抗丙肝”公益活动，快来帮我攒爱心，您的帮助将让一位医生拯救一位海外丙肝患者！",
        pic: "http://testwap.aiganyisheng.net/v1.9.0/act/hcv/img/share-img.png"
    };

    initWxJSSDK();
    function initWxJSSDK() {
        var thisPageUrl = location.href;
        $.ajax({
            url: ajaxUrl + "tenpayJsApiTicketShare.htm",
            type: "POST",
            data: {
                sign: 'c48d421b4364182263376e7b9d905067',
                url: thisPageUrl
            },
            success: function (data) {
                console.log(data);
                var str = JSON.parse(data);
                var signJson = str.values;
                   var  appid = signJson.appid,
                        timestamp = signJson.timestamp,
                        noncestr = signJson.noncestr,
                        signature = signJson.sign;
                    if (wx != undefined) {
                        //初始化微信sdk
                        wx.config({
                            debug: false,
                            appId: appid,
                            timestamp: timestamp,
                            nonceStr: noncestr,
                            signature: signature,
                            jsApiList: [
                                'onMenuShareTimeline',
                                'onMenuShareAppMessage',
                                'checkJsApi',
                                'chooseImage',
                                'previewImage',
                                'uploadImage',
                                'downloadImage'
                            ]
                        });
                    }else {
                        console.log(signJson.errormsg);
                    }
            },

            error: function (error) {
                console.log(error);
            },
            beforeSend: function (XMLHttpRequest) {
            },
            complete: function (XMLHttpRequest, textStatus) {
                //HideLoading();//关闭进度条
                //alert("complete");
                //console.log("complete");
            }
        });

        // window.location.href="http://testmanage.aiganyisheng.net/trade/app/redirectWechatLogin.htm?sign=" +
        //     "5540b83596ed1584f7a0cf2faa4bfab6&type=2";

    }

    if (wx != undefined) {
        wx.ready(function () {
            //判断当前客户端版本是否支持指定JS接口
            wx.checkJsApi({
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'checkJsApi',
                    'chooseImage',
                    'previewImage',
                    'uploadImage',
                    'downloadImage'
                ],
                success: function (res) {
                    console.log(res);

                    //朋友圈
                    wx.onMenuShareTimeline({
                        title: shareContent.title, // 分享标题
                        link: shareContent.url, // 分享链接
                        imgUrl: shareContent.pic, // 分享图标
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        trigger: function (res) {
                            //shareLog()
                            //alert('用户点击分享到朋友圈');
                        },
                        success: function (res) {

                            //shareLog()
                            alert('已分享');
                        },
                        cancel: function (res) {
                            //alert('已取消');
                        },
                        fail: function (res) {
                            console.log(JSON.stringify(res));
                        }
                    });
                    //分享给朋友
                    wx.onMenuShareAppMessage({
                        title: shareContent.title, // 分享标题
                        desc: shareContent.content, // 分享描述
                        link: shareContent.url, // 分享链接
                        imgUrl: shareContent.pic, // 分享图标
                        type: 'link', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            //alert("成功")
                            // 用户确认分享后执行的回调函数
                            //shareLog()
                            alert('已分享');
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                            alert('已取消');
                        },
                        fail: function (res) {
                            console.log(JSON.stringify(res));
                        }
                    });

                    //分享到QQ
                    wx.onMenuShareQQ({
                        title: shareContent.title, // 分享标题
                        desc: shareContent.content, // 分享描述
                        link: shareContent.url, // 分享链接
                        imgUrl: shareContent.pic, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            alert("成功分享");
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                            alert("分享失败");
                        }
                    });
                }
        });
        });
    }
});


