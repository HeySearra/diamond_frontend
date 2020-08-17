<template>
    <div class="chatting_room">
        <div class="user_list">
            <chat-user-list-item
                v-for="item in user_list"
                :key="item.uid"
                :uid="item.uid"
                :name="item.name"
                :src="item.src"
                :content="item.last_message"
                @click="choose_user">
            </chat-user-list-item>
        </div>
        <div class="chatting_area">
            <div class="bubble_window">
                <chatting-bubble
                    v-for="(item, index) in chatting_list"
                    :key="index"
                    :type="item.is_mine?'my':'other'"
                    :text="item.text">
                </chatting-bubble>
            </div>
            <div class="input_area">
                <textarea style="resize:none" v-model="text" @keyup.enter.native="send()"></textarea>
            </div>
            <div class="button_area">
                <el-button type="primary" plain :disabled="!text" @click="send">发送</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                text:'',
                user_list:[],
                chatting_list:[],
                uid:'',
                other_src:'',
                my_src:'',
                timer:undefined
            }
        },

        mounted(){
            var that = this;
            this.timer = setInterval(function(){
                that.init();
            }, 1000*5);
        },

        methods:{
            init(refresh){
                var result = false;
                var that = this;
                let url = '/chat/list';
                $.ajax({
                    type:'get',
                    url: url,
                    headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                    async:false, 
                    success:function (res){
                        if(that.console_debug){
                            console.log(url+ " : " +res.status);
                        }
                        if(res.status == 0){
                            that.user_list = res.list;
                            result = true;
                        }
                        else{
                            if(!refresh){
                                that.alert_msg.error('请求内容失败');
                            }
                            result = false;
                        }
                    },
                    error:function(){
                        if(!refresh){
                            that.alert_msg.error('网络连接失败');
                        }
                        result = false;
                    }
                });

                if(this.uid != ''){
                    this.choose_user(uid);
                }
                return result;
            },

            getCookie (name) {
                var value = '; ' + document.cookie
                var parts = value.split('; ' + name + '=')
                if (parts.length === 2) return parts.pop().split(';').shift()
            },

            choose_user(uid){
                this.$refs.chat_user_list.choose(uid);
                this.init_chatting_bubble();
            },

            init_chatting_bubble(refresh){
                var that = this;
                let url = '/chat/content?uid=' + this.uid;
                $.ajax({
                    type:'get',
                    url: url,
                    headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                    async:false, 
                    success:function (res){
                        if(that.console_debug){
                            console.log(url+ " : " +res.status);
                        }
                        if(res.status == 0){
                            that.chatting_list = res.list;
                        }
                        else{
                            if(!refresh){
                                that.alert_msg.error('请求内容失败');
                            }
                        }
                    },
                    error:function(){
                        if(!refresh){
                            that.alert_msg.error('网络连接失败');
                        }
                    }
                });
            },

            send(){
                var that = this;
                let url = '/chat/send';
                let msg = {
                    uid:this.uid,
                    text:this.text
                }
                $.ajax({
                    type:'get',
                    url: url,
                    headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                    data: JSON.stringify(msg),
                    async:false, 
                    success:function (res){
                        if(that.console_debug){
                            console.log(url+ " : " +res.status);
                        }
                        if(res.status == 0){
                            that.text = '';
                            that.init_chatting_bubble();
                        }
                        else{
                            that.alert_msg.error('发送内容失败');
                        }
                    },
                    error:function(){
                        that.alert_msg.error('网络连接失败');
                    }
                });
            },

            close(){
                clearInterval(this.timer);
            }
        }

    }
</script>

<style scoped>
    @import url("../assets/common.css");

    .chatting_room{
        position: relative;
        width:750px;
        height:600px;
        /* border:1px solid #ccc; */
    }

    .user_list{
        position: absolute;
        top:0;
        left:0;
        height:100%;
        width:200px;
        overflow-y:auto;
        border:1px solid #ccc;
        border-right:unset;
    }

    .chatting_area{
        position: absolute;
        top:0;
        left:200px;
        height:100%;
        width: calc(100% - 200px);
        border:1px solid #ccc;
    }

    .bubble_window{
        position: absolute;
        top:0;
        left:0;
        height:430px;
        width: calc(100% - 20px);
        overflow-y:auto;
        padding:20px 10px;
    }

    .input_area{
        position: absolute;
        top:469px;
        left:0;
        height:calc(100% - 470px);
        width: 100%;
        border-top:1px solid #ccc;
        border-bottom:1px solid #ccc;
        overflow: hidden;
    }

    textarea{
        font-size:16px;
        line-height:23px;
        padding: 10px 20px;
        width:calc(100% - 20px);
        height:calc(100% - 20px);
        overflow-y:auto;
        font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif !important;
        color:#343434;
        border:unset;
    }

    textarea:focus{
        outline: none;
    }

    .button_area{
        position: absolute;
        bottom:6px;
        right:36px;
        width: 30px;
    }

    .button_area .el-button{
        padding:6px 15px;
    }

    .cb{
        margin-top:11px;
    }
</style>
