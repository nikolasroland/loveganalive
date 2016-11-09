$(document).ready(function(){
    var scroll = new IScroll('#scroll-web', {probeType: 3, mouseWheel: true, bounce: true});
    var page = 1, rows = 10;
    var distance = 30, flag = true;

    //上拉加载
    scroll.on("slideUp", function() {
        if (this.maxScrollY - this.y > distance) {
            if (flag) {
                flag = false;
                page += 1;
                getLoveInfo(page);
            }
        }
    });

    getLoveInfo();

    function getLoveInfo() {
        if(userName){
            $.ajax({
                url:ajaxUrl+'getLoveCountDetailInfo.htm',
                // url:"js/test.json",
                type:'post',
                dataType:"json",
                data:{
                    sign:'c9d77b16f8b81a542e36b8290456c031',
                    userName:userName,
                    page:page,
                    rows:rows
                },
                success:function (data) {
                    console.log( typeof data);
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
                            data_hospital.text( infoArr[i].hospital);
                            data_minuteBefore.text(infoArr[i].minuteBefore);
                            data_loveCount.text(infoArr[i].loveCount);
                            tpl.appendTo(love_info);
                        }
                    }
                    flag = true;
                    scroll.refresh();
                },
                error:function(error){
                    console.log(error);
                }
            });
        }

    }


})