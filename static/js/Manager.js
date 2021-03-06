(function(){
    var userListOpenBtn = document.querySelector('.user-select'),
    userList = document.querySelector('.user-list'),
    userOptions = userList.querySelectorAll('.option'),
    submitBtn = document.querySelector('.submit-btn'),
    initBtn = document.querySelector('.initialAll')
    userListOpenBtn.addEventListener('mouseenter', userListOpen)

    userOptions.forEach(function(item){
        item.addEventListener('click', chooseUser)
    })

    submitBtn.addEventListener('click', submitHandle)
    initBtn.addEventListener('click', initialHandle)

    function userListOpen(){
        userList.style.opacity = '1'
        userList.style.pointerEvents = 'auto'
        userList.style.webkitTransform = 'scale(1) translateY(0)'
        userList.style.msTransform = 'scale(1) translateY(0)'
        userList.style.transform = 'scale(1) translateY(0)'
        userList.addEventListener('mouseleave',userListClose)
        userListOpenBtn.removeEventListener('mouseenter', userListOpen)
        document.querySelector('.wrap').addEventListener('mouseleave', userListClose)
    }
    function userListClose(){
        userList.removeAttribute('style')
        userList.removeEventListener('mouseleave', userListClose)
        userListOpenBtn.addEventListener('mouseenter',userListOpen)
        document.querySelector('.wrap').removeEventListener('mouseleave', userListClose)
    }
    function chooseUser(){
        var current = document.querySelector('.user-current')
        current.innerHTML = this.innerHTML
        current.dataset.value = this.dataset.value
        userListClose()
    }

    function submitHandle(){
        var updateUsername = document.querySelector('.user-current').dataset.value
        var updatePassword = document.querySelector('.password input[name="updatePassword"]').value,
            ManagerPassword = document.querySelector('.password input[name="password"]').value
        if(!updateUsername || !updateUsername.match(/(DRC)|(BLR)|(FB)|(WA)|(EPB)|(Manager)/)){
            var closeTips = showTips("?????????????????????????????????")
            setTimeout(function(){
                closeTips()
            },3000)
            return
        }
        if(!updatePassword){
            var closeTips = showTips('????????????????????????')
            setTimeout(function(){
                closeTips()
            },3000)
            return
        }
        if(!ManagerPassword){
            var closeTips = showTips('????????????????????????')
            setTimeout(function(){
                closeTips()
            },3000)
            return
        }
        window._ajax({
            data:{
                updateUsername: updateUsername,
                updatePassword: updatePassword,
                password: ManagerPassword,
                username: 'Manager'
            },
            method: 'post',
            url: '/api/update',
            success: function(res){
                if(!!res && res == '1'){
                    var closeTips = showTips('????????????',true)
                    setTimeout(function(){
                        closeTips()
                    },3000)
                }else{
                    var closeTips = showTips('????????????????????????')
                    setTimeout(function(){
                        closeTips()
                    },3000)
                }
            }
        })
    }

    function initialHandle(){
        var ManagerPassword = document.querySelector('.password input[name="password"]').value
        if(!ManagerPassword){
            var closeTips = showTips("?????????????????????")
            setTimeout(function(){
                closeTips()
            },3000)
            return
        }
        var flag = confirm("???????????????????????????")
        if(!flag){
            return
        }
        window._ajax({
            data:{
                password: ManagerPassword,
                username: 'Manager'
            },
            method: 'post',
            url: '/api/initial',
            success: function(res){
                if(!!res && res == '1'){
                    var closeTips = showTips('???????????????,????????????',true)
                    setTimeout(function(){
                        closeTips()
                        window.location.href = '/api/logout'
                    },3000)
                }else{
                    var closeTips = showTips('???????????????????????????')
                    setTimeout(function(){
                        closeTips()
                    },3000)
                }
            }
        })
    }
})()