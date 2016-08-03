var express = require('express');
var site = require('./controllers/site');
var topic = require('./controllers/topic');
var auth = require('./middlewares/auth');

var router = express.Router();

router.get('/', site.index);

router.get('/topic/create', auth.userRequired, topic.create);
router.post('/topic/create', topic.put);

router.get('/topic/:tid', topic.index);  // 显示某个话题

module.exports = router;