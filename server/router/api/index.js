import express from 'express'

import Permission from '../../controller/permission'
import User from '../../controller/user'

const apiRouter = express.Router()

apiRouter
    .post('/login', User.fn_login_handle)
    .post('/submit', User.statistics_submit)
    .post('/initial', User.fn_password_initial)
    .post('/update', User.fn_password_update)
    .get('/statistics', Permission.permission_require, User.statistics_get)
    .get('/statistic', Permission.permission_require, User.statistic_get)
    .get('/logout', User.fn_logout_handle)
    .get('/permission',Permission.permission_require ,User.permission_require)

export default apiRouter