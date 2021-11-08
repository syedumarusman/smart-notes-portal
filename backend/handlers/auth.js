const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../utils/constants');
const { tokenSchema, refreshTokenSchema } = require('../validations/authSchema');
const { getNewToken } = require("../utils/jwtService");

const checkAuthToken = async (token) => {
    let tokenExpired;
    const { error } = tokenSchema.validate({ token });
    if (error) {
        throw error;
    }
    try {
        const validateToken = jwt.verify(token, JWT_SECRET_KEY);
        tokenExpired = false;
    } catch(err) {
        if(err && err.name === "TokenExpiredError")
        tokenExpired = true
    }
    response = { tokenExpired }
    return response
}

const refreshToken = async (user) => {
    const { error } = refreshTokenSchema.validate(user, { allowUnknown: true } );
    if (error) {
        throw error;
    }
    const token = getNewToken(JWT_SECRET_KEY, user);
    return token;
}

module.exports = { checkAuthToken, refreshToken }