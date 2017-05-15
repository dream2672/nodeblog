/**
 * Created by sheyude on 2017/5/6.
 * 处理首页请求函数
 */
var express = require("express");
var main = express.Router();
let Category = require("../models/Catrgory");
let Article = require("../models/Acticle");



/*
 首页
 req request 客户端请求
 res response 服务器给的响应
 next 函数
 */
main.get('/',function(req, res, next){
    /*
     * 读取views下面的指定文件,并返回给客户端
     * */
    Article.find().sort({_id:-1}).then(function(articles){
        Category.find().sort({number:-1}).then(function(categorys){
            res.render('main/index',{
                userInfo:req.userInfo,
                categorys:categorys,
                articles:articles,
            })
        })
    })


})

// 登陆页面
main.get('/login/',function(req, res, next){
    /*
     * 读取views下面的指定文件,并返回给客户端
     * */
    if(req.cookies.get("userInfo")){
        res.redirect('/')
    }else{
        res.render('main/login')
    }
});
// 退出登陆
main.get('/out',function(req, res, next){
    req.cookies.set('userInfo',null);
    res.redirect('/')
})

/*
 * 404页面
 * 应该写在下面，默认被匹配路由的页面，都会走到这里
 */
let error = {
    message:"",
    state:"",
}
main.get('*',function(req, res){
    error = {
        message:"对不起您访问的页面不存在！",
        state:"404",
    };
    res.status(404);
    res.render('error/error',{
        error:error,
    })
})

//  返回数据
module.exports = main;