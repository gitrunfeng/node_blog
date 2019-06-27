const express = require('express');
var router = express.Router();
const Category = require('../models/Category');
var Content = require('../models/Content');
var data;

/*
* 处理通用的数据
* */
router.use(function(req,res,next){
    data = {
        userInfo: req.userInfo,
        categories:[]
    }
    Category.find().sort({_id:1}).then(function(categories){
        data.categories=categories;
        next()
    })
})

router.get('/',function(req,res,next){
    // console.log(req.userInfo)
    //读取所有分类信息
    // Category.find().sort({_id:1}).then(function(rs){
    //     res.render('main/index.html',{
    //         userInfo: req.userInfo,
    //         categories:rs
    //     })
    // })

    data.category = req.query.category || '';
    data.count = 0;
    data.page = Number(req.query.page || 1);
    data.limit = 5;
    data.pages = 0;

    var where = {};
    if (data.category) {
        where.category = data.category
    }
    Content.where(where).count().then(function(count){
        data.count = count;
        data.pages = Math.ceil(data.count/data.limit);//计算总页数
        data.page = Math.min(data.page,data.pages);//取值不能超过pages
        data.page = Math.max(data.page,1);//取值不能小于1
        var skip = (data.page -1) * data.limit
        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
            addTime: -1
        });
    }).then(function(contents) {
        data.contents = contents;
        res.render('main/index', data);
    })

    
})

// 详情页
router.get('/view',function(req,res){
    const contentId =req.query.contentid || '';
    Content.findOne({
        _id:contentId
    }).then(function(content){
        // console.log(content);
        data.content=content;
        content.views++;
        content.save();
        res.render('main/view',data)
    })
})

module.exports = router;