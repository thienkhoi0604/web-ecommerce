const { Schema, default: mongoose } = require('mongoose');
const { BcryptUtil } = require('../utils');

const UserModel = new Schema(
  {
    _id: {
      type: mongoose.ObjectId,
      auto: true,
    },
    id: {
      type: String,
    },
    fullname: {
      type: String,
      required: [true, 'Please enter your fullname!'],
    },
    phone: {
      type: String,
      require: [true, 'Please enter your phone!'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your email!'],
      unique: [true, 'Email already exists!'],
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minLength: [4, 'Password should be greater than 4 characters'],
    },
    paymentId: {
      type: mongoose.ObjectId,
      ref: 'payments',
    },
    role: {
      type: String,
      default: 'user',
      enum: ['admin', 'user', 'shop-owner'],
    },
    source: {
      type: String,
    },
    createdBy: {
      type: mongoose.ObjectId,
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
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserModel.pre('save', function (next) {
  this.password = this.isModified('password')
    ? BcryptUtil.hash(this.password)
    : this.password;
  next();
});
UserModel.virtual("createdByObj", {
  ref: "users",
  localField: "createdBy",
  foreignField: "_id",
  justOne: true
});
UserModel.virtual("updatedByObj", {
  ref: "users",
  localField: "updatedBy",
  foreignField: "_id",
  justOne: true
});
UserModel.virtual("deletedByObj", {
  ref: "users",
  localField: "deletedBy",
  foreignField: "_id",
  justOne: true
});
// compare password
UserModel.methods.comparePassword = function (enteredPassword) {
  return BcryptUtil.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('users', UserModel);
