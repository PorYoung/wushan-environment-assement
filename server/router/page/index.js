import express from 'express'

import User from '../../controller/user'
import Permission from '../../controller/permission'

const router = express.Router()

router
    .get('/', User.fn_login_index)
    .get('/:user', Permission.permission_require, User.user_page_load)

export default router