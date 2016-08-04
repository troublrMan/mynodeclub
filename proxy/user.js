var models = require('../models/index');
var User = models.user;

/**
 * 根据关键字，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getUsersByQuery = function(query, opt, callback) {
    User.find(query, '', opt, callback);
};

/**
 * 新建保存 user 
 */
exports.newAndSave = function(name, loginname, pass, email, avatar_url, active, callback) {
    var user = new User();
    user.name = loginname;
    user.loginname = loginname;
    user.pass = pass;
    user.email = email;
    user.avatar = avatar_url;
    user.active = active || false;
    // user.accessToken = uuid.V4();   不明所以先注掉
    user.save(callback);
};

/**
 * 根据邮箱获取用户
 */
exports.getUserByMail = function(email, callback) {
    User.findOne({'email': email}, callback);
};

/**
 * 根据登录名获取用户
 */
exports.getUserByLoginName = function(loginName, callback) {
    User.findOne({'loginname': new RegExp('^' + loginName + '$', 'i')}, callback);
};