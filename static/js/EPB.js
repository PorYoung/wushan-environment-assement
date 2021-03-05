(function t(){
        var WaterCountBtn = document.querySelector('.count-btn')
        WaterCountBtn.addEventListener('click', EvaluationOfEnvironmentWaterCount)
})()
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
                continue
            }
            D[key] = v
            var tmp = D[key] / S[key] - 1
            if(RMax == null || tmp > RMax){
                RMax = tmp
            }
        }
    }
    return RMax
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
        RlMax = null,
        res = {}
    for(key in data){
        if(data.hasOwnProperty(key)){
            if(key != "shuihuanjingzhiliangjianceduanmian"){
                if(data[key] instanceof Array){
                    D[key] = []
                    for(var i = 0;i < data[key].length;i++){
                        var v = parseFloat(data[key])
                        if(isNaN(v)){
                            //不能为空
                            return false
                        }
                        if(key == "dov"){
                            var tmpr = 1 / (v / Sr[key]) - 1,
                                tmpl = 1 / (v / Sl[key]) - 1
                        }else{
                            var tmpr = v / Sr[key] - 1,
                                tmpl = v / Sl[key] - 1
                        }
                        if(!data.shuihuanjingzhiliangjianceduanmian[i]){
                            v = tmpr
                        }else[
                            v = tmpl
                        ]
                        D[key].push(v)
                    }
                }else{
                    //最少为两个断面
                    return false
                }
            }else{
                D[key] = data[key]
            }
        }
    }
    //计算第i项超标指数
    for(key in D){
        if(D.hasOwnProperty(key)){
            var Ri = 0
            for(var i = 0;i < D[key].length;i++){
                Ri += D[key][i]
            }
            Ri = Ri / D[key].length
            res[key] = Ri
        }
    }
    //计算第k个断面超标指数和区域j水污染物浓度超标指数
    var Rj = 0
    for(var i = 0;i < D.dov.length;i++){
        var Rk = null
        for(key in D){
            if(D.hasOwnProperty(key)){
                if(Rk == null || D[key][i] > Rk){
                    Rk = D[key][i]
                }
            }
        }
        Rj += Rk
    }
    Rj = Rj / D.dov.length
    res.EvaluationOfEnvironmentWaterResult = Rj
    return res
}
function EvaluationOfEnvironment(){
    if(!config.data.hasOwnProperty('EvaluationOfEnvironment') || !config.data.EvaluationOfEnvironment.hasOwnProperty('EvaluationOfEnvironmentWater') || !config.data.EvaluationOfEnvironment.hasOwnProperty('EvaluationOfEnvironmentAir')){
        return false
    }else{
        var a = config.data.EvaluationOfEnvironment.EvaluationOfEnvironmentAir.EvaluationOfEnvironmentAirResult,
            w = config.data.EvaluationOfEnvironment.EvaluationOfEnvironmentWater.EvaluationOfEnvironmentWaterResult.EvaluationOfEnvironmentWaterResult,
            Rtmp = a > w?a:w,
            res = null
        if(Rtmp > 0){
            res = '污染物浓度超标指数: ' + Rtmp + ' , 污染物浓度超标'
        }else if(Rtmp > -0.2){
            res = '污染物浓度超标指数: ' + Rtmp + ' , 污染物浓度接近超标'
        }else{
            res = '污染物浓度超标指数: ' + Rtmp + ' , 污染物浓度未超标'
        }
    }
    return res
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
    if(isNaN(L)) L = 0
    if(!D.chengshishuihuanjingpingjiaquyu){
        //优化开发区域
        if(Den < 100){
            if(L < 0.25){
                eva = '黑臭水体密度: ' + Den + '重点黑臭比例: ' + L + ' , 轻度污染'
            }else{
                eva = '黑臭水体密度: ' + Den + '重点黑臭比例: ' + L + ' , 中度污染'
            }
        }else if(Den >= 100 && D < 500){
            if(L < 0.25){
                eva = '黑臭水体密度: ' + Den + '重点黑臭比例: ' + L + ' , 轻度污染'
            }else if(L < 0.5){
                eva = '黑臭水体密度: ' + Den + '重点黑臭比例: ' + L + ' , 中度污染'
            }else{
                eva = '黑臭水体密度: ' + Den + '重点黑臭比例: ' + L + ' , 重度污染'
            }
        }else{
            if(L < 0.25){
                eva = '黑臭水体密度: ' + Den + '重点黑臭比例: ' + L + ' , 中度污染'
            }else{
                eva = '黑臭水体密度: ' + Den + '重点黑臭比例: ' + L + ' , 重度污染'
            }
        }
    }else{
        //重点开发区域
        if(Den < 300){
            if(L < 0.33){
                eva = '黑臭水体密度: ' + Den + '重点黑臭比例: ' + L + ' , 轻度污染'
            }else{
                eva = '黑臭水体密度: ' + Den + '重点黑臭比例: ' + L + ' , 中度污染'
            }
        }else if(Den >= 300 && D < 800){
            if(L < 0.33){
                eva = '黑臭水体密度: ' + Den + '重点黑臭比例: ' + L + ' , 轻度污染'
            }else if(L < 0.66){
                eva = '黑臭水体密度: ' + Den + '重点黑臭比例: ' + L + ' , 中度污染'
            }else{
                eva = '黑臭水体密度: ' + Den + '重点黑臭比例: ' + L + ' , 重度污染'
            }
        }else{
            if(L < 0.33){
                eva = '黑臭水体密度: ' + Den + '重点黑臭比例: ' + L + ' , 中度污染'
            }else{
                eva = '黑臭水体密度: ' + Den + '重点黑臭比例: ' + L + ' , 重度污染'
            }
        }
    }
    return eva
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
                eva = '年超标天数: ' + D.pm2d5nianchaobiaotianshu + ' , 轻度污染'
            }else if(D.pm2d5nianchaobiaotianshu < 90){
                eva = '年超标天数: ' + D.pm2d5nianchaobiaotianshu + ' , 中度污染'
            }else if(D.pm2d5nianchaobiaotianshu < 180){
                eva = '年超标天数: ' + D.pm2d5nianchaobiaotianshu + ' , 重度污染'
            }else{
                eva = '年超标天数: ' + D.pm2d5nianchaobiaotianshu + ' , 严重污染'
            }
        }else{
            if(D.pm2d5nianchaobiaotianshu < 60){
                eva = '年超标天数: ' + D.pm2d5nianchaobiaotianshu + ' , 轻度污染'
            }else if(D.pm2d5nianchaobiaotianshu < 120){
                eva = '年超标天数: ' + D.pm2d5nianchaobiaotianshu + ' , 中度污染'
            }else if(D.pm2d5nianchaobiaotianshu < 210){
                eva = '年超标天数: ' + D.pm2d5nianchaobiaotianshu + ' , 重度污染'
            }else{
                eva = '年超标天数: ' + D.pm2d5nianchaobiaotianshu + ' , 严重污染'
            }
        }
    }else{
        //重点开发区域
        if(D.hexinchengshizhuchengqu){
            //核心城市
            if(D.pm2d5nianchaobiaotianshu < 60){
                eva = '年超标天数: ' + D.pm2d5nianchaobiaotianshu + ' , 轻度污染'
            }else if(D.pm2d5nianchaobiaotianshu < 120){
                eva = '年超标天数: ' + D.pm2d5nianchaobiaotianshu + ' , 中度污染'
            }else if(D.pm2d5nianchaobiaotianshu < 210){
                eva = '年超标天数: ' + D.pm2d5nianchaobiaotianshu + ' , 重度污染'
            }else{
                eva = '年超标天数: ' + D.pm2d5nianchaobiaotianshu + ' , 严重污染'
            }
        }else{
            if(D.pm2d5nianchaobiaotianshu < 120){
                eva = '年超标天数: ' + D.pm2d5nianchaobiaotianshu + ' , 轻度污染'
            }else if(D.pm2d5nianchaobiaotianshu < 180){
                eva = '年超标天数: ' + D.pm2d5nianchaobiaotianshu + ' , 中度污染'
            }else if(D.pm2d5nianchaobiaotianshu < 240){
                eva = '年超标天数: ' + D.pm2d5nianchaobiaotianshu + ' , 重度污染'
            }else{
                eva = '年超标天数: ' + D.pm2d5nianchaobiaotianshu + ' , 严重污染'
            }
        }
    }
    return eva
}

