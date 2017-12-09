(function(){
    window.onload = function(){
        var userListOpenBtn = document.querySelector('.user-select'),
            userList = document.querySelector('.user-list'),
            userOptions = userList.querySelectorAll('.option'),
            loginBtn = document.querySelector('.login-btn')
        userListOpenBtn.addEventListener('mouseenter', userListOpen)
        
        userOptions.forEach(function(item){
            item.addEventListener('click', chooseUser)
        })
        
        loginBtn.addEventListener('click', loginHandle)
        
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
        function loginHandle(){
            var username = document.querySelector('.user-current').dataset.value
            var password = document.querySelector('.password input[type="password"]').value
            if(!username || !username.match(/(DRC)|(BLR)|(FB)|(WA)|(EPB)|(Manager)/)){
                alert("请选择您的单位")
                return
            }
            if(!password){
                alert('请输入您的密码')
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
                        qRouter.go('/'+res.username)
                    }else{
                        alert('faile')
                    }
                }
            })
        }
    }
})()