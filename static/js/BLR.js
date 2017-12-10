function EvaluationOfLandResources(data){
    var D = parseFloat(data),
        obj = {
            EvaluationOfLandResourcesResult: null
        }
    if(isNaN(D)){
        return false
    }
    var res
    if(D > 0){
        res = "土地资源压力大"
    }else if(D <= 0 && D >= -0.3){
        res = "土地资源压力中等"
    }else{
        res = "土地资源压力小"
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
        //默认所有评测日期为录入日期
        for(key in config.data){
            if(key.match(/DateYear/)){
                if(!config.data[key]){
                    config.data[key] = config.data.dateYear
                }
            }else if(key.match(/DateMonth/)){
                if(!config.data[key]){
                    config.data[key] = config.data.dateMonth
                }
            }
        }
        var t = {
            tudiziyuanyalizhishu: config.data.tudiziyuanyalizhishu,
            EvaluationOfLandResourcesDateYear: config.data.EvaluationOfLandResourcesDateYear,
            EvaluationOfLandResourcesDateMonth: config.data.EvaluationOfLandResourcesDateMonth
        }
        if((t.EvaluationOfLandResourcesResult = EvaluationOfLandResources(t.tudiziyuanyalizhishu)) === false){
            clearMyLoading()
            window.history.back()
            var closeTips = showTips()
            setTimeout(function(){
                closeTips()
            }, 3000)
            return
        }
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
        t.UtilizationEfficiencyOfLandResourcesDateYear = config.data.UtilizationEfficiencyOfLandResourcesDateYear
        t.UtilizationEfficiencyOfLandResourcesDateMonth = config.data.UtilizationEfficiencyOfLandResourcesDateMonth
        config.data.UtilizationEfficiencyOfLandResources = {}
        Object.assign(config.data.UtilizationEfficiencyOfLandResources, t)

        config.data.EvaluationOfUrbanizationArea = {
            chengshiyujianzhizhenzongmianji: config.data.chengshiyujianzhizhenzongmianji,
            EvaluationOfUrbanizationAreaDateYear: config.data.EvaluationOfUrbanizationAreaDateYear,
            EvaluationOfUrbanizationAreaDateMonth: config.data.EvaluationOfUrbanizationAreaDateMonth
        }
        config.data.EvaluationOfEcological = {
            pingjiaquyutudimianji: config.data.pingjiaquyutudimianji,
            EvaluationOfEcologicalDateYear: config.data.EvaluationOfEcologicalDateYear,
            EvaluationOfEcologicalDateMonth: config.data.EvaluationOfEcologicalDateMonth
        }

        //计算完成，提交后台
        config.data.statisticsDate = config.data.dateYear + '-' + config.data.dateMonth
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