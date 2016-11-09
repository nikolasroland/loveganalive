$(function() {
    var scrollDpt = new IScroll('#scroll-dpt', {
        probeType: 3,
        mouseWheel: true
    });
    var scrollRes = new IScroll('#result', {
        probeType: 3,
        mouseWheel: true
    });
    var ajaxUrl = "http://www-test.zhaoduiyisheng.com/api/";
    var scroll;
    var page = 1;
    var distance = 30;
    var bFlag = true;
    var $city;
    var $department = '';
    if (window.sessionStorage.filterDoctor) {
        $city = JSON.parse(window.sessionStorage.filterDoctor).city;
        $department = JSON.parse(window.sessionStorage.filterDoctor).department;
        if (!$department) {
            $("#filter-dpt").text("科室筛选");
        }
        $("#city-list>li").each(function() {
            if ($(this).text() === $city) {
                $(this).addClass('c-cyan').siblings().removeClass();
            }
        });
        $("#dpt-list>li").each(function() {
            if ($(this).text() === $department) {
                $(this).addClass('c-cyan').siblings().removeClass();
            }
        });
    } else if ($("#filter-city").text()) {
        $city = $("#filter-city").text();
        $("#filter-dpt").text("科室筛选");
    } else {
        $city = "北京";
        $("#filter-city").text("北京");
        $("#filter-dpt").text("科室筛选");
    }

    function loadInit() {
        $("#filter-city").text($city);
        if ($department) {
            $("#filter-dpt").text($department);
        }
        scroll = new IScroll('#scroll-doctor', {
            probeType: 3,
            mouseWheel: true
        });
        getDoctorList($city, $department, page);
        scroll.on("slideUp", function() {
            if (this.maxScrollY - this.y > distance) {
                if (bFlag) {
                    bFlag = false;
                    page += 1;
                    getDoctorList($city, $department, page);
                }
            }
        });
    }

    function getDoctorList(city, department, page) {
        var config = {
            city: city || "",
            department: department || "",
            page: page || 1
        };

        window.sessionStorage.filterDoctor = JSON.stringify(config);
        $.ajax({
            type: "GET",
            url: ajaxUrl + "Platform/DoctorList?city=" + config.city + "&department=" + config.department + "&page=" + config.page,
            contentType: "text/plain; charset=UTF-8",
            dataType: "json",
            success: function(res) {
                if (res.code == 0) {
                    var dataList = res.data.dataList;
                    var len = dataList.length;
                    var $doctorItem = '';
                    var $doctorList = $("#doctor-list");
                    if (page == 1) {
                        $doctorList.html("");
                    }
                    if (len > 0) {
                        for (var i = 0; i < len; i++) {
                            if (!dataList[i].avatar) {
                                dataList[i].avatar = 'http://imgcdn.zhaoduiyisheng.com/img/icon/icon_doctor.png';
                            }
                            $doctorItem = $('<li>' +
                                '<a href="doctorDetail.html?from=doctorInfo&uuid=' + dataList[i].uuid + '">' +
                                '<div class="fl doctor-head" style="background-image:url(' + dataList[i].avatar + ')">' +
                                '</div>' +
                                '<ul class="fl">' +
                                '<li class="cbo">' +
                                '<span class="f34 fl mr14">' + dataList[i].name + '</span>' +
                                '<span class="f28 c-66 fl pt02">' + dataList[i].jobTitle + '</span>' +
                                '</li>' +
                                '<li class="f28 c-66">' + dataList[i].sectionName + '</li>' +
                                '<li class="f24 c-99">' + dataList[i].hospital + '</li>' +
                                '</ul>' +
                                '</a>' +
                                '</li>');
                            $doctorList.append($doctorItem);
                        }
                        bFlag = true;
                    } else {
                        $(".pull-down").text("没有更多数据了");
                    }

                }
            },
            error: function(res) {
                if (res.status == 401) {
                    myalert.tips({
                        txt: "会话超时，请重新登录",
                        fnok: function() {
                            window.location = "../html/newLogin.html";
                        },
                        btn: 1
                    });

                }
            }
        }).success(function() {
            scroll.refresh();
        });
    }
    //筛选医生
    function filterDoctor() {
        $("#filter-city").swipe({
            tap: function() {
                if (!$("#win-dpt").hasClass('dn')) {
                    $("#win-dpt").addClass('dn');
                }
                $("#win-city").removeClass("dn");
            }
        });
        $("#filter-dpt").swipe({
            tap: function() {
                if (!$("#win-city").hasClass('dn')) {
                    $("#win-city").addClass('dn');
                }
                $("#win-dpt").removeClass("dn");
                scrollDpt.refresh();
            }
        });
        $("#win-city").swipe({
            tap: function(e) {
                $("#win-city").addClass("dn");
                e.preventDefault();
            }
        });
        $("#win-dpt").swipe({
            tap: function(e) {
                $("#win-dpt").addClass("dn");
                e.preventDefault();
            }
        });
        $("#close-dpt").swipe({
            tap: function(e) {
                $("#win-dpt").addClass("dn");
                e.preventDefault();
            }
        });


        $("#city-list li").swipe({
            tap: function() {
                if ($(this).hasClass("c-cyan")) {
                    return false;
                }
                $city = $(this).text();
                $(this).addClass("c-cyan").siblings().removeClass("c-cyan");
                $("#filter-city").text($city);
                page = 1;
                getDoctorList($city, $department, page);
            }
        });
        $("#dpt-list li").swipe({
            tap: function() {
                if ($(this).hasClass("c-cyan")) {
                    return false;
                }
                $department = $(this).text();
                $(this).addClass("c-cyan").siblings().removeClass("c-cyan");
                $("#filter-dpt").text($department);
                page = 1;
                getDoctorList($city, $department, page);
            }
        });
        $("#doctor-list").on('click', '.doctor-head', function(e) {
            window.location = 'https://www.baidu.com/s?ie=utf-8&fr=bks0000&wd=' + $(this).next().find('span').eq(0).text() + '%20' + $(this).next().find('li').last().text();
            e.preventDefault();
        });
    }
    //函数调用
    loadInit();
    filterDoctor();
    // 搜索变量
    var nowSKey='',
        nowSPage = 1;
    // 判断中文
    function isChineseChar(str) {
        var reg = /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/g;
        return reg.test(str);
    }
    // 获取历史搜索
    function getHistory(arr) {
        if (arr) {
            var his = JSON.parse(arr),
                str = '<div class="history clearfix c-99 pr"><em class="fl">历史搜索</em><em class="clear-history centerY br5">清除搜索历史</em></div>',
                i = his.length - 1;
            for (; i >= 0; i--) {
                str += '<div class="key">' + his[i] + '</div>';
            }
            $('#result').children().empty().append(str);
            scrollRes.refresh();
        }
    }
    // 执行搜索
    function runSearch(key,page) {
        var search;
        if (window.localStorage.search) {
            search=JSON.parse(window.localStorage.search);
        }else{
            search=[];
        }
        if (search[0]&&-1<key.indexOf(search[search.length-1])) {
            search[search.length-1]=key;
        }else{
            search.push(key);
        }
        window.localStorage.search=JSON.stringify(search);
        $.ajax({
            type: "GET",
            url: ajaxUrl + "Platform/DoctorList?name=" + key + '&page=' + page,
            contentType: "text/plain; charset=UTF-8",
            dataType: "json",
            success: function(res) {
                if (res.code == 0) {
                    var dataList = res.data.dataList,
                        len = dataList.length,
                        str = '',
                        i = 0;
                    if (len > 0) {
                        for (; i <len; i++) {
                            str += '<div class="icon-list" data-uuid="'+dataList[i].uuid+'">'+dataList[i].name+'&nbsp;'+dataList[i].hospital+'</div>';
                        }
                        if (1===page) {
                            $('#result').children().empty().append(str);
                            nowSPage++;
                            runSearch(nowSKey,nowSPage);
                        }else{
                            $('#result').children().append(str);
                        }
                        scrollRes.refresh();
                    } else if (1===page) {
                        $('#result').children().empty();
                    }
                }else{
                    myalert.tips({
                        txt: res.message,
                        btn: 1
                    });
                }
                scroll.refresh();
                bFlag = true;
            },
            error: function(res) {
                myalert.tips({
                    txt: "网络错误，请稍后再试",
                    btn: 1
                });
                bFlag = true;
            }
        });
    }
    scrollRes.on("slideUp", function() {
        if (this.maxScrollY - this.y > distance) {
            if (bFlag&&!$('#result>div>div').hasClass('history')) {
                bFlag = false;
                nowSPage += 1;
                runSearch(nowSKey,nowSPage);
            }
        }
    });
    // 添加事件
    // input
    var windowHeight = $(window).height();
    $("#search").on('focus',
        function(e) {
            $(this).parent().addClass('centerY w85 ml10').removeClass('center').parent().addClass('searchon');
            $("#cancel").removeClass('dn');
            $('#result').css('background','#ededed');
            $('#result').removeClass('dn').height(windowHeight - $('.search').height());
            getHistory(window.localStorage.search);
            e.preventDefault();
        }
    );
    $("#search").on('input propertychange', function() {
        if (isChineseChar($(this).val())) {
            nowSKey = $(this).val();
            nowSPage = 1;
            runSearch(nowSKey,nowSPage);
        }
        if ($(this).val()) {
            $("#del").removeClass('dn');
        }else{
            $("#del").addClass('dn');
        }
    });
    $('#search').parent().swipe({
        tap: function(e) {
            $("#search").focus();
            e.preventDefault();
        }
    });
    // 取消
    $("#cancel").swipe({
        tap: function(e) {
            $("#search").blur().val('');
            $('#result').addClass('dn');
            $(this).addClass('dn').prev().addClass('center').removeClass('centerY w85 ml10').parent().removeClass('searchon');
            $('#result').children().empty();
            e.preventDefault();
        }
    });
    // 删除搜索框文字
    $("#del").swipe({
        tap: function(e) {
            $("#search").val('');
            e.preventDefault();
        }
    });
    // 结果列表事件委托
    $("#result").swipe({
        tap: function(e, t) {
            if ($(t).hasClass('clear-history')) {
                window.localStorage.removeItem('search');
                $('#result').children().empty();
            } else if ($(t).hasClass('key')) {
                nowSKey = $(t).text();
                nowSPage = 1;
                runSearch(nowSKey,nowSPage);
            } else if ($(t).hasClass('icon-list')) {
                window.location='doctorDetail.html?from=doctorInfo&uuid='+$(t).data('uuid');
            }
            e.preventDefault();
        }
    });
    $("#result").on('touchstart',function(){
        $("#search").blur();
    });
});

