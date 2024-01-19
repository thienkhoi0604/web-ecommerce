const mongoose = require('mongoose');
const { Schema } = require("mongoose")

const PaymentModel = new Schema({
    _id: Schema.ObjectId,
    userId: {
        type: mongoose.ObjectId,
        ref: "user"
    },
    status: {
        type: String,
    },
    type: {
        type: String,
    },
    createdBy: {
        type: String,
        required: true,
    },
    updatedBy: {
        type: String
    },
    deletedBy: {
        type: String
    },
    deletedAt: {
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    collection: 'payments',
    timestamps: true
})

module.exports = mongoose.model("payments", PaymentModel)