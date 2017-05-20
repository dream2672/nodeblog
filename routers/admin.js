/**
 * Created by sheyude on 2017/5/6.
 */
let express = require("express");
let admin = express.Router();
let trimHtml = require("trim-html");

let User = require("../models/User");
let Category = require("../models/Catrgory");
let Article = require("../models/Acticle");
// 导入哈希
let Hash = require('../method/hash');

// 解码
// todo 后台用户需要改进
function hexToDec(str) {
    str=str.replace(/\\/g,"%");
    return unescape(str);
}

// 定义错误消息
let error = {
    message:"",
    state:404,
    isAdmin:false,
}
//判断是否是管理员
admin.use(function(req, res, next){
    error = {
        message:"ERROR 你是黑客吗？",
        state:404,
        isAdmin:false,}
    if(!req.userInfo.isAdmin){
        res.render('error/error',{
            error:error,
        })
        return;
    }
    next();
});
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
                username:hexToDec(req.userInfo.username + ''),
                // 找到的表
                models:models,
                page:page,
                pages:pages,
                sum:sum,
            })
        })
    });
};


// 后台首页
// todo 目前是直接转向
admin.get('/',function(req, res){
    // 返回管理员信息给模版
    // res.render('admin/index',{
    //     userInfo:req.userInfo,
    //     username:hexToDec(req.userInfo.username + ''),
    // })
    res.redirect("/admin/article/list")
});

// 文章列表
admin.get('/article/list/',function(req, res){
    // 返回管理员信息给模版
    adminListPage(Article, req, res, 'admin/article-list', 6, {_id:-1},'category');
});
// markdwon版本 发布文章
admin.get('/article/add/',function(req, res){
    Category.find().sort({number:-1}).then(function (categorys) {
        res.render('admin/article-add',{
            username:hexToDec(req.userInfo.username + ''),
            userInfo:req.userInfo,
            categorys:categorys,
            f11:true,
        })
    })
});
// editor版本 发布文章
admin.get('/article/editor/',function(req, res){
    Category.find().sort({number:-1}).then(function (categorys) {
        res.render('admin/article-editor',{
            username:hexToDec(req.userInfo.username + ''),
            userInfo:req.userInfo,
            categorys:categorys,
        })
    })

});
admin.post('/article/add/',function(req, res, next){
    let title = req.body.title;
    let content = req.body.content;
    let categoryid = req.body.categoryid;
    let editer = req.body.editer;
    // todo 需要整理
    let author = hexToDec(req.userInfo.username + '');
    let str="";
    let digest = "";
    // console.log(content)

    // console.log(digest.html)
    // 判断编辑器 1代表editer编辑器
    if(editer == "1"){
        str =content;
        digest = trimHtml(content, { limit: 200 });
    }else{
        for ( let i = 0; i < content.length; i++){
            str = str + content[i];
        };
        digest = trimHtml(str, { limit: 200 });
    }
    new Article({
        category:categoryid,
        title:title,
        content:str,
        author:author,
        digest:digest.html,
        creationTime:new Date(),
    }).save();
    res.json({message:"提交成功..",code:1})
});
// 用户列表
admin.get("/user/list/",function(req, res){
    adminListPage(User, req, res, 'admin/user-list', 6, {_id:-1},'');
});
// 添加分类
admin.get("/category/add/",function(req, res){
    res.render('admin/category-add',{
        userInfo:req.userInfo,
        username:hexToDec(req.userInfo.username + ''),
    });

});
admin.post("/category/add/",function(req, res, next){
    let number = req.body.number;
    let name = req.body.categoryname;
    if(number == ""){
        number = 0;
    }
    // new 一个新数据
    let category = new Category({
        number:number,
        name:name,
    });
    // 保存
    category.save();


    res.redirect("/admin/category/list")
    next();
});
// 分类列表
admin.get("/category/list/",function(req, res){
    adminListPage(Category, req, res, 'admin/category-list',6, {number:-1},'');
});



