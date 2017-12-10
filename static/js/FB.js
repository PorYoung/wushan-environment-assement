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
        H = Ad / At,
        res = null
    if(H > 0.1){
        res = '生态系统健康度低'
    }else if(H > 0.05){
        res = '生态系统健康度中等'
    }else{
        res = '生态系统健康度高'
    }
    return res
}

function EvaluationOfKeyEcologicalFunctionArea(data){
    var D = parseFloat(data),
        res = null
    if(isNaN(D)){
        return false
    }
    if(D > 12.5){
        res = "水土保持功能高"
    }else if(D <= 12.5 && D >= 1){
        res = "水土保持功能高中等"
    }else{
        res = "水土保持功能高低"
    }
    return res
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
        //生态评价
        var t = {}
        for(key in config.data){
            switch(key){
                case 'zhongduyishangshuituliushimianji':
                case 'zhongduyishangtudishahuamianji':
                case 'zhongduyishangyanzihuamianji':
                case 'zhongduyishangshimohuamianji':
                case 'pingjiaquyutudimianji':{
                    t[key] = config.data[key]
                    break
                }
            }
        }
        if((t.EvaluationOfEcologicalResult = EvaluationOfEcological(t)) === false){
            clearMyLoading()
            window.history.back()            
            var closeTips = showTips()
            setTimeout(function(){
                closeTips()
            }, 3000)
            return
        }
        t.EvaluationOfEcologicalDateYear = config.data.EvaluationOfEcologicalDateYear
        t.EvaluationOfEcologicalDateMonth = config.data.EvaluationOfEcologicalDateMonth
        config.data.EvaluationOfEcological = {}
        Object.assign(config.data.EvaluationOfEcological, t)
        //重点生态功能区评价
        t = {
            shuituliushizhishu: config.data.shuituliushizhishu
        }
        if((t.EvaluationOfKeyEcologicalFunctionAreaResult = EvaluationOfKeyEcologicalFunctionArea(t.shuituliushizhishu)) === false){
            clearMyLoading()
            window.history.back()            
            var closeTips = showTips()
            setTimeout(function(){
                closeTips()
            }, 3000)
            return
        }
        t.EvaluationOfKeyEcologicalFunctionAreaDateYear = config.data.EvaluationOfKeyEcologicalFunctionAreaDateYear
        t.EvaluationOfKeyEcologicalFunctionAreaDateMonth = config.data.EvaluationOfKeyEcologicalFunctionAreaDateMonth
        config.data.EvaluationOfKeyEcologicalFunctionArea = {}
        Object.assign(config.data.EvaluationOfKeyEcologicalFunctionArea, t)
        //林草覆盖率变化
        t = {}
        for(key in config.data){
            switch(key){
                case 'jizhunnian':
                case 'pingjianian':
                case 'jizhunnianingzhengquyuneilincaofugailv':
                case 'pingjianianxingzhengquyuneilincaofugailv':
                case 'quanguonianjunlincaofugailvzengsupingjunshuiping':{
                    t[key] = config.data[key]
                    break
                }
            }
        }
        if((t.EcologicalQualityLincaoResult = EcologicalQualityLincao(t)) === false){
            clearMyLoading()
            window.history.back()
            var closeTips = showTips()
            setTimeout(function(){
                closeTips()
            }, 3000)
            return
        }
        if(config.data.hasOwnProperty('EcologicalQuality')){
            config.data.EcologicalQuality.EcologicalQualityLincao = {}
        }else{
            config.data.EcologicalQuality = {}
            config.data.EcologicalQuality.EcologicalQualityLincao = {}
        }
        Object.assign(config.data.EcologicalQuality.EcologicalQualityLincao, t)

        t = {
            EcologicalQualityDateYear: config.data.EcologicalQualityDateYear,
            EcologicalQualityDateMonth: config.data.EcologicalQualityDateMonth
        }
        Object.assign(config.data.EcologicalQuality, t)

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