var express = require('express');
var site = require('./controllers/site');
var topic = require('./controllers/topic');
var sign = require('./controllers/sign');
var auth = require('./middlewares/auth');

var router = express.Router();

router.get('/', site.index);

router.get('/topic/create', auth.userRequired, topic.create);
router.post('/topic/create', topic.put);

router.get('/topic/:tid', topic.index);  // 显示某个话题

router.get('/signin', sign.showLogin);  //跳转到登录界面
router.post('/signin', sign.login);      //登录校验

router.get('/signup', sign.showSignup);  // 跳转到注册页面
router.post('/signup', sign.signup);  // 提交注册信息

module.exports = router;