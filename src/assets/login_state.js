export const login_manager = {
    set: function(state, account, name, por){
        if(state){
            localStorage.setItem('state', state);
            if(account)localStorage.setItem('account', account);
            if(uname)localStorage.setItem('uname', name);
            if(por)localStorage.setItem('por', por);
        }
        else{
            localStorage.setItem('state', false);
        }
    },
    get: function(){
        if(localStorage.getItem('state') && localStorage.getItem('account')){
            return localStorage.getItem('account');
        }
        else{
            return false;
        }
    },
    clear: function(){
        localStorage.removeItem('state');
        localStorage.removeItem('account');
        localStorage.removeItem('uname');
        localStorage.removeItem('por');
    },
    get_account: function(){
        return localStorage.getItem('account');
    },
    get_name: function(){
        return localStorage.getItem('uname');
    },
    get_por: function(){
        return localStorage.getItem('por');
    }
}