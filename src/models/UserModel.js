const { Schema, default: mongoose } = require('mongoose');
const { BcryptUtil } = require('../utils');

const UserModel = new Schema(
  {
    _id: Schema.ObjectId,
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
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minLength: [4, 'Password should be greater than 4 characters'],
      select: false,
    },
    paymentId: {
      type: mongoose.ObjectId,
      ref: 'payments',
    },
    type: {
      type: Number,
      required: true,
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
    timestamps: true,
  }
);

UserModel.pre('save', function (next) {
  user.password = this.isModified('password')
    ? BcryptUtil.hash(user.password)
    : this.password;
  next();
});

// compare password
UserModel.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('user', UserModel);
