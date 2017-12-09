function EvaluationOfEnvironmentAir(data){
    var D = {},
        S = {
            "so2v": 60,
            "no2v": 40,
            "pm10v": 70,
            "cov": 4,
            "pm2d5v": 35
        },
        RMax = null             //大气污染物浓度超标指数
    for(key in data){
        if(data.hasOwnProperty(key)){
            var v = parseFloat(data[key])
            if(isNaN(v)){
                return false
            }
            D[key] = v
            var tmp = D[key] / S[key] - 1
            if(RMax == null || tmp > RMax){
                RMax = tmp
            }
        }
    }
    if(config.data.hasOwnProperty('EvaluationOfEnvironment')){
        Object.assign(config.data.EvaluationOfEnvironment, {EvaluationOfEnvironmentAir: RMax})
    }else{
        config.data.EvaluationOfEnvironment = {
            EvaluationOfEnvironmentAir: RMax
        }
    }
    return true
}
function EvaluationOfEnvironmentWater(data){
    var D = {},
        Sr = {
            "dov": 5,
            "codmnv": 6,
            "bod5v": 4,
            "codcrv": 20,
            "nh3nv": 1.0,
            "tnv": 1.0,
            "tpv": 0.2
        },
        Sl = {
            "dov": 5,
            "codmnv": 6,
            "bod5v": 4,
            "codcrv": 20,
            "nh3nv": 1.0,
            "tnv": 1.0,
            "tpv": 0.05
        },
        RrMax = null,
        RlMax = null
    for(key in data){
        if(data.hasOwnProperty(key)){
            var v = parseFloat(data[key])
            if(isNaN(v)){
                return false
            }
            D[key] = v
            if(key == "dov"){
                var tmpr = 1 / (D[key] / Sr[key]) - 1,
                    tmpl = 1 / (D[key] / Sl[key]) - 1
                if(RrMax == null || tmpr > RrMax){
                    RrMax = tmpr
                }
                if(RlMax == null || tmpl > RlMax){
                    RlMax = tmpl
                }
            }else{
                var tmpr = D[key] / Sr[key] - 1,
                    tmpl = D[key] / Sl[key] - 1
                if(RrMax == null || tmpr > RrMax){
                    RrMax = tmpr
                }
                if(RlMax == null || tmpl > RlMax){
                    RlMax = tmpl
                }
            }
        }
    }
    var RMax = (RrMax + RlMax) / 2     //水污染物浓度超标指数
    if(config.data.hasOwnProperty('EvaluationOfEnvironment')){
        Object.assign(config.data.EvaluationOfEnvironment, {EvaluationOfEnvironmentWarter: RMax})
    }else{
        config.data.EvaluationOfEnvironment = {
            EvaluationOfEnvironmentWater: RMax
        }
    }
    return true
}
function EvaluationOfEnvironment(){
    if(!config.data.hasOwnProperty('EvaluationOfEnvironment') || !config.data.EvaluationOfEnvironment.hasOwnProperty('EvaluationOfEnvironmentWater') || !config.data.EvaluationOfEnvironment.hasOwnProperty('EvaluationOfEnvironmentAir')){
        return false
    }else{
        var a = config.data.EvaluationOfEnvironment.EvaluationOfEnvironmentAir,
            w = config.data.EvaluationOfEnvironment.EvaluationOfEnvironmentWarter,
            R = a > w?a:w
        if(R > 0){
            Object.assign(config.data.EvaluationOfEnvironment, {EvaluationOfEnvironment: '污染物浓度超标'})
        }else if(R > -0.2){
            Object.assign(config.data.EvaluationOfEnvironment, {EvaluationOfEnvironment: '污染物浓度接近超标'})
        }else{
            Object.assign(config.data.EvaluationOfEnvironment, {EvaluationOfEnvironment: '污染物浓度未超标'})
        }
    }
    return true
}

