<template>
    <div class="user_info_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            width="450px">
            <h3>用户信息</h3>
            <div class="content">
                <div style="height:20px"></div>
                <div class="por">
                    <el-avatar :src="src"></el-avatar>
                </div>
                <h2 class="name">{{name}} <el-tag type="info" v-if="is_me" disable-transitions>我</el-tag></h2>
                <div class="acc">{{account}}</div>
                <div class="intro">{{intro}}</div>
                <el-button type="primary" class="chat_button" v-show="!is_me" @click="build_chat">私聊</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'user-info-dialog',

  data () {
    return {
        src:'',
        name:'',
        uid: '',
        account:'',
        intro: '',
        dia_vis:false,
        is_me:false
    }
  },
  methods:{
    open(uid){
        this.uid = uid;
        this.is_me = uid==this.login_manager.get_uid();
        this.apply_for_info(uid);
    },

    getCookie (name) {
        var value = '; ' + document.cookie
        var parts = value.split('; ' + name + '=')
        if (parts.length === 2) return parts.pop().split(';').shift()
    },

    apply_for_info(uid){
        let url = '/user/user_info?uid=' + uid;
        var that = this;
        $.ajax({ 
            type:'get',
            url: url,
            headers: {'X-CSRFToken': this.getCookie('csrftoken')},
            async:false,
            success:function (res){ 
                if(that.console_debug){
                    console.log(url +  '：' + res.status);
                }
                if(res.status == 0){
                    that.name = res.name;
                    that.account = res.acc;
                    that.src = res.portrait;
                    setTimeout(function(){
                        that.dia_vis = true;
                    }, 0);
                }
                else{
                    switch(res.status){
                        case 2:
                            that.alert_msg.error('权限不足');
                            break;
                        default:
                            that.alert_msg.error('发生了未知错误');
                    }
                }
            },
            error:function(res){
                that.alert_msg.error('网络连接失败');
            }
        });
    },

    build_chat(){
        if(this.uid == this.login_manager.get_uid()){
            let random = parseInt(Math.random()*100000);
            this.alert_msg.normal('你好寂寞' + this.magic_word[random%this.magic_word.length]);
            return;
        }
        var flag = true;
        let url = '/chat/build_chat';
        var that = this;
        $.ajax({
            type:'post',
            url: url,
            headers: {'X-CSRFToken': this.getCookie('csrftoken')},
            data: JSON.stringify({uid:this.uid}),
            async:false,
            success:function (res){
                if(that.console_debug){
                    console.log(url +  '：' + res.status);
                }
                if(res.status == 0){
                    flag = true;
                }
                else{
                    switch(res.status){
                        case 2:
                            that.alert_msg.error('权限不足');
                            break;
                        case 3:
                            that.alert_msg.error('找不到用户');
                            break;
                        default:
                            that.alert_msg.error('发生了未知错误');
                    }
                    flag = false;
                }
            },
            error:function(res){
                that.alert_msg.error('网络连接失败');
                flag = false;
            }
        });
        if(flag){
            this.$emit('open_chatting_dialog', this.uid);
            this.dia_vis = false;
        }
    },
  }
}
</script>


<style scoped>
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");

.por{
    text-align: center;
}

.por span{
    width:80px;
    height:80px;
}

.name{
    font-size: 21px;
    font-weight: bold;
    word-break: break-all;
    text-align: center;
    margin:15px 0 5px;
}

.acc{
    word-break: break-all;
    text-align: center;
    color:#bbb;
}

.intro{
    margin-top:25px;
    padding: 0 25px;
    font-size: 15px;
    line-height:27px;
}

.chat_button{
    width:75%;
    margin:0 auto;
    display:block;
    margin-top:30px;
    letter-spacing: 3em;
    text-indent: 3em;
}

.el-tag{
    padding:0 10px;
    line-height:23px;
    height:23px;
}

</style>
