var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true},
    hash: String,
    salt: String
});

var calculateHash = function (password, salt) {
    crypto.pbkdf2Sync(password, salt, 1000, 64).toString('hex');
}

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = calculateHash(password, this.salt);
};

UserSchema.methods.validPassword = function (password) {
    var hash = calculateHash(password, this.salt);
    return this.hash === hash;
}

UserSchema.methods.generateJWT = function () {
    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(expiryDate().getTime() / 1000),
    }, 'SECRET'); //TODO use a good secret
};

function expiryDate() {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return exp;
}

mongoose.model('User', UserSchema);