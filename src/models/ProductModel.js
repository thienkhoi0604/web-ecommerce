const { Schema, default: mongoose } = require('mongoose');

const ProductModel = new Schema(
  {
    _id: Schema.ObjectId,
    name: {
      type: String,
      required: [true, 'Please enter your product name!'],
    },
    description: {
      type: String,
      required: [true, 'Please enter your product description!'],
    },
    category: {
      type: String,
      required: [true, 'Please enter your product category!'],
    },
    tags: {
      type: String,
    },
    originalPrice: {
      type: Number,
    },
    discountPrice: {
      type: Number,
      required: [true, 'Please enter your product price!'],
    },
    stock: {
      type: Number,
      required: [true, 'Please enter your product stock!'],
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    reviews: [
      {
        user: {
          type: Object,
        },
        rating: {
          type: Number,
        },
        comment: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    ratings: {
      type: Number,
    },
    shopId: {
      type: mongoose.ObjectId,
      ref: 'shops',
      required: true,
    },
    shop: {
      type: Object,
      required: true,
    },
    sold_out: {
      type: Number,
      default: 0,
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
    collection: 'products',
    timestamps: true,
  }
);

module.exports = mongoose.model('products', ProductModel);
