import express from 'express'

import User from '../../controller/user'

const apiRouter = express.Router()

apiRouter
    .post('/login', User.fn_login_handle)

export default apiRouter