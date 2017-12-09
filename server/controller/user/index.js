export default class{
    static async fn_login_index(req, res, next) {
        return res.render('app')
    }

    static async fn_login_handle(req, res, next) {
        req.session.username = 'Manager'
        return res.send({
            status: '1',
            username: 'Manager'
        })
    }

    static async permission_require(req, res, next){
        return res.send('1')
    }
}