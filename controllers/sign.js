var validator = require('validator');
var eventproxy = require('eventproxy');
var config = require('../config');
var User = require('../proxy').User;
var tools = require('../common/tools');
var authMiddleWare = require('../middlewares/auth');

/**
 * 登录页
 */
exports.showLogin = function(req, res, next) {
    // req.session._loginReferer = req.headers.referer;
    res.render('sign/signin');
};

/**
 * 登录时需要跳到首页的页面
 * @type {Array}
 */
var notJump = [
    '/active_account', 
    '/reset_pass',     
    '/signup',         
    '/search_pass'    
];

/**
 * 登录逻辑验证
 */
exports.login = function(req, res, next) {
    var loginName = validator.trim(req.body.name).toLowerCase();
    var pass = validator.trim(req.body.pass).toLowerCase();
    var ep = new eventproxy();
    
    ep.fail(next);
    ep.on('login_error', function(login_error) {
        res.status(403);
        res.render('sign/signin', { error: '用户名或密码错误'});
    })
    
    if(!loginName || !pass) {
        res.status(422);
        return res.render('sign/signin', { error: '信息不完整'});
    }
    
    //根据用户名或邮箱获取用户
    var getUser;
    if(loginName.indexOf('@') !== -1) {
        getUser = User.getUserByMail;
    } else {
        getUser = User.getUserByLoginName;
    }
    
    getUser(loginName, function(err, user) {
        if(err) return next(err);
        if(!user) {
            return ep.emit('login_error');
        }
        
        //验证密码
        var passhash = user.pass;
        tools.bcompare(pass, passhash, ep.done(function(bool) {
            if(!bool) return ep.emit('login_error');
            
            //账号未激活，应该提示用户去激活
            if(!user.active) {
                console.log('该用户未激活');
            }
            
            //保存 session、cookie
            authMiddleWare.gen_session(user, req, res);
            //登录成功后的跳转地址
            var refer = (req.session && req.session._loginReferer) || '/';
            if(notJump.some(function(item) {
                return refer.indexOf(item) >= 0;
            })) {
                refer = '/';
            }
            
            res.redirect(refer);
        }));
    });
}

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