//判断是否是超级管理员
admin.use(function(req, res, next){
    error = {
        message:"本操作需要超级管理员权限！",
        state:"SOS",
        isAdmin:true,}
    if(!req.userInfo.Admin){
        res.render('error/error',{
            error:error,
        })
        return;
    }
    next();
});



// 编辑文章
admin.get("/article/edit/",function(req, res){
    let id = req.query.id || '';
    Article.findOne({
        _id:id,
    }).populate("category").then(function(article){
        Category.find().then(function (categorys) {
            res.render("admin/article-edit",{
                userInfo:req.userInfo,
                username:hexToDec(req.userInfo.username + ''),
                article:article,
                categorys:categorys,
            })
        })
    })
});
admin.post("/article/edit/",function(req, res){
    // 注意ajax提过来不能地址栏获取id
    let id = req.body.id || '';
    let title = req.body.title;
    let content = req.body.content;
    let categoryid = req.body.categoryid;
    Article.update({
        _id:id,
    },{
        category:categoryid,
        title:title,
        content:content,
    }).then(function () {
        res.json({message:"修改成功..",code:1})
    })
});
// 删除文章
admin.get("/article/del",function(req, res){
    let id = req.query.id || '';
    Article.remove({
        _id:id,
    }).then(function () {
        res.redirect("/admin/article/list")
    })
})

// 修改用户
admin.get("/user/edit",function(req, res){
    let id = req.query.id || '';
    User.findOne({
        _id:id,
    }).then(function (user) {
        console.log(user)
        res.render("admin/user-edit",{
            userInfo:req.userInfo,
            username:hexToDec(req.userInfo.username + ''),
            user:user,
        })
    })
});
admin.post("/user/edit",function(req, res){
    let id = req.query.id || '';
    let email = req.body.email || '';
    let isAdmin = req.body.isadmin || '';
    let pwd = req.body.pwd || '123456'
    User.update({
        _id:id,
    },{
        email:email,
        isAdmin:isAdmin,
        password:Hash.hash(pwd),
    }).then(function () {
        res.redirect("/admin/user/list")
    })
});
// 删除用户
//todo 这样需要做权限分级
admin.get("/user/del",function (req, res) {
    let id = req.query.id || '';
    User.remove({
        _id:id,
    }).then(function () {
        res.redirect("/admin/user/list")
    })
})

// 修改分类
admin.get("/category/edit/",function(req, res){
    let id = req.query.id || '';
    Category.findOne({
        _id:id
    }).then(function(category){
        res.render("admin/category-edit",{
            username:hexToDec(req.userInfo.username + ''),
            userInfo:req.userInfo,
            category:category,
        })
    })
});
// todo 这里需要给前台传递数据
admin.post("/category/edit",function(req, res){
    //这是前台地址来的ID
    let id = req.query.id || '';
    let number = req.body.number || '';
    let name = req.body.categoryname || '';
    Category.update({
        // 第一个是条件
        _id:id,
    },{
        number:number,
        name:name,
    }).then(function () {
        res.redirect("/admin/category/list")
    })
});
// 删除分类
admin.get("/category/del/",function(req, res){
    // 获取需要删除的id
    let id = req.query.id || '';
    Category.remove({
        _id:id,
    }).then(function () {
        res.redirect("/admin/category/list")
    })
});
//删除评论
admin.post("/conment/del/",function(req, res){
    var id = req.body.id || '';
    var index = req.body.index || '';
    Article.findOne({
        _id:id
    }).then(function (content) {
        content.comments.splice(index,1);
        // 返回
        content.save()
        res.json({code:"ok"})
    })
})

// 404页面
admin.get("*",function(req, res){
    error = {
        message:"对不起本功能正在紧张研发中！",
        state:404,
        isAdmin:true,
    }
    res.status(404);
    res.render("error/error",{
        error:error,
    })
})

module.exports = admin;