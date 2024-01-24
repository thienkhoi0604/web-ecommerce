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
    products: [
      {
        type: mongoose.ObjectId,
        ref: 'products',
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'Not Process',
      enum: ['Not Process', 'Processing', 'Delivering', 'Shipped', 'Cancel'],
    },
    shippingAddress: {
      type: Object,
      required: true,
    },
    paymentId: {
      type: mongoose.ObjectId,
      ref: 'payments',
      required: true,
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

module.exports = mongoose.model('orders', OrderModel);
