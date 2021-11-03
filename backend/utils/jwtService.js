const jwt = require('jsonwebtoken')

const getNewToken = (secret, data) => {
    const token = jwt.sign(data.toJSON(), secret, { expiresIn: "1d" })
    return token
}

module.exports = { getNewToken }