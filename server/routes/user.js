const express = require('express')
const router = express.Router()
const chalk = require('chalk')

const { User } = require('../model')

router.get('/info', function (req, res) {
  User.findOne({
    raw: true,
    where: {
      id: req.cookies.uid,
    },
  }).then(user => {
    if (user !== null) {
      console.log(chalk.cyan('Find user: ') + JSON.stringify(user, null, 4))
      res.send({
        code: 0,
        message: 'Success',
        data: user,
      })
    } else {
      console.log(chalk.cyan('Not find users'))
      res.status(403)
      res.send({
        code: 1,
        message: 'Failed',
        data: null,
      })
    }
  })
})

router.get('/logout', function (req, res) {
  res.clearCookie('note_online_csrftoken')
  res.clearCookie('uid')
  res.send({
    code: 0,
    message: 'Success',
    data: null,
  })
})

module.exports = router
