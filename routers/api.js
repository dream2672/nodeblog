/**
 * Created by sheyude on 2017/5/6.
 */
var express = require("express");
var api = express.Router();


/*
 首页
 req request 对象
 res response 对象
 next 函数
 */
api.get('/',function(req, res, next){
    /*
     * 读取views下面的指定文件,并返回给客户端
     * */
    res.send("api")
    // res.render('main/index.html')

})
module.exports = api;