import express from 'express'

import pageRouter from './page'
import apiRouter from './api'

const router = express.Router()

router
    .use('/api', apiRouter)
    .use(pageRouter)

export default router
