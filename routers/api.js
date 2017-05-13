/**
 * Created by sheyude on 2017/5/6.
 */
var express = require("express");
// 创建路由
var api = express.Router();
// 导入模型
var User = require('../models/User');
// 导入哈希
var Hash = require('../method/hash');
// 导入验证
var gdBmp = require("../method/gdBmp");
var imgStr = null;

// 初始化统一返回格式,注意这里定义好了返回
var responseData;
api.use(function(req, res, next){
    responseData = {
        // 错误码
        code:0,
        // 错误信息
        message:'',
        error:false,
    }
    next();
});
/*
 接收前台注册验证时候发来的请求，去数据库查询如果有就返回false，没有就返回true
 */
api.post('/user/reg/username',function(req, res, next){
    User.findOne({
        username:req.body.username,
    }).then(function(userInfo){
        if(userInfo == null){
            responseData.error = true;
            res.json(responseData.error);
        }else(
            res.json(responseData.error)
        );
    });
});
/*
 接收前台登陆发来的用户名查询发来的请求，查询没有就返回false ，有就返回true
 */
api.post('/user/login/username',function(req, res, next){
    User.findOne({
        username:req.body.loginusername,
    }).then(function(userInfo){
        if(userInfo == null){
            res.json(responseData.error);
            return;
        }else {
            responseData.error = true;
            res.json(responseData.error);
        };
    });
});
/**
 * 注册逻辑
 * 1.用户名不能为空
 * 2.密码不能为空
 * 3.两次密码必须一致
 * 4.用户名是否已经被注册
 */
api.post('/user/reg',function(req, res, next){
    // 启用 bodyParser 会自动给req设置一个body属性，里面包含前台Post提交过来的数据
    var username = req.body.username;
    var password = req.body.password;
    var rpassword = req.body.rpassword;
    var email = req.body.email;
    // 用户名不能为空
    if(username == ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空！'
        res.json(responseData);
        return;
    }
    // 密码不能为空
    if(password == ''){
        responseData.code = 2;
        responseData.message = '密码不能为空！'
        res.json(responseData);
        return;
    }
    // 两次输入的密码不一致
    if(password != rpassword){
        responseData.code = 3;
        responseData.message = '两次输入密码不一致！'
        res.json(responseData);
        return;
    }
    // 数据库查询,查询数据库是不是有这个用户名
    User.findOne({
        username:username,
    }).then(function(userInfo){
        // userInfo 会显示是否有查到
        // console.log(userInfo)
        if(userInfo){
            responseData.code = 4;
            responseData.message = '用户名已经被注册！'
            res.json(responseData);
            return;
        };
        // 保存用户信息到数据库
        var user = new User({
            username:username,
            password:Hash.hash(password),
            email:email,
        });
        return user.save();
        // 操作完成后走下面newUserInfo,是上面插入的数据
    }).then(function(newUserInfo){
        // console.log(newUserInfo)
        responseData.message = '注册成功！';
        res.json(responseData);
    })
});
// 登陆逻辑
api.post('/user/login',function(req, res, next){
    var username = req.body.loginusername;
    var password = req.body.loginpassword;
    var checkbox = req.body.logincheckbox;
    // 查询数据库中用户名和密码是否同时存在，如果存在就登陆
    User.findOne({
        username:username,
        password:Hash.hash(password),
    }).then(function(userInfo){
        // 登陆失败！
        if(!userInfo){
            responseData.code = 1;
            responseData.message = '您输入的密码有误！！';
            res.json(responseData);
            return;
        }

        User.findById(userInfo._id).then(function(admin){
            responseData.isAdmin = admin.isAdmin
            responseData.message = '登陆成功！';
            responseData.userInfo = {
                _id:userInfo._id,
                username:userInfo.username,
            }
            // 保存登陆状态，默认浏览器结束进程销毁
            req.cookies.set('userInfo',JSON.stringify({
                _id:userInfo._id,
                username:userInfo.username,
            }))
            // 记住密码
            if(checkbox == "on"){
                req.cookies.set('userInfo',JSON.stringify({
                    _id:userInfo._id,
                    username:userInfo.username,
                }),{
                    // 销毁的毫秒数
                    maxAge:604800000,
                })
            }

            res.json(responseData);
            return;
        })

    })
});
// 验证码
api.get('/img',function(req, res, next){
    var imgData = gdBmp.makeCapcha();
    res.setHeader('Content-Type', 'image/bmp');
    res.end(imgData.img.getFileData());
    imgStr = imgData.str;
    // 查看当前验证码
    // console.log(imgData.str);
});
// 验证码验证接口
api.post('/img/verify',function(req, res, next){
    var str = req.body.verify ||req.body.loginverify
    if(str.toLocaleUpperCase() == imgStr){
        responseData.error = true;
        res.json(responseData.error)
    }else{
        // 零时关门验证码
        responseData.error = true;
        res.json(responseData.error);
    }
})
module.exports = api;
