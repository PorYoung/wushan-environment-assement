import express from 'express'

import User from '../../controller/user'

const router = express.Router()

router
    .get('/', User.fn_login_index)
    .get('/BLR', async function (req,res) {
        res.render('BLR')
    })
    .get('/WA', async function (req,res) {
        res.render('WA')
    })
    .get('/EPB', async function (req,res) {
        res.render('EPB')
    })
    .get('/FB', async function (req,res) {
        res.render('FB')
    })

export default router