/**
 * Created by sheyude on 2017/5/6.
 */

// 引入数据库管理模块
var mongoose = require("mongoose");
// 创建用户表结构
// 暴露出去 module.exports
module.exports = new mongoose.Schema({
    // 用户名
    username:String,
    password:String,
    // 密码
});