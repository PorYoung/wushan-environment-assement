const config = {
    user: 'BLR',
    data: {}
}
_addLoadEvent(function(){
    var inputArr = document.querySelectorAll('.form-input')
    inputArr.forEach(function(item){
        if(item.type == "button" || item.type == "checkbox" || item.type == "radio"){
            return
        }
        item.addEventListener('focusin', formInputFocusin)
        item.addEventListener('focusout', formInputFocusout)
    })

    function formInputFocusin(){
        var label = this.previousElementSibling
        label.classList.add('input-active')
    }
    function formInputFocusout(){
        var label = this.previousElementSibling,
            value = this.value
        if(value == ''){ 
            label.classList.remove('input-active')
        }
    }
})

_addLoadEvent(function(){
    var formCategory = document.querySelector('.form-submit.category'),
        formAll = document.querySelector('.form-submit.all')
        formAll.addEventListener('click', bindSubmitAllEvent)    
        formCategory.addEventListener('click', bindSubmitCategoryEvent)
    function bindSubmitCategoryEvent(){
        getInputElements('.list.category')
    }
    function bindSubmitAllEvent(){
        getInputElements('.list.all')
    }
    //获取指定form中的所有的<input>对象  
    function getInputElements(formId) {
        var form = document.querySelector(formId)
        var elements = []
        var tagElements = form.getElementsByTagName('input');  
        for (var j = 0; j < tagElements.length; j++){
            if(tagElements[j].type == "number" || tagElements[j].type == "text"){
                if(tagElements[j].value == ''){
                    formCategory.removeEventListener('click', bindSubmitCategoryEvent)
                    formAll.removeEventListener('click', bindSubmitAllEvent)
                    var closeTips = showTips()
                    return function(){
                        setTimeout(function(){
                            closeTips()
                            formCategory.addEventListener('click', bindSubmitCategoryEvent)
                            formAll.addEventListener('click', bindSubmitAllEvent)                            
                        },3000)
                    }()
                }
            }
            elements.push(tagElements[j])
        }
        var obj = {}
        elements.forEach(function(ele){
             switch(ele.type){
                 case 'checkbox':{
                     obj[ele.name] = ele.checked
                     break
                 }
                 case 'number':{
                     obj[ele.name] = parseFloat(ele.value)
                     break
                 }
                 case 'text':{
                     obj[ele.name] = ele.value
                     break
                 }
             }
        })
        Object.assign(config.data, obj)
    }
})

function showTips(str){
    document.querySelector('.tips-text').innerHTML = str || '请检查您的输入'
    document.querySelector('.tips').style.zIndex = 'initial'
    document.querySelector('.tips').classList.addClass('animated flipInX')
    document.body.classList.addClass('animated shake')
    return function(){
        document.body.classList.removeClass('animated shake')
        document.querySelector('.tips').classList.removeClass('animated flipInX')
        document.querySelector('.tips').classList.addClass('animated flipOutY')
        setTimeout(function(){
            document.querySelector('.tips').style.zIndex = '-1'
            document.querySelector('.tips').classList.removeClass('animated flipOutY')
        },1000)
    }
}

qRouter.init()
// qRouter.on('/'+config.user+'/all',function(req){
qRouter.on('/all',function(req){
    var listAll = document.querySelector('.list.all'),
        listCategory = document.querySelector('.list.category'),
        headerList = document.querySelector('.header').children
    if(listAll.classList.contains('list-active')){
        return
    }else{
        listCategory.classList.removeClass('list-active bounceIn')
        listCategory.classList.addClass('zoomOutDown')
        listAll.classList.removeClass('zoomOutDown')
        listAll.classList.addClass('list-active bounceIn')
        headerList[0].children[0].classList.add('header-active')
        headerList[1].classList.remove('fa-angle-right')
        headerList[1].classList.add('fa-angle-left')
        headerList[2].children[0].classList.remove('header-active')
    }
})
qRouter.on('/category',function(req){
    var listAll = document.querySelector('.list.all'),
        listCategory = document.querySelector('.list.category'),
        headerList = document.querySelector('.header').children
    if(listCategory.classList.contains('list-active')){
        return
    }else{
        listAll.classList.removeClass('list-active bounceIn')
        listAll.classList.addClass('zoomOutDown')
        listCategory.classList.removeClass('zoomOutDown')
        listCategory.classList.addClass('list-active bounceIn')
        headerList[0].children[0].classList.remove('header-active')
        headerList[1].classList.remove('fa-angle-left')
        headerList[1].classList.add('fa-angle-right')
        headerList[2].children[0].classList.add('header-active')
    }
})