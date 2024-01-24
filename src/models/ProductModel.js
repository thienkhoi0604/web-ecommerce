const { Schema, default: mongoose } = require('mongoose');

const ProductModel = new Schema(
  {
    _id: {
      type: mongoose.ObjectId,
      auto: true,
    },
    name: {
      type: String,
      required: [true, 'Please enter your product name!'],
    },
    description: {
      type: String,
      required: [true, 'Please enter your product description!'],
    },
    categoryId: {
      type: Schema.ObjectId,
      required: [true, 'Please enter your product category!'],
    },
    tags: {
      type: String,
    },
    size: {
      type: String,
    },
    color: {
      type: String,
    },
    originalPrice: {
      type: Number,
      required: [true, 'Please enter your product price!'],
    },
    discountPrice: {
      type: Number,
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
        images: {
          type: String,
          required: true,
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
    soldOut: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.ObjectId,
      required: true,
    },
    updatedBy: {
      type: Schema.ObjectId,
    },
    deletedBy: {
      type: Schema.ObjectId,
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

ProductModel.virtual("createdByObj", {
  ref: "users",
  localField: "createdBy",
  foreignField: "_id",
  justOne: true
});
ProductModel.virtual("updatedByObj", {
  ref: "users",
  localField: "updatedBy",
  foreignField: "_id",
  justOne: true
});
ProductModel.virtual("deletedByObj", {
  ref: "users",
  localField: "deletedBy",
  foreignField: "_id",
  justOne: true
});
ProductModel.virtual("categoryObj", {
  ref: "categories",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true
});

module.exports = mongoose.model('products', ProductModel);
