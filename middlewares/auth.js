var mongoose   = require('mongoose');
var UserModel = require('../models/index').user;
var config = require('../config');

/**
 * 用户认证
 */
exports.userRequired = function(req, res, next) {
    if(!req.session || !req.session.user || !req.session.user._id) {
        return res.status(403).send('forbidden!');
    }
    
    next();
};

/**
 * 记录 cookie 和session
 */
exports.gen_session = function(user, req, res) {
    var auth_token = user._id + '$$$$';   // 以后可能会存储更多信息，用 $$$$ 来分隔
    var opts = {
        // path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30,   //30天期限
        // signed: true,
        // httpOnly: true          //客户端js不可读写
    };
    req.session.user = user;
    res.cookie(config.auth_cookie_name, auth_token, opts);
};