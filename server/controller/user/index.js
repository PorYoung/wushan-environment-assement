import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { inflate } from 'zlib';
import { userInfo } from 'os';

export default class{
    static async fn_login_index(req, res, next) {
        if(!!req.session.username){
            return res.render('app',{
                username: req.session.username
            })
        }
        return res.render('app',{
            username: null
        })
    }
    static async fn_login_handle(req, res, next) {
        let {username, password} = req.body
        if(!!username && !!username.match(/(DRC)|(BLR)|(FB)|(WA)|(EPB)|(Manager)/)){
            password = crypto.createHash("sha1").update(password).digest("hex")
            let info = await db.user.findOne({username: username})
            if(!!info && info.password == password){
                req.session.username = username
                return res.send({
                    status: '1',
                    username: req.session.username
                })
            }else{
                return res.send('-1')
            }
        }else{
            return res.send('-1')
        }
        return res.send({
            status: '1',
            username: req.session.username
        })
    }

    static async fn_password_update(req, res, next){
        let userinfo = req.body
        if(!!userinfo && !!userinfo.username && userinfo.username === "Manager"){
            userinfo.password = crypto.createHash("sha1").update(userinfo.password).digest("hex")
            let info = await db.user.findOne({username: 'Manager'})
            if(!!info && info.password === userinfo.password){
                info = await db.user.findOne({username: info.updateUsername})
                if(!!info && userInfo.updatePassword){
                    userinfo.updatePassword = crypto.createHash("sha1").update(userinfo.updatePassword).digest("hex")
                    await db.user.findOneAndUpdate({username: userinfo.updateUsername},{password: userinfo.updatePassword})
                    return res.send('1')
                }
            }
        }
        return res.send('-1')
    }

    static async fn_password_initial(req, res, next){
        let userinfo = req.body
        if(!!userinfo && !!userinfo.username && userinfo.username === "Manager"){
            userinfo.password = crypto.createHash("sha1").update(userinfo.password).digest("hex")
            let info = await db.user.findOne({username: 'Manager'})
                if(!!info && info.password === userinfo.password){
                let initPassword = crypto.createHash("sha1").update("123456").digest("hex")
                await db.user.updateMany({},{password: initPassword})
                return res.send('1')
            }
        }
        return res.send('-1')
    }

    static async fn_logout_handle(req, res, next){
        req.session.username = undefined
        return res.redirect('/')
    }

    static async permission_require(req, res, next){
        return res.send('1')
    }

    static async user_page_load(req, res, next) {
        let username = req.session.username
        username = username.toUpperCase()
        fs.createReadStream(path.join(__dirname + '../../../views/'+ username +'.html')).pipe(res)
    }

