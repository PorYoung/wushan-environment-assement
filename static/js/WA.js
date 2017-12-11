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
    var res = null
    if(D.dixiashuishifouchaocai || D.yongshuiliang > D.yongshuiliangkongzhizhibiao || D.dixiashuigongshuizongliang > D.dixiashuigongshuizhibiao){
        res = "水资源超载"
    }else if(D.yongshuiliang > 0.9 * D.yongshuiliangkongzhizhibiao || D.dixiashuigongshuizongliang > 0.9 * D.dixiashuigongshuizhibiao){
        res = "水资源临界超载"
    }else{
        res = "水资源不超载"
    }
    return res
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
    return res
}

qRouter.on('/'+config.user+'/submit',function(){
    if(!!config.data){
        var html = "<i class='fa fa-spinner fa-pulse fa-3x fa-fw'></i><span class='sr-only'>Loading...</span>"
        var clearMyLoading = myLoading("Waiting...",html)
        //水资源评价
        var t = {}
        for(key in config.data){
            switch(key){
                case 'yongshuiliang':
                case 'dixiashuigongshuizongliang':
                case 'yongshuiliangkongzhizhibiao':
                case 'dixiashuigongshuizhibiao':
                case 'dixiashuishifouchaocai':{
                    t[key] = config.data[key]
                    break
                }
            }
        }
        if((t.EvaluationOfWarterResourcesResult = EvaluationOfWarterResources(t)) === false){
            clearMyLoading()
            window.history.back()            
            var closeTips = showTips()
            setTimeout(function(){
                closeTips()
            }, 3000)
            return
        }
        t.statisticsDate = config.data.EvaluationOfWarterResourcesDateYear
        config.data.EvaluationOfWarterResources = {}
        Object.assign(config.data.EvaluationOfWarterResources, t)
        //水资源利用效率变化
        t = {}
        for(key in config.data){
            switch(key){
                case 'jizhunnian':
                case 'pingjianian':
                case 'jizhunnianGDP':
                case 'pingjianianGDP':
                case 'jizhunnianxingzhengquyuneiyongshuiliang':
                case 'pingjianianxingzhengquyuneiyongshuiliang':
                case 'quanguonianjunshuiziyuanliyongxiaolvzengsupingjunshuiping':{
                    t[key] = config.data[key]
                    break
                }
            }
        }
        if((t.UtilizationEfficiencyOfWarterResourcesResult = UtilizationEfficiencyOfWarterResources(t)) === false){
            clearMyLoading()
            window.history.back()            
            var closeTips = showTips()
            setTimeout(function(){
                closeTips()
            }, 3000)
            return
        }
        t.statisticsDate = config.data.pingjianian
        config.data.UtilizationEfficiencyOfWarterResources = {}
        Object.assign(config.data.UtilizationEfficiencyOfWarterResources, t)

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