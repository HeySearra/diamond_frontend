export const login_manager = {
    set: function(state, uid, name, por){
        if(state){
            localStorage.setItem('state', state);
            localStorage.setItem('uid', uid);
            localStorage.setItem('uname', name);
            localStorage.setItem('por', por);
        }
        else{
            localStorage.setItem('state', false);
        }
    },
    get: function(){
        if(localStorage.getItem('state') && localStorage.getItem('uid')){
            return localStorage.getItem('uid');
        }
        else{
            return false;
        }
    },
    clear: function(){
        localStorage.removeItem('state');
        localStorage.removeItem('uid');
        localStorage.removeItem('uname');
        localStorage.removeItem('por');
    },
    get_uid: function(){
        return localStorage.getItem('uid');
    },
    get_name: function(){
        return localStorage.getItem('uname');
    },
    get_por: function(){
        return localStorage.getItem('por');
    }
}