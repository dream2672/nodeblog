/**
 * Created by sheyude on 2017/5/6.
 */
// 用户表模型
var mongoose = require("mongoose");
var usersSchema = require('../schemas/users')


module.exports = mongoose.model('User',usersSchema)
// module.exports = User;