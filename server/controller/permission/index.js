export default class{
    static async permission_require(req, res, next){
        let username = req.query.username
        let user = req.params.username
        if(!!req.session.username && req.session.username == username){
            next()
        }else if(!!req.session.username){
            next()
        }else{
            return res.redirect('/')
        }
    }
}