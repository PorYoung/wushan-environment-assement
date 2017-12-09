(function(window) {
    // 如果浏览器不支持原生实现的事件，则开始模拟，否则退出。
    if ( "onhashchange" in window ) { return; }

    var location = window.location,
    oldURL = location.href,
    oldHash = location.hash;

    // 每隔100ms检查hash是否发生变化
    setInterval(function() {
    var newURL = location.href,
    newHash = location.hash;

    // hash发生变化且全局注册有onhashchange方法（这个名字是为了和模拟的事件名保持统一）；
    if ( newHash != oldHash && typeof window.onhashchange === "function"  ) {
        // 执行方法
        window.onhashchange({
        type: "hashchange",
        oldURL: oldURL,
        newURL: newURL
        });

        oldURL = newURL;
        oldHash = newHash;
    }
    }, 100);
})(window);

//封装ajax
window._ajax = function(options){
    var opt = {
        method: 'get',
        data: null,
        postData: null,
        async: true,
        url: window.location.host,
        success: null,
        fail: null
    }
    Object.assign(opt, options)
    var XMLHttp = null
    if(XMLHttpRequest){
        XMLHttp = new XMLHttpRequest()
    }else{
        XMLHttp = new ActiveXObject('Microsoft.XMLHTTP')
    }
    var params = []
    if(!!opt.data){
        for(var key in opt.data){
            if(opt.data.hasOwnProperty(key)){
                params.push(key + '=' + opt.data[key])
            }
        }
        opt.postData = params.join('&')
    }
    if(opt.method.toUpperCase() === 'POST'){
        XMLHttp.open(opt.method, opt.url, opt.async)
        XMLHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        XMLHttp.send(opt.postData);
    }else if(opt.method.toUpperCase() === 'GET'){
        XMLHttp.open(opt.method, opt.url + '?' + opt.postData, opt.async)
        XMLHttp.send(null)
    }else{
        return
    }
    XMLHttp.onreadystatechange = function () {
        if (XMLHttp.readyState == 4){
            if(XMLHttp.status == 200) {
                var res = XMLHttp.responseText
                try{
                    res = JSON.parse(XMLHttp.responseText)
                }catch(e){
                    console.log(e)
                }
                return !!opt.success?opt.success(res):null
            }else{
                return !!opt.fail?opt.fail(XMLHttp.status,XMLHttp.statusText):null
            }
        }
    }
}

//模拟NodeList forEach
if(!NodeList.prototype.hasOwnProperty('forEach')){
    NodeList.prototype.forEach = function(callback){
        var item = null
        for(var i = 0;i < this.length;i++){
            item = this[i]
            callback(item)
        }
    }
}

//模拟Object.assign
if(!Object.prototype.hasOwnProperty('assign')){
    Object.prototype.assign = function(ori, src){
        if(!ori){
            throw error('Origin Object needed.')
        }
        if(!src){
            throw error('Src Object cannot be null.')
        }
        for(key in src){
            if(src.hasOwnProperty(key)){
                ori[key] = src[key]
            }
        }
    }
}

//模拟jquery addClass
if(!DOMTokenList.prototype.hasOwnProperty('addClass')){
    DOMTokenList.prototype.addClass = function(classlist){
        if(!classlist){
            throw error("class list cannot be null")
        }
        var list = classlist.split(' '),
            that = this
        list.forEach(function(cs){
            if(that.contains(cs)){
                return
            }else{
                that.add(cs)
            }
        })
    }
}
//模拟jquery removeClass
if(!DOMTokenList.prototype.hasOwnProperty('removeClass')){
    DOMTokenList.prototype.removeClass = function(classlist){
        if(!classlist){
            throw error("class list cannot be null")
        }
        var list = classlist.split(' '),
            that = this
        list.forEach(function(cs){
            if(that.contains(cs)){
                that.remove(cs)
            }else{
                return
            }
        })
    }
}

function _addLoadEvent(func) {
    //把现有的 window.onload 事件处理函数的值存入变量
    var oldOnload = window.onload;
    if (typeof window.onload != "function") {
      //如果这个处理函数还没有绑定任何函数，就像平时那样添加新函数
      window.onload = func;
    } else {
      //如果处理函数已经绑定了一些函数，就把新函数添加到末尾
      window.onload = function() {
        oldOnload();
        func();
      }
    }
  }