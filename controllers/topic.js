var Topic = require('../proxy').Topic;
var config = require('../config');
var EventProxy = require('eventproxy');

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
    
    //暂时没加用户验证
    var sessionId = req.session ? req.session.user._id : null;
    
    Topic.newAndSave(title, content, tab, sessionId, function (err, topic) {
        if(err) {
            return next(err);
        }
        
        var proxy = new EventProxy();
        
        proxy.all('score_saved', function() {
            res.redirect('/topic/' + topic._id);
        });
        
        proxy.fail(next);
    });
};

exports.create = function(req, res, next) {
    res.render('topic/edit', {
        tabs: config.tabs
    });
};