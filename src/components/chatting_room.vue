<template>
    <transition name="el-zoom-in-top">
        <div class="chatting_room" v-show="show">
            <div class="chatting_room_header can_not_choose">{{title}}<span class="el-icon-close close_icon" @click="close"></span></div>
            <div class="user_list">
                <chat-user-list-item
                    ref="chat_user_list_item"
                    v-for="item in user_list"
                    :key="item.uid"
                    :uid="item.uid"
                    :name="item.name"
                    :no_read="!item.is_read"
                    :src="item.src"
                    :content="item.last_message"
                    @click="choose_user">
                </chat-user-list-item>
            </div>
            <div class="chatting_area" v-loading="is_loading">
                <div class="bubble_window" id="bubble_window">
                    <div
                        v-for="(item, index) in chatting_list"
                        :key="index"
                        style="height:fit-content">
                        <div class="chatting_time not_found">{{item.time}}</div>
                        <chatting-bubble
                            v-for="(iitem, iindex) in item.list"
                            :key="iindex"
                            :type="iitem.is_mine?'my':'other'"
                            :text="iitem.text"
                            :src="iitem.is_mine?my_por:another_por">
                        </chatting-bubble>
                        </div>
                        <div class="bottom clear_both"></div>
                    </div>
                    
                </div>
                <transition name="el-fade-in-linear">
                    <div class="input_area">
                        <textarea style="resize:none" :disabled="uid==''" v-model="text" @keydown="keydown" maxlength="300"></textarea>
                    </div>
                </transition>
                <transition name="el-fade-in-linear">
                    <div class="button_area">
                        <el-button type="primary" plain :disabled="!text" @click="send">发送</el-button>
                    </div>
                </transition>
            </div>
        </div>
    </transition>
