/**
 * Created by sheyude on 2017/5/6.
 * 处理首页请求函数
 */
let express = require("express");
let main = express.Router();
let Category = require("../models/Catrgory");
let Article = require("../models/Acticle");

/*
 首页
 req request 客户端请求
 res response 服务器给的响应
 next 函数
 */
// 解码
function hexToDec(str) {
    str=str.replace(/\\/g,"%");
    return unescape(str);
}
let data = {};

main.use(function (req, res, next) {
    data.userInfo = req.userInfo;
    data.userInfo.username = hexToDec(req.userInfo.username + '')
    data.categorys = [];
    Category.find().sort({number:-1}).then(function (categorys){
        data.categorys = categorys;
    })
    next();
});

main.get('/',function(req, res){
        data.page = Number(req.query.page) || 1;
        data.categoryid = req.query.category || '';
        data.limit = 10;
        data.pages = [];// 页数
        data.sum = 0;
        data.articles = [];
    // 声明条件
    // todo 这里需要研究
    let where = {};
    if (data.categoryid){
        where.category = data.categoryid
    }
        // 读取文章总数然后返回
        Article.where(where).count().then(function (count) {
        data.sum = Math.ceil(count / data.limit);
        for(let i = 1; i < data.sum + 1; i++){
            data.pages.push(i);
        };
        let skip = (data.page - 1) * data.limit;
        // 查找文章表
        return Article.where(where).find().sort({_id:-1}).limit(data.limit).skip(skip).populate("category");
    }).then(function (articles) {
        data.articles = articles;
        res.render("main/index",data)
    })
});
// 文章页面
main.get('/article/',function(req, res){
    let id = req.query.id || '';
    Article.findOne({
        _id:id,
    }).populate("category").then(function (article) {
        // 文章阅读次数
        article.count ++;
        article.save();
        data.article = article;
        res.render('main/article',data);
    })
})
// 登陆页面
main.get('/login/',function(req, res){
    /*
     * 读取views下面的指定文件,并返回给客户端
     * */
    if(req.cookies.get("userInfo")){
        res.redirect('/')
    }else{
        res.render('main/login')
    }
});
// 退出登陆
main.get('/out',function(req, res){
    req.cookies.set('userInfo',null);
    res.redirect('/');
});
/*
 * 404页面
 * 应该写在下面，默认被匹配路由的页面，都会走到这里
 */
let error = {
    message:"",
    state:"",
};
main.get('*',function(req, res){
    error = {
        message:"对不起您访问的页面不存在！",
        state:"404",
    };
    res.status(404);
    res.render('error/error',{
        error:error,
    })
});

//  返回数据
module.exports = main;