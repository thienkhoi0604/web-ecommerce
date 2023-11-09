const Joi = require('joi');
const { USER_ROLE } = require('../constants');

const LoginValidate = {
    user: Joi.object({
        email: Joi.string()
            .email()
            .required(),

        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .min(6)
            .required(),

        type: Joi.number()
            .default(USER_ROLE.USER)
    })
};

module.exports = LoginValidate;