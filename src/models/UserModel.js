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
    createdBy: {
        type: String
    },
    updatedBy: {
        type: String
    },
    deletedBy: {
        type: String
    },
    deletedAt: {
        type: Date,
        default: Date.now()
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

UserModel.pre('save', function (next) {
    user.password = this.isModified('password') ? BcryptUtil.hash(user.password) : this.password;
    next();
});

module.exports = mongoose.model("user", UserModel);