// var mongoose=require('mongoose');
// var passwordLocalMongoose=require('passport-local-mongoose');

// var UserSchema=new mongoose.Schema({
// 	username:String,
// 	password:String
// });

// UserSchema.plugin(passwordLocalMongoose);

// module.exports=mongoose.model('User',UserSchema);

var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose); //adds the methods to our user

module.exports = mongoose.model("User", UserSchema);