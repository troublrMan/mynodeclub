var models = require('../models/index');
var Topic = models.topic;

exports.newAndSave = function (title, content, tab, authorId, callback) {
    var topic = new Topic();
    topic.title = title;
    topic.content = content;
    topic.tab = tab;
    topic.author_id = authorId;
    
    topic.save(callback);
};