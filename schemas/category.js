/**
 * Created by sheyude on 2017/5/12.
 */

let mongoose = require('mongoose');
// 建立分类表结构

module.exports = new mongoose.Schema({
    // 排序分类
    number:{
       type:String,
        default:0,
    },
    category:String,
})
