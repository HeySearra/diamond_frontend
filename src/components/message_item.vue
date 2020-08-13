<template>
    <div class="message-item" @click="mark_read">
        <div style="height:10px;"></div>
        <div class="item">
            <div class="profile">
                <span v-if="!portrait" class="icon iconfont">&#xe622;</span>
                <el-avatar v-if="portrait" :src="img" style="vertical-align: middle;"></el-avatar>
            </div>
            <div class="content">
                <h4 class="title">
                    <div class="message-head" @click="type=='doc'? 'jump_to_doc':type=='join'?'comfirm_to_join':type=='accept'?'jump_to_team':''">{{title}}</div>
                    <div class="message-head" v-if="type=='join'" @click="confirm_join">{{team_name}}</div>
                    <div class="message-head" v-if="type=='admin' || type=='remove'" @click="type=='admin'? 'to_team':''">{{team_name}}</div>
                </h4>
                <div class='comment' v-if="type=='doc'">{{comment}}</div>
            </div>
        </div>
        <div class="not-read" v-if="!is_read"></div>
        <div class="clear_both"></div>
        <div style="height:25px;"></div>
        <el-divider></el-divider>
    </div>
</template>

<script>
export default {
    props: {
        mid:{
            type:String,
            default:'mid',
        },
    },
    data () {
        return {
            did: '', //文档id
            type: 'doc',   //join accept out doc
            title: '我是文档标题 我是文档标题我是文档标题我是文档标题我是文档标题', //消息标题
            comment: '321凤凰发灰黑服啊和附件和佛教咖啡机能让肌肤发基坑俊娥既然你3', //消息内容
            id: '',
            name: 'team_name',
            loading: true,
            is_read: false,
            is_dnd: false,
            uid: 'uid',     //发表评论的人的id
            uname: 'uname',
            portrait: '',
            time: '',
        }
    },
    mounted(){
        //this.init();
    },
    methods:{
        init(){
            this.apply_for_info();
        },
        apply_for_info(){
            var that = this;
            $.ajax({
                type:'get',
                url: "/msg/info?mid=" + that.mid,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                processData: false,
                contentType: false,
                success:function (res){
                    if(that.console_debug)console.log("(get)/msg/info"+ " : " +res.status);
                    if(res.status == 0){
                        that.type = res.type;
                        that.is_read = res.is_read;
                        that.is_dnd = res.is_dnd;
                        that.title = res.title;
                        that.name = res.name;
                        that.portrait = res.portrait;
                        that.id = res.id;
                        if(that.type == 'doc'){
                            that.comment = res.content;
                            that.uid = res.uid;
                            that.uname = res.uname;
                        }
                        // var cur_dt = new Date(res.cur_dt);
                        // var dt = new Date(res.dt);
                        var cur_dt = res.cur_dt;
                        var dt = res.dt;
                        if(dt.substring(0, 4) == cur_dt.substring(0,4)){
                            if(dt.substring(8, 10) == cur_dt.substring(8, 10)){
                                that.time = '今天 ' + dt.substring(11, 19);
                            }
                            else{
                                that.time = dt.substring(5, 16);
                            }
                        }
                        else{
                            that.time = dt.substring(0, 10);
                        }
                        that.loading = false;
                        that.$emit('done');
                    }
                    else{
                        that.loading = true;
                    }
                },
                error:function(){
                    that.alert_msg.error('连接失败');
                    that.loading = true;
                }
            });
        },
        jump_to_doc(){
            that.$router.push({path: '/doc/' + this.id}); //待定
        },
        confirm_to_join(){
            let data = {
                tid: this.id,
                team_name: this.name,
            }
            this.$emit('confirm_to_join', data);
        },
        jump_to_team(){
            that.$router.push({path: '/team/' + this.id + "/file/desktop"});
        },
        mark_read(){
            let that = this;
            let msg = {mid: that.mid};
            $.ajax({
                type:'post',
                url: "/msg/ar" + that.mid,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                data: JSON.stringify(msg),
                processData: false,
                contentType: false,
                success:function (res){
                    if(that.console_debug)console.log("(post)/msg/ar"+ " : " +res.status);
                    if(res.status == 0){
                        this.is_read = true;
                    }
                    else{
                        that.alert_msg.msg('标记已读失败', '请重试');
                    }
                },
                error:function(){
                    that.alert_msg.error('连接失败');
                }
            });
        },
    }
}
</script>
<style scoped>
.message-item{
    position: relative;
    padding: 0;
    cursor:pointer;
    width:100%;
}

.message-item:hover{
    background-color: #ccc;
}

.el-divider{
    margin: 0;
}
.item{
    display:flex;
    flex-direction: row;
    flex-wrap: nowrap;
}
.profile{
    justify-content: flex-start;
    position: relative;
    padding: 10px;
    width: 40px;
    margin: 0;
}

.title{
    margin:15px 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
    width:330px;
}
.not-read{
    width:100%;
    height:100%;
    background-color: rgb(77, 176, 221);
    position: absolute;
    top:0;
    left:0;
    opacity: 0.2;
}
.comment{
    font-size: 14px;
    word-break:break-all;
    width:320px;

}
</style>
