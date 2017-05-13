/**
 * Created by sheyude on 2017/5/6.
 */
// 用户表模型
let mongoose = require("mongoose");
let usersSchema = require('../schemas/users')


let User = mongoose.model('User',usersSchema)
module.exports = User;