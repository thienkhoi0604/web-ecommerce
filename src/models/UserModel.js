const { Schema, default: mongoose } = require("mongoose");
const { BcryptUtil } = require("../utils");

const UserModel = new Schema({
    id: Schema.ObjectId,
    firstname: {
        type: String,
        require: true
    },
    lastname: {
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
    }
}, {
    timestamps: true
});

UserModel.pre('save', function (next) {
    user.password = this.isModified('password') ? BcryptUtil.hash(user.password) : this.password;
    next();
});

module.exports = mongoose.model("user", UserModel);