    static async statistics_submit(req, res, next){
        let data = req.body,
            username = req.session.username
        console.log(data)
        console.log(username)
        if(!data || !username){
            return res.send('-1')
        }else{
            let time = new Date()
            switch(username.toUpperCase()){
                case 'BLR':{
                    let info = await db.BLR.findOne({statisticsDate: data.EvaluationOfLandResources.statisticsDate},{_id:0})
                    if(!info){
                        await db.BLR.create({
                            submitDate: time,
                            statisticsDate: data.EvaluationOfLandResources.statisticsDate,
                            EvaluationOfLandResources: data.EvaluationOfLandResources
                        })
                    }else{
                        if(!!info.EvaluationOfLandResources)
                        await db.log.create({
                            date: time,
                            username: 'BLR',
                            statistics: info
                        })
                        await db.BLR.findOneAndUpdate({statisticsDate: data.EvaluationOfLandResources.statisticsDate},{
                            submitDate: time,
                            EvaluationOfLandResources: data.EvaluationOfLandResources,
                        })
                    }
                    info = await db.BLR.findOne({statisticsDate: data.UtilizationEfficiencyOfLandResources.statisticsDate})
                    if(!info){
                        await db.BLR.create({
                            submitDate: time,
                            statisticsDate: data.UtilizationEfficiencyOfLandResources.statisticsDate,
                            UtilizationEfficiencyOfLandResources: data.UtilizationEfficiencyOfLandResources
                        })
                    }else{
                        if(!!info.UtilizationEfficiencyOfLandResources)
                        await db.log.create({
                            date: time,
                            username: 'BLR',
                            statistics: info
                        })
                        await db.BLR.findOneAndUpdate({statisticsDate: data.UtilizationEfficiencyOfLandResources.statisticsDate},{
                            submitDate: time,
                            UtilizationEfficiencyOfLandResources: data.UtilizationEfficiencyOfLandResources,
                        })
                    }
                    info = await db.BLR.findOne({statisticsDate: data.EvaluationOfUrbanizationArea.statisticsDate})
                    if(!info){
                        await db.BLR.create({
                            submitDate: time,
                            statisticsDate: data.EvaluationOfUrbanizationArea.statisticsDate,
                            EvaluationOfUrbanizationArea: data.EvaluationOfUrbanizationArea
                        })
                    }else{
                        if(!!info.EvaluationOfUrbanizationArea)
                        await db.log.create({
                            date: time,
                            username: 'BLR',
                            statistics: info
                        })
                        await db.BLR.findOneAndUpdate({statisticsDate: data.EvaluationOfUrbanizationArea.statisticsDate},{
                            submitDate: time,
                            EvaluationOfUrbanizationArea: data.EvaluationOfUrbanizationArea,
                        })
                    }
                    info = await db.BLR.findOne({statisticsDate: data.EvaluationOfEcological.statisticsDate})
                    if(!info){
                        await db.BLR.create({
                            submitDate: time,
                            statisticsDate: data.EvaluationOfEcological.statisticsDate,
                            EvaluationOfEcological: data.EvaluationOfEcological
                        })
                    }else{
                        if(!!info.EvaluationOfEcological)
                        await db.log.create({
                            date: time,
                            username: 'BLR',
                            statistics: info
                        })
                        await db.BLR.findOneAndUpdate({statisticsDate: data.EvaluationOfEcological.statisticsDate},{
                            submitDate: time,
                            EvaluationOfEcological: data.EvaluationOfEcological,
                        })
                    }
                    break
                }
                case 'EPB':{
                    let info = await db.EPB.findOne({statisticsDate: data.EmissionIntensityOfPollutants.statisticsDate},{_id:0})
                    if(!info){
                        await db.EPB.create({
                            submitDate: time,
                            statisticsDate: data.EmissionIntensityOfPollutants.statisticsDate,
                            EmissionIntensityOfPollutants: data.EmissionIntensityOfPollutants
                        })
                    }else{
                        if(!!info.EmissionIntensityOfPollutants)
                        await db.log.create({
                            date: time,
                            username: 'EPB',
                            statistics: info
                        })
                        await db.EPB.findOneAndUpdate({statisticsDate: data.EmissionIntensityOfPollutants.statisticsDate},{
                            submitDate: time,
                            EmissionIntensityOfPollutants: data.EmissionIntensityOfPollutants,
                        })
                    }
                    info = await db.EPB.findOne({statisticsDate: data.EvaluationOfUrbanizationArea.statisticsDate},{_id:0})
                    if(!info){
                        await db.EPB.create({
                            submitDate: time,
                            statisticsDate: data.EvaluationOfUrbanizationArea.statisticsDate,
                            EvaluationOfUrbanizationArea: data.EvaluationOfUrbanizationArea
                        })
                    }else{
                        if(!!info.EvaluationOfUrbanizationArea)
                        await db.log.create({
                            date: time,
                            username: 'EPB',
                            statistics: info
                        })
                        await db.EPB.findOneAndUpdate({statisticsDate: data.EvaluationOfUrbanizationArea.statisticsDate},{
                            submitDate: time,
                            EvaluationOfUrbanizationArea: data.EvaluationOfUrbanizationArea,
                        })
                    }
                    info = await db.EPB.findOne({statisticsDate: data.EvaluationOfEnvironment.statisticsDate},{_id:0})
                    if(!info){
                        await db.EPB.create({
                            submitDate: time,
                            statisticsDate: data.EvaluationOfEnvironment.statisticsDate,
                            EvaluationOfEnvironment: data.EvaluationOfEnvironment
                        })
                    }else{
                        if(!!info.EvaluationOfEnvironment)
                        await db.log.create({
                            date: time,
                            username: 'EPB',
                            statistics: info
                        })
                        await db.EPB.findOneAndUpdate({statisticsDate: data.EvaluationOfEnvironment.statisticsDate},{
                            submitDate: time,
                            EvaluationOfEnvironment: data.EvaluationOfEnvironment,
                        })
                    }
                    break
                }
                case 'FB':{
                    let info = await db.FB.findOne({statisticsDate: data.EvaluationOfEcological.statisticsDate},{_id:0})
                    if(!info){
                        await db.FB.create({
                            submitDate: time,
                            statisticsDate: data.EvaluationOfEcological.statisticsDate,
                            EvaluationOfEcological: data.EvaluationOfEcological
                        })
                    }else{
                        if(!!info.EvaluationOfEcological)
                        await db.log.create({
                            date: time,
                            username: 'FB',
                            statistics: info
                        })
                        await db.FB.findOneAndUpdate({statisticsDate: data.EvaluationOfEcological.statisticsDate},{
                            submitDate: time,
                            EvaluationOfEcological: data.EvaluationOfEcological,
                        })
                    }
                    info = await db.FB.findOne({statisticsDate: data.EvaluationOfKeyEcologicalFunctionArea.statisticsDate},{_id:0})
                    if(!info){
                        await db.FB.create({
                            submitDate: time,
                            statisticsDate: data.EvaluationOfKeyEcologicalFunctionArea.statisticsDate,
                            EvaluationOfKeyEcologicalFunctionArea: data.EvaluationOfKeyEcologicalFunctionArea
                        })
                    }else{
                        if(!!info.EvaluationOfKeyEcologicalFunctionArea)
                        await db.log.create({
                            date: time,
                            username: 'FB',
                            statistics: info
                        })
                        await db.FB.findOneAndUpdate({statisticsDate: data.EvaluationOfKeyEcologicalFunctionArea.statisticsDate},{
                            submitDate: time,
                            EvaluationOfKeyEcologicalFunctionArea: data.EvaluationOfKeyEcologicalFunctionArea,
                        })
                    }
                    info = await db.FB.findOne({statisticsDate: data.EcologicalQuality.statisticsDate},{_id:0})
                    if(!info){
                        await db.FB.create({
                            submitDate: time,
                            statisticsDate: data.EcologicalQuality.statisticsDate,
                            EcologicalQuality: data.EcologicalQuality
                        })
                    }else{
                        if(!!info.EcologicalQuality)
                        await db.log.create({
                            date: time,
                            username: 'FB',
                            statistics: info
                        })
                        await db.FB.findOneAndUpdate({statisticsDate: data.EcologicalQuality.statisticsDate},{
                            submitDate: time,
                            EcologicalQuality: data.EcologicalQuality,
                        })
                    }
                    break
                }
                case 'WA':{
                    let info = await db.WA.findOne({statisticsDate: data.EvaluationOfWarterResources.statisticsDate},{_id:0})
                    if(!info){
                        await db.WA.create({
                            submitDate: time,
                            statisticsDate: data.EvaluationOfWarterResources.statisticsDate,
                            EvaluationOfWarterResources: data.EvaluationOfWarterResources
                        })
                    }else{
                        if(!!info.EvaluationOfWarterResources)
                        await db.log.create({
                            date: time,
                            username: 'WA',
                            statistics: info
                        })
                        await db.WA.findOneAndUpdate({statisticsDate: data.EvaluationOfWarterResources.statisticsDate},{
                            submitDate: time,
                            EvaluationOfWarterResources: data.EvaluationOfWarterResources,
                        })
                    }
                    info = await db.WA.findOne({statisticsDate: data.UtilizationEfficiencyOfWarterResources.statisticsDate},{_id:0})
                    if(!info){
                        await db.WA.create({
                            submitDate: time,
                            statisticsDate: data.UtilizationEfficiencyOfWarterResources.statisticsDate,
                            UtilizationEfficiencyOfWarterResources: data.UtilizationEfficiencyOfWarterResources
                        })
                    }else{
                        if(!!info.UtilizationEfficiencyOfWarterResources)
                        await db.log.create({
                            date: time,
                            username: 'WA',
                            statistics: info
                        })
                        await db.WA.findOneAndUpdate({statisticsDate: data.UtilizationEfficiencyOfWarterResources.statisticsDate},{
                            submitDate: time,
                            UtilizationEfficiencyOfWarterResources: data.UtilizationEfficiencyOfWarterResources,
                        })
                    }
                    break
                }
            }
            return res.send('1')
        }
    }

