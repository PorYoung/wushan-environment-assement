export default class{
    static async permission_require(req, res, next){
        let username = req.query.username
        if(!!req.session.username && req.session.username == username){
            next()
        }else{
            return res.send('-1')
        }
    }
}