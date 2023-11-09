const { RESPONSE_CODE } = require("../constants");
const UserModel = require("../models/UserModel");
const { BcryptUtil } = require("../utils");

const authService = {
    async doLogin(user) {
        try {
            const userModel = await UserModel.findOne({ email: user.email });
            if (!userModel) {
                return {
                    error: {
                        code: RESPONSE_CODE.ERROR,
                        message: "User not found."
                    }
                };
            }
            const match = BcryptUtil.compare(user.password, userModel.password);
            if (match) {
                return {
                    error: {
                        code: RESPONSE_CODE.SUCCESS,
                        message: "Successfully."
                    }
                };
            } else {
                return {
                    error: {
                        code: RESPONSE_CODE.ERROR,
                        message: "Password not match."
                    }
                };
            }
        } catch (e) {
            console.log(e);
            return {
                error: {
                    code: RESPONSE_CODE.ERROR,
                    message: "Something error. Please coming a later time."
                }
            };
        }
    },
    async doRegister(user) {
        try {
            const userModel = new UserModel(user);
            return {
                error: {
                    code: RESPONSE_CODE.SUCCESS,
                    message: "Successfully."
                },
                user: userModel
            };
        } catch (e) {
            console.log(e);
            return {
                error: {
                    code: RESPONSE_CODE.ERROR,
                    message: "Something error. Please coming a later time."
                }
            };
        }
    }
}

module.exports = authService;