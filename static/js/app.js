(function t() {
    var inputArr = document.querySelectorAll('.form-input')
    inputArr.forEach(function (item) {
        if (item.type == "button" || item.type == "checkbox" || item.type == "radio") {
            return
        }
        item.addEventListener('focusin', formInputFocusin)
        item.addEventListener('focusout', formInputFocusout)
    })

    var formCategory = document.querySelector('.form-submit.category')
    formCategory.addEventListener('click', bindSubmitCategoryEvent)
    function bindSubmitCategoryEvent() {
        getInputElements('.list.category')
    }
    //获取指定form中的所有的<input>对象  
    function getInputElements(formId) {
        var form = document.querySelector(formId)
        var elements = []
        var tagElements = form.getElementsByTagName('input');
        for (var j = 0; j < tagElements.length; j++) {
            if (tagElements[j].type == "number" || tagElements[j].type == "text") {
                if (tagElements[j].value == '' && !tagElements[j].name.match(/(DateMonth)|(DateYear)/)) {
                    formCategory.removeEventListener('click', bindSubmitCategoryEvent)
                    var closeTips = showTips()
                    return function () {
                        setTimeout(function () {
                            closeTips()
                            formCategory.addEventListener('click', bindSubmitCategoryEvent)
                        }, 3000)
                    }()
                }
            }
            elements.push(tagElements[j])
        }
        var obj = {}
        elements.forEach(function (ele) {
            switch (ele.type) {
                case 'checkbox': {
                    if(!!obj[ele.name]){              
                        if(typeof obj[ele.name] !== "object"){
                            var t = obj[ele.name]
                            obj[ele.name] = []
                            obj[ele.name].push(t)
                            obj[ele.name].push(ele.checked)
                        }else{
                            obj[ele.name].push(ele.checked)
                        }
                        obj[ele.name].push(ele.checked)
                    }else{
                        obj[ele.name] = ele.checked
                    }
                    break
                }
                case 'number': {
                    if(!!obj[ele.name]){              
                        if(typeof obj[ele.name] !== "object"){
                            var t = obj[ele.name]
                            obj[ele.name] = []
                            obj[ele.name].push(t)
                            obj[ele.name].push(parseFloat(ele.value))
                        }else{
                            obj[ele.name].push(parseFloat(ele.value))
                        }
                        obj[ele.name].push(parseFloat(ele.value))
                    }else{
                        obj[ele.name] = parseFloat(ele.value)
                    }
                    break
                }
                case 'text': {
                    obj[ele.name] = ele.value
                    break
                }
            }
        })
        Object.assign(config.data, obj)
        qRouter.go('/'+config.user+'/submit')
    }
    window.onbeforeunload = function(event){
        event.returnValue = '信息尚未提交，您确定要离开吗'
    }
})()

function formInputFocusin() {
    var label = this.previousElementSibling
    label.classList.add('input-active')
}
function formInputFocusout() {
    var label = this.previousElementSibling,
        value = this.value
    if (value == '') {
        label.classList.remove('input-active')
    }
}

qRouter.on('/' + config.user + '/category', function (req) {
    var listCategory = document.querySelector('.list.category')
    if (listCategory.classList.contains('list-active')) {
        return
    } else {
        listCategory.classList.removeClass('zoomOutDown')
        listCategory.classList.addClass('list-active bounceIn')
    }
})