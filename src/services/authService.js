const { RESPONSE_CODE } = require('../constants');
const UserModel = require('../models/UserModel');
const { BcryptUtil } = require('../utils');

const authService = {
  async doLogin(user) {
    try {
      const userModel = await UserModel.findOne({ email: user.email });
      if (!userModel) {
        return {
          error: {
            code: RESPONSE_CODE.ERROR,
            message: 'Invalid credentials.',
          },
        };
      }
      const match = userModel.comparePassword(user.password);
      if (match) {
        return {
          user: userModel.toObject(),
          error: {
            code: RESPONSE_CODE.SUCCESS,
            message: 'Successfully.',
          },
        };
      } else {
        return {
          error: {
            code: RESPONSE_CODE.ERROR,
            message: 'Invalid credentials.',
          },
        };
      }
    } catch (e) {
      console.log(e);
      return {
        error: {
          code: RESPONSE_CODE.ERROR,
          message: 'Something error. Please coming a later time.',
        },
      };
    }
  },
  async doRegister(user) {
    try {
      const alreadyUser = await UserModel.exists({ email: user.email });
      if (!!alreadyUser) {
        return {
          error: {
            code: RESPONSE_CODE.SUCCESS,
            message: 'Email already exist.',
          },
        };
      }

      const userModel = new UserModel(user);
      const newUser = await UserModel.create(userModel);

      if (newUser) {
        return {
          user: newUser.toObject(),
          error: {
            code: RESPONSE_CODE.SUCCESS,
            message: 'Successfully.',
          },
        };
      }

      return {
        user: newUser.toObject(),
        error: {
          code: RESPONSE_CODE.ERROR,
          message: 'Failed.',
        },
      };
    } catch (e) {
      console.log(e);
      return {
        error: {
          code: RESPONSE_CODE.ERROR,
          message: 'Something error. Please coming a later time.',
        },
      };
    }
  },
};

module.exports = authService;
