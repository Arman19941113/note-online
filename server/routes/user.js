const express = require('express')
const router = express.Router()
const chalk = require('chalk')

const { User } = require('../model')

router.get('/info', function (req, res) {
    const id = req.cookies.uid

    if (id) {
        User.findAll({
            raw: true,
            where: { id }
        }).then(users => {
            if (users.length) {
                console.log()
                console.log(chalk.cyan('Find users: ') + JSON.stringify(users, null, 4))
                console.log()
                res.send(users[0])
            } else {
                console.log()
                console.log(chalk.cyan('Not find users'))
                console.log()
                res.status(403)
                res.send({
                    code: 1,
                    message: 'Unauthorized',
                    data: null
                })
            }
        })
    } else {
        // 未登录
        console.log()
        console.log(chalk.cyan('Not login'))
        console.log()
        res.status(401)
        res.send({
            code: 1,
            message: 'Unauthorized',
            data: null
        })
    }
})

router.get('/logout', function (req, res) {
    res.clearCookie('uid')
    res.send({
        code: 0,
        message: 'Success',
        data: null
    })
})

module.exports = router
