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
// production
const homePage = 'http://127.0.0.1:3000'
// dev
// const homePage = 'http://127.0.0.1:7777'
const redirectUri = 'http://127.0.0.1:3000/auth/github/redirect'

// github 登录授权
router.get('/github', (req, res) => {
  console.log(chalk.cyan('request github auth'))
  const url = 'https://github.com/login/oauth/authorize?'
    + `client_id=${clientId}`
    + `&redirect_uri=${redirectUri}`
  res.redirect(url)
})

// github 授权成功返回
router.get('/github/redirect', async (req, res) => {
  const code = req.query.code
  console.log(chalk.cyan('github authorization code: ') + code)

  try {
    // 获取 access_token
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://github.com/login/oauth/access_token?'
        + `code=${code}`
        + `&client_id=${clientId}`
        + `&client_secret=${clientSecret}`,
      headers: {
        accept: 'application/json',
      },
    })
    const accessToken = tokenResponse.data.access_token
    console.log(chalk.cyan('access_token: ') + accessToken)

    // 获取 github 用户信息
    const result = await axios({
      method: 'get',
      url: `https://api.github.com/user`,
      headers: {
        accept: 'application/json',
        Authorization: `token ${accessToken}`,
      },
    })
    // 有时候 github 会抽风 获取用户信息超时
    // const result = {
    //   data: {
    //     id: 35905177,
    //     name: 'Arman19941113',
    //     avatar_url: 'https://avatars0.githubusercontent.com/u/35905177?v=4',
    //   },
    // }
    const userData = {
      githubId: result.data.id,
      name: result.data.name,
      avatar: result.data.avatar_url,
    }
    console.log(chalk.cyan('github user info: ') + JSON.stringify(userData, null, 4))

    // 如果不存在用户则新增用户
    let currentUser
    const user = await User.findOne({
      raw: true,
      where: { githubId: userData.githubId },
    })
    if (user !== null) {
      currentUser = user
      console.log(chalk.cyan('Find user: ') + JSON.stringify(user, null, 4))
    } else {
      const newUser = await User.create(userData)
      currentUser = newUser.dataValues
      console.log(chalk.cyan('Create new user: ') + JSON.stringify(currentUser, null, 4))
    }

    // 生成 token
    const payload = {
      id: currentUser.id,
    }
    const privateKey = fs.readFileSync(path.resolve('rsa/rsa_private_key.pem'))
    const token = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '10 days',
    })
    console.log(chalk.cyan('Generate token: ') + token)

    // 设置 cookie
    res.cookie('note_online_csrftoken', token, {
      maxAge: 86400000,
    })
    res.cookie('uid', currentUser.id, {
      httpOnly: true,
      maxAge: 86400000,
    })
    res.redirect(homePage)
  } catch (error) {
    res.status(403)
    res.send({
      error,
      code: 0,
      message: 'Unexpected error',
      data: null,
    })
  }
})

module.exports = router
