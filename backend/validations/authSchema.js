const Joi = require('joi');
const { USER_ROLES: { admin, user } } = require('../utils/constants');

const tokenSchema = Joi.object({
    token: Joi.string().required()
})

const refreshTokenSchema = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    userId: Joi.string().required().min(4),
    role: Joi.string().valid(admin, user).required(),
    email: Joi.string().email().required()
})

module.exports = { tokenSchema, refreshTokenSchema }