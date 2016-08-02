var express = require('express');
var path = require('path');
var webRouter = require('./web_router');


var app = express();


app.set('port', process.env.PORT || 3000);
//视图路径
app.set('views', path.join(__dirname, 'views'));
//模板引擎
app.set('view engine', 'ejs');

//引入静态资源
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', webRouter);

app.listen(3000);