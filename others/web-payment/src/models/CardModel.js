const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const CardModel = new Schema(
    {
        _id: Schema.ObjectId,
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
        cvv: {
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
        collection: 'cards',
        timestamps: true,
    }
);

module.exports = mongoose.model('cards', CardModel);
