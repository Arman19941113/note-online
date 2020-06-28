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

app.get('/', function (req, res) {
    res.sendFile(path.resolve('web/index.html'))
})
app.use(express.static(path.resolve('web')))

// 只有 ajax 才会接着处理，因为设置了 SameSite=Lax，后面的接口只有同域名下的请求才会携带 cookie
app.use(function (req, res, next) {
    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        next()
    } else {
        res.status(403)
        res.send(null)
    }
})
app.use('/auth', require('./routes/auth'))
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
