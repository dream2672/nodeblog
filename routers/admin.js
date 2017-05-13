/**
 * Created by sheyude on 2017/5/6.
 */
let express = require("express");
let admin = express.Router();
let User = require("../models/User");
let Category = require("../models/Catrgory")

var error = {
    message:"对不起本页只有管理员才能访问!",
    state:404,
    isAdmin:false,
}
//判断是否是管理员
admin.use(function(req, res, next){
    if(!req.userInfo.isAdmin){
        res.render('error/error',{
            error:error,
        })
        return;
    }
    next();
})
// 后台首页
admin.get('/',function(req, res, next){
    // 返回管理员信息给模版
    res.render('admin/index',{
        userInfo:req.userInfo,
    })
})
// 文章列表
admin.get('/article/list/',function(req, res, next){
    // 返回管理员信息给模版
    res.render('admin/article-list',{
        userInfo:req.userInfo,
    })
})
// 用户列表
admin.get("/user/list/",function(req, res, next){
    User.find().then(function(users){
        res.render('admin/user-list',{
            userInfo:req.userInfo,
            users:users
        })
    })

})
// 分类列表
admin.get("/category/list/",function(req, res){
    Category.find().then(function(categorys){
        res.render("admin/category-list",{
            userInfo:req.userInfo,
            categorys:categorys,
        })
    })

})
// 添加分类 渲染
admin.get("/category/add/",function(req, res){
    res.render('admin/category-add',{
        userInfo:req.userInfo,
    });

})
// 添加分类 渲染
admin.post("/category/add/",function(req, res, next){
    let number = req.body.number;
    let categoryname = req.body.categoryname;
    if(number == ""){
        number = 0;
    }
    // new 一个新数据
    let category = new Category({
        number:number,
        category:categoryname
    });
    // 保存
    category.save();


    res.redirect("/admin")
    next();
})


// 404页面
admin.get("*",function(req, res){
    error = {
        message:"对不起本功能正在紧张研发中！",
        state:404,
        isAdmin:true,
    }
    res.status(404);
    res.render("error/error",{
        error:error,
    })
})
module.exports = admin;