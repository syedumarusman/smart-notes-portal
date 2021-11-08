const jwt = require('jsonwebtoken')

const getNewToken = (secret, data) => {
    const token = jwt.sign(data, secret, { expiresIn: 30 * 60 })
    return token
}

module.exports = { getNewToken }