</template>
<script>
    import chat_user_list_item from '@/components/chat_user_list_item';
    import chatting_bubble from '@/components/chatting_bubble';
    export default {
        name: 'chatting-room',

        components:{
            'chat-user-list-item' :chat_user_list_item, 
            'chatting-bubble': chatting_bubble
        },

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
                show: false,
                title:'',
                another_por: '',
                my_por: '',
                save_list:[]
            }
        },

        mounted(){
        },

        methods:{
            open(uid){
                var that = this;
                this.uid = '';
                this.title = '';
                this.text = '';
                this.chatting_list = [];
                this.choose_user('');
                clearInterval(this.timer);
                this.init();
                this.timer = setInterval(function(){
                    that.init(true);
                }, 1000*5);
                $("#bubble_window").off('scroll');
                $("#bubble_window").scroll(function(){
                    if(Math.abs($("#bubble_window")[0].scrollTop + $("#bubble_window")[0].clientHeight - $("#bubble_window")[0].scrollHeight) < 20){
                        that.is_bottom = true;
                    }
                    else{
                        that.is_bottom = false;
                    }
                    // console.log(Math.abs($("#bubble_window")[0].scrollTop + $("#bubble_window")[0].clientHeight - $("#bubble_window")[0].scrollHeight))
                    // console.log(that.is_bottom);
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
                    processData: false,
                    contentType: false, 
                    success:function (res){
                        if(that.console_debug){
                            console.log(url+ " : " +res.status);
                        }
                        if(res.status == 0){
                            that.user_list = res.list;
                            setTimeout(function(){
                                let item = that.$refs.chat_user_list_item;
                                if(item){
                                    for(let i=0; i<item.length; i++){
                                        item[i].init();
                                    }
                                }
                            }, 0);
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
                        this.title = ''
                    }
                    else{
                        for(let i=0; i<this.user_list.length; i++){
                            if(uid == this.user_list[i].uid){
                                this.title = this.user_list[i].name;
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
                    processData: false,
                    contentType: false,
                    success:function (res){
                        if(that.console_debug){
                            console.log(url+ " : " +res.status);
                        }
                        if(res.status == 0){
                            that.chatting_list = [];
                            that.save_list = res.list;
                            let start_dt;
                            let last_dt;
                            if(res.list.length){
                                start_dt = new Date(res.list[0].dt);
                                last_dt = new Date(res.list[0].dt);
                            }
                            else{
                                that.is_loading = false;
                                return;
                            }
                            let list = [];
                            that.my_por = res.user_info.src;
                            that.another_por = res.another_info.src;
                            for(let i=0; i<res.list.length; i++){
                                if(new Date(res.list[i].dt) - last_dt > 1000*60*3){
                                    var llist = [];
                                    for(let i=0; i<list.length; i++){
                                        llist.push(list[i]);
                                    }
                                    let content = {
                                        time: that.datetime_format_for_chatting(start_dt, res.cur_dt),
                                        list: llist
                                    };
                                    start_dt = new Date(res.list[i].dt);
                                    list = [];
                                    that.chatting_list.push(content);
                                }
                                last_dt = new Date(res.list[i].dt);
                                list.push(res.list[i]);
                            }
                            var llist = [];
                            for(let i=0; i<list.length; i++){
                                llist.push(list[i]);
                            }
                            let content = {
                                time: that.datetime_format_for_chatting(start_dt, res.cur_dt),
                                list: llist
                            };
                            that.chatting_list.push(content);
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
                                $("#bubble_window").animate({scrollTop:$("#bubble_window")[0].scrollHeight}, 500);
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
                this.add_chatting_bubble(this.text);
                this.text = '';
                $.ajax({
                    type:'post',
                    url: url,
                    headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                    data: JSON.stringify(msg),
                    processData: false,
                    contentType: false,
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
                var that = this;
                setTimeout(function(){
                    that.$emit('close');
                }, 30);
                
            },

            keydown(e){
                if(e.keyCode == 13){
                    e.preventDefault()
                    this.send();
                }
            },

            datetime_format_for_chatting(t, ct){
                let dt = t;
                let cdt = new Date(ct);
                if(cdt - dt <= 2*24*60*60*1000){
                    if(cdt.getDate() == dt.getDate()){
                        return dt.getHours() + ':' + (dt.getMinutes()<10?('0'+dt.getMinutes()):dt.getMinutes());
                    }
                    else if(cdt.getDate()-dt.getDate() == 1){
                        return '昨天 ' + dt.getHours() + ':' + (dt.getMinutes()<10?('0'+dt.getMinutes()):dt.getMinutes());
                    }
                    else{
                        return (dt.getMonth()+1) + '月' + dt.getDate() + '日 ' + dt.getHours() + ':' + (dt.getMinutes()<10?('0'+dt.getMinutes()):dt.getMinutes());
                    }
                }
                else{

                    if(cdt.getFullYear() == dt.getFullYear()){
                        return (dt.getMonth()+1) + '月' + dt.getDate() + '日 ' + dt.getHours() + ':' + (dt.getMinutes()<10?('0'+dt.getMinutes()):dt.getMinutes());
                    }
                    else{
                        return dt.getFullYear() + '年' + (dt.getMonth()+1) + '月' + dt.getDate() + '日 ' + dt.getHours() + ':' + (dt.getMinutes()<10?('0'+dt.getMinutes()):dt.getMinutes());
                    }
                }
            },

            add_chatting_bubble(text){
                var last_dt = this.save_list.length-1<0 ? new Date('1900-1-1') : new Date(this.save_list[this.save_list.length-1].dt);
                var now_dt = new Date();
                if(now_dt - last_dt > 1000*60*3){
                    var content = {
                        time: this.datetime_format_for_chatting(now_dt, now_dt),
                        list: [{is_mine:true, dt:now_dt, text:text}]
                    };
                    this.chatting_list.push(content);
                }
                else{
                    this.chatting_list[this.chatting_list.length-1].list.push({is_mine:true, dt:now_dt, text:text});
                }
                $("#bubble_window").animate({scrollTop:$("#bubble_window")[0].scrollHeight}, 500);
            }
        }

    }
</script>

<style scoped>
    @import url("../assets/common.css");

    .chatting_room{
        position: absolute;
        width:80%;
        left:9%;
        height:calc(100vh - 50px);
        top:20px;
        border:solid 1px hsl(0, 0%, 78%);
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 1px 2px 3px hsla(0, 0%, 0%, 0.23) !important;
        /* border:1px solid #ccc; */
    }

    .chatting_room_header{
        position: absolute;
        top:0;
        left:300px;
        height: 56px;
        padding-right: 2em;
        line-height: 56px;
        font-weight: bold;
        font-size: 21px;
        text-indent: 1em;
        width:calc(100% - 300px - 2em);
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1; /* 行数 */
        overflow: hidden;
        background-color: hsla(0, 0%, 99%, 0.96);
        border-bottom:solid 1px hsl(0, 0%, 87%);
    }

    .user_list{
        position: absolute;
        top:0;
        left:0;
        height:100%;
        width:299px;
        overflow-y:auto;
        background-color: hsla(0, 0%, 93%, 0.93);
        border-right:solid 1px #ccc;
        
    }

    .chatting_area{
        position: absolute;
        top:57px;
        left:300px;
        height:calc(100% - 57px);
        width: calc(100% - 300px);
        background-color: hsla(0, 0%, 100%, 0.56);
    }

    .bubble_window{
        position: absolute;
        top:0;
        left:0;
        height:calc(100% - 240px);
        width: calc(100% - 50px);
        overflow-y:overlay;
        padding:20px 23px 20px 23px;
        /* scroll-behavior:smooth; */
    }

    .input_area{
        position: absolute;
        bottom:0;
        right:0;
        height:200px;
        width: calc(100% - 300px);
        border-top:solid 1px hsla(0, 0%, 87%, 0.96);
        background-color: hsl(0, 0%, 100%, 0.96);
        overflow: hidden;
    }

    textarea{
        font-size:17px;
        line-height:25px;
        padding: 20px 20px 20px 30px;
        width:calc(100% - 50px);
        height:106px;
        overflow-y:auto;
        font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif !important;
        color:#343434;
        border:unset;
        background:unset;
        transition: all 0.1s linear;
    }

    textarea:focus{
        outline: none;
    }

    .button_area{
        position: absolute;
        bottom:12px;
        right:69px;
        width: 36px;
    }

    .button_area .el-button{
        padding:9px 18px;
        font-size:17px;
    }

    .cb{
        margin-top:15px;
    }

    .input_area textarea:disabled{
        background-color: hsla(0, 0%, 0%, 0) !important;
    }

    .chatting_time{
        margin-top:15px;
        line-height: 36px !important;
    }

    .close_icon{
        position: absolute;
        top:0;
        right: 18px;
        line-height:56px;
        display:inline-block;
        cursor:pointer;
        color:#aaa;
    }

    .close_icon:hover{
        color:#666
    }
</style>
