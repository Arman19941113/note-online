const path = require('path')

module.exports = function (webpackEnv) {
    if (webpackEnv === 'development') {
        return {
            port: 7777,
            host: 'localhost',
        }
    } else if (webpackEnv === 'production') {
        return {
            outputPath: path.resolve('../server/web'),
            publicPath: '/',
            useSourceMap: false,
        }
    }
}
