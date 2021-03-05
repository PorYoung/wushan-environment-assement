(function t() {

    //初始化config.data
    config.data = {
        BLR:{
            EvaluationOfEcological:{},
            EvaluationOfLandResources:{},
            EvaluationOfUrbanizationArea:{},
            chengshiyujianzhizhenzongmianji:{},
            UtilizationEfficiencyOfLandResources:{}
        },
        EPB:{
            EmissionIntensityOfPollutants:{},
            EvaluationOfEnvironment:{},
            EvaluationOfUrbanizationArea:{}
        },
        FB:{
            EcologicalQuality:{},
            EvaluationOfEcological:{},
            EvaluationOfKeyEcologicalFunctionArea:{}
        },
        WA:{
            EvaluationOfWarterResources:{},
            UtilizationEfficiencyOfWarterResources:{}
        },
        yujingdengji:{
            yujingdengjiResult:null
        }
    }

    var dateYear = document.querySelector('.dateYear'),
        queryBtn = document.querySelector('.query-btn'),
        singleQueryBtn = document.querySelectorAll('.single-query-btn')
    dateYear.addEventListener('keyup', queryStatistics)
    queryBtn.addEventListener('click', queryStatistics)

    singleQueryBtn.forEach(function(item){
        item.addEventListener('click', querySingle)
    })
    function queryStatistics(event) {
        event = event || window.event
        var resultSpan = document.querySelectorAll('span[class*="Result"]')
        resultSpan.forEach(function (item) {
            item.innerHTML = "暂无数据"
            if(item.className.indexOf('noSpanBorder') != -1){
                item.classList.remove('noSpanBorder')
            }
        })
        if (event.keyCode == 13 || event.type.indexOf('click') != '-1') {
            var year = document.querySelector('.dateYear').value
            if (year == '') {
                var closeTips = showTips('请输入查询年份')
                dateYear.removeEventListener('keyup', queryStatistics)
                queryBtn.removeEventListener('click', queryStatistics)    
                setTimeout(function () {
                    closeTips()
                    dateYear.addEventListener('keyup', queryStatistics)
                    queryBtn.addEventListener('click', queryStatistics)    
                },3000)
            } else {
                statisticsDate = year
                var html = "<i class='fa fa-spinner fa-pulse fa-3x fa-fw'></i><span class='sr-only'>Loading...</span>"
                var clearMyLoading = myLoading("Loading...", html)
                window._ajax({
                    url: '/api/statistics',
                    data: {
                        statisticsDate: statisticsDate
                    },
                    success: function (res) {
                        if (!!res && res != '-1') {
                            var container = document.querySelector('.container'),
                                input = document.querySelectorAll('input')
                            
                            input.forEach(function(item){
                                if(item.className.match(/DateYear/)){
                                    item.value = year
                                }
                            })

                            container.style.opacity = '0'
                            config.data = res

                            //读取数据
                            expandObject(config.data)
                            //类别划分
                            categoryProcessEvaluation()
                            setTimeout(function () {
                                clearMyLoading()
                                qRouter.go('/' + config.user + '/' + statisticsDate)
                                container.style.opacity = '1'
                            }, 1200)
                        } else {
                            var closeTips = showTips()
                            setTimeout(function () {
                                clearMyLoading()
                                closeTips()
                                container.style.opacity = '1'
                            }, 1200)
                        }
                    }
                })
            }
        }
    }

})()

function showTips(str) {
    document.querySelector('.tips-text').innerHTML = str || '请检查您的输入'
    document.querySelector('.tips').style.zIndex = '999'
    document.querySelector('.tips').classList.addClass('animated flipInX')
    document.body.classList.addClass('animated shake')
    return function () {
        document.body.classList.removeClass('animated shake')
        document.querySelector('.tips').classList.removeClass('animated flipInX')
        document.querySelector('.tips').classList.addClass('animated flipOutY')
        setTimeout(function () {
            document.querySelector('.tips').style.zIndex = '-1'
            document.querySelector('.tips').classList.removeClass('animated flipOutY')
        }, 1000)
    }
}

