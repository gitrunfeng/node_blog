
#项目名：资讯博客1.0

#1.0使用了哪些技术？
  Node+Express+Mongoose+Ejs

#有哪些功能？
  * 博客首页
  * 博客详情（文章详情，阅读数，评论）
  * 用户中心（登录，注册，重置密码）
  * 博客后台管理系统（包括用户管理（用户删除，添加，权限设置）
  * 文章管理（文章发布，分类，修改，删除以及用户评论管理））


#工具安装方法以及本项目所使用的monggoDB属性介绍

1.先创建项目文件夹blog2  然后npm init生成pageage.json文件

2.npm install --save express 安装express框架

3.npm install mongoose(Mongoose是在node.js异步环境下对mongodb进行便捷操作的对象模型工具)


-----------------------------------mongoDB工具安装-------------------------------------

C:/Program Files/MongoDB/Server/4.0/bin   mongoDB安装位置


  
mongod --dbpath=当前数据库存储的路径 port=指定端口

mongod --dbpath=E:\imooc\Node_boke\db port=27018



下载MongoDB可视化工具RoboMongo ： https://robomongo.org/


mongodb:https://www.runoob.com/mongodb/mongodb-tutorial.html

mysql是table表  =>  

C:\Program Files\MongoDB\Server\4.0\bin

检查是否安装成功：cmd -> C:\Program Files\MongoDB\Server\4.0\bin -> mongo.exe

1、创建c:\data\db 文件夹
2、C:\Program Files\MongoDB\Server\4.0\bin\mongod --dbpath c:\data\db  开启数据库链接
3、链接MongoDB C:\Program Files\MongoDB\Server\4.0\bin\mongo.exe


下载：Robo 3T软件（mongoDB可视化工具）
mongoose中文文档：https://xiaoxiami.gitbook.io/mongoose/
Mongoose是在node.js异步环境下对mongodb进行便捷操作的对象模型工具
安装：npm i mongoose


curl -d 'name=lilei&age=28' http://localhost:3000/addPerson

数据库导入：mongoimport -d 库名 -c 表名 xxx项目库源地址

-----------------------------------所使用到的mongoDB属性-------------------------------------
//  根据_id查询
//  User.findById(id, [fields], [options], [callback])
//  limit()方法接受一个数字参数，该参数指定从MongoDB中读取的记录条数。
//  skip方法同样接受一个数字参数作为跳过的记录条数。
//  使用count()方法查询表中的记录条数，例如，下面的命令查询表users的记录数量：
    db.users.find().count();

//  limit()方法接受一个数字参数，该参数指定从MongoDB中读取的记录条数。
//  skip方法同样接受一个数字参数作为跳过的记录条数。
//  findOne 返回一个文档满足指定的查询条件
//  find() 方法以非结构化的方式来显示所有文档。
//  Promise.reject(reason)方法也会返回一个新的 Promise 实例，该实例的状态为rejected。
//  条件操作符，"$lt", "$lte", "$gt", "$gte", "$ne"就是全部的比较操作符，对应于"<", "<=", ">", ">=","!="
//  update() 方法用于更新已存在的文档
//  save() 方法通过传入的文档来替换已有文档
//  remove()函数是用来移除集合中的数据
//  model(name) 返回另一个Model实例
//  mongoose.model('User', usersSchema)  User:数据库表名
// .sort({_id:-1})排序  按id排序  -1：降序，1：升序
// 关联数据库操作
   type: mongoose.Schema.Types.ObjectId,
   ref: 'User'
// populate:在定义一个 Schema 的时候可以指定了其中的字段（属性）是另一个Schema的引用,在查询文档时就可以使用 populate 方法通过引用 Schema 和 id 找到关联的另一个文档或文档的指定字段值
// Model.where:当查询比较复杂时，用 where：
