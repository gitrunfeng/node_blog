var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

router.use(function(req,res,next){
    if(!req.userInfo.isAdmin){
        //如果当前用户是非管理员
        res.send('<p style="width:100%;text-align:center;margin:100px auto">对不起，只有管理员才可以进入后台管理 <a href="/">返回首页</a></p>');
        return;
    }
    next();
})

//管理后台首页
router.get('/',function(req,res,next){
    res.render('admin/index.html',{
        userInfo: req.userInfo
    })
    User.find().count().then(function(userCount){
        req.userInfo.userCount = userCount;
    })
    
});

//用户管理
router.get('/user',function(req,res,next){

    /*
    * 从数据库中读取所有的用户数据
    *
    * limit(Number) : 限制获取的数据条数
    *
    * skip(2) : 忽略数据的条数
    *
    * 每页显示2条
    * 1 : 1-2 skip:0 -> (当前页-1) * limit
    * 2 : 3-4 skip:2
    * */

    //limit()方法接受一个数字参数，该参数指定从MongoDB中读取的记录条数。
    //skip方法同样接受一个数字参数作为跳过的记录条数。

    let page = Number(req.query.page || 1);
    let limit = 10;
    let pages = 0;


    //从数据库中读取所有用户数据
    User.count().then(function(count){
        //计算总页数
        pages = Math.ceil(count/limit);//ceil() 方法可对一个数进行上舍入。
        //取值不能超过pages
        page = Math.min( page, pages ); //min() 方法可返回指定的数字中带有最低值的数字。 Math.min(5,7) 5
        //取值不能小于1
        page = Math.max( page, 1 ); //max() 方法可返回两个指定的数中带有较大的值的那个数。 Math.min(5,7) 7
        let skip = (page-1)*limit;

        User.find().limit(limit).skip(skip).then(function(users){
            // console.log(users)
            res.render('admin/user_index.html',{
                url:'/admin/user',
                userInfo: req.userInfo,
                users:users,
                usersNum:users.length,
                page:page,
                limit:limit,
                pages:pages,
                count:count
            })
        })
    })    
 
})

//分类首页
router.get('/category',function(req,res){
    let page = Number(req.query.page || 1);
    let limit = 10;
    let pages=0;
    Category.count().then(function(count){
        pages = Math.ceil(count/limit);
        page = Math.min(page,pages);
        page = Math.max(page,1)
        let skip = (page-1)*limit;
        /*
        * 1: 升序
        * -1: 降序
        * */
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categories){
            res.render('admin/category_index.html',{
                url:'/admin/category',
                userInfo:req.userInfo,
                categories:categories,
                count:count,
                page:page,
                limit:limit,
                pages:pages,
            });
        })
    })
    
});


//分类的添加
router.get('/category/add',function(req,res){
    res.render('admin/category_add.html',{
        userInfo:req.userInfo
    })
})
//分类的添加的保存
router.post('/category/add',function(req,res){
    let name = req.body.name || '';
    if(name==''){
        res.render('admin/error.html',{
            userInfo: req.userInfo,
            message: '名称不能为空'
        })
        return;
    }
    //数据库中是否已经存在同名分类名称
    // findOne 返回一个文档满足指定的查询条件
    //Promise.reject(reason)方法也会返回一个新的 Promise 实例，该实例的状态为rejected。
    Category.findOne({
        name:name
    }).then(function(rs){
        if(rs){
            //数据库中已经存在该分类了
            res.render('admin/error.html',{
                userInfo: req.userInfo,
            message: '分类已经存在了'
            })
            return Promise.reject();//reject:拒绝
        }else{
            //数据库中不存在该分类，可以保存
            return new Category({
                name:name
            }).save();
        }
    }).then(function(newCategory){
        res.render('admin/success.html',{
            userInfo: req.userInfo,
            message:'分类保存成功',
            url:'/admin/category'
        })
    })
    
})

//分类修改
router.get('/category/edit',function(req,res){
     //获取要修改的分类的信息，并且用表单的形式展现出来
    let id = req.query.id || '';
    // console.log(id);
    //获取要修改的分类信息
    Category.findOne({
        _id:id
    }).then(function(category){
        if(!category){
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            return Promise.reject();
        }else{
            res.render('admin/category_edit.html',{
                userInfo: req.userInfo,
                category:category
            })
        }
    })

    
})

