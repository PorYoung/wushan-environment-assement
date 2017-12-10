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
        }
    }

    var dateMonth = document.querySelector('.dateMonth'),
        queryBtn = document.querySelector('.query-btn'),
        singleQueryBtn = document.querySelectorAll('.single-query-btn')
    dateMonth.addEventListener('keyup', queryStatistics)
    queryBtn.addEventListener('click', queryStatistics)

    singleQueryBtn.forEach(function(item){
        item.addEventListener('click', querySingle)
    })
    function queryStatistics(event) {
        event = event || window.event
        var resultSpan = document.querySelectorAll('span[class*="Result"]')
        resultSpan.forEach(function (item) {
            item.innerHTML = "暂无数据"
        })
        if (event.keyCode == 13 || event.type.indexOf('click') != '-1') {
            var year = document.querySelector('.dateYear').value,
                month = document.querySelector('.dateMonth').value
            if (year == '' || month == '') {
                var closeTips = showTips()
                dateMonth.removeEventListener('keyup', queryStatistics)
                queryBtn.removeEventListener('click', queryStatistics)    
                setTimeout(function () {
                    closeTips()
                    dateMonth.addEventListener('keyup', queryStatistics)
                    queryBtn.addEventListener('click', queryStatistics)    
                })
            } else {
                statisticsDate = year + '-' + month
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
                                }else if(item.className.match(/DateMonth/)){
                                    item.value = month
                                }
                            })

                            container.style.opacity = '0'
                            config.data = res

                            //读取数据
                            expandObject(config.data)
                            function expandObject(obj) {
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
                            }
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
}

function queryStatistics(sid) {
    if (!sid) {
        return qRouter.go('/' + config.user) && qRouter.refresh()
    }
    var resultSpan = document.querySelectorAll('span[class*="Result"]')
    resultSpan.forEach(function (item) {
        item.innerHTML = "暂无数据"
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
                    dateYear = document.querySelector('.dateYear'),
                    dateMonth = document.querySelector('.dateMonth'),
                    year = sid.split('-')[0],
                    month = sid.split('-')[1]
                dateYear.value = year
                dateMonth.value = month
                var input = document.querySelectorAll('input')
                input.forEach(function(item){
                    if(item.className.match(/DateYear/)){
                        item.value = year
                    }else if(item.className.match(/DateMonth/)){
                        item.value = month
                    }
                })
                body.style.opacity = '0'
                config.data = res
                //读取数据
                expandObject(config.data)
                
                //类别划分
                categoryProcessEvaluation()
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
        queryInput = this.parentNode.querySelectorAll('input'),
        queryYear = queryInput[0].value,
        queryMonth = queryInput[1].value
    if(!queryYear || !queryMonth){
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
            year: queryYear,
            month: queryMonth
        },
        success: function(res){
            if(!!res && res != '-1'){
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
                        Object.assign(config.data.fb[query], res)
                        break
                    }
                }
                expandObject(res)
                //类别划分
                categoryProcessEvaluation()
                setTimeout(function () {
                    clearMyLoading()
                }, 1200)
            }else if(res == '-2'){
                var resultSpan = document.querySelectorAll('span[class*="Result"]')
                resultSpan.forEach(function (item) {
                    if(item.className.indexOf(query) != '-1'){
                        item.innerHTML = "暂无数据"
                    }
                })
            }
            else{
                var closeTips = showTips("获取失败，请检查您的输入或稍后再试")
                setTimeout(function () {
                    clearMyLoading()
                    closeTips()
                }, 3000)
            }
        }
    })
}
function categoryProcessEvaluation() {
    config.data.categoryProcessEvaluation = {}
    var obj = {}
    try{
        if (!!config.data.BLR) {
            var BLR = config.data.BLR.UtilizationEfficiencyOfLandResources,
                WA = config.data.WA.UtilizationEfficiencyOfWarterResources
            if (BLR.UtilizationEfficiencyOfLandResourcesResult < BLR.quanguonianjuntudiziyuanliyongxiaolvzengsushuiping && WA.UtilizationEfficiencyOfWarterResourcesResult < WA.quanguonianjunshuiziyuanliyongxiaolvzengsupingjunshuiping) {
                obj.UtilizationEfficiencyOfResourcesCategoryResult = "类别: 低效率类 , 指向: 变化趋差"
            } else {
                obj.UtilizationEfficiencyOfResourcesCategoryResult = "类别: 高效率类 , 指向: 变化趋良"
            }
        }
        if (!!config.data.EPB) {
            var EPBAirNO = config.data.EPB.EmissionIntensityOfPollutants.EmissionIntensityOfPollutantsAirNO.EmissionIntensityOfPollutantsAirNOReuslt,
                EPBAirNONation = config.data.EPB.EmissionIntensityOfPollutants.EmissionIntensityOfPollutantsAirNO.quanguonianjundanyanghuawupaifangqiangduzengsupingjunshuiping
            EPBAirSO2 = config.data.EPB.EmissionIntensityOfPollutants.EmissionIntensityOfPollutantsAirSO2.EmissionIntensityOfPollutantsAirSO2Result,
                EPBAirSO2Nation = config.data.EPB.EmissionIntensityOfPollutants.EmissionIntensityOfPollutantsAirSO2.quanguonianjuneryanghualiupaifangqiangduzengsupingjunshuiping,
                EPBWaterN = config.data.EPB.EmissionIntensityOfPollutants.EmissionIntensityOfPollutantsWaterN.EmissionIntensityOfPollutantsWaterNResult,
                EPBWaterNNation = config.data.EPB.EmissionIntensityOfPollutants.EmissionIntensityOfPollutantsWaterN.quanguonianjunandanpaifangqiangduzengsupingjunshuiping,
                EPBWaterO = config.data.EPB.EmissionIntensityOfPollutants.EmissionIntensityOfPollutantsWaterO.EmissionIntensityOfPollutantsWaterOResult,
                EPBWaterONation = config.data.EPB.EmissionIntensityOfPollutants.EmissionIntensityOfPollutantsWaterO.quanguonianjunhuaxuexuyangliangpaifangqiangduzengsushuiping,
                count = 0
            if (EPBAirNO > EPBAirNONation) count++
            if (EPBAirSO2 > EPBAirSO2Nation) count++
            if (EPBWaterN > EPBWaterNNation) count++
            if (EPBWaterO > EPBWaterONation) count++
            if (count >= 3) {
                obj.EmissionIntensityOfPollutantsCategoryResult = "类别: 高强度类 , 指向: 变化趋差"
            } else {
                obj.EmissionIntensityOfPollutantsCategoryResult = "类别: 低强度类 , 指向: 变化趋良"
            }
        }

        if (!!config.data.FB) {
            var FB = config.data.FB.EcologicalQuality.EcologicalQualityLincao,
                FBResult = FB.EcologicalQualityLincaoResult,
                FBResultNation = FB.quanguonianjunlincaofugailvzengsupingjunshuiping
            if (FBResult < FBResultNation) {
                obj.EcologicalQualityCategoryResult = "类别: 低质量类 , 指向: 变化趋差"
            } else {
                obj.EcologicalQualityCategoryResult = "类别: 高质量类 , 指向: 变化趋良"
            }
        }
    }catch(e){
        console.warn(e)
        return
    }
    Object.assign(config.data.categoryProcessEvaluation, obj)
    function expandObject(obj) {
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
    }
    expandObject(obj)
}

qRouter.on('/:user/:sid', function (req) {
    var list = document.querySelector('.list')
    list.classList.addClass('fadeIn')
    var sid = req.params.sid
    queryStatistics(sid)
})