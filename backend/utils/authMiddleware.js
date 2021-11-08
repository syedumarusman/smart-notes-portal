const Boom = require('boom');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('./constants');

function auth(expectedRole) {
    return async (ctx, next) => {
        let token;
        const bearerToken = ctx.headers['authorization']
        if(typeof bearerToken === undefined) {
            throw Boom.unauthorized('User is not authorized')
        }
        const bearerList = bearerToken.split(' ')
        token = bearerList[1]
        let validatedToken = jwt.verify(token, JWT_SECRET_KEY);
        if (typeof validatedToken === 'string') {
            throw new Error('Not a valid token');
        }
        for (const role of expectedRole) {
            if (role == validatedToken.role) {
                return next();
            }
        }
        throw Boom.unauthorized("User is not authorized");
    }
}

module.exports = auth;