//分类的修改保存
router.post('/category/edit',function(req,res){
    //获取要修改的分类的信息，并且用表单的形式展现出来
    let id = req.query.id || '';
    //获取post提交过来的名称
    var name = req.body.name || '';
    //获取要修改的分类信息
    Category.findOne({
        _id:id
    }).then(function(category){
        console.log('分类的修改保存category',category)
        if(!category){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '分类信息不存在'
            })
            return Promise.reject();
        }else{
            //当用户没有做任何的修改提交的时候
            if(name===category.name){
                res.render('admin/success',{
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/category'
                })
                return Promise.reject();
            }else{
                //$ne 对应 !=
                return Category.findOne({
                    _id:{$ne: id},
                    name:name
                })
            }
        }
    }).then(function(sameCategory){
        console.log('sameCategory',sameCategory)
        if(sameCategory){
            res.render('admin/error',{
                userInfo: req.userInfo,
                    message: '数据库中已经存在同名分类',
            })
            return Promise.reject();
            
        }else{
            return Category.update({
                _id: id
            },{
                name: name
            })
        }
    }).then(function(){
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/category'
        });
    })

});

//分类删除
router.get('/category/delete',function(req,res){
    //获取要删除的分类的id
    let id = req.query.id || '';
    Category.remove({
        _id:id
    }).then(function(){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/category'
        })
    })

})

//内容首页
router.get('/content',function(req,res){
    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;
    Content.count().then(function(count){
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min( page, pages );
        //取值不能小于1
        page = Math.max(page,1);
        var skip = (page-1)*limit;
        Content.find().limit(limit).skip(skip).sort({addTime: -1}).populate(['category','user']).then(function(contents){
            // console.log(contents)
            res.render('admin/content_index.html',{
                userInfo: req.userInfo,
                contents:contents,

                count: count,
                pages: pages,
                limit: limit,
                page: page
            })
        })

    })
    
})
//添加内容
router.get('/content/add',function(req,res){
    //获取要修改的分类信息
    Category.find().sort({_id:-1}).then(function(categories){
        res.render('admin/content_add.html',{
            userInfo: req.userInfo,
            categories:categories
        })
    })
    
})
//添加内容保存
router.post('/content/add',function(req,res){
    // console.log(req.body);
    if(req.body.category==''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        })
        return;
    }
    if ( req.body.title == '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        })
        return;
    }
    if ( req.body.description == '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容简介不能为空'
        })
        return;
    }
    if ( req.body.content == '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容不能为空'
        })
        return;
    }
    //保存数据到数据库
    new Content({
        category:req.body.category,
        title:req.body.title,
        user:req.userInfo._id.toString(),
        description: req.body.description,
        content: req.body.content
    }).save().then(function(rs){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content'
        })
    })
});

// 内容保存修改页面
router.get('/content/edit',function(req,res){
    let id = req.query.id || '';
    let categories = [];
    Category.find().sort({_id:1}).then(function(rs){
        categories=rs;
        return Content.findOne({
            _id:id
        }).populate('category');
    }).then(function(content){
        // console.log(content)
        if(!content){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '指定内容不存在'
            });
            return Promise.reject();
        }else{
            res.render('admin/content_edit.html',{
                userInfo: req.userInfo,
                categories: categories,
                content:content
            })
        }
    })
})

// 内容保存修改页面保存
router.post('/content/edit',function(req,res){
    console.log(req);
    let id = req.query.id || '';
    if(req.body.category==''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        })
        return;
    }
    if ( req.body.title == '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        })
        return;
    }
    if ( req.body.description == '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容简介不能为空'
        })
        return;
    }
    if ( req.body.content == '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容不能为空'
        })
        return;
    }
    Content.update({
        _id:id
    },{
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(function(update){
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content/edit?id=' + id
        })
    })

})
//分类删除
router.get('/content/delete',function(req,res){
    let id = req.query.id || '';
    Content.remove({
        _id:id
    }).then(function(){
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/content'
        });
    })
})

module.exports = router;