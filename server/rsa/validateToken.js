const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const jwt = require('jsonwebtoken')

// 登录验证
module.exports = function (req, res, next) {
  const CSRFToken = req.headers['x-csrftoken']
  if (!req.cookies.uid || !CSRFToken || CSRFToken !== req.cookies.note_online_csrftoken) {
    res.status(401)
    res.send({
      code: 1,
      message: 'Unauthorized',
      data: null,
    })
    return
  }

  // decode token
  const publicKey = fs.readFileSync(path.resolve('rsa/rsa_public_key.pem'))
  try {
    const decoded = jwt.verify(CSRFToken, publicKey)
    if (decoded.id.toString() === req.cookies.uid) {
      // console.log(chalk.cyan('decoded token: ') + JSON.stringify(decoded, null, 4))
      next()
    } else {
      throw new Error('Invalid token')
    }
  } catch (error) {
    console.error('decode error', error)
    res.status(401)
    res.send({
      code: 1,
      message: 'Unauthorized',
      data: null,
    })
  }
}
