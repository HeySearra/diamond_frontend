import { Message, MessageBox } from 'element-ui'

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