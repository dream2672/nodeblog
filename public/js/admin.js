/**
 * Created by sheyude on 2017/5/3.
 */
// 登陆界面
$(document).ready(function(){
    var li = $(".login-img li");
    $(li[2]).animate({"opacity":"1"},2000)
    var sum = 0;
    var liTime = null;
    var imgTime = null;
    liTime = setInterval(function(){
        switch(sum){
            case 0:
                $(li).css({"opacity":"0"});
                $(li[0]).animate({"opacity":"1"},1000)
                break;
            case 1:
                $(li).css({"opacity":"0"});
                $(li[1]).animate({"opacity":"1"},1000)
                break;
            case 2:
                $(li).css({"opacity":"0"});
                $(li[2]).animate({"opacity":"1"},1000)
                break;
        }
    },4400)

    imgTime = setInterval(function(){
        sum++;
        if(sum == 3){
            sum = 0
        }
    },4400)

    // 切换注册
    $("#loginReg").click(function(){
        $("#loginDiv").hide();
        $("#regDiv").show();
        return false;
    })
    // 切换登陆
    $("#regLogin").click(function(){
        $("#regDiv").hide();
        $("#loginDiv").show();
        return false;
    })
    // 登陆界面警告框
    $("#close>div>span").click(function(){
        $("#close").hide();
    })

})
// 后台界面
$(document).ready(function(){
    // 后台左边栏
    var list = $("#left-list>li>a");
    list.click(function(){
        var on = $(this).attr("on");
        var ul = $(this).next();
        var li = ul.find("li");
        var height = li.length*li.height();
        console.log(on)
        if(on == 0 || on == undefined){
            ul.animate({"height":height+"px"});
            $(this).attr("on","1").css({"color":"#fff"});
            $(this).find("i").css("color","#f74e4d")
        }else if(on == 1){
            ul.animate({"height":0});
            $(this).attr("on","0").removeAttr("style");
            $(this).find("i").removeAttr("style");
        }
        return false;
    })

    // 算右边高度
    onsize();
    window.onresize = function(){
        onsize();
    }
    function onsize(){
        var clientHeight = document.body.clientHeight;

        var contentHeight = clientHeight - 65;
        $("#content").css({"min-height":contentHeight + "px"});
        // markdwon 高度
        $("#mark").css({"height":contentHeight-65 + "px"});
        $("#preview").css({"height":contentHeight-65 + "px"});

        //蒙版高度
        var right = $(".main").height()
        $("#right").css({"min-height":right + "px"});
    }



    // 搜索
    $(".search").focus(function(){
        $(this).animate({"width":"140px"}).removeAttr("placeholder");
    })
    $(".search").blur(function(){
        $(this).animate({"width":"100px"}).attr("placeholder","输入关键字");
    });



    // 小屏面包屑
    var $left = $(".left");
    $("#sm-bar").click(function(){
        $("#left-hiden").show(300);
        $left.animate({"width":"100px","display":"block"});
        $("#right").show()
    })
    $("#right").click(function(){
        $(this).hide();
        $left.animate({"width":"0"});
        $("#left-hiden").hide();
    })


    // 侧边栏按钮
    $("#left-bar").click(function(){
        leftBar()
    })
    // 弹框


    $("#articleAdd").click(function(){
        var html = '<a href="/admin/article/editor" class="btn btn-info">富文本编辑</a> <a href="/admin/article/add" class="btn btn-danger">Markwon</a>'
        $("#modalTitle").text("请选择编辑器版本");
        $("#modalCenter").html(html);
        $('#adminlayout').modal('toggle');
    })
//    删除弹出确认框
    $(".del").click(function(){
        var url = $(this).attr("del");
        var name = $(this).attr("delname");
        var html = '<a  data-dismiss="modal" aria-label="Close" class="btn btn-info">返回列表</a> <a href='+ url +' class="btn btn-danger">确定删除</a>'
        $("#modalTitle").text("确定删除-" + name);
        $("#modalCenter").html(html);
        $('#adminlayout').modal('toggle');
    })


})
// 关闭和开启侧边栏
function leftBar() {
    if($(".left").attr("on") == 1 || $(".left").attr("on") == undefined){
        $("#left-hiden").hide();
        $(".left").animate({"width":"0",}).attr("on","0");
        $(".right").animate({"margin-left":"10px"});

        $("#left-bar").html("<i class='iconfont' title='显示'>&#xe61e;</i>");

    }else if($(".left").attr("on") == 0){
        $(".left").animate({"width":"100px"}).attr("on","1");
        $(".right").animate({"margin-left":"100px"});
        $("#left-hiden").show(300);
        $("#left-bar").html("<i class='iconfont' title='隐藏'>&#xe612;</i>");
    }
}

// 全屏
//进入全屏
function requestFullScreen() {
    var de = document.documentElement;
    if (de.requestFullscreen) {
        de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
        de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
        de.webkitRequestFullScreen();
    }
}
//退出全屏
function exitFullscreen() {
    var de = document;
    if (de.exitFullscreen) {
        de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen();
    }
}