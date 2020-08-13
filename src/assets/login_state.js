export const login_manager = {
    set: function(state, uid, name, por){
        if(state){
            localStorage.setItem('state', state);
            if(uid)localStorage.setItem('uid', uid);
            if(name)localStorage.setItem('name', name);
            if(por)localStorage.setItem('por', por);
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
        localStorage.removeItem('name');
        localStorage.removeItem('por');
    },
    get_uid: function(){
        return localStorage.getItem('uid');
    },
    get_name: function(){
        return localStorage.getItem('name');
    },
    get_por: function(){
        return localStorage.getItem('por');
    }
}