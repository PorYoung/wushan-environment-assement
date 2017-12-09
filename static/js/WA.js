function EvaluationOfWarterResources(data){
    var D = {}
    for(key in data){
        if(data.hasOwnProperty(key)){
            if(key != "dixiashuishifouchaocai"){
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
    if(D.dixiashuishifouchaocai || D.yongshuiliang > D.yongshuiliangkongzhizhibiao || D.dixiashuigongshuizongliang > D.dixiashuigongshuizhibiao){
        Object.assign(config.data, {EvaluationOfWarterResourcesResult: "水资源超载"})
        return true
    }else if(D.yongshuiliang > 0.9 * D.yongshuiliangkongzhizhibiao || D.dixiashuigongshuizongliang > 0.9 * D.dixiashuigongshuizhibiao){
        Object.assign(config.data, {EvaluationOfWarterResourcesResult: "水资源临界超载"})
        return true
    }else{
        Object.assign(config.data, {EvaluationOfWarterResourcesResult: "水资源不超载"})
        return true
    }
}

function UtilizationEfficiencyOfWarterResources(data){
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
    var t1 = D.jizhunnianxingzhengquyuneiyongshuiliang / D.jizhunnianGDP,
        t2 = D.pingjianianxingzhengquyuneiyongshuiliang / D.pingjianianGDP,
        t3 = t1 / t2,
        t4 = Math.pow(t3, Math.pow((D.pingjianian - D.jizhunnian), -1)),
        res = t4 - 1
    Object.assign(config.data,{UtilizationEfficiencyOfWarterResourcesResult: res})
    return true
}