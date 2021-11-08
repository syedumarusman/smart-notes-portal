const AuthHandler = require('../handlers/auth');

const checkAuthToken = async (ctx) => {
    const token = ctx.query.token;
    const response = await AuthHandler.checkAuthToken(token);
    ctx.body = response;
}

const refreshToken = async (ctx) => {
    const user = ctx.request.body.currentUser;
    const response = await AuthHandler.refreshToken(user);
    ctx.body = response;
}

module.exports = { checkAuthToken, refreshToken }