/**
 * Created by sheyude on 2017/5/6.
 * 应用程序入口
 * 代码改动让服务自动启动，supervisor app.js
 *  mongod --dbpath /Users/sheyude/Desktop/项目/nodeblog/db
 */

// 加载express
var express = require("express");
// 加载模版
var swig = require("swig");

// 创建app应用
var app = express();

/**
 * 配置模版引擎
 * 定义当前应用使用的模版
 * 第一个参数，定义模版名称，同时也是模版文件的后缀
 * 第二给参数表示用于解析处理模版类容的方法
 */
app.engine('html',swig.renderFile);

// 设置模版文件存放目录
// 第一给参数不能变，第二个是目录路径
// 注意这里不能这样设置会报错app.set('views','/views');
app.set('/','/views');
// 注册所使用的模版引擎，第一给参数不能变，第二个上面设置的后缀必须一样
app.set('views engine','html')
// 设置静态文件托管,当用户请求以/public开头的url，直接返回
app.use('/public',express.static(__dirname + '/public'));

// 加载数据库
var mongoose = require("mongoose");

// 取消模版缓存
swig.setDefaults({cache:false});

// 处理首页函数
app.use("/",require("./routers/main"));
// 处理后台请求函数
app.use("/admin",require("./routers/admin"));
// 处理api
app.use("/api",require("./routers/api"));

// 连接数据库
mongoose.connect('mongodb://localhost/:27017/blog',function(err){
    if(err){
        console.log("数据库连接失败！");
    }else{
        console.log("数据库已经成功连接！");
        // 监听http请求
        app.listen(2000);
        console.log("服务器成功启动:http://127.0.0.1:2000")
    }
});
