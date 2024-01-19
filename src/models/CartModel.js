const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const CartModel = new Schema(
  {
    _id: Schema.ObjectId,
    userId: {
      type: mongoose.ObjectId,
      ref: 'user',
    },
    products: [
      {
        type: mongoose.ObjectId,
        ref: 'products',
      },
    ],
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
    collection: 'carts',
    timestamps: true,
  }
);

module.exports = mongoose.model('carts', CartModel);
