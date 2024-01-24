const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const CartModel = new Schema(
  {
    _id: {
      type: Schema.ObjectId,
      auto: true,
    },
    userId: {
      type: mongoose.ObjectId,
      ref: 'user',
    },
    productId: {
        type: mongoose.ObjectId,
        ref: 'products',
    },
    number: {
      type: Number,
      default: 1,
    },
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
    },
    deletedBy: {
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
    collection: 'carts',
    timestamps: true,
  }
);

CartModel.virtual("createdByObj", {
  ref: "users",
  localField: "createdBy",
  foreignField: "_id",
  justOne: true
});
CartModel.virtual("updatedByObj", {
  ref: "users",
  localField: "updatedBy",
  foreignField: "_id",
  justOne: true
});
CartModel.virtual("deletedByObj", {
  ref: "users",
  localField: "deletedBy",
  foreignField: "_id",
  justOne: true
});

module.exports = mongoose.model('carts', CartModel);
