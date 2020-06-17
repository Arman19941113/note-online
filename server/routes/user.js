const express = require('express')
const router = express.Router()
const chalk = require('chalk')

const { User } = require('../model')

router.get('/info', function (req, res) {
    User.findAll({
        raw: true,
        where: {
            id: req.cookies.uid
        }
    }).then(users => {
        if (users.length) {
            console.log()
            console.log(chalk.cyan('Find users: ') + JSON.stringify(users, null, 4))
            console.log()
            res.send({
                code: 0,
                message: 'Success',
                data: users[0]
            })
        } else {
            console.log()
            console.log(chalk.cyan('Not find users'))
            console.log()
            res.status(403)
            res.send({
                code: 1,
                message: 'Failed',
                data: null
            })
        }
    })
})

router.get('/logout', function (req, res) {
    res.clearCookie('token')
    res.clearCookie('uid')
    res.send({
        code: 0,
        message: 'Success',
        data: null
    })
})

module.exports = router
