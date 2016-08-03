var mongoose   = require('mongoose');
var UserModel = require('../models/index').user;

exports.userRequired = function(req, res, next) {
    console.log('userRequired');
}