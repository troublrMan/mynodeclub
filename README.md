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

### =====================================================================
nodeclub 是很好的学习资源，下面的内容会记录 1、nodeclub 优秀的处理方式   2、我踩的坑   3、nodeclub 的槽点   4、待完善的部分  

第一个去实施的模块是 topic 可能是觉得比较直观吧，实际上肯定先要做登录注册的～

### topic的 edit 页面（topic发布页面）
进入 topic 发布页面，路由（这个页面实际上是要进行 author 认证的，暂时略过，后面再加上中间件）、控制器很简单没有坑，由于 ejs 并不熟悉，遇到了一个小梗，但很快解决  

topic 的 edit 页面如何引用 header、footer模板（不在同一目录下，以前写demo都是同一目录下，相对路径的格式是怎样的～）？
通过github ejs官网查看，可以这样直接写 `<%- include ../header %>` 这就是相对路径啦  

进入 topic 发布的 post流程，post 提交的数据为什么在 req.body 中取不到？   
查看 app.js 文件，妈哒，居然没有使用 body-parser 中间件，加上就正常了。  
body-parser 要点简记：

nodeclub 的 model 暴露方式值得学习。所有的model统一使用 models/index.js 来暴露，这里有两个好处，首先是在引用 model 时候变得清晰了，都是 `require('../models').xxx` 之类，同一管理非常好；其次，使用这个 index.js 统一维护 mongoose 的连接池。  
这里有一个小坑，正常我们引入暴露模块都是通过 require、exports，但 nodeclub 奇妙的通过 mongoose.model() （初始化 model，根据 model名取model）实现了这一个效果

### sign 的 signup 页面（注册页面）
没办法了，还是得先搞定注册和登录才能继续其他页面啊  
注册页面展示没有问题。注册处理逻辑用到了几个三方模块不错 validator、eventproxy、bcrypt  
validator 要点简记：  
eventproxy 要点简记：   
bcrypt 要点简记：  

第一个槽点，nodeclub 注册时的密码居然是明文传输的～ 别人抓个包是不是你的注册信息全部泄露了？

有个地方得说一下，Array.prototype.some() 测试数组中的某些元素是否有通过了指定函数的测试，这个很好用，以前一个一个判断是否为空多蠢啊～  

### sign 的 signin 页面（登录）
登录成功后设置 cookie
```
//添加 cookie-parser 中间件就能访问 cookie了
app.use(cookieParser(config.session_secret));

//登录成功后修改 cookie
res.cookie(config.auth_cookie_name, auth_token, opts);
```
登录成功后缓存 session
```
//添加 session 中间件，并使用 redis 缓存 session
app.use(session({
    secret: config.session_secret,
    store: new RedisStore({
        port: config.redis_port,
        host: config.redis_host,
        db: config.redis_db,
        pass: config.redis_password, 
    }),
    resave: false,
    saveUninitialized: false,
}));

//登录成功后修改 session
req.session.user = user;
```