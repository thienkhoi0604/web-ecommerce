const { Response } = require("../../commons");
const { logger } = require("../../configs");
const { RESPONSE_CODE } = require("../../constants");
const { UserModel } = require("../../models");

const ProfileController = {
    async index(req, res, next) {
        res.render('client/profile', Response({ res, data: { profile: true } }));
    },
    async updatePassword(req, res, next) {
        try {
            const _user = res.locals._user;
            const body = req.body;
            const { password, newPassword } = body;
            const user = await UserModel.findById(_user._id);
            if (!user) {
                throw new Error("User not found!");
            }
            if (!user.comparePassword(password)) {
                throw new Error("Password is incorrect!");
            }
            await UserModel.findByIdAndUpdate(_user._id, { password: newPassword, updatedBy: _user?._id }, { new: false }).lean();
            logger.log({
                level: 'info',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: "Update password successfully!",
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Update password successfully!"
            });
        } catch (e) {
            logger.log({
                level: 'error',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: "Update password error!",
                    error: e.message
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }
    },
    async update(req, res, next) {
        try {
            const _user = res.locals._user;
            const body = req.body;
            const updateFields = [
                "fullname",
                "email",
                "phone",
                "address",
            ];
            const updateUser = updateFields.reduce((acc, field) => {
                const value = body[field];
                acc[field] = value;
                return acc;
            }, {});
            updateUser.updatedBy = _user?._id;
            const id = _user._id;
            const updatedUser = await UserModel.findByIdAndUpdate(id, updateUser, { new: false }).lean();
            logger.log({
                level: 'info',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: "Update user successfully!",
                    updatedUser
                })
            })
            res.json({
                data: updatedUser,
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Update user successfully!"
            });
        } catch (e) {
            logger.log({
                level: 'error',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: "Update profile error!",
                    error: e.message
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }
    }
}

module.exports = ProfileController;