/**
 * Created by sheyude on 2017/4/24.
 */
$(document).ready(function () {
    // 代码高亮
    window.onscroll = function () {
        var t = document.documentElement.scrollTop || document.body.scrollTop;
        var $height = $("#head").height();
        var $nav = $("#nav");
        if(t <= 10){
            $("#nav a").css({"color":"#333"});
            $nav.css({"transition":"all .5s","background":"rgba(0,0,0,0)","opacity":"1"});
            // 修复面包屑颜色
            $(".icon-bar").css({"background":"#333"});
        }else if(t < $height-$nav.height()){
            $nav.css({"transition":"all .5s","background":"rgba(0,0,0,.7)","opacity":"1"})
            $("#nav a").css({"color":"#fff"});
            $(".icon-bar").css({"background":"#fff"});
            // 返回顶部
            $("#top").fadeOut()
        }else if(t > $height-$nav.height()){
            $nav.css({"transition":"all .5s","background":"rgba(0,0,0,0)","opacity":"0"});
            $("#top").fadeIn()
        }

    }
// 点击返回顶部
    $("#top").click(function(){
        $('body,html').animate({ scrollTop: 0}, 500);
        return false;
    })
// 修复导航
    $("#indexBar").click(function(){
        $("#nav").css({"transition":"all 1s","background":"rgba(0,0,0,.7)","opacity":"1"});
        $("#nav a").css({"color":"#fff"});

    })
    $(".dropdown").click(function(){
        $("#nav").css({"transition":"all 1s","background":"rgba(0,0,0,.7)","opacity":"1"})
        $("#nav a").css({"color":"#fff"});
    })
// 背景图片
    var sum = Math.floor(Math.random()*6+1)
    $("#body").css({"background":"url(/public/img/bg/"+ sum +".jpg) fixed"})

    // 侧边栏
    // 检查是否打开
    if ( $.fn.makisu.enabled ) {
        var $maki = $( '.maki' );
//            配置文件
        $maki.makisu({
            selector: 'dd',
            overlap: 0.6,
            speed: 0.85
        });
        var time = null;
        var time2 = null;
        $( '.sidebar-1' ).css({"display":"block"}).makisu( 'open' );
        time = setTimeout(function(){
            $( '.sidebar-2' ).css({"display":"block"}).makisu( 'open' );
        },5000)
        time2 = setTimeout(function(){
            $( '.sidebar-3' ).css({"display":"block"}).makisu( 'open' );
            clearTimeout(time);
            clearTimeout(time2);
        },10000)
    }

    // 限制长度
    // 限制文章标题
    maxStr(".len","..",30,15);
    // 限制侧边栏最新文章长度
    maxStr(".sidlen","..",10,10);

    // 首页ajax分类数量请求
    var cid = [];
    $(".category").each(function (index, element) {
        cid.push($(element).attr("cid"))
    })
    $.ajax({
        type:'post',
        url:"/api/category/count",
        data:{cid:cid},
        success:function (count) {
            $(".sidebar-1 dd i").each(function (index, element) {
                $(element).text(count[index])
            })
        }
    })
    // 评论
    $("#textarea").click(function () {
        $(this).text("");
    })
    $("#comment-submit").click(function(){
        $.ajax({
            type:'post',
            url:'/api/comment',
            data:{
                contentid:$("#contentid").val(),
                content:$("#textarea").val(),
            },
            success:function (responseData) {
                $("#textarea").text("");
                console.log(responseData)
            }
        })
    })



})
/**
 *  设置大屏和小屏文字长度限制
 * @param setClass 接收需要限制的类名
 * @param behind  需要显示的后缀
 * @param maxst 大屏的长度
 * @param minstr 小屏的长度
 */
function maxStr(setClass,behind,maxstr, minstr) {
    var arr =[];
    // 规定显示的文字个数
    var maxstr = Number(maxstr);
    // 计算每一个标题的字数
    var width = $(document).width();
    if(width <= 768){
        // 设置小屏显示个字数
        maxstr = Number(minstr);
    }
    $(setClass).each(function(index,element){
        arr.push($(element).text().length)
    })
    $(arr).each(function(index,element){
        if(Number(element) >= maxstr){
            var text = $($(setClass)[index]).text().substring(0,maxstr)
            $($(setClass)[index]).text(text +  behind)
        }
    })
}