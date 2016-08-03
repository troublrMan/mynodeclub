var validator = require('validator');
var eventproxy = require('eventproxy');
var config = require('../config');
var User = require('../proxy').User;
var tools = require('../common/tools');

/**
 * 登录页
 */
exports.showLogin = function(req, res, next) {
    // req.session._loginReferer = req.headers.referer;
    res.render('sign/signin');
};

/**
 * 注册显示页面
 */
exports.showSignup = function(req, res, next) {
    res.render('sign/signup');
};

/**
 * 注册逻辑实现
 */
exports.signup = function(req, res, next) {
    var loginName = validator.trim(req.body.loginname).toLowerCase();
    var email = validator.trim(req.body.email).toLowerCase();
    var pass = validator.trim(req.body.pass);
    var rePass = validator.trim(req.body.re_pass);
    
    var ep = new eventproxy();
    ep.fail(next);
    ep.on('prop_err', function(msg) {
        res.status(422).render('sign/signup', {
            error: msg,
            loginname: loginName,
            email: email
        });
    });
    
    //验证信息    
    if([loginName, pass, rePass, email].some(function(item) {
        return item === '';
    })) {
        return ep.emit('prop_err', '信息不完整'); 
    }
    
    if(loginName.length < 5) {
        return ep.emit('prop_err', '用户至少需要5个字符'); 
    }
    
    if(!tools.validateId(loginName)) {
        return ep.emit('prop_err', '用户名不合法'); 
    }
    
    if(!validator.isEmail(email)) {
        return ep.emit('prop_err', '邮箱不合法');
    }
    
    if(pass !== rePass) {
        return ep.emit('prop_err', '两次密码输入不一致');
    }
    
    //检测邮箱是被可用
    User.getUsersByQuery({
        '$or': [
            {'loginname': loginName},
            {'email': email}
        ]
    }, {}, function(err, users) {
        if(err) return next(err);
        if(users.length > 0) {
            return ep.emit('prop_err', '用户名或邮箱已被使用。');
        }
    });
    
    tools.bhash(pass, ep.done(function(passhash) {
        //avatar url 生成后面再做
        User.newAndSave(loginName, loginName, passhash, email, 'avatarUrl', false, function(err) {
            if(err) return next(err);
            //发送激活邮件 
            res.render('sign/signup', {
                success: '欢迎加入 ' + config.name + '！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。'
            });
        });
    }));
    
};