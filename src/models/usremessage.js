const mongoose = require("mongoose");
const validator = require("validator");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3, 
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: "Invalid email id"
        }
    
    },
    phone: {
        type: String,
        required: true,
        minLength: 10,
    },
    message: {
        type: String,
        required: true,
        minLength: 3,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    googleId: {
        type:String
    },
  client_secret:{
    type:String
  }
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = mongoose.model("User", userSchema);
module.exports = User;
