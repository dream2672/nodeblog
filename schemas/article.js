/**
 * Created by sheyude on 2017/5/13.
 */
let mongoose = require("mongoose");

// 内容表
module.exports = new mongoose.Schema({
    // 作者
    author:String,
    // 标题
    title:String,
    // 摘要
    // 关联字段 内容分类id

    category:{
        // 类型是一个引用
        type:mongoose.Schema.Types.ObjectId,
        // 引用哪一个模型
        ref:"Category",
    },
    // 类容
    content:String,
    // 添加时间
    creationTime:{
        type:Date,
        default:new Date(),
    },
    // 点击次数
    count:{
        type:String,
        default:0,
    },
    digest:String,
})