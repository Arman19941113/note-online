const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const { sequelize } = require('./model')
sequelize.sync()

const app = express()

// view engine setup
app.set('views', path.resolve('views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// 静态资源请求
app.get('/', function (req, res) {
  res.sendFile(path.resolve('web/index.html'))
})
app.use(express.static(path.resolve('web')))

// 用户登录
app.use('/auth', require('./routes/auth'))

// 处理 AJAX 请求
app.use(function (req, res, next) {
  // const chalk = require('chalk')
  // console.log(chalk.cyan('------headers-------'))
  // console.log(JSON.stringify(req.headers, null, 4))
  // console.log(chalk.cyan('------cookies-------'))
  // console.log(JSON.stringify(req.cookies, null, 4))
  if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
    next()
  } else {
    res.status(403)
    res.send(null)
  }
})
app.use(require('./rsa/validateToken'))
app.use('/user', require('./routes/user'))
app.use('/note', require('./routes/note'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
