var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db, {
    server: {poolSize: 20}
}, function(err) {
    if(err) {
        console.log(err);
        process.exit(1);
    }
});

var TopicSchema = require('./topic');
/**
 * 非 exports、require的方式而通过 mogoose.model 引入 model
 * 必须这里 require 注册 否则下面会报错 Schema hasn't been registered for model "User"
 */
require('./user');

exports.topic = mongoose.model('Topic', TopicSchema, 'topic');
exports.user = mongoose.model('User');

exports.test = function() {
    console.log('chen');
};