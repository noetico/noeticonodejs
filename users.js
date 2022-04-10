var express = require('express');
var usercontroller = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/appdb');
var db = mongoose.connection;

var user = new Schema({
    username: {
    type: String,
    index: true
    },
    password: {
    type: String
    },
    email: {
    type: String
    },
    name: {
    type: String
    },
    profileimage: {
    type: String
    }
    });
module.exports = mongoose.model('User', user);;
//     var User = module.exports = mongoose.model('User', UserSchema);
// module.exports.createUser = function(newUser, callback){
// newUser.save(callback);
// }