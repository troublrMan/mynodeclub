## 学习 nodeclub 从头开始
资源 
https://github.com/cnodejs/nodeclub
https://cnodejs.org/topic/535601a20d7d0faf140303d8

### 起步
#### 视图与静态文件
设置视图路径、设置模板引擎、搭建好路由
```
var webRouter = require('./web_router');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/', webRouter);
```
web_router.js 是路由控制文件，示例如下
```
var site = require('./controllers/site');
...
var router = express.Router();
router.get('/', site.index);
module.exports = router;
```
controllers/site.js 控制层，页面逻辑代码实现
```
exports.index = function(req, res, next) {
    ...
    res.render('index', {
        ...
    });
};
```
到目前为止，基本的结构已经搭建好，有几个问题需要一个一个解决

如何加载css、js、图片等静态资源？
```
app.use(express.static(path.join(__dirname, 'public')));
```
这样就设置好express的静态资源目录了，只要在对应的视图文件引入静态文件就能加载了

#### 数据存储与获取
数据库使用 mongodb ，创建 models 文件夹，安装mongoose