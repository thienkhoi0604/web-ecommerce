const Joi = require('joi');
const { USER_ROLE } = require('../constants');

const RegisterValidate = {
    user: Joi.object({
        firstname: Joi.string()
            .alphanum()
            .min(1)
            .max(30)
            .required(),

        lastname: Joi.string()
            .alphanum()
            .min(1)
            .max(30)
            .required(),

        phone: Joi.string()
            .pattern(new RegExp('^[0-9]'))
            .required(),

        email: Joi.string()
            .email()
            .required(),

        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .min(6)
            .required(),

        repeatPassword: Joi.ref('password'),

        type: Joi.number()
            .default(USER_ROLE.USER)
    })
};

module.exports = RegisterValidate;