function  EvaluationOfUrbanizationArea(){
    if(!config.data.hasOwnProperty('EvaluationOfUrbanizationArea') || !config.data.EvaluationOfUrbanizationArea.hasOwnProperty('EvaluationOfUrbanizationAreaWater') || !config.data.EvaluationOfUrbanizationArea.hasOwnProperty('EvaluationOfUrbanizationAreaAir')){
        return false
    }else{
        var a = config.data.EvaluationOfUrbanizationArea.EvaluationOfUrbanizationAreaAir.EvaluationOfUrbanizationAreaAirResult,
            b = config.data.EvaluationOfUrbanizationArea.EvaluationOfUrbanizationAreaWater.EvaluationOfUrbanizationAreaWaterResult,
            res = null
        if(a.indexOf('严重污染') != -1 || (a.indexOf('重度污染') != -1 && b.indexOf('重度污染') != -1)){
            res =  '水气环境黑灰指数超载'
        }else if(b.indexOf('重度污染') != -1 || a.indexOf('重度污染') != -1 || (a.indexOf('中度污染') != -1 && b.indexOf('中度污染') != -1)){
            res =  '水气环境黑灰指数临界超载'
        }else{
            res = '水气环境黑灰指数未超载'
        }        
    }
    return res
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
        return res
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
        return res
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
        return res
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
        return res
}

function EvaluationOfEnvironmentWaterCount(){
    var panel = document.querySelector('.EPB-EvaluationOfEnvironment-Water')
        input = document.querySelector('.EPB-EvaluationOfEnvironment-Water-count input'),
        count = parseInt(input.value)
        if(isNaN(count)){
            var closeTips = showTips("请检查您的输入")
            setTimeout(function(){
                closeTips()
            },3000)
            return
        }else if(count < 2){
            var closeTips = showTips("最少计算两个断面")
            setTimeout(function(){
                closeTips()
            },3000)
            return
        }
        config.EvaluationOfEnvironmentWaterCount = count
        //生成列表
        for(var id = 0;id < count;id++){
            var html = `
                <header>断面 ${id+1}</header>
                <div class="form-group">
                    <label class="labels" for="dov-category-${id}">DO监测值</label>
                    <input class="form-input" type="number" min="0" name="dov" id="dov-category-${id}">
                </div>
                <div class="form-group">
                    <label class="labels" for="codmnv-category-${id}">COD
                        <sub>Mn</sub>监测值</label>
                    <input class="form-input" type="number" min="0" name="codmnv" id="codmnv-category-${id}">
                </div>
                <div class="form-group">
                    <label class="labels" for="bod5v-category-${id}">BOD
                        <sub>5</sub>监测值</label>
                    <input class="form-input" type="number" min="0" name="bod5v" id="bod5v-category-${id}">
                </div>
                <div class="form-group">
                    <label class="labels" for="codcrv-category-${id}">COD
                        <sub>Cr</sub>监测值</label>
                    <input class="form-input" type="number" min="0" name="codcrv" id="codcrv-category-${id}">
                </div>
                <div class="form-group">
                    <label class="labels" for="nh3nv-category-${id}">NH
                        <sub>3</sub>-N监测值</label>
                    <input class="form-input" type="number" min="0" name="nh3nv" id="nh3nv-category-${id}">
                </div>
                <div class="form-group">
                    <label class="labels" for="tnv-category-${id}">TN监测值</label>
                    <input class="form-input" type="number" min="0" name="tnv" id="tnv-category-${id}">
                </div>
                <div class="form-group">
                    <label class="labels" for="tpv-category-${id}">TP监测值</label>
                    <input class="form-input" type="number" min="0" name="tpv" id="tpv-category-${id}">
                </div>
                <div class="form-group">
                    <label class="labels" for="shuihuanjingzhiliangjianceduanmian-category-${id}">[河流断面/湖库断面]</label>
                    <div class="toggle-input">
                        <input class="form-input" type="checkbox" name="shuihuanjingzhiliangjianceduanmian" id="shuihuanjingzhiliangjianceduanmian-category-${id}">
                        <label class="labels" for="shuihuanjingzhiliangjianceduanmian-category-${id}"></label>
                    </div>
                </div>
            `
            var form = document.createElement('form')
            form.className = "EPB-EvaluationOfEnvironment-Water-form form"
            form.innerHTML = html
            panel.appendChild(form)
            var inputArr = form.querySelectorAll('input')
            inputArr.forEach(function (item) {
                if (item.type == "button" || item.type == "checkbox" || item.type == "radio") {
                    return
                }
                item.addEventListener('focusin', formInputFocusin)
                item.addEventListener('focusout', formInputFocusout)
            })
        }
        var WaterCountBtn = document.querySelector('.count-btn')
        WaterCountBtn.removeEventListener('click', EvaluationOfEnvironmentWaterCount)
}

qRouter.on('/'+config.user+'/submit',function(){
    if(!!config.data){
        var html = "<i class='fa fa-spinner fa-pulse fa-3x fa-fw'></i><span class='sr-only'>Loading...</span>"
        var clearMyLoading = myLoading("Waiting...",html)
    //环境评价
        //空气质量检测
        var t = {}
        for(key in config.data){
            switch(key){
                case 'so2v':
                case 'no2v':
                case 'pm10v':
                case 'cov':
                case 'o3v':
                case 'pm2d5v':{
                    t[key] = config.data[key]
                    break
                }
            }
        }
        if((t.EvaluationOfEnvironmentAirResult = EvaluationOfEnvironmentAir(t)) === false){
            clearMyLoading()
            window.history.back()            
            var closeTips = showTips()
            setTimeout(function(){
                closeTips()
            }, 3000)
            return
        }
        if(config.data.hasOwnProperty('EvaluationOfEnvironment')){
            config.data.EvaluationOfEnvironment.EvaluationOfEnvironmentAir = {}
        }else{
            config.data.EvaluationOfEnvironment = {}
            config.data.EvaluationOfEnvironment.EvaluationOfEnvironmentAir = {}
        }
        Object.assign(config.data.EvaluationOfEnvironment.EvaluationOfEnvironmentAir, t)
        //水质检测
        t = {}
        for(key in config.data){
            switch(key){
                case 'dov':
                case 'codmnv':
                case 'bod5v':
                case 'codcrv':
                case 'nh3nv':
                case 'tnv':
                case 'tpv':
                case 'shuihuanjingzhiliangjianceduanmian':{
                    t[key] = config.data[key]
                    break
                }
            }
        }
        if((t.EvaluationOfEnvironmentWaterResult = EvaluationOfEnvironmentWater(t)) === false){
            clearMyLoading()
            window.history.back()            
            var closeTips = showTips()
            setTimeout(function(){
                closeTips()
            }, 3000)
            return
        }
        config.data.EvaluationOfEnvironment.EvaluationOfEnvironmentWater = {}
        Object.assign(config.data.EvaluationOfEnvironment.EvaluationOfEnvironmentWater, t)
        t = {}
        if((t.EvaluationOfEnvironmentResult = EvaluationOfEnvironment()) === false){
            clearMyLoading()
            window.history.back()            
            var closeTips = showTips()
            setTimeout(function(){
                closeTips()
            }, 3000)
            return
        }
        t.statisticsDate = config.data.EvaluationOfEnvironmentDateYear
        Object.assign(config.data.EvaluationOfEnvironment, t)

        //城市水环境
        t={}
        for(key in config.data){
            switch(key){
                case 'chengshiyujianzhizhenzongmianji':
                case 'chengshishuihuanjingpingjiaquyuquyu':
                case 'heichoushuitishicechangdu':
                case 'zhongduheichoushuitichangdu':{
                    t[key] = config.data[key]
                    break
                }
            }
        }
        if((t.EvaluationOfUrbanizationAreaWaterResult = EvaluationOfUrbanizationAreaWater(t)) === false){
            clearMyLoading()
            window.history.back()            
            var closeTips = showTips()
            setTimeout(function(){
                closeTips()
            }, 3000)
            return
        }
        if(config.data.hasOwnProperty('EvaluationOfUrbanizationArea')){
            config.data.EvaluationOfUrbanizationArea.EvaluationOfUrbanizationAreaWater = {}
        }else{
            config.data.EvaluationOfUrbanizationArea = {}
            config.data.EvaluationOfUrbanizationArea.EvaluationOfUrbanizationAreaWater = {}
        }
        Object.assign(config.data.EvaluationOfUrbanizationArea.EvaluationOfUrbanizationAreaWater, t)
        //城市空气质量环境
        t={}
        for(key in config.data){
            switch(key){
                case 'hexinchengshizhuchengqu':
                case 'pm2d5nianchaobiaotianshu':{
                    t[key] = config.data[key]
                    break
                }
            }
        }
        if((t.EvaluationOfUrbanizationAreaAirResult = EvaluationOfUrbanizationAreaAir(t)) === false){
            clearMyLoading()
            window.history.back()            
            var closeTips = showTips()
            setTimeout(function(){
                closeTips()
            }, 3000)
            return
        }
        config.data.EvaluationOfUrbanizationArea.EvaluationOfUrbanizationAreaAir = {}
        Object.assign(config.data.EvaluationOfUrbanizationArea.EvaluationOfUrbanizationAreaAir, t)
        //城市化地区评价
        t = {}
        if((t.EvaluationOfUrbanizationAreaResult = EvaluationOfUrbanizationArea(t)) === false){
            clearMyLoading()
            window.history.back()            
            var closeTips = showTips()
            setTimeout(function(){
                closeTips()
            }, 3000)
            return
        }
        t.statisticsDate = config.data.EvaluationOfUrbanizationAreaDateYear
        Object.assign(config.data.EvaluationOfUrbanizationArea, t)

        //水污染物 化学需氧量
        t = {}
        for(key in config.data){
            switch(key){
                case 'EmissionIntensityOfPollutants':
                case 'jizhunnian':
                case 'pingjianian':
                case 'jizhunnianGDP':
                case 'pingjianianGDP':
                case 'jizhunnianxingzhengquyuneihuaxuexuyangliang':
                case 'pingjianianxingzhengquyuneihuaxuexuyangliang':
                case 'quanguonianjunhuaxuexuyangliangpaifangqiangduzengsushuiping':{
                    t[key] = config.data[key]
                    break
                }
            }
        }
        if((t.EmissionIntensityOfPollutantsWaterOResult = EmissionIntensityOfPollutantsWaterO(t)) === false){
            clearMyLoading()
            window.history.back()            
            var closeTips = showTips()
            setTimeout(function(){
                closeTips()
            }, 3000)
            return
        }
        if(config.data.hasOwnProperty('EmissionIntensityOfPollutants')){
            config.data.EmissionIntensityOfPollutants.EmissionIntensityOfPollutantsWaterO = {}
        }else{
            config.data.EmissionIntensityOfPollutants = {}
            config.data.EmissionIntensityOfPollutants.EmissionIntensityOfPollutantsWaterO = {}
        }
        Object.assign(config.data.EmissionIntensityOfPollutants.EmissionIntensityOfPollutantsWaterO, t)
        //水污染物 氨氮
        t = {}
        for(key in config.data){
            switch(key){
                case 'jizhunnian':
                case 'pingjianian':
                case 'jizhunnianGDP':
                case 'pingjianianGDP':
                case 'jizhunnianxingzhengquneiandanpaifangliang':
                case 'pingjianianxingzhengquyuneiandanpaifangliang':
                case 'quanguonianjunandanpaifangqiangduzengsupingjunshuiping':{
                    t[key] = config.data[key]
                    break
                }
            }
        }
        if((t.EmissionIntensityOfPollutantsWaterNResult = EmissionIntensityOfPollutantsWaterN(t)) === false){
            clearMyLoading()
            window.history.back()            
            var closeTips = showTips()
            setTimeout(function(){
                closeTips()
            }, 3000)
            return
        }
        config.data.EmissionIntensityOfPollutants.EmissionIntensityOfPollutantsWaterN = {}
        Object.assign(config.data.EmissionIntensityOfPollutants.EmissionIntensityOfPollutantsWaterN, t)
        //大气污染物 二氧化硫
        t = {}
        for(key in config.data){
            switch(key){
                case 'jizhunnian':
                case 'pingjianian':
                case 'jizhunnianGDP':
                case 'pingjianianGDP':
                case 'jizhunnianxingzhengquyuneieryanghualiupaifangliang':
                case 'pingjianianxingzhengquyuneieryanghualiupaifangliang':
                case 'quanguonianjuneryanghualiupaifangqiangduzengsupingjunshuiping':{
                    t[key] = config.data[key]
                    break
                }
            }
        }
        if((t.EmissionIntensityOfPollutantsAirSO2Result = EmissionIntensityOfPollutantsAirSO2(t)) === false){
            clearMyLoading()
            window.history.back()            
            var closeTips = showTips()
            setTimeout(function(){
                closeTips()
            }, 3000)
            return
        }
        config.data.EmissionIntensityOfPollutants.EmissionIntensityOfPollutantsAirSO2 = {}
        Object.assign(config.data.EmissionIntensityOfPollutants.EmissionIntensityOfPollutantsAirSO2, t)
        //大气污染物 氮氧化物
        t = {}
        for(key in config.data){
            switch(key){
                case 'jizhunnian':
                case 'pingjianian':
                case 'jizhunnianGDP':
                case 'pingjianianGDP':
                case 'jizhunnianxingzhengquyuneidanyanghuawupaifangliang':
                case 'pingjianianxingzhengquyuneidanyanghuawupaifangliang':
                case 'quanguonianjundanyanghuawupaifangqiangduzengsupingjunshuiping':{
                    t[key] = config.data[key]
                    break
                }
            }
        }
        if((t.EmissionIntensityOfPollutantsAirNOResult = EmissionIntensityOfPollutantsAirNO(t)) === false){
            clearMyLoading()
            window.history.back()            
            var closeTips = showTips()
            setTimeout(function(){
                closeTips()
            }, 3000)
            return
        }
        config.data.EmissionIntensityOfPollutants.EmissionIntensityOfPollutantsAirNO = {}
        Object.assign(config.data.EmissionIntensityOfPollutants.EmissionIntensityOfPollutantsAirNO, t)
        
        t={
            statisticsDate: config.data.pingjianian
        }
        Object.assign(config.data.EmissionIntensityOfPollutants,t)

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