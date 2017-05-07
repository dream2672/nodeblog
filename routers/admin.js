/**
 * Created by sheyude on 2017/5/6.
 */
var express = require("express");
var admin = express.Router();


admin.get('/',function(req, res, next){
    /*
     * 读取views下面的指定文件,并返回给客户端
     * */
    res.render('admin/login')
});

// 注册入口
admin.get('/reg',function (req, res, next) {
    res.render('admin/reg');
})
module.exports = admin;