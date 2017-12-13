function EvaluationOfLandResources(data){
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
    var t = D.jiansheyongdimianji  / D.xingzhengquyumianji
    var res
    if(t > 0.15){
        res = '土地开发强度: ' + t + " , 土地资源压力大"
    }else if(t <= 0.15 && t >= 0.1){
        res = '土地开发强度: ' + t + " , 土地资源压力中等"
    }else{
        res = '土地开发强度: ' + t + " , 土地资源压力小"
    }
    return res
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
    return res
}

qRouter.on('/'+config.user+'/submit',function(){
    if(!!config.data){
        var html = "<i class='fa fa-spinner fa-pulse fa-3x fa-fw'></i><span class='sr-only'>Loading...</span>"
        var clearMyLoading = myLoading("Waiting...",html)
        var t = {
            jiansheyongdimianji: config.data.jiansheyongdimianji,
            xingzhengquyumianji: config.data.xingzhengquyumianji    
        }
        if((t.EvaluationOfLandResourcesResult = EvaluationOfLandResources(t)) === false){
            clearMyLoading()
            window.history.back()
            var closeTips = showTips()
            setTimeout(function(){
                closeTips()
            }, 3000)
            return
        }
        t.statisticsDate = config.data.EvaluationOfLandResourcesDateYear
        config.data.EvaluationOfLandResources = {}
        Object.assign(config.data.EvaluationOfLandResources, t)
        //利用效率
        var t = {}
        for(key in config.data){
            switch(key){
                case 'jizhunnian':
                case 'pingjianian':
                case 'jizhunnianxingzhengquyuneijiansheyongdimianji':
                case 'jizhunnianGDP':
                case 'pingjianianxingzhengquyuneijiansheyongdimianji':
                case 'pingjianianGDP':
                case 'quanguonianjuntudiziyuanliyongxiaolvzengsushuiping':{
                    t[key] = config.data[key]
                    break
                }
            }
        }
        if((t.UtilizationEfficiencyOfLandResourcesResult = UtilizationEfficiencyOfLandResources(t)) === false){
            clearMyLoading()
            window.history.back()            
            var closeTips = showTips()
            setTimeout(function(){
                closeTips()
            }, 3000)
            return
        }
        t.statisticsDate = config.data.pingjianian
        config.data.UtilizationEfficiencyOfLandResources = {}
        Object.assign(config.data.UtilizationEfficiencyOfLandResources, t)

        config.data.EvaluationOfUrbanizationArea = {
            chengshiyujianzhizhenzongmianji: config.data.chengshiyujianzhizhenzongmianji,
            statisticsDate: config.data.EvaluationOfUrbanizationAreaDateYear
        }
        config.data.EvaluationOfEcological = {
            pingjiaquyutudimianji: config.data.pingjiaquyutudimianji,
            statisticsDate: config.data.EvaluationOfEcologicalDateYear
        }

        //计算完成，提交后台
        window._ajax({
            url: '/api/submit',
            data: config.data,
            method: 'post',
            dataType: 'json',
            success: function(res){
                if(!!res & res != '-1'){
                    clearMyLoading()
                    html = "<i class='fa fa-check-circle-o fa-4x fa-fw' style='color: #00EE00'></i><span class='sr-only'>Success</span>"
                    clearMyLoading = myLoading("Success",html)
                    setTimeout(function () {
                        window.history.back()
                        clearMyLoading()
                    },1200)
                }else{
                    clearMyLoading()
                    window.history.back()
                    var closeTips = showTips('抱歉，提交失败您可以尝试重新提交')
                    setTimeout(function(){
                        closeTips()
                    }, 3000)
                }
            }
        })
    }else{
        var closeTips = showTips()
        setTimeout(function(){
            closeTips()
        }, 3000)
    }
})