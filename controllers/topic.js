var Topic = require('../proxy').Topic;
var config = require('../config');
var EventProxy = require('eventproxy');
var User = require('../proxy').User;

exports.put = function(req, res, next) {
    var title = req.body.title;
    var content = req.body.t_content;
    var tab = req.body.tab;
    
    var allTabs = config.tabs.map(function(item) {
        return item[0];    
    });
    
    // 验证
    var editError;
    if (title === '') {
        editError = '标题不能是空的。';
    } else if (title.length < 5 || title.length > 100) {
        editError = '标题字数太多或太少。';
    } else if (!tab || allTabs.indexOf(tab) === -1) {
        editError = '必须选择一个版块。';
    } else if (content === '') {
        editError = '内容不可为空';
    }
    // END 验证

    if (editError) {
        res.status(422);
        return res.render('topic/edit', {
            edit_error: editError,
            title: title,
            content: content,
            tabs: config.tabs
        });
    }
  
    var sessionId = req.session ? req.session.user._id : null;
    
    Topic.newAndSave(title, content, tab, sessionId, function (err, topic) {
        if(err) {
            return next(err);
        }
        
        var ep = new EventProxy();
        
        ep.all('score_saved', function() {
            res.redirect('/topic/' + topic._id);
        });
        ep.fail(next);
        
        User.getUserById(req.session.user._id, ep.done(function(user) {
            
        }));
    });
};

exports.create = function(req, res, next) {
    res.render('topic/edit', {
        tabs: config.tabs
    });
};

exports.index = function(req, res, next) {
    var id = req.query._id;
    res.render('topic/index', {
        
    });
}