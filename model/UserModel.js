// const {model} = require('mongoose');

// const {userSchema} = require('../schemas/UserSchema');

// const UsersModel = new model('user', userSchema);

// module.exports = {UsersModel};

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

