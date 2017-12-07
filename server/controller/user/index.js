export default class{
    static async fn_login_index(req, res, next) {
        return res.render('login')
    }

    static async fn_login_handle(req, res, next) {
        return res.send({
            status: '1',
            username: 'Manager'
        })
    }

    static async fn(req, res, next){
        res.send("???")
    }
}