const { Schema, default: mongoose } = require('mongoose');

const ShopModel = new Schema(
  {
    _id: Schema.ObjectId,
    name: {
      type: String,
      required: [true, 'Please enter your shop name!'],
    },
    description: {
      type: String,
    },
    address: {
      type: String,
      required: [true, 'Please enter your shop address!'],
    },
    phoneNumber: {
      type: Number,
      required: [true, 'Please enter your shop phone!'],
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
    collection: 'shops',
    timestamps: true,
  }
);

module.exports = mongoose.model('shops', ShopModel);
