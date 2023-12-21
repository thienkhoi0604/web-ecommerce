const { Schema, default: mongoose } = require("mongoose");
const { BcryptUtil } = require("../utils");

const UserModel = new Schema({
    _id: Schema.ObjectId,
    id: {
        type: String
    },
    fullname: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    type: {
        type: Number,
        require: true
    },
    source: {
        type: String
    },
    accessToken: {
        type: String
    },
    refreshToken: {
        type: String
    },
}, {
    timestamps: true
});

UserModel.pre('save', function (next) {
    user.password = this.isModified('password') ? BcryptUtil.hash(user.password) : this.password;
    next();
});

module.exports = mongoose.model("user", UserModel);