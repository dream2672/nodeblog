/**
 * Created by sheyude on 2017/5/7.
 */
$(document).ready(function(){
    // 验证注册界面
    $("#form").validate({
        // debug:true,
        rules:{
            username:{
                required: true,   //是否必填
                minlength: 4,     //最小长度
                maxlength: 10,
                remote:{
                    type:'post',
                    url:'/api/user/reg/username',
                    username:function(){
                        return $("#username").val();
                    },
                },
            },
            password:{
                required: true,   //是否必填
                minlength: 4,     //最小长度
                maxlength: 20,
            },
            rpassword:{
                required: true,   //是否必填
                minlength: 4,     //最小长度
                maxlength: 20,
                equalTo: "#password"
            },
            email:{
                // required: true,
                email: true
            },
            verify:{
                required: true,   //是否必填
                remote:{
                    type:'post',
                    url:'/api/img/verify',
                    verify:function(){
                        return $("#verify").val();
                    },
                },
            },

        },
        messages:{
            //配置当验证不通过时的错误提示
            username: {
                required: "*请输入用户名！",
                minlength: "*用户名至少有4个字符！",
                maxlength: "*用户名最多只能10个字符！",
                remote:"*用户名已被注册！",
            },

            //密码的配置
            password: {
                required: "*必须填写密码！",
                minlength: "*密码最短不能低于4位！",
                maxlength: "*密码最长不能超过20位！"
            },
            rpassword: {
                required: "*必须填写密码！",
                minlength: "*密码最短不能低于4位！",
                maxlength: "*密码最长不能超过20位！",
                equalTo: "*两次密码必须一致！"
            },
            email: {
                // required: "*请输入邮箱！",
                email: "*请检查邮箱格式！"
            },
            verify:{
                required: "*请输入验证码！",
                remote:"*验证码错误！",
            },
        },
        // 验证通过后执行！
        submitHandler: function(form) {  //通过之后回调
            $("#reg").addClass("disabled");
            $.ajax({
                type:'post',
                url:'/api/user/reg',
                data:$("#form").serialize(),
                dataType:'json',
                success:function(result){
                    if(!result.code){
                        var time = null, sum = 3;
                        time = setInterval(function(){
                            sum--;
                            $("#reg").html(result.message + sum)
                            if(sum == 0){
                                $("#reg").removeClass("disabled").html("注册");
                                $("#regDiv").css({"display":"none"});
                                $("#loginDiv").css({"display":"block"});
                                $(".form-control").val("").addClass("test");
                                sum = 10;
                                clearInterval(time);
                            }
                        },1000)
                    }
                }
            });
        },
        invalidHandler: function(form, validator) {  //不通过回调
            return false;
        }
    })
    // 验证登陆界面
    $("#loginform").validate({
        // debug:true,
        rules:{
            loginusername:{
                required: true,   //是否必填
                remote:{
                    type:'post',
                    url:'/api/user/login/username',
                    loginusername:function(){
                        return $("#loginusername").val();
                    },
                },

            },
            loginpassword:{
                required: true,   //是否必填

            },
            loginverify:{
                required: true,   //是否必填
                remote:{
                    type:'post',
                    url:'/api/img/verify',
                    loginverify:function(){
                        return $("#loginverify").val();
                    },
                },
            },

        },
        messages:{
            //配置当验证不通过时的错误提示
            loginusername: {
                required: "*请输入用户名！",
                remote:"*用户名不存在！"
            },
            //密码的配置
            loginpassword: {
                required: "*必须填写密码！",
            },
            loginverify:{
                required: "*请输入验证码！",
                remote:"*验证码错误！",
            },
        },
        // 验证通过后执行！
        submitHandler: function(form) {  //通过之后回调
            $.ajax({
                type:'post',
                url:'/api/user/login',
                data:$("#loginform").serialize(),
                dataType:'json',
                success:function(result){
                    if(result.code == 1){

                        $("#close").show().animate({"left":"15px"},100).animate({"left":"-15px"},100).animate({"left":"0"},100);
                        $("#close>span").html(result.message)
                    }else if(result.code == 0){
                        if(result.isAdmin == true){
                            window.location.href='/admin'
                        }else(
                            window.location.href='/'
                        )
                    }
                }
            });
        },
        invalidHandler: function(form, validator) {  //不通过回调
            return false;
        }
    })
    // 验证后台分类添加界面
    $("#categorForm").validate({
        dubug:true,
        rules:{
            categoryname:{
                required:true,
                minlength:2,
                maxlength:10,
            },
        },
        messages:{
            categoryname:{
                required:"*分类必填",
                minlength:"*分类不能少于2个字符",
                maxlength:"*分类不能超过10个字符",
            }
        }
    })
    // 验证框颜色
    proof("username");
    proof("password");
    proof("rpassword");
    proof("email");
    proof("verify");
    // 注册
    proof("loginusername");
    proof("loginpassword");
    proof("loginverify");
    // 后台
    proof("categoryname");
    /**
     *
     * @param id 需要验证的id
     */
    function  proof(id){
        $("#"+ id).blur(function(){
            var errorId = $('#'+ id +'-error')
            var attr = errorId.attr("style")
            if(errorId == null || attr == "display: none;"){
                errorId.parent().removeClass("has-error");
            }else{
                errorId.parent().addClass("has-error").animate({"left":"10px"},100)
                    .animate({"left":"-10px"},100).animate({"left":"0"},100);
            }
        })
    }

    // 注册图片
    $("#regimg>img").click(function(){
        $.ajax({
            type:'get',
            url:'/api/img',
            success:function(result){
                if(result){
                    $("#regimg>img").removeAttr("src").attr("src","api/img");
                }
            }
        })
        return false;
    });
    // 登陆图片
    // todo 提交2次
    $("#loginimg>img").click(function(){
        // getAjax('/api/img',getImg);
        $.ajax({
            type:'get',
            url:'/api/img',
            success:function(result){
                if(result){
                    $("#loginimg>img").removeAttr("src").attr("src","api/img");
                }
            }
        })
        return false;
    });
})
/**
 * ajax以get方式请求
 * @param url 请求地址
 * @param object 成功执行的函数
 */
function getAjax(url,object){
    $.ajax({
        type:'get',
        url:url,
        success:object,
    })
}