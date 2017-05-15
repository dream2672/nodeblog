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
        console.log("s")
        $nav.css({"transition":"all 1s","background":"rgba(0,0,0,.7)","opacity":"1"})
        // 返回顶部
        $("#top").fadeOut()
        // $("#top").stop(true).animate({right:"-60px"})
    }else if(t > $height-$nav.height()){
        console.log("x")
        $nav.css({"transition":"all 1s","background":"rgba(0,0,0,0)","opacity":"0"});
        $("#top").fadeIn()
        // $("#top").stop(true).animate({right:"20px"})
    }

}
// 点击返回顶部
$("#top").click(function(){
    $('body,html').animate({ scrollTop: 0}, 500);
    return false;
})
// 修复导航
$("#indexBar").click(function(){
    $("#nav").css({"transition":"all 1s","background":"rgba(0,0,0,.7)","opacity":"1"})

})
$(".dropdown").click(function(){
    $("#nav").css({"transition":"all 1s","background":"rgba(0,0,0,.7)","opacity":"1"})
})