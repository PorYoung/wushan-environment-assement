(function(){
    _addLoadEvent(function(){
        if(!!config.user){
            document.body.style.opacity = '0'
            window._ajax({
                url: '/api/permission',
                data: {
                    username: config.user
                },
                success: function(res){
                    if(!!res && res == '1'){
                        config.user = config.user
                        var html = "<i class='fa fa-spinner fa-pulse fa-3x fa-fw'></i><span class='sr-only'>Loading...</span>"
                        var clearMyLoading = myLoading("Loading...",html)
                        window._ajax({
                            url: '/'+config.user,
                            data:{
                                username: config.user
                            },
                            success: function(data){
                                if(!!data && data != '-1'){
                                    var link = document.getElementsByTagName('link')
                                    for(var i = 0;i < link.length;i++){
                                        if(link[i].href.match(/\/login.css$/)){
                                            link[i].parentNode.removeChild(link[i])
                                            break
                                        }
                                    }
                                    if(config.user != 'DRC' && config.user != 'Manager'){
                                        _loadJs('/static/js/app.js')
                                    }else{
                                        _loadCss('/static/css/DRC.css')
                                    }
                                    _loadCss('/static/css/app.css')
                                    _loadJs('/static/js/'+config.user+'.js',{
                                        async: true
                                    })
                                    document.body.innerHTML = data
                                    setTimeout(function () {
                                        clearMyLoading()
                                        var cur = window.location.href
                                        if(cur.match(/\/submit/)){
                                            if(config.user != 'DRC' && config.user != 'Manager'){
                                                qRouter.go('/'+config.user+'/category')
                                            }else{
                                                qRouter.go('/'+config.user)
                                            }
                                            qRouter.refresh()
                                        }else
                                            qRouter.refresh()
                                        document.body.style.opacity = '1'
                                    },1200)
                                }else{
                                    clearMyLoading()
                                    html = "<i class='fa fa-remove fa-4x fa-fw' style='color: #00EE00'></i><span class='sr-only'>Failed</span>"
                                    clearMyLoading = myLoading("Failed，请重新登陆",html)
                                    setTimeout(function () {
                                        clearMyLoading()
                                        window.location.href = '/'
                                        document.body.style.opacity = '1'
                                    },1200)
                                }
                            }
                        })
                    }else{
                        window.location.href = '/'
                        document.body.style.opacity = '1'
                    }
                }
            })
        }
        var userlist = document.querySelectorAll('.user-list .option'),
            loginBtn = document.querySelector('.login-btn')
        userlist.forEach(function(item){
            item.addEventListener('click',chooseUser)
        })
        loginBtn.addEventListener('click', loginHandle)
        
        function chooseUser(){
            var value = this.dataset.value
            var preActive = document.querySelector('.user-active')
            !!preActive && preActive.classList.remove('user-active')
            this.classList.add('user-active')
            var username = document.querySelector('.username')
            username.dataset.value = value
        }
        function loginHandle(){
            var username = document.querySelector('.username').dataset.value
            var password = document.querySelector('.password input[type="password"]').value
            if(!username || !username.match(/(DRC)|(BLR)|(FB)|(WA)|(EPB)|(Manager)/)){
                var closeTips = showTips('请选择您的单位')
                setTimeout(function(){
                    closeTips()
                },3000)
                return
            }
            if(!password){
                var closeTips = showTips('请输入您的密码')
                setTimeout(function(){
                    closeTips()
                },3000)
                return
            }
            window._ajax({
                data:{
                    username: username,
                    password: password,
                },
                method: 'post',
                url: '/api/login',
                success: function(res){
                    if(!!res && res.status == '1'){
                        clearTimeout(timer)
                        qRouter.go('/'+res.username)
                    }else{
                        var closeTips = showTips('密码有误')
                        setTimeout(function(){
                            closeTips()
                        },3000)
                    }
                }
            })
        }

        var timer = bgAnimation()
    })
})()