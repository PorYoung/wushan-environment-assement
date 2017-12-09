import { error } from "util";
import { fail } from "assert";
import { setTimeout } from "timers";

function EvaluationOfLandResources(data){
    var D = parseFloat(data),
        obj = {
            EvaluationOfLandResourcesResult: null
        }
    if(isNaN(D)){
        var closeTips = showTips()
        return setTimeout(function(){
            closeTips()
        },3000)
    }
    if(D > 0){
        obj.EvaluationOfLandResourcesResult = "土地资源压力大"
    }else if(D <= 0 && D >= -0.3){
        obj.EvaluationOfLandResourcesResult = "土地资源压力中等"
    }else{
        obj.EvaluationOfLandResourcesResult = "土地资源压力小"
    }
    Object.assign(config.data, obj)
}

function UtilizationEfficiencyOfLandResources(data){
    var D = {}
    for(key in data){
        if(data.hasOwnProperty(key)){
            var v = parseFloat(data[key])
            if(isNaN(v)){
                var closeTips = showTips()
                return setTimeout(function(){
                    closeTips()
                },3000)
            }
            D[key] = v
        }
    }
    var t1 = D.jizhunnian / D.jizhunnianGDP,
        t2 = D.jizhunnianxingzhengquyuneijiansheyongdimianji / D.pingjianianhoudishinianGDP,
        t3 = t1 / t2,
        t4 = Math.pow(t3, Math.pow((D.pingjianian - D.jizhunnian), -1)),
        res = t4 - 1
    Object.assign(config.data,{UtilizationEfficiencyOfLandResourcesResult: res})
}