var express = require('express');
var path = require('path');
var webRouter = require('./web_router');
var config = require('./config');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var app = express();


app.set('port', process.env.PORT || 3000);
//视图路径
app.set('views', path.join(__dirname, 'views'));
//模板引擎
app.set('view engine', 'ejs');

//引入静态资源
app.use(express.static(path.join(__dirname, 'public')));

//如果不用 bodyParser, post提交的数据在 req.body 中将会取不到
app.use(bodyParser.urlencoded({ extended: false }));

//添加 cookie 中间件
app.use(cookieParser(config.session_secret));

//添加 session 中间件
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

app.use('/', webRouter);

app.listen(3000);