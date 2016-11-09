
$(document).ready(function(){
    //验证手机号码
    $(".getcode").swipe({
        tap:function(){
            checkPhone();
        }
    });
    $(".submit").swipe({
        tap:function(){
            checkPhone();
        }
    });


});

function checkPhone() {
    var _reg = /^1[3|4|5|7|8]\d{9}$/;
    var count = 180;
    var phoneNum = $(".phone").val();
    var _getcode = $(".getcode").html();
    if (!_reg.test(phoneNum)) {
        alert("您输入的手机号有问题!");
        return false;
    }else{
        checkExist();
    }


}
//判断手机号是否注册
function checkExist(){
    $.ajax({
        url:ajaxUrl+"queryUserNameIsJoin.htm",
        type:"POST",
        data:{
            userName:userName,
            sign:"70716d226a174d180ae85130d706aff6"
        },
        success: function(data){
            var str = JSON.parse(data);
            var isReg= str.values;
            if(isReg=='YES'){//没有注册
                getCode($(".phone").val());
            }else{
                alert('您已经注册过了');
            }
    }
    })
}
function checkCode(){
    var phoneNum = $(".phone").val();
    var codeVal = $(".testcode").val();
    console.log(codeVal);
    $.ajax({
        url:"http://testnewapi.aiganyisheng.net/public/phone_verification_code_check",
        type:"POST",
        data:"telphone="+phoneNum+"&code="+codeVal,
        success:function(data){
            var str = JSON.parse(data);
            // console.log(str.code);
            if(str.code==206 && codeVal){
                window.location.href = "fillmess.html";
            }else{
                alert("验证码输入错误");
                return false;
            }
        },
        error:function(error){
            alert("请重新输入");
            return false;
        }
    })
}

function getCode(phoneNum){
    $.ajax({
        url:"http://testnewapi.aiganyisheng.net/public/phone_verification_code",
        data:"telphone="+phoneNum+"&type=1",
        type:"POST",
        success:function(data){
            console.log(data);
            $(".getcode").html( "获取成功");
            getCodeActive($(".getcode"));
            //验证码检测
            $(".submit").swipe({
                tap:function(){
                    checkCode();
                }
            });
        },
        error:function(error){
            alert("网路问题，请重新获取");
        }
    });

}
function getCodeActive(obj){
    console.log("已发送验证码");
    var $getRegCode = obj;
    if (!$getRegCode.hasClass('disable')) {
        $getRegCode.addClass('disable');
        var iSecond = 180;
        var timer;
        $getRegCode.text(iSecond + "s");
        iSecond--;
        timer = setInterval(function () {
            if (iSecond < 0) {
                $getRegCode.text("重新获取");
                clearInterval(timer);
                $getRegCode.removeClass('disable');
            } else {
                $getRegCode.text(iSecond + "s");
                iSecond--;
            }
        }, 1000);
    }
}