function EvaluationOfUrbanizationAreaWater(data){
    var D = {}
    for(key in data){
        if(data.hasOwnProperty(key)){
            if(key != 'chengshishuihuanjingpingjiaquyuquyu'){
                var v = parseFloat(data[key])
                if(isNaN(v)){
                    return false
                }
                D[key] = v
            }else{
                D[key] = data[key]
            }
        }
    }
    var Den = D.heichoushuitishicechangdu / D.chengshiyujianzhizhenzongmianji,
        L = D.zhongduheichoushuitichangdu / D.heichoushuitishicechangdu,
        eva = null
    if(!D.chengshishuihuanjingpingjiaquyu){
        //优化开发区域
        if(Den < 100){
            if(L < 0.25){
                eva = '轻度污染'
            }else{
                eva = '中度污染'
            }
        }else if(Den >= 100 && D < 500){
            if(L < 0.25){
                eva = '轻度污染'
            }else if(L < 0.5){
                eva = '中度污染'
            }else{
                eva = '重度污染'
            }
        }else{
            if(L < 0.25){
                eva = '中度污染'
            }else{
                eva = '重度污染'
            }
        }
    }else{
        //重点开发区域
        if(Den < 300){
            if(L < 0.33){
                eva = '轻度污染'
            }else{
                eva = '中度污染'
            }
        }else if(Den >= 300 && D < 800){
            if(L < 0.33){
                eva = '轻度污染'
            }else if(L < 0.66){
                eva = '中度污染'
            }else{
                eva = '重度污染'
            }
        }else{
            if(L < 0.33){
                eva = '中度污染'
            }else{
                eva = '重度污染'
            }
        }
    }
    if(config.data.hasOwnProperty('EvaluationOfUrbanizationArea')){
        Object.assign(config.data.EvaluationOfUrbanizationArea, {EvaluationOfUrbanizationAreaWater: eva})
    }else{
        config.data.EvaluationOfUrbanizationArea = {
            EvaluationOfUrbanizationAreaWater: eva
        }
    }
    return true
}

function EvaluationOfUrbanizationAreaAir(data){
    var D = {}
    for(key in data){
        if(data.hasOwnProperty(key)){
            if(key != 'chengshishuihuanjingpingjiaquyuquyu' && key != 'hexinchengshizhuchengqu'){
                var v = parseFloat(data[key])
                if(isNaN(v)){
                    return false
                }
                D[key] = v
            }else{
                D[key] = data[key]
            }
        }
    }
    var eva = null
    if(!D.chengshishuihuanjingpingjiaquyu){
        //优化开发区域
        if(D.hexinchengshizhuchengqu){
            //核心城市
            if(D.pm2d5nianchaobiaotianshu < 30){
                eva = '轻度污染'
            }else if(D.pm2d5nianchaobiaotianshu < 90){
                eva = '中度污染'
            }else if(D.pm2d5nianchaobiaotianshu < 180){
                eva = '重度污染'
            }else{
                eva = '严重污染'
            }
        }else{
            if(D.pm2d5nianchaobiaotianshu < 60){
                eva = '轻度污染'
            }else if(D.pm2d5nianchaobiaotianshu < 120){
                eva = '中度污染'
            }else if(D.pm2d5nianchaobiaotianshu < 210){
                eva = '重度污染'
            }else{
                eva = '严重污染'
            }
        }
    }else{
        //重点开发区域
        if(D.hexinchengshizhuchengqu){
            //核心城市
            if(D.pm2d5nianchaobiaotianshu < 60){
                eva = '轻度污染'
            }else if(D.pm2d5nianchaobiaotianshu < 120){
                eva = '中度污染'
            }else if(D.pm2d5nianchaobiaotianshu < 210){
                eva = '重度污染'
            }else{
                eva = '严重污染'
            }
        }else{
            if(D.pm2d5nianchaobiaotianshu < 120){
                eva = '轻度污染'
            }else if(D.pm2d5nianchaobiaotianshu < 180){
                eva = '中度污染'
            }else if(D.pm2d5nianchaobiaotianshu < 240){
                eva = '重度污染'
            }else{
                eva = '严重污染'
            }
        }
    }

    if(config.data.hasOwnProperty('EvaluationOfUrbanizationArea')){
        Object.assign(config.data.EvaluationOfUrbanizationArea, {EvaluationOfUrbanizationAreaAir: eva})
    }else{
        config.data.EvaluationOfUrbanizationArea = {
            EvaluationOfUrbanizationAreaAir: eva
        }
    }
}

function  EvaluationOfUrbanizationArea(){
    if(!config.data.hasOwnProperty('EvaluationOfUrbanizationArea') || !config.data.EvaluationOfUrbanizationArea.hasOwnProperty('EvaluationOfUrbanizationAreaWater') || !config.data.EvaluationOfUrbanizationArea.hasOwnProperty('EvaluationOfUrbanizationAreaAir')){
        return false
    }else{
        var a = config.data.EvaluationOfUrbanizationArea.EvaluationOfUrbanizationAreaAir,
            b = config.data.EvaluationOfUrbanizationArea.EvaluationOfUrbanizationAreaWater
        if(a === '严重污染' || (a === '重度污染' && b === '重度污染')){
            Object.assign(config.data.EvaluationOfUrbanizationArea, {EvaluationOfUrbanizationArea: '水气环境黑灰指数超载'})
        }else if(b === '重度污染' || a === '重度污染' || (a === '中度污染' && b === '中度污染')){
            Object.assign(config.data.EvaluationOfUrbanizationArea, {EvaluationOfUrbanizationArea: '水气环境黑灰指数临界超载'})
        }else{
            Object.assign(config.data.EvaluationOfUrbanizationArea, {EvaluationOfUrbanizationArea: '水气环境黑灰指数未超载'})            
        }
    }
    return true
}

function EmissionIntensityOfPollutantsWaterO(data){
    var D = {}
    for(key in data){
        if(data.hasOwnProperty(key)){
            var v = parseFloat(data[key])
            if(isNaN(v)){
                return false
            }
            D[key] = v
        }
    }
    var t1 = D.pingjianianxingzhengquyuneihuaxuexuyangliang / D.pingjianianGDP,
        t2 = D.jizhunnianxingzhengquyuneihuaxuexuyangliang / D.jizhunnianGDP,
        t3 = t1 / t2,
        t4 = Math.pow(t3, Math.pow((D.pingjianian - D.jizhunnian), -1)),
        res = t4 - 1
        if(config.data.hasOwnProperty('EmissionIntensityOfPollutants')){
            Object.assign(config.data.EmissionIntensityOfPollutants, {EmissionIntensityOfPollutantsWaterO: res})
        }else{
            config.data.EmissionIntensityOfPollutants = {
                EmissionIntensityOfPollutantsWaterO: res
            }
        }
        return true
}

function EmissionIntensityOfPollutantsWaterN(data){
    var D = {}
    for(key in data){
        if(data.hasOwnProperty(key)){
            var v = parseFloat(data[key])
            if(isNaN(v)){
                return false
            }
            D[key] = v
        }
    }
    var t1 = D.pingjianianxingzhengquyuneiandanpaifangliang / D.pingjianianGDP,
        t2 = D.jizhunnianxingzhengquneiandanpaifangliang / D.jizhunnianGDP,
        t3 = t1 / t2,
        t4 = Math.pow(t3, Math.pow((D.pingjianian - D.jizhunnian), -1)),
        res = t4 - 1
        if(config.data.hasOwnProperty('EmissionIntensityOfPollutants')){
            Object.assign(config.data.EmissionIntensityOfPollutants, {EmissionIntensityOfPollutantsWaterN: res})
        }else{
            config.data.EmissionIntensityOfPollutants = {
                EmissionIntensityOfPollutantsWaterN: res
            }
        }
        return true
}

function EmissionIntensityOfPollutantsAirSO2(data){
    var D = {}
    for(key in data){
        if(data.hasOwnProperty(key)){
            var v = parseFloat(data[key])
            if(isNaN(v)){
                return false
            }
            D[key] = v
        }
    }
    var t1 = D.pingjianianxingzhengquyuneieryanghualiupaifangliang / D.pingjianianGDP,
        t2 = D.jizhunnianxingzhengquyuneieryanghualiupaifangliang / D.jizhunnianGDP,
        t3 = t1 / t2,
        t4 = Math.pow(t3, Math.pow((D.pingjianian - D.jizhunnian), -1)),
        res = t4 - 1
        if(config.data.hasOwnProperty('EmissionIntensityOfPollutants')){
            Object.assign(config.data.EmissionIntensityOfPollutants, {EmissionIntensityOfPollutantsAirSO2: res})
        }else{
            config.data.EmissionIntensityOfPollutants = {
                EmissionIntensityOfPollutantsAirSO2: res
            }
        }
        return true
}
function EmissionIntensityOfPollutantsAirNO(data){
    var D = {}
    for(key in data){
        if(data.hasOwnProperty(key)){
            var v = parseFloat(data[key])
            if(isNaN(v)){
                return false
            }
            D[key] = v
        }
    }
    var t1 = D.pingjianianxingzhengquyuneidanyanghuawupaifangliang / D.pingjianianGDP,
        t2 = D.jizhunnianxingzhengquyuneidanyanghuawupaifangliang / D.jizhunnianGDP,
        t3 = t1 / t2,
        t4 = Math.pow(t3, Math.pow((D.pingjianian - D.jizhunnian), -1)),
        res = t4 - 1
        if(config.data.hasOwnProperty('EmissionIntensityOfPollutants')){
            Object.assign(config.data.EmissionIntensityOfPollutants, {EmissionIntensityOfPollutantsAirNO: res})
        }else{
            config.data.EmissionIntensityOfPollutants = {
                EmissionIntensityOfPollutantsAirNO: res
            }
        }
        return true
}