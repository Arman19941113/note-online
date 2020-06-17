const express = require('express')
const router = express.Router()
const chalk = require('chalk')

const { Note } = require('../model')

router.get('/', function (req, res) {
    Note.findAll({
        raw: true,
        where: { uid: req.cookies.uid }
    }).then(notes => {
        console.log()
        console.log(chalk.cyan('Find notes: ') + JSON.stringify(notes, null, 4))
        console.log()
        res.send({
            code: 0,
            message: 'Success',
            data: notes
        })
    }).catch(error => {
        res.status(403)
        res.send({
            error,
            code: 1,
            message: 'Failed',
            data: null
        })
    })
})

router.post('/', function (req, res) {
    Note.create({
        uid: req.cookies.uid,
        content: ''
    }).then(data => {
        console.log()
        console.log(chalk.cyan('Create note: ') + JSON.stringify(data.dataValues, null, 4))
        console.log()
        res.status(201)
        res.send({
            code: 0,
            message: 'Success',
            data: data.dataValues
        })
    }).catch(error => {
        res.status(403)
        res.send({
            error,
            code: 1,
            message: 'Failed',
            data: null
        })
    })
})

router.put('/', function (req, res) {
    Note.update({
        content: req.body.content
    }, {
        where: {
            id: req.body.id
        }
    }).then(idList => {
        console.log()
        console.log(chalk.cyan('Update notes id list: ') + JSON.stringify(idList))
        console.log()
        res.status(201)
        res.send({
            code: 0,
            message: 'Success',
            data: idList
        })
    }).catch(error => {
        res.status(403)
        res.send({
            error,
            code: 1,
            message: 'Failed',
            data: null
        })
    })
})

router.delete('/', function (req, res) {
    Note.destroy({
        where: {
            id: req.query.id
        }
    }).then(counts => {
        console.log()
        console.log(chalk.cyan('Delete note counts: ') + counts)
        console.log()
        res.status(204)
        res.send({
            code: 0,
            message: 'Success',
            data: counts
        })
    }).catch(error => {
        res.status(403)
        res.send({
            error,
            code: 1,
            message: 'Failed',
            data: null
        })
    })
})

module.exports = router
