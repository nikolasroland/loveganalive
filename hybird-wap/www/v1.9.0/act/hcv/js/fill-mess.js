$(function(){
    var scroll = new IScroll('#scroll-web', {probeType: 3,  bounce: false});
    var openId = localStorage.getItem("openId"),
        nickName = localStorage.getItem("nickName");
    $(".mess-submit").swipe({
        tap:function(){
            checkMess();
        }
    });

    function checkMess(){
        var $hostname = $("#hostname").val();
        var $areaCode = $("#areacode").val();
        var $telephone = $("#telephone").val();
        var $department = $("#department").val();
        var $userName = $("#username").val();
        var areacheck = /^\d{3}$/.test($areaCode);
        var telcheck = /^\d{8}$/.test($telephone);
        if(!/^([\u4E00-\u9FA5]{2,4})$/.test($userName)){
            alert("请输入合法名字");
            return false;
        }if(!/[\u4E00-\u9FA5]/i.test($hostname)){
            // console.log($hostname);
            alert("请输入合法医院名");
            return false;
        }if(!areacheck || !telcheck){
            alert("请输入正确号码");
            return false;
        }else{
            var userData = {};
            userData.name = $userName;
            userData.hostipal = $hostname;
            userData.departments = $department;
            userData.phone = $areaCode + $telephone;
            // console.log(userData);
            joinAct(userData);
            localStorage.setItem("doctorName",$userName);
        }
    }

//加入活动
    function joinAct(obj){
        // console.log("val="+$hostname,$areaCode+$telephone,$department);
        var str = {
            sign:"2e1c12abe7f4d04e8268093393e82265",
            openId:openId,
            nickName:nickName,
            sourceName:userName,
            hospital:obj.hostipal,
            phone:obj.phone,
            departments:obj.departments
        };
        console.log(str);
        $.ajax({
            url:ajaxUrl + "joinHcvPromotionDoc.htm",
            type:"POST",
            data:{
                sign:"2e1c12abe7f4d04e8268093393e82265",
                openId:openId,
                nickName:nickName,
                sourceName:userName,
                hospital:obj.hostipal,
                phone:obj.phone,
                departments:obj.departments
            },
            success:function(data){
                alert("恭喜报名成功！");
                console.log(data);
                window.location.href="sharesuccess.html";
            },
            error:function(error){
                console.log("网络问题，请等待");
            }
        })
    }
});