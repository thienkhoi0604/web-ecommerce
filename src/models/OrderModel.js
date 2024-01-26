const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const OrderModel = new Schema(
  {
    _id: {
      type: Schema.ObjectId,
      auto: true,
    },
    userId: {
      type: mongoose.ObjectId,
      ref: 'user',
      required: true,
    },
    cartIds: [
      {
        type: mongoose.ObjectId,
        required: true,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'Info',
      enum: ['Info', 'Payment', 'Review', 'Proccess', 'Delivering', 'Shipped', 'Cancel'],
    },
    fullname: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    note: {
      type: String,
    },
    cardId: {
      type: mongoose.ObjectId,
      ref: 'cards',
    },
    paidAt: {
      type: Date,
      default: Date.now(),
    },
    deliveredAt: {
      type: Date,
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
      default: false,
    },
  },
  {
    collection: 'orders',
    timestamps: true,
  }
);
OrderModel.virtual("createdByObj", {
  ref: "users",
  localField: "createdBy",
  foreignField: "_id",
  justOne: true
});
OrderModel.virtual("updatedByObj", {
  ref: "users",
  localField: "updatedBy",
  foreignField: "_id",
  justOne: true
});
OrderModel.virtual("deletedByObj", {
  ref: "users",
  localField: "deletedBy",
  foreignField: "_id",
  justOne: true
});
OrderModel.virtual("cartObjs", {
  ref: "carts",
  localField: "cartIds",
  foreignField: "_id",
  justOne: false
});
OrderModel.virtual("cardObj", {
  ref: "cards",
  localField: "cardId",
  foreignField: "_id",
  justOne: true
});
module.exports = mongoose.model('orders', OrderModel);
