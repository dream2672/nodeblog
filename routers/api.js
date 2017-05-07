/**
 * Created by sheyude on 2017/5/6.
 */
var express = require("express");
// 创建路由
var api = express.Router();
// 导入模型
var User = require('../models/User');

// 初始化统一返回格式,注意这里定义好了返回
var responseData;
api.use(function(req, res, next){
    responseData = {
        // 错误码
        code:0,
        // 错误信息
        message:'',
    }
    next();
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
    // res.json(responseData);
    // console.log(req.body)
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
        password:password,
    }).then(function(userInfo){
        // userInfo 会显示是否有查到
        // console.log(userInfo)
        if(userInfo){
            responseData.code = 4;
            responseData.message = '该用户名已经存在！'
            res.json(responseData);
            return;
        };
        // 保存用户信息到数据库
        var user = new User({
            username:username,
            password:password,
        });
        return user.save();
        // 操作完成后走下面newUserInfo,是上面插入的数据
    }).then(function(newUserInfo){
        console.log(newUserInfo)
        responseData.message = '注册成功！';
        res.json(responseData);
    })
})
module.exports = api;
