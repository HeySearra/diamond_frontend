<template>
    <transition name="el-zoom-in-top">
        <div class="chatting_room" v-show="show">
            <div class="user_list">
                <chat-user-list-item
                    ref="chat_user_list_item"
                    v-for="item in user_list"
                    :key="item.uid"
                    :uid="item.uid"
                    :name="item.name"
                    :src="item.src"
                    :content="item.last_message"
                    @click="choose_user">
                </chat-user-list-item>
            </div>
            <div class="chatting_area" v-loading="is_loading">
                <div class="bubble_window" id="bubble_window">
                    <chatting-bubble
                        v-for="(item, index) in chatting_list"
                        :key="index"
                        :type="item.is_mine?'my':'other'"
                        :text="item.text">
                    </chatting-bubble>
                    <div class="bottom clear_both"></div>
                </div>
                <div class="input_area">
                    <textarea style="resize:none" :disabled="uid==''" v-model="text" @keydown="keydown"></textarea>
                </div>
                <div class="button_area">
                    <el-button type="primary" plain :disabled="!text" @click="send">发送</el-button>
                </div>
            </div>
        </div>
    </transition>
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
                timer:undefined,
                is_loading:true,
                is_bottom:true,
                show: false
            }
        },

        mounted(){
        },

        methods:{
            open(uid){
                var that = this;
                this.uid = '';
                this.chatting_list = [];
                this.choose_user('');
                clearInterval(this.timer);
                this.init();
                this.timer = setInterval(function(){
                    that.init(true);
                }, 1000*2);
                $("#bubble_window").off('scroll');
                $("#bubble_window").scroll(function(){
                    if(Math.abs($("#bubble_window").scrollTop() - $("#bubble_window")[0].scrollHeight) < 20){
                        that.is_bottom = true;
                    }
                    else{
                        that.is_bottom = false;
                    }
                });
                if(uid){
                    this.choose_user(uid);
                }
                this.show = true;
            },

            init(refresh){
                if(!refresh){
                    this.is_loading = true;
                }
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
                    this.choose_user(this.uid, refresh);
                }
                else{
                    this.is_loading = false;
                }
                return result;
            },

            getCookie (name) {
                var value = '; ' + document.cookie
                var parts = value.split('; ' + name + '=')
                if (parts.length === 2) return parts.pop().split(';').shift()
            },

            choose_user(uid, refresh){
                let force_bottom = false;
                if(this.uid != uid){
                    force_bottom = true;
                    if(uid == ''){
                        this.$emit('change_title', '');
                    }
                    else{
                        for(let i=0; i<this.user_list.length; i++){
                            if(uid == user_list[i].uid){
                                this.$emit('change_title', this.user_list[i].name);
                                break;
                            }
                        }
                    }
                }
                this.uid = uid;
                let item = this.$refs.chat_user_list_item;
                if(item){
                    for(let i=0; i<item.length; i++){
                        item[i].choose(uid);
                    }
                }
                if(force_bottom){
                    this.is_loading = true;
                }
                var that = this;
                setTimeout(function(){
                    that.init_chatting_bubble(refresh&&!force_bottom, force_bottom);
                }, 150);
            },

            init_chatting_bubble(refresh, force_buttom){
                if(this.uid == ''){
                    this.is_loading = false;
                    return;
                }
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
                        setTimeout(function(){
                            if(!that.is_bottom && !force_buttom){
                                return;
                            }
                            if(refresh){
                                $("#bubble_window").animate({scrollTop:$("#bubble_window")[0].scrollHeight}, 800);
                            }
                            else{
                                $("#bubble_window").scrollTop($("#bubble_window")[0].scrollHeight);
                            }
                            if(force_buttom){
                                setTimeout(function(){
                                    that.is_loading = false;
                                }, 100);
                            }
                            else{
                                that.is_loading = false;
                            }
                            //document.getElementById('bubble_window').scrollIntoView({behavior: 'smooth', block:'end'});
                            
                        }, 10);
                    },
                    error:function(){
                        if(!refresh){
                            that.alert_msg.error('网络连接失败');
                        }
                    }
                });
            },

            send(){
                if(this.text.trim() == ''){
                    this.alert_msg.warning('请输入内容');
                    this.text = '';
                    return;
                }
                var that = this;
                let url = '/chat/send';
                let msg = {
                    uid:this.uid,
                    text:this.text
                }
                $.ajax({
                    type:'post',
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
                            that.is_bottom = true;
                            that.init_chatting_bubble(true);
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
                this.show = false;
            },

            keydown(e){
                if(e.keyCode == 13){
                    e.preventDefault()
                    this.send();
                }
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
        width: calc(100% - 27px);
        overflow-y:overlay;
        padding:20px 17px 20px 10px;
        /* scroll-behavior:smooth; */
    }

    .bubble_window::-webkit-scrollbar {
        display:none
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
        transition: all 0.1s linear;
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
        margin-top:15px;
    }

    textarea:disabled{
        background-color: hsl(0, 0%, 97%) !important;
    }
</style>
