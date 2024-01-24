const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const CartModel = new Schema(
  {
    _id: {
      type: mongoose.ObjectId,
      auto: true,
    },
    userId: {
      type: mongoose.ObjectId,
      ref: 'user',
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
    createdBy: {
      type: mongoose.ObjectId,
      required: true,
    },
    updatedBy: {
      type: mongoose.ObjectId,
    },
    deletedBy: {
      type: mongoose.ObjectId,
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
CartModel.virtual("createdByObject", {
  ref: "user",
  localField: "createdBy",
  foreignField: "_id",
  justOne: true
});
CartModel.virtual("updatedByObject", {
  ref: "user",
  localField: "updatedBy",
  foreignField: "_id",
  justOne: true
});
module.exports = mongoose.model('cards', CartModel);
