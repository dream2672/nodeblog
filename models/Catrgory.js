/**
 * Created by sheyude on 2017/5/12.
 */
// 分类表模型
let mongoose = require("mongoose");
let categorySchema = require("../schemas/category");


let Category = mongoose.model('Category',categorySchema);
module.exports = Category;