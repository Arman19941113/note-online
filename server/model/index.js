const Sequelize = require('sequelize')

const sequelize = new Sequelize('note_online', 'root', '19941113', {
    host: '127.0.0.1',
    dialect: 'mysql'
})

// 数据模型 对应一个表
const User = sequelize.define('user', {
    githubId: { type: Sequelize.INTEGER },
    name: { type: Sequelize.STRING },
    avatar: { type: Sequelize.STRING }
})
const Note = sequelize.define('note', {
    uid: { type: Sequelize.INTEGER },
    content: { type: Sequelize.STRING }
})

module.exports = { sequelize, User, Note }
