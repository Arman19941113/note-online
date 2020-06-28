const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    const CSRFToken = req.headers['x-csrftoken']
    if (!CSRFToken) {
        console.log()
        console.log(chalk.cyan('Not login'))
        console.log()
        res.status(401)
        res.send({
            code: 1,
            message: 'Unauthorized',
            data: null
        })
        return
    } else if (CSRFToken !== req.cookies.note_online_csrftoken) {
        console.log()
        console.log(chalk.cyan('Maybe CSRF attack'))
        console.log()
        res.status(403)
        res.send({
            code: 1,
            message: 'Forbidden',
            data: null
        })
        return
    }

    const publicKey = fs.readFileSync(path.resolve('rsa/jwt_pub.pem'))
    try {
        const decoded = jwt.verify(CSRFToken, publicKey)
        console.log()
        console.log(chalk.cyan('decoded: ') + JSON.stringify(decoded, null, 4))
        console.log()
        next()
    } catch (error) {
        res.status(403)
        res.send({
            error,
            code: 1,
            message: 'Failed',
            data: null
        })
    }
}
