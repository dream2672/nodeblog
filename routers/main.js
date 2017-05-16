/**
 * Created by sheyude on 2017/5/6.
 * 处理首页请求函数
 */
var express = require("express");
var main = express.Router();
let Category = require("../models/Catrgory");
let Article = require("../models/Acticle");
/**
 *  分页封装
 * @param model 模型
 * @param req   客户端请求
 * @param res   服务器响应
 * @param views 需要渲染的视图模版
 * @param quantity 需要显示的条数
 * @param sort 排序 接收数组
 * @param populate 关联的表
 */
function adminListPage(model,req,res,views,quantity,sort,populate){
    /*
     * 数据库读取全部数据
     * limit(number),限制获取数据条数
     * skip(2), 忽略条数
     * 每页显示2条
     * 1: 1-2 skip(0)
     * 2: 3-4 skip(2)
     */
// 页数，如果前台没传参数就默认第一页，
    let page = Number(req.query.page) || 1;
// 每一次获取的条数
    let limit = quantity;
// skip忽略的条数
    let skip = (page - 1) * limit;
// 查询总的条数
    model.count().then(function(count){
        // 计算总页数,向上取整防止出现小数
        let sum = Math.ceil(count / limit);
        let pages = [];
        for(let i = 1; i < sum + 1; i++){
            pages.push(i);
        }
        // 查询的表
        model.find().sort(sort).limit(limit).skip(skip).populate(populate).then(function(models){
            res.render(views,{
                userInfo:req.userInfo,
                // 找到的表
                models:models,
                page:page,
                pages:pages,
                sum:sum,
            })
        })
    });
};



/*
 首页
 req request 客户端请求
 res response 服务器给的响应
 next 函数
 */
main.get('/',function(req, res, next){
    /*
     * 读取views下面的指定文件,并返回给客户端
     * */
// 页数，如果前台没传参数就默认第一页，
    let page = Number(req.query.page) || 1;
// 每一次获取的条数
    let limit = 4;
// skip忽略的条数
    let skip = (page - 1) * limit;
// 查询总的条数
    Article.count().then(function(count){
        // 计算总页数,向上取整防止出现小数
        let sum = Math.ceil(count / limit);
        let pages = [];
        for(let i = 1; i < sum + 1; i++){
            pages.push(i);
        };
        // 查询的表
        Article.find().sort({_id:-1}).limit(limit).skip(skip).populate("category").then(function(articles){
            Category.find().then(function (categorys) {
                res.render("main/index",{
                    userInfo:req.userInfo,
                    // 找到的表
                    articles:articles,
                    page:page,
                    pages:pages,
                    sum:sum,
                    categorys:categorys,
                });
            });
        });
    });
});
// 文章页面
main.get('/article/',function(req, res){
    let id = req.query.id || '';
    Article.findOne({
        _id:id,
    }).populate("category").then(function (article) {
        res.render('main/article',{
            userInfo:req.userInfo,
            article:article,
        })
    })
})

// 登陆页面
main.get('/login/',function(req, res, next){
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
main.get('/out',function(req, res, next){
    req.cookies.set('userInfo',null);
    res.redirect('/')
})

/*
 * 404页面
 * 应该写在下面，默认被匹配路由的页面，都会走到这里
 */
let error = {
    message:"",
    state:"",
}
main.get('*',function(req, res){
    error = {
        message:"对不起您访问的页面不存在！",
        state:"404",
    };
    res.status(404);
    res.render('error/error',{
        error:error,
    })
})

//  返回数据
module.exports = main;