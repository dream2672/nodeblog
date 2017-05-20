/**
 * Created by sheyude on 2017/4/24.
 */
// 处理评论
// 每一页显示几条

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
            // $( '.sidebar-3' ).css({"display":"block"}).makisu( 'open' );
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
    // 发表评论
    $("#textarea").click(function () {
        $(this).text("");
    })
    $("#comment-submit").click(function(){
        $(this).text("正在提交")
        $.ajax({
            type:'post',
            url:'/api/comment/post',
            data:{
                contentid:$("#contentid").val(),
                content:$("#textarea").val(),
            },
            success:function (responseData) {
                if(responseData.data.comments != 0){
                    // 改变发表文字框的内容
                    $("#comment-submit").text("发布评论")
                    // 把上一次提交的值清空
                    $("#textarea").val("");
                    // 隐藏沙发框
                    $(".comment-main").hide();
                    // 显示评论框
                    $(".conment-li").show();
                    page = 1;
                    conmentContent(responseData.data.comments.reverse());
                }

            }
        })
    })
    // 每一次页面加载的时候
    indexAjax()
    // 首页最多查看
    //

})

function indexAjax() {
    $.ajax({
        type:'post',
        url:'/api/comment',
        data:{
            contentid:$("#contentid").val(),
        },
        success:function (responseData) {
            // 如果有评论就显示！，没有就显示沙发
            if(responseData.data.comments.length >= 1){
                conmentContent(responseData.data.comments.reverse());
                // liClick(responseData.data.comments.reverse());
            }else{
                // 显示沙发框
                $(".comment-main").show();
                // 隐藏评论框
                $(".conment-li").hide();
            }
        }
    })
}





// 每页显示几条
var perpage = 3;
// 当前页数
var page = 1;
// 总页数
var pages = 0;

// 分页序号
// 每页显示
var perindex = 4;
var indexPage = 1;



function conmentContent(content) {
    // 计算评论的索引
    var contentIdex = content.length;
    var end =0;
    // 总页数,向上取整
    pages = Math.ceil(content.length / perpage);
    if(pages == 1){
        $("#articlePagination").hide()
    }
    // 开始
    var start = (page -1) * perpage;
    // console.log(start)
    //结束
    // 解决最后空单条数据报找不到内容
    if(pages == page){
        // 解决最后一页单数的问题
        end = content.length
    }else{
        //判断如果总数没有达到
        if (perpage >= content.length){
            end = start + content.length;
        }else{
            end = start + perpage;
        };
    }
    // 下面序号显示逻辑
    var indexStart = 0;
    // 总页数
    var indexPages = Math.ceil(pages / perindex);

    //
    // }
    // 开始
    if(indexPage == 1){
        indexStart= (indexPage -1) * perindex;
    }else{
        indexStart= (indexPage -1) * perindex ;
    }

    // 结束
    if (indexPage == indexPages){
        var indexEnd = pages -1
    }else{
        var indexEnd = indexStart + perindex;

    }
    // 处理总页数达不到2页的时候
    if(indexPages <= 1){
        var indexEnd = pages -1
    }

    // 分页

    var pageHtml = '';
    pageHtml += '<li><a href="javascript:;">首页</a></li>';

    // 处理上一页
    if(page <= 1){
        page = 1;
        pageHtml += '<li class="disabled"><a href="javascript:;"><span>«</span></a></li>';
    }else {
        pageHtml += '<li><a href="javascript:;"id="pageTop"><span>«</span></a></li>';
    }
    // 处理页数
    for(var i = indexStart; i < indexEnd+1; i++){
        if(i == (page - 1)){
            pageHtml += '<li class="active"><a href="javascript:;">'+ (i + 1) +'</a></li>'
        }else{
            pageHtml += '<li><a href="javascript:;">'+ (i + 1) +'</a></li>'
        }
    }
    if(indexPage != indexPages){
        pageHtml += '<li class="disabled"><a href="javascript:;">...</a></li>';
    }
    // 处理末页
    if(page >= pages){
        page = pages;
        pageHtml += '<li class="disabled"><a href="javascript:;" aria-label="Next"><span aria-hidden="true">»</span></a></li>';
    }else{
        pageHtml += '<li><a href="javascript:;" id="pageNext"><span >»</span></a></li>';
    }
    pageHtml += '<li><a href="javascript:;">末页</a></li>';
    $("#articlePagination").html(pageHtml)


    // 处理评论内容
    var html = ''
    for (let j = start; j < end; j++){
        html += "<li><div class='conment-logo hidden-xs hidden-sm'><img src='/public/img/logo.gif'></div><div>" +
            "<span class='li-left'>" + content[j].username + "</span><span class='li-right'>"+ conmentDate(content[j].postTime) +
            " <a index='"+ (contentIdex-j-1) +"' href='' >删除</a></span>" +
            "<p>"+ content[j].content +"</p></div></li>"
    }
    $("#conment-li").html(html);
    $("#articlePagination li").on("click", "a",function () {
        //上一页
        if($(this).attr("id") == "pageTop"){
            page--;
            if(page+perindex <= (perindex * indexPage)){
                indexPage --
            }
        }
        //下一页
        if($(this).attr("id") == "pageNext"){
            page++;
            if(page > (perindex * indexPage)){
                indexPage++
            }
        }
        // 里面的分页
        if($(this).text() >= 1 && $(this).text() <= pages){
            page = $(this).text()
        }
        // 首页
        if($(this).text() == "首页"){
            page = 1;
            indexPage = 1
        }
        // 末页
        if($(this).text() == "末页"){
            page = pages;
            indexPage = indexPages;
        }
        if($(this).text() > (perindex * indexPage) ){
            if(indexPage <= indexPages){
                indexPage++
            }
        }
        conmentContent(content)
    })
    $(".li-right").on("click","a",function () {
        var contentid = $("#contentid").val();
        var index = $(this).attr("index");
        $.ajax({
            type:"post",
            url:"/admin/conment/del",
            data:{
                id:contentid,
                index:index,
            },
            success:function (message) {
                console.log(message)
                if(message){
                    indexAjax()
                }
            }
        })
        return false

    })
}
// 格式化时间
function conmentDate(t) {
    var date = new Date(t);
    var str = date.getFullYear() + "年" + (date.getMonth()+1) + "月" + date.getDate() + "日"
    + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return str;
}




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