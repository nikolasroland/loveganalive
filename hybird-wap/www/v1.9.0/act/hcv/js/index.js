
$(document).ready(function(){
    var scroll = new IScroll('#scroll-web', {probeType: 3,  bounce: false});
    //隐藏显示游戏规则
    showRules();
    checkWxLogin();
    getLoveInfo();
    getRank();
    //通过分享人的userName得到该人在该活动中排名、头像，
    //显示点赞明细以及时间，
    //点赞后根据用户类型处理点赞

    $(".btn-tap").swipe({
        tap:function(){
            if(userName){
                alert("点赞成功！");
                addLove();
            }else{
                return false;
            }
        }
    });

    function showRules(){
        $(".rules-title").swipe({
            tap:function(){
                $(".rules-content").slideToggle("slow",function(){
                    scroll.refresh();
                });
            }
        })
    }

    //微信授权获取userName openId
    function checkWxLogin() {
        console.log(userName);
        if (!userName || undefined == userName || null == userName || "" == userName) {
            window.location.href = "http://testmanage.aiganyisheng.net/trade/app/redirectWechatLogin.htm?sign=5540b83596ed1584f7a0cf2faa4bfab6&userType=2";
        }
    }

    //点赞成功
    function addLove(){
        var userType = localStorage.getItem("userType");
        var toHelperUser = localStorage.getItem("toHelperUser");
        if(toHelperUser){
            $.ajax({
                url:ajaxUrl+"addLoveCount.htm",
                type:"POST",
                dataType:"json",
                data:{
                    sign:"9cd0445e2ee4cceadd4f02a17edb8e57",
                    openId:openId,
                    toHelperName:toHelperUser
                },
                success:function(res){
                    console.log(res);
                    window.location.href="applypraise.html";
                },
                error:function(error){
                    alert("亲，网速不行呀");
                }
            })
        }

    }

    //获取点赞信息前3
    function getLoveInfo() {
        if(userName){
            $.ajax({
                 url:ajaxUrl+'getLoveCountDetailInfo.htm',
                 // url:"js/test.json",
                type:'post',
                dataType:'json',
                data:{
                    sign:'c9d77b16f8b81a542e36b8290456c031',
                    userName:userName,
                    page:1,
                    rows:3
                },
                success:function (data) {
                    console.log(data);
                    var love_info = $("#index-love-info");
                    var infoArr=data.values.rows;
                    if(infoArr.length >0){
                        for(var i in infoArr){
                            var tpl = $($('#tpl-love-info').html()).clone();
                            var data_headimgurl = tpl.find(".data-headimgurl"),
                                data_nickName = tpl.find(".data_nickName"),
                                data_hospital = tpl.find(".data-hospital"),
                                data_minuteBefore = tpl.find(".data-minuteBefore"),
                                data_loveCount = tpl.find(".data-loveCount");
                            data_headimgurl.attr("src",infoArr[i].headimgurl);
                            data_nickName.text(infoArr[i].nickName);
                            data_hospital.text(infoArr[i].hospital);
                            data_minuteBefore.text(infoArr[i].minuteBefore);
                            data_loveCount.text(infoArr[i].loveCount);
                            tpl.appendTo(love_info);
                        }
                    }
                },
                error:function(error){
                    console.log(error);
                }
            });
        }
    }


    //获取当前医生排名
    function getRank(){
        var toHelperUser = GetQueryString("userName");
        localStorage.setItem("toHelperUser",toHelperUser);
        console.log(toHelperUser);
        if(toHelperUser){
            $.ajax({
                url:ajaxUrl+"getHcvPromotionInfo.htm",
                type:"POST",
                dataType:"json",
                data:{
                    sign:"6c7a899608021ed85387ce9fa5596aa7",
                    userName:toHelperUser
                },
                success:function(res){
                    console.log(typeof res);
                    var info = res.values;
                    $(".doctor-head").css("background","url("+info.headimgurl+") center/cover");
                    $(".ranknum").text(info.exceedPerson);
                }
            })
        }
    }
});






