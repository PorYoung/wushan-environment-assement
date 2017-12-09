import express from 'express'

import Permission from '../../controller/permission'
import User from '../../controller/user'

const apiRouter = express.Router()

apiRouter
    .post('/login', User.fn_login_handle)
    .get('/permission',Permission.permission_require ,User.permission_require)

export default apiRouter