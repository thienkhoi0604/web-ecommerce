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
    orderId: {
      type: mongoose.ObjectId,
      ref: 'orders',
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
CartModel.virtual("orderObj", {
  ref: "orders",
  localField: "orderId",
  foreignField: "_id",
  justOne: true
});
CartModel.virtual("productObj", {
  ref: "products",
  localField: "productId",
  foreignField: "_id",
  justOne: true
});
module.exports = mongoose.model('carts', CartModel);
