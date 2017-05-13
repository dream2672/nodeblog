/**
 * Created by sheyude on 2017/4/24.
 */
window.onscroll = function () {
    var t = document.documentElement.scrollTop || document.body.scrollTop;
    var $height = $("#head").height();
    var $nav = $("#nav");
    if(t < 10){
        $nav.css({"transition":"all 1s","background":"rgba(0,0,0,0)"});
    }else if(t < $height-$nav.height()){
        $nav.css({"transition":"all 1s","background":"rgba(0,0,0,.7)","opacity":"1"})
        // 返回顶部
        $("#top").fadeOut();
    }else if(t > $height-$nav.height()){
        $nav.css({"transition":"all 1s","background":"rgba(0,0,0,0)","opacity":"0"});
        $("#top").fadeIn();
    }

}
// 返回顶部
$("#top").hover(function(){
    $(this).css("background","rgba(0,0,0,.5)");
},function(){
    $(this).css("background","rgba(0,0,0,.2)");
})
// 点击返回顶部
$("#top").click(function(){
    $('body,html').animate({ scrollTop: 0}, 500);
    return false;
})

$("#indexBar").click(function(){
    console.log($(this).attr("on"))
    $("#nav").css({"transition":"all 1s","background":"rgba(0,0,0,.7)","opacity":"1"})

})
$(".dropdown").click(function(){
    $("#nav").css({"transition":"all 1s","background":"rgba(0,0,0,.7)","opacity":"1"})
})