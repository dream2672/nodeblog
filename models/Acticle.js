/**
 * Created by sheyude on 2017/5/13.
 */
// 文章模型
var mongoose = require("mongoose");
var articleSchema = require('../schemas/article')

module.exports = mongoose.model('Article',articleSchema)