    static async statistics_get(req, res, next){
        let statisticsDate = req.query.statisticsDate
        if(!statisticsDate){
            return res.send('-1')
        }else{
            let BLRs = await db.BLR.findOne({statisticsDate: statisticsDate}),
                EPBs = await db.EPB.findOne({statisticsDate: statisticsDate}),
                WAs = await db.WA.findOne({statisticsDate: statisticsDate}),
                FBs = await db.FB.findOne({statisticsDate: statisticsDate}),
                data = {
                    BLR: BLRs,
                    EPB: EPBs,
                    WA: WAs,
                    FB: FBs
                }
                return res.send(data)
        }
    }

    static async statistic_get(req, res, next){
        let queryString = req.query.queryString,
            statisticsDate = req.query.statisticsDate
        if(!!queryString && !!statisticsDate){
            let data = null
            switch(queryString){
                case 'EvaluationOfLandResources':
                case 'UtilizationEfficiencyOfLandResources':{
                    data = await db.BLR.findOne({statisticsDate: statisticsDate},{_id: 0})
                    break
                }
                case 'EvaluationOfWarterResources':
                case 'UtilizationEfficiencyOfWarterResources':{
                    data = await db.WA.findOne({statisticsDate: statisticsDate},{_id: 0})
                    break
                }
                case 'EvaluationOfEnvironment':
                case 'EvaluationOfUrbanizationArea':
                case 'EmissionIntensityOfPollutants':{
                    data = await db.EPB.findOne({statisticsDate: statisticsDate},{_id: 0})
                    break
                }
                case 'EvaluationOfKeyEcologicalFunctionArea':
                case 'EvaluationOfEcological':
                case 'EcologicalQuality':{
                    data = await db.FB.findOne({statisticsDate: statisticsDate},{_id: 0})
                    break
                }
            }
            if(!!data && !!data[queryString]){
                return res.send(data[queryString])
            }else{
                return res.send('-2')
            }
        }else{
            return res.send('-1')
        }
    }
}