const fs = require('fs')
const path = require('path')
const express = require('express')
const router = express.Router()
const axios = require('axios')
const chalk = require('chalk')
const jwt = require('jsonwebtoken')

const { User } = require('../model')

const clientId = '3d2ca9a4f7a56795cd83'
const clientSecret = '83e4978bfcc491f68c8d2fdf2b1823167c1e0c7c'
const homePage = 'http://127.0.0.1:3000'
const redirectUri = 'http://127.0.0.1:3000/auth/github/redirect'

router.get('/github', (req, res) => {
    const url = 'https://github.com/login/oauth/authorize?'
        + `client_id=${clientId}`
        + `&redirect_uri=${redirectUri}`
    res.redirect(url)
})

router.get('/github/redirect', async (req, res) => {
    const code = req.query.code
    console.log()
    console.log(chalk.cyan('authorization code: ') + code)
    console.log()

    try {
        // 获取 token
        const tokenResponse = await axios({
            method: 'post',
            url: 'https://github.com/login/oauth/access_token?'
                + `code=${code}`
                + `&client_id=${clientId}`
                + `&client_secret=${clientSecret}`,
            headers: {
                accept: 'application/json'
            }
        })
        const accessToken = tokenResponse.data.access_token
        console.log()
        console.log(chalk.cyan('access token: ') + accessToken)
        console.log()

        // 获取用户信息
        const result = await axios({
            method: 'get',
            url: `https://api.github.com/user`,
            headers: {
                accept: 'application/json',
                Authorization: `token ${accessToken}`
            }
        })
        // 有时候 github 会抽风 获取用户信息超时
        // const result = {
        //     data: {
        //         id: 35905177,
        //         name: 'Arman19941113',
        //         avatar_url: 'https://avatars0.githubusercontent.com/u/35905177?v=4'
        //     }
        // }

        const userData = {
            githubId: result.data.id,
            name: result.data.name,
            avatar: result.data.avatar_url
        }
        console.log()
        console.log(chalk.cyan('github user: ') + JSON.stringify(userData, null, 4))
        console.log()

        // 设置 cookie，如果不存在用户则新增用户
        let currentUser

        const users = await User.findAll({
            raw: true,
            where: { githubId: userData.githubId }
        })
        if (users.length) {
            currentUser = users[0]
            console.log()
            console.log(chalk.cyan('Find users: ') + JSON.stringify(users, null, 4))
            console.log()
        } else {
            const newUser = await User.create(userData)
            currentUser = newUser.dataValues
            console.log()
            console.log(chalk.cyan('Create new user: ') + JSON.stringify(currentUser, null, 4))
            console.log()
        }

        const payload = {
            id: currentUser.id
        }
        const privateKey = fs.readFileSync(path.resolve('rsa/jwt.pem'))
        const token = jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '10 days'
        })
        console.log()
        console.log(chalk.cyan('Token: ') + token)
        console.log()

        res.cookie('note_online_csrftoken', token, {
            sameSite: 'Lax',
            maxAge: 864000
        })
        res.cookie('uid', currentUser.id, {
            httpOnly: true,
            sameSite: 'Lax',
            maxAge: 864000
        })
        res.redirect(homePage)
    } catch (error) {
        res.status(403)
        res.send({
            error,
            code: 0,
            message: 'Unexpected error',
            data: null
        })
    }
})

module.exports = router
