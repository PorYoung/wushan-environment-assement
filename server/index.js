import express from 'express'
import session from 'express-session'
import http from 'http'
import db from './model/mongoose'
import router from './router'

// 设置为全局数据库连接句柄
global.db = db

const app = express()
const server = http.createServer(app)
server.listen(8878)

//指定模板引擎和模板位置
app.set("view engine", "ejs")
app.set("views", __dirname + "/views")

//cookie、session配置
app.use(session({
	secret: 'PorYoung',
	cookie: {
		maxAge: 60 * 1000 * 30
	},
	resave: false,
	saveUninitialized: true,
}))

app.use(router)

app.get('/index',(req,res) => {
    res.send("hello world")
})


module.exports = app