//加载排名
$(document).ready(function(){
    var page = 1;
    var $rank_my = $(".rank-my");
    var scroll = new IScroll('#scroll-web', {probeType: 3, mouseWheel: true, bounce: true});
    var distance = 30, flag = true;
    getRankInfo(page);
    var toHelperUser = localStorage.getItem("toHelperUser");
    getUserInfo(toHelperUser);
    //上拉加载
    scroll.on("slideUp", function() {
        if (this.maxScrollY - this.y > distance) {
            if (flag) {
                flag = false;
                page += 1;
                getRankInfo(page);
            }
        }
    });

    function getRankInfo(page){
        $.ajax({
            url:ajaxUrl+"queryDocLoveCountRank.htm",
            type:"POST",
            dataType:"json",
            data:{sign:"5f203885575bf2c252b8f3f6b6aa6925",page:page},
            success:function(data){
                console.log(data);
                var ranklist = $("#rank-list");
                var dataArr = data.values.rows;
                if(dataArr.length>0){
                    for(var i in dataArr){
                        var tpls = $($("#tpl-love-rank").html()).clone();
                        var data_headimgurl = tpls.find("img"),
                            data_ranknum = tpls.find("#data-ranknum"),
                            data_nickName = tpls.find("#data-name"),
                            data_addr = tpls.find("#datsa-addr"),
                            data_hospital = tpls.find("#data-hospital"),
                            data_office = tpls.find("#data-office"),
                            data_loveCount = tpls.find("#data-lovenum");
                        data_headimgurl.attr("src",dataArr[i].headimgurl);
                        data_ranknum.text(parseInt(i)+1);
                        data_nickName.text(dataArr[i].nickName);
                        data_addr.text(dataArr[i].state);
                        data_hospital.text(dataArr[i].hospital);
                        data_office.text(dataArr[i].departments);
                        data_loveCount.text("+"+dataArr[i].loveCount);
                        tpls.appendTo(ranklist);
                    }
                }
                flag = true;
                scroll.refresh();
            }
        })
    }

    function getUserInfo(obj){
        if(obj){
            $.ajax({
                 url:ajaxUrl+"getHcvPromotionInfo.htm",
                type:"POST",
                dataType:"json",
                data:{
                    sign:"6c7a899608021ed85387ce9fa5596aa7",
                    userName:toHelperUser
                },
                success:function(res){
                    var rankMy = $(".rank-my");
                    console.log(res);
                    var toHelperInfo = res.values;
                    rankMy.find("img").attr("src",toHelperInfo.headimgurl);
                    rankMy.child("b").find("em").text(toHelperInfo.exceedPreson);
                    rankMy.child("p span em").text(toHelperInfo.nickName);
                    rankMy.find(".love-num").text(toHelperInfo.loveCount);
                },
                error:function(error){
                    console.log(error);
                }
            })
        }
    }
})