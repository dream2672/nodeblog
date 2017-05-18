/**
 * Created by sheyude on 2017/5/13.
 */
// 文章模型
let mongoose = require("mongoose");
let articleSchema = require('../schemas/article')

let Article = mongoose.model('Article',articleSchema);
module.exports = Article;