const { Schema } = require("mongoose");

const UserModel = new Schema({
    id: Schema.ObjectId,
    email: String,
    password: String,
    type: Number
}, {
    timestamps: true
});

module.exports = UserModel;