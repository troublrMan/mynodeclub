var express = require('express');
var site = require('./controllers/site');

var router = express.Router();

router.get('/', site.index);

module.exports = router;