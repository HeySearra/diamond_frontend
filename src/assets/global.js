import { Message, MessageBox } from 'element-ui'
export const console_debug = false;
export const alert_msg = {
    success:function(msg){
        Message({
            showClose: true,
            message: msg,
            type: 'success'
        });
    },
    error:function(msg){
        Message({
            showClose: true,
            message: msg,
            type: 'error'
        });
    },
    warning:function(msg){
        Message({
            showClose: true,
            message: msg,
            type: 'warning'
        });
    },
    normal:function(msg){
        Message({
            showClose: true,
            message: msg,
        });
    }
}

export const alert_box = {
    msg:function(title, msg, after_function){
        MessageBox.alert(msg, title, {
            confirmButtonText: "确定",
            callback: action => {
                if(after_function){
                    after_function();
                }
            }
        });
    },
    confirm_msg:function(title, text, confirm_function, cancal_function){
        MessageBox.confirm(text, title, {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: 'warning'
            }).then(() => {
                if(confirm_function){
                    confirm_function();
                }
            }).catch(() => {
                if(cancal_function){
                    cancal_function();
                }
        });
    },
    html:function(title, text){
        MessageBox.prompt(text, title, {
            confirmButtonText: "确认",
            dangerouslyUseHTMLString: true,
        });
    }
};

export const view_type_manager = {
    set: (type) => {
        localStorage.setItem('view_type', type);
    },
    get: () => {return localStorage.getItem('view_type')&&localStorage.getItem('view_type')=='list' ? 'list' : 'block'}
}

export const datetime_format = (t, ct) => {
    let time = new Date(t);
    let cur = new Date(ct);
    if(cur - time < 5*60*1000){
        return '刚刚';
    }
    else if(cur - time < 60*60*1000){
        return parseInt((cur-time)/1000/60) + '分钟前';
    }
    else if(cur - time < 24*60*60*1000){
        return parseInt((cur-time)/60/60/1000) + '小时前';
    }
    else if(cur.getFullYear() == time.getFullYear()){
        return (time.getMonth()+1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + (time.getMinutes()<10?('0'+time.getMinutes()):time.getMinutes()) + ':' + (time.getSeconds()<0?('0'+time.getSeconds()):time.getSeconds());
    }
    else{
        return t;
    }
}

export var magic_word = ['哦', '呀', '啊', '嘤', '惹', '呢', '！', '哼', '~', '嗷', '嘻', '¿', '🐋'];
