import express from 'express'

import User from '../../controller/user'

const router = express.Router()

router
    .get('/', User.fn_login_index)

export default router