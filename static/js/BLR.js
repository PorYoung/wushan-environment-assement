function EvaluationOfLandResources(data){
    var D = parseFloat(data),
        obj = {
            EvaluationOfLandResourcesResult: null
        }
    if(isNaN(D)){
        return false
    }
    if(D > 0){
        obj.EvaluationOfLandResourcesResult = "土地资源压力大"
    }else if(D <= 0 && D >= -0.3){
        obj.EvaluationOfLandResourcesResult = "土地资源压力中等"
    }else{
        obj.EvaluationOfLandResourcesResult = "土地资源压力小"
    }
    Object.assign(config.data, obj)
    return true
}

function UtilizationEfficiencyOfLandResources(data){
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
    var t1 = D.jizhunnianxingzhengquyuneijiansheyongdimianji / D.jizhunnianGDP,
        t2 = D.pingjianianxingzhengquyuneijiansheyongdimianji / D.pingjianianGDP,
        t3 = t1 / t2,
        t4 = Math.pow(t3, Math.pow((D.pingjianian - D.jizhunnian), -1)),
        res = t4 - 1
    Object.assign(config.data,{UtilizationEfficiencyOfLandResourcesResult: res})
    return true
}