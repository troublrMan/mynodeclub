var mongoose   = require('mongoose');
var UserModel = require('../models/index').user;

exports.userRequired = function(req, res, next) {
    if(!req.session || !req.session.user || !req.session.user._id) {
        return res.status(403).send('forbidden!');
    }
    
    next();
}