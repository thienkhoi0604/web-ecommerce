const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const CardModel = new Schema(
    {
        _id: {
            type: Schema.ObjectId,
            auto: true,
        },
        cardNumber: {
            type: String,
            required: true,
        },
        cardHolder: {
            type: String,
            required: true,
        },
        expirationDate: {
            type: Date,
            required: true,
        },
        ccv: {
            type: String,
            required: true,
        },
        issuer: {
            type: String,
            required: true,
        },
        balance: {
            type: Number,
            required: true,
        },
        partnerId: {
            type: String,
            required: true,
        },
        createdBy: {
            type: String,
            required: true,
        },
        updatedBy: {
            type: String,
        },
        deletedAt: {
            type: Date,
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
    },
    {
        collection: 'payment-cards',
        timestamps: true,
    }
);

module.exports = mongoose.model('payment-cards', CardModel);
