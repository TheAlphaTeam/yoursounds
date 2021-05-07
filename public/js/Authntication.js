'use strict';





const checkLogin = () => {
    if (!window.localStorage.user)  
        window.location.href = "/";
}



checkLogin();