function expandObject(obj) {
    for (key in obj) {
        if (typeof obj[key] === "object") {
            if(obj[key] instanceof Array) continue
            expandObject(obj[key])
        } else {
            if (typeof obj[key] != "function") {
                var item = document.querySelector('.' + key)
                if (!!item) {
                    // console.log(obj[key])
                    if(obj[key].toString().indexOf(',') != -1){
                        var t = obj[key].toString().split(','),
                            html = '<span>'+t[0]+'</span><span style="margin-left:10px;">'+t[1]+'</span>'
                        item.classList.add('noSpanBorder')
                        item.innerHTML = html                        
                    }else
                        item.innerHTML = obj[key]
                }
                /* var items = document.querySelectorAll('.' + key)
                if(!!items){
                    items.forEach(function(item){
                        item.innerHTML = obj[key]                    
                    })
                } */
            }
        }
    }
}

function queryStatistics(sid,callback) {
    if (!sid) {
        return qRouter.go('/' + config.user) && qRouter.refresh()
    }
    var resultSpan = document.querySelectorAll('span[class*="Result"]')
    resultSpan.forEach(function (item) {
        item.innerHTML = "暂无数据"
        if(item.className.indexOf('noSpanBorder') != -1){
            item.classList.remove('noSpanBorder')
        }
    })
    statisticsDate = sid
    var html = "<i class='fa fa-spinner fa-pulse fa-3x fa-fw'></i><span class='sr-only'>Loading...</span>"
    var clearMyLoading = myLoading("Loading...", html)
    window._ajax({
        url: '/api/statistics',
        data: {
            statisticsDate: statisticsDate
        },
        success: function (res) {
            if (!!res && res != '-1') {
                var body = document.body,
                    dateYear = document.querySelector('.dateYear')
                dateYear.value = sid
                var input = document.querySelectorAll('input')
                input.forEach(function(item){
                    if(item.className.match(/DateYear/)){
                        item.value = sid
                    }
                })
                body.style.opacity = '0'
                Object.assign(config.data, res)
                for(key in config.data){
                    if(!config.data[key]){
                        switch(key){
                            case 'BLR':{
                                config.data.BLR = {
                                    EvaluationOfEcological:{},
                                    EvaluationOfLandResources:{},
                                    EvaluationOfUrbanizationArea:{},
                                    chengshiyujianzhizhenzongmianji:{},
                                    UtilizationEfficiencyOfLandResources:{}
                                }
                                break
                            }
                            case 'WA':{
                                config.data.WA = {
                                    EvaluationOfWarterResources:{},
                                    UtilizationEfficiencyOfWarterResources:{}
                                }
                                break
                            }
                            case 'FB':{
                                config.data.FB = {
                                    EcologicalQuality:{},
                                    EvaluationOfEcological:{},
                                    EvaluationOfKeyEcologicalFunctionArea:{}
                                }
                                break
                            }
                            case 'EPB':{
                                config.data.EPB = {
                                    EmissionIntensityOfPollutants:{},
                                    EvaluationOfEnvironment:{},
                                    EvaluationOfUrbanizationArea:{}
                                }
                                break
                            }
                            case 'yujingdengji':{
                                config.data.yujingdengji = {
                                    yujingdengjiResult:null
                                }
                            }
                        }
                    }
                }
                //读取数据
                expandObject(config.data)
                
                //类别划分
                categoryProcessEvaluation()

                //回调
                if(!!callback) callback()
                setTimeout(function () {
                    clearMyLoading()
                    body.style.opacity = '1'
                }, 1200)
            } else {
                var closeTips = showTips("获取失败，请检查您的输入或稍后再试")
                setTimeout(function () {
                    clearMyLoading()
                    closeTips()
                    container.style.opacity = '1'
                }, 1200)
            }
        }
    })
}

function querySingle(){
    var query = this.dataset.value,
        queryInput = this.parentNode.querySelector('input'),
        queryYear = queryInput.value
    if(!queryYear){
        var closeTips = showTips()
        setTimeout(function(){
            closeTips()
        },3000)
        return
    }
    var html = "<i class='fa fa-spinner fa-pulse fa-3x fa-fw'></i><span class='sr-only'>Loading...</span>"
    var clearMyLoading = myLoading("Loading...", html)
    window._ajax({
        url: '/api/statistic',
        data: {
            queryString: query,
            statisticsDate: queryYear
        },
        success: function(res){
            if(!!res && res == '-2'){
                var resultSpan = document.querySelectorAll('span[class*="Result"]')
                resultSpan.forEach(function (item) {
                    if(item.className.indexOf(query) != '-1'){
                        item.innerHTML = "暂无数据"
                        if(item.className.indexOf('noSpanBorder') != -1){
                            item.classList.remove('noSpanBorder')
                        }
                    }
                })
                switch(query){
                    case 'EvaluationOfLandResources':
                    case 'UtilizationEfficiencyOfLandResources':{
                        config.data.BLR[query] = {}
                        break
                    }
                    case 'EvaluationOfWarterResources':
                    case 'UtilizationEfficiencyOfWarterResources':{
                        config.data.WA[query] = {}
                        break
                    }
                    case 'EvaluationOfEnvironment':
                    case 'EvaluationOfUrbanizationArea':
                    case 'EmissionIntensityOfPollutants':{
                        config.data.EPB[query] = {}
                        break
                    }
                    case 'EvaluationOfKeyEcologicalFunctionArea':
                    case 'EvaluationOfEcological':
                    case 'EcologicalQuality':{
                        config.data.FB[query] = {}
                        break
                    }
                }
                //类别划分
                categoryProcessEvaluation()
                setTimeout(function () {
                    clearMyLoading()
                }, 1200)
            }else if(!!res && res != '-1'){
                switch(query){
                    case 'EvaluationOfLandResources':
                    case 'UtilizationEfficiencyOfLandResources':{
                        Object.assign(config.data.BLR[query], res)
                        break
                    }
                    case 'EvaluationOfWarterResources':
                    case 'UtilizationEfficiencyOfWarterResources':{
                        Object.assign(config.data.WA[query], res)
                        break
                    }
                    case 'EvaluationOfEnvironment':
                    case 'EvaluationOfUrbanizationArea':
                    case 'EmissionIntensityOfPollutants':{
                        Object.assign(config.data.EPB[query], res)
                        break
                    }
                    case 'EvaluationOfKeyEcologicalFunctionArea':
                    case 'EvaluationOfEcological':
                    case 'EcologicalQuality':{
                        Object.assign(config.data.FB[query], res)
                        break
                    }
                }
                expandObject(res)
                //类别划分
                categoryProcessEvaluation()
                setTimeout(function () {
                    clearMyLoading()
                }, 1200)
            }else {
                var closeTips = showTips("获取失败，请检查您的输入或稍后再试")
                setTimeout(function () {
                    clearMyLoading()
                    closeTips()
                }, 3000)
            }
        }
    })
}

function chaozaileixingEvaluation(){
    config.data.chaozaileixingEvaluation = {}
    var obj = {}
    try{
        var BLR = config.data.BLR,
            FB = config.data.FB,
            WA = config.data.WA,
            EPB = config.data.EPB,
            EvaluationOfLandResourcesResult = BLR.EvaluationOfLandResources.EvaluationOfLandResourcesResult,
            EvaluationOfWarterResourcesResult = WA.EvaluationOfWarterResources.EvaluationOfWarterResourcesResult,
            EvaluationOfEnvironmentResult = EPB.EvaluationOfEnvironment.EvaluationOfEnvironmentResult,
            EvaluationOfEcologicalResult = FB.EvaluationOfEcological.EvaluationOfEcologicalResult,
            EvaluationOfUrbanizationAreaResult = EPB.EvaluationOfUrbanizationArea.EvaluationOfUrbanizationAreaResult,
            EvaluationOfKeyEcologicalFunctionAreaResult = FB.EvaluationOfKeyEcologicalFunctionArea.EvaluationOfKeyEcologicalFunctionAreaResult
            if(EvaluationOfLandResourcesResult.indexOf('土地资源压力大') != -1 || EvaluationOfWarterResourcesResult.indexOf('水资源超载') != -1 || EvaluationOfEnvironmentResult.indexOf('污染物浓度超标') != -1 || EvaluationOfEcologicalResult.indexOf('健康度低') != -1 || EvaluationOfUrbanizationAreaResult.indexOf('水气环境黑灰指数超载') != -1 || EvaluationOfKeyEcologicalFunctionAreaResult.indexOf('低等') != -1){
                obj.chaozaileixingEvaluationResult = "经集成分析,超载类型确定为: 超载"
            }else{
                var count = 0
                if(EvaluationOfLandResourcesResult.indexOf('土地资源压力中等') != -1) count++
                if(EvaluationOfWarterResourcesResult.indexOf('水资源临界超载') != -1) count++
                if(EvaluationOfEnvironmentResult.indexOf('污染物浓度接近超标') != -1) count++
                if(EvaluationOfEcologicalResult.indexOf('生态系统健康度中等') != -1) count++
                if(EvaluationOfUrbanizationAreaResult.indexOf('水气环境黑灰指数临界超载') != -1) count++
                if(EvaluationOfKeyEcologicalFunctionAreaResult.indexOf('临界超载') != -1) count++
                if(count >= 2){
                obj.chaozaileixingEvaluationResult = "经集成分析,超载类型确定为: 超载"                
                }else if(count == 1){
                obj.chaozaileixingEvaluationResult = "经集成分析,超载类型确定为: 临界超载"                
                }else{
                obj.chaozaileixingEvaluationResult = "经集成分析,超载类型确定为: 不超载"                
                }
            }
    }catch(e){
        obj.chaozaileixingEvaluationResult = "暂无数据"
    }
    Object.assign(config.data.chaozaileixingEvaluation, obj)
    expandObject(obj)
}

function categoryProcessEvaluation() {
    config.data.categoryProcessEvaluation = {}
    var obj = {},
        badCount = 0,
        goodCount = 0
    try{
        if (!!config.data.BLR && !!config.data.WA) {
            var BLR = config.data.BLR.UtilizationEfficiencyOfLandResources,
                WA = config.data.WA.UtilizationEfficiencyOfWarterResources
            if(!BLR.hasOwnProperty('UtilizationEfficiencyOfLandResourcesResult') || !WA.hasOwnProperty('UtilizationEfficiencyOfWarterResourcesResult')){
                obj.UtilizationEfficiencyOfResourcesCategoryResult = "暂无数据"
                goodCount = badCount = NaN
            }else{
                if (BLR.UtilizationEfficiencyOfLandResourcesResult < BLR.quanguonianjuntudiziyuanliyongxiaolvzengsushuiping && WA.UtilizationEfficiencyOfWarterResourcesResult < WA.quanguonianjunshuiziyuanliyongxiaolvzengsupingjunshuiping) {
                    obj.UtilizationEfficiencyOfResourcesCategoryResult = "类别: 低效率类 , 指向: 变化趋差"
                    badCount++
                } else {
                    obj.UtilizationEfficiencyOfResourcesCategoryResult = "类别: 高效率类 , 指向: 变化趋良"
                    goodCount++
                }          
            }
        }
    }catch(e){
        console.warn(e)        
    }
    try{
        if (!!config.data.EPB) {
            var EPB = config.data.EPB.EmissionIntensityOfPollutants
                count = 0
            if(!EPB.hasOwnProperty('EmissionIntensityOfPollutantsAirNO') || !EPB.EmissionIntensityOfPollutantsAirNO.hasOwnProperty('EmissionIntensityOfPollutantsAirNOResult')){
                obj.EmissionIntensityOfPollutantsCategoryResult = "暂无数据"    
                goodCount = badCount = NaN            
            }else{
                EPBAirNO = EPB.EmissionIntensityOfPollutantsAirNO.EmissionIntensityOfPollutantsAirNOReuslt
                EPBAirNONation = EPB.EmissionIntensityOfPollutantsAirNO.quanguonianjundanyanghuawupaifangqiangduzengsupingjunshuiping
                EPBAirSO2 = EPB.EmissionIntensityOfPollutantsAirSO2.EmissionIntensityOfPollutantsAirSO2Result
                EPBAirSO2Nation = EPB.EmissionIntensityOfPollutantsAirSO2.quanguonianjuneryanghualiupaifangqiangduzengsupingjunshuiping
                EPBWaterN = EPB.EmissionIntensityOfPollutantsWaterN.EmissionIntensityOfPollutantsWaterNResult
                EPBWaterNNation = EPB.EmissionIntensityOfPollutantsWaterN.quanguonianjunandanpaifangqiangduzengsupingjunshuiping
                EPBWaterO = EPB.EmissionIntensityOfPollutantsWaterO.EmissionIntensityOfPollutantsWaterOResult
                EPBWaterONation = EPB.EmissionIntensityOfPollutantsWaterO.quanguonianjunhuaxuexuyangliangpaifangqiangduzengsushuiping
                if (EPBAirNO > EPBAirNONation) count++
                if (EPBAirSO2 > EPBAirSO2Nation) count++
                if (EPBWaterN > EPBWaterNNation) count++
                if (EPBWaterO > EPBWaterONation) count++
                if (count >= 3) {
                    obj.EmissionIntensityOfPollutantsCategoryResult = "类别: 高强度类 , 指向: 变化趋差"
                    badCount++
                } else {
                    obj.EmissionIntensityOfPollutantsCategoryResult = "类别: 低强度类 , 指向: 变化趋良"
                    goodCount++
                }
            }
        }
    }catch(e){
        console.warn(e)        
    }
    try{
        if (!!config.data.FB) {
            var FB = config.data.FB.EcologicalQuality
            if(!FB.hasOwnProperty('EcologicalQualityLincao') || !FB.EcologicalQualityLincao.hasOwnProperty('EcologicalQualityLincaoResult')){
                obj.EcologicalQualityCategoryResult = "暂无数据"          
                goodCount = badCount = NaN      
            }else{
                FB = FB.EcologicalQualityLincao
                FBResult = FB.EcologicalQualityLincaoResult,
                FBResultNation = FB.quanguonianjunlincaofugailvzengsupingjunshuiping
                if (FBResult < FBResultNation) {
                    obj.EcologicalQualityCategoryResult = "类别: 低质量类 , 指向: 变化趋差"
                    badCount++
                } else {
                    obj.EcologicalQualityCategoryResult = "类别: 高质量类 , 指向: 变化趋良"
                    goodCount++
                }
            }
        }
    }catch(e){
        console.warn(e)
        // return
    }
    if(!isNaN(badCount) && !isNaN(goodCount)){
        if(badCount >= 2){
            obj.ziyuansunhaozhishuResult = '资源环境耗损加剧型'
        }
        if(goodCount >= 2){
            obj.ziyuansunhaozhishuResult = '资源环境耗损趋缓型'
        }
    }
    Object.assign(config.data.categoryProcessEvaluation, obj)
    /* function expandObject(obj) {
        for (key in obj) {
            if (typeof obj[key] === "object") {
                expandObject(obj[key])
            } else {
                if (typeof obj[key] != "function") {
                    var item = document.querySelector('.' + key)
                    if (!!item) {
                        item.innerHTML = obj[key]
                    }
                }
            }
        }
    } */
    expandObject(obj)
    //预警等级
    chaozaileixingEvaluation()
    var tmp = {}
    if(!!obj.ziyuansunhaozhishuResult){
        if(obj.ziyuansunhaozhishuResult.indexOf('加剧型') != -1){
            var chaozai = config.data.chaozaileixingEvaluation.chaozaileixingEvaluationResult
            if(chaozai != "暂无数据"){
                if(chaozai.indexOf('经集成分析,超载类型确定为: 超载') != -1){
                    tmp.yujingdengjiResult = '红色预警 (极重警)'
                    document.querySelector('.yujingdengji').style.backgroundColor = "rgb(255,0,0)"
                }else if(chaozai.indexOf('临界超载') != -1){
                    tmp.yujingdengjiResult = '黄色预警 (中警)'
                    document.querySelector('.yujingdengji').style.backgroundColor = "rgb(255, 255, 0)"
                }else{
                    tmp.yujingdengjiResult = '绿色预警 (无警)'
                    document.querySelector('.yujingdengji').style.backgroundColor = "rgb(0, 100, 0)"
                }
            }else{
                tmp.yujingdengjiResult = '暂无数据'  
                document.querySelector('.yujingdengji').style.backgroundColor = "initial"              
            }
        }else if(obj.ziyuansunhaozhishuResult.indexOf('趋缓型') != -1){
            var chaozai = config.data.chaozaileixingEvaluation.chaozaileixingEvaluationResult
            if(chaozai != "暂无数据"){
                if(chaozai.indexOf('经集成分析,超载类型确定为: 超载') != -1){
                    tmp.yujingdengjiResult = '橙色预警 (重警)'
                    document.querySelector('.yujingdengji').style.backgroundColor = "rgb(255, 165, 0)"
                }else if(chaozai.indexOf('临界超载') != -1){
                    tmp.yujingdengjiResult = '蓝色预警 (轻重警)'
                    document.querySelector('.yujingdengji').style.backgroundColor = "rgb(40, 189, 250)"
                }else{
                    tmp.yujingdengjiResult = '绿色预警 (无警)'
                    document.querySelector('.yujingdengji').style.backgroundColor = "rgb(0, 100, 0)"
                }
            }else{
                tmp.yujingdengjiResult = '暂无数据'
                document.querySelector('.yujingdengji').style.backgroundColor = "initial"
            }
        }
    }else{
        tmp.yujingdengjiResult = '暂无数据'
        document.querySelector('.yujingdengji').style.backgroundColor = "transparent"             
    }
    if(!config.data.hasOwnProperty('yujingdengji')){
        config.data.yujingdengji = {}
    }
    Object.assign(config.data.yujingdengji, tmp)    
    expandObject(tmp)
}


function showBLRDetail(obj){
    var BLR = document.querySelector('.BLR-form')
    for (key in obj) {
        if (typeof obj[key] === "object") {
            if(obj[key] instanceof Array) continue
            showBLRDetail(obj[key])
        } else {
            if (typeof obj[key] != "function") {
                var item = BLR.querySelector('input[name="' + key + '"]')
                if (!!item) {
                    if(item.type == "checkbox"){
                        item.checked = !!item.type
                    }else{
                        item.value = obj[key]
                        if(!!item.previousElementSibling)
                        item.previousElementSibling.classList.addClass('input-active')
                    }
                }
            }
        }
    }
}
function showWADetail(obj){
    var WA = document.querySelector('.WA-form')
    for (key in obj) {
        if (typeof obj[key] === "object") {
            if(obj[key] instanceof Array) continue
            showWADetail(obj[key])
        } else {
            if (typeof obj[key] != "function") {
                var item = WA.querySelector('input[name="' + key + '"]')
                if (!!item) {
                    if(item.type == "checkbox"){
                        item.checked = !!item.type
                    }else{
                        item.value = obj[key]
                        if(!!item.previousElementSibling)
                        item.previousElementSibling.classList.addClass('input-active')
                    }
                }
            }
        }
    }
}
function showFBDetail(obj){
    var FB = document.querySelector('.FB-form')
    for (key in obj) {
        if (typeof obj[key] === "object") {
            if(obj[key] instanceof Array) continue
            showFBDetail(obj[key])
        } else {
            if (typeof obj[key] != "function") {
                var item = FB.querySelector('input[name="' + key + '"]')
                if (!!item) {
                    if(item.type == "checkbox"){
                        item.checked = !!item.type
                    }else{
                        item.value = obj[key]
                        if(!!item.previousElementSibling)
                        item.previousElementSibling.classList.addClass('input-active')
                    }
                }
            }
        }
    }
}
function showEPBDetail(obj){
    var EPB = document.querySelector('.EPB-form')
    for (key in obj) {
        if (typeof obj[key] === "object") {
            if(obj[key] instanceof Array) continue
            showEPBDetail(obj[key])
        } else {
            if (typeof obj[key] != "function") {
                var item = EPB.querySelector('input[name="' + key + '"]')
                if (!!item) {
                    if(item.type == "checkbox"){
                        item.checked = !!item.type
                    }else{
                        item.value = obj[key]
                        if(!!item.previousElementSibling)
                        item.previousElementSibling.classList.addClass('input-active')
                    }
                }
            }
        }
    }
}


qRouter.on('/:user/detail',function(req){
    var dateYear = document.querySelector('.dateYear').value
    if(dateYear == ''){
        var closeTips = showTips('请输入查询年份')
        setTimeout(function(){
            closeTips()
        },3000)
        return qRouter.go('/'+config.user+'/errortips')
    }else{
        queryStatistics(dateYear,function(){
            var detailPanel = document.querySelector('.list.detail'),
                list = document.querySelector('.list.showlist')
            detailPanel.classList.removeClass('fadeOut')
            detailPanel.classList.addClass('fadeIn')
            detailPanel.style.display = 'block'
            list.classList.removeClass('fadeIn')
            list.classList.addClass('fadeOut')
            var input = document.querySelectorAll('.list.detail input')
            input.forEach(function(item){
                item.setAttribute('readonly',"readonly")
                if(item.type == "checkbox") item.checked = false
                else item.value = ''
            })
            showBLRDetail(config.data.BLR)
            showFBDetail(config.data.FB)
            showWADetail(config.data.WA)
            showEPBDetail(config.data.EPB)
        })
    }
})
qRouter.on('/:user/:sid', function (req) {
    var list = document.querySelector('.list.showlist'),
        detailPanel = document.querySelector('.list.detail')
    list.classList.removeClass('fadeOut')
    list.classList.addClass('fadeIn')
    detailPanel.classList.removeClass('fadeIn')
    detailPanel.classList.addClass('fadeOut')
    detailPanel.style.display = 'none'
    var sid = req.params.sid
    queryStatistics(sid)
})

qRouter.on('/'+config.user+'/help',function(){
    var closeTips = showTips('管理员尚未提供任何信息，如有任何疑问请联系系统管理员！')
    setTimeout(function(){
        closeTips()
    }, 3000)
})