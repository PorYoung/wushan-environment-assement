function EvaluationOfEcological(data){
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
    var Ad = D.zhongduyishangshuituliushimianji + D.zhongduyishangtudishahuamianji + D.zhongduyishangyanzihuamianji + D.zhongduyishangshimohuamianji,
        At = D.pingjiaquyutudimianji,
        H = Ad / At
    if(H > 0.1){
        Object.assign(config.data, {EvaluationOfEcological: '生态系统健康度低'})
    }else if(H > 0.05){
        Object.assign(config.data, {EvaluationOfEcological: '生态系统健康度中等'})   
    }else{
        Object.assign(config.data, {EvaluationOfEcological: '生态系统健康度高'})        
    }
    return true
}

function EvaluationOfKeyEcologicalFunctionArea(data){
    var D = parseFloat(data),
        obj = {
            EvaluationOfKeyEcologicalFunctionArea: null
        }
    if(isNaN(D)){
        return false
    }
    if(D > 12.5){
        obj.EvaluationOfKeyEcologicalFunctionArea = "水土保持功能高"
    }else if(D <= 12.5 && D >= 1){
        obj.EvaluationOfKeyEcologicalFunctionArea = "水土保持功能高中等"
    }else{
        obj.EvaluationOfKeyEcologicalFunctionArea = "水土保持功能高低"
    }
    Object.assign(config.data, obj)
    return true
}

function EcologicalQualityLincao(data){
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
    var t1 = D.pingjianianxingzhengquyuneilincaofugailv / D.jizhunnianingzhengquyuneilincaofugailv,
        t2 = Math.pow(t1, Math.pow((D.pingjianian - D.jizhunnian), -1)),
        res = t2 - 1
        if(config.data.hasOwnProperty('EcologicalQuality')){
            Object.assign(config.data.EcologicalQuality, {EcologicalQualityLincao: res})
        }else{
            config.data.EcologicalQuality = {
                EcologicalQualityLincao: res
            }
        }
        return true
}