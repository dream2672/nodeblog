/**
 * Created by sheyude on 2017/5/6.
 */

var mongoose = require("mongoose");
var usersSchema = require("../schemas/users")


module.exports = mongoose.model('User',usersSchema);