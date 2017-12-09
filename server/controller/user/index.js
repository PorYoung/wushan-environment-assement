import fs from 'fs'
import path from 'path'
export default class{
    static async fn_login_index(req, res, next) {
        return res.render('app')
    }

    static async fn_login_handle(req, res, next) {
        req.session.username = 'BLR'
        return res.send({
            status: '1',
            username: 'BLR'
        })
    }

    static async permission_require(req, res, next){
        return res.send('1')
    }

    static async user_page_load(req, res, next) {
        let username = req.session.username
        username = username.toUpperCase()
        fs.createReadStream(path.join(__dirname + '../../../views/'+ username +'.html')).pipe(res)
    }
}