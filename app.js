/**
 * Created by sheyude on 2017/5/6.
 * 应用程序入口
 * 代码改动让服务自动启动，supervisor app.js
 *  mongod --dbpath /Users/sheyude/Desktop/项目/nodeblog/db
 */

// 加载express
let express = require("express");
// 加载模版
let swig = require("swig");
// 加载数据库
let mongoose = require("mongoose");
// 加载中间件，用于处理post提交过来的请求
let bodyParser = require("body-parser");
// 加载cookies
let Cookies = require("cookies");
// 记得./是相对路径
let User = require('./models/User');

// 创建app应用
let app = express();

// 设置静态文件托管,当用户请求以/public开头的url，直接返回
app.use('/public',express.static(__dirname + '/public'));

/**
 * 配置模版引擎
 * 定义当前应用使用的模版
 * 第一个参数，定义模版名称，同时也是模版文件的后缀
 * 第二给参数表示用于解析处理模版类容的方法
 * 注意顺序，先配置，再注册，再设置目录，不然会出错
 */
app.engine('html',swig.renderFile);

/* 注册所使用的模版引擎，第一给参数不能变，第二个上面设置的后缀必须一样
 * 注意这里是view engine
 */
app.set('view engine','html');
// 设置模版文件存放目录
// 第一给参数不能变，第二个是目录路径
app.set('views', __dirname + '/views');
// 取消模版缓存
swig.setDefaults({cache:false});


//bodyParser设置
app.use(bodyParser.urlencoded({extended:true}));
// cookies设置
app.use(function(req, res, next){
    req.cookies = new Cookies(req, res);
    // 解析用户登陆cookies信息.
    req.userInfo = {};
    if(req.cookies.get("userInfo")){
        try{
            req.userInfo = JSON.parse(req.cookies.get("userInfo"));
            // 获取当前登陆用户是否是管理员
            User.findById(req.userInfo._id).then(function(userInfo){
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                req.userInfo.Admin = Boolean(userInfo.Admin);
                next();
            })
        }catch (e){
            next();
        }
    }else{
        next();
    }
})

// 处理后台请求函数
app.use("/admin",require("./routers/admin"));
// 处理api
app.use("/api",require("./routers/api"));

// 处理首页函数
app.use("/",require("./routers/main"));


// 连接数据库
mongoose.connect('mongodb://122.228.180.10:27017/blog',function(err){
    if(err){
        console.log("数据库连接失败！");
    }else{
        console.log("数据库已经成功连接！");
        // 监听http请求
        app.listen(4000);
        console.log("服务器成功启动:http://127.0.0.1:3000")
    }
});
