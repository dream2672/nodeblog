/**
 * Created by sheyude on 2017/5/6.
 */

var mongoose = require("mongoose");
var usersSchema = require('../schemas/users')


var User = mongoose.model('User',usersSchema)
module.exports = User;