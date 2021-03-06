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
        res = '强烈及以上水土流失面积比例: ' + H + ' , 生态系统健康度低'
    }else if(H > 0.05){
        res = '强烈及以上水土流失面积比例: ' + H + ' , 生态系统健康度中等'
    }else{
        res = '强烈及以上水土流失面积比例: ' + H + ' , 生态系统健康度高'
    }
    return res
}

function EvaluationOfKeyEcologicalFunctionArea(data){
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
    var t = D.shuitulishimianji  / D.xingzhengquyumianji
    if(t > 0.35){
        res = "指标结果: " + t + " , 低等"
    }else if(t <= 0.35 && t >= 0.25){
        res = "指标结果: " + t + " , 临界超载"
    }else{
        res = "指标结果: " + t + " , 不超载"
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
        t.statisticsDate = config.data.EvaluationOfEcologicalDateYear
        config.data.EvaluationOfEcological = {}
        Object.assign(config.data.EvaluationOfEcological, t)
        //重点生态功能区评价
        t = {
            shuitulishimianji: config.data.shuitulishimianji,
            xingzhengquyumianji: config.data.xingzhengquyumianji    
        }
        if((t.EvaluationOfKeyEcologicalFunctionAreaResult = EvaluationOfKeyEcologicalFunctionArea(t)) === false){
            clearMyLoading()
            window.history.back()            
            var closeTips = showTips()
            setTimeout(function(){
                closeTips()
            }, 3000)
            return
        }
        t.statisticsDate = config.data.EvaluationOfKeyEcologicalFunctionAreaDateYear
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
            statisticsDate: config.data.pingjianian,
        }
        Object.assign(config.data.EcologicalQuality, t)

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

qRouter.on('/'+config.user+'/help',function(){
    var closeTips = showTips('管理员尚未提供任何信息，如有任何疑问请联系系统管理员！')
    setTimeout(function(){
        closeTips()
    }, 3000)
})