<template>
    <div class="message-item can_not_choose" @dblclick="click_to_read" @click="mark_read" v-loading="loading">
        <div style="height:10px;"></div>
        <div class="item">
            <div class="profile can_not_choose">
                <span v-if="type=='accept'" class="icon iconfont" style="color:hsl(202, 56%, 50%)">&#xe664;</span>
                <span v-if="type=='reject'" class="icon iconfont" style="color:hsl(1, 69%, 73%)">&#xe69e;</span>
                <span v-if="type=='join'||type=='admin'" class="icon iconfont" style="color:hsl(202, 56%, 50%);">&#xe6cb;</span>
                <span v-if="type=='out'" class="icon iconfont" style="color:hsl(198, 10%, 69%)">&#xe62f;</span>
                <span v-if="type=='doc'&&false" class="icon iconfont" style="color:hsl(202, 56%, 50%)">&#xe7ff;</span>
                <span v-if="false" class="icon iconfont">&#xe622;</span>
                <el-avatar v-if="type=='doc'" :src="portrait" style="vertical-align: middle;margin-left:11px"></el-avatar>
            </div>
            <div class="content">
                <h4 class="title">
                    <div class="message-head">{{title}}</div>
                </h4>
                <div class='comment' v-if="content.length">{{content}}</div>
                <div style="height:10px;"></div>
                <div class='comment can_not_choose' v-if="sub_content.length" style="color:#aaa">{{sub_content}}</div>
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
    name: 'message-item',

    props: {
        mid:{
            type:String,
            default:'',
        },
    },
    data () {
        return {
            type: 'doc',   //join accept out doc
            title: '', //消息标题
            content: '', //消息内容
            sub_content:'',
            id: '',
            loading: true,
            is_read: false,
            is_process: false,
            is_dnd: false,
            uid: 'uid',     //发表评论的人的id
            team_name: 'team_name',
            portrait: '',
            time: '',
        }
    },
    methods:{
        init(){
            if(this.mid == ''){
                return;
            }
            this.apply_for_info();
        },
        apply_for_info(){
            this.loading = true;
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
                        that.is_read = res.is_read;
                        that.is_process = res.is_process;
                        that.is_dnd = res.is_dnd;
                        that.title = res.title;
                        that.portrait = res.portrait;
                        that.type = res.type;
                        that.id = res.id;
                        that.content = res.content;
                        that.sub_content = res.result_content;
                        if(that.type == 'doc'){
                            that.content = res.content;
                            that.uid = res.uid;
                        }
                        if(that.type == 'join'){
                            that.team_name = res.name;
                        }
                        // var cur_dt = new Date(res.cur_dt);
                        // var dt = new Date(res.dt);
                        var cur_dt = res.cur_dt;
                        var dt = res.dt;
                        that.time = that.datetime_format(res.cur_dt, res.dt);
                        that.loading = false;
                    }
                    else{
                        that.alert_msg.error('获取消息内容失败');
                    }
                },
                error:function(){
                    that.alert_msg.error('连接失败');
                }
            });
        },
        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },
        jump_to_doc(){
            if(this.$route.name=='doc' && this.$route.did==this.id){
                this.alert_msg.normal('你已经在这个文档中了');
            }
            else{
                this.$router.push({name:'doc', params:{did:this.id}}); //待定
            }
            this.$emit('close');
        },
        confirm_to_join(){
            let data = {
                mid: this.mid,
                team_name: this.team_name,
            }
            this.$emit('confirm-to-join', data);
        },
        jump_to_team(){
            if(this.$route.name=='team_file_system' && this.$route.params.tid==this.id){
                this.alert_msg.normal('你已经在这个团队目录中了');
            }
            else{
                this.$router.push({path: '/team/' + this.id + "/file/desktop"});
            }
            this.$emit('close');
        },

        click_to_read(){
            this.mark_read();
            if(this.type == 'join'){
                if(this.is_process){
                    this.alert_msg.normal("您已处理过该消息");
                }
                else{
                    this.confirm_to_join();
                }
            }
            else if(this.type == 'admin' || this.type == 'accept'){
                this.jump_to_team();
            }
            else if(this.type == 'doc'){
                this.jump_to_doc();
            }
        },

        mark_read(){
            let dbl_alert = localStorage.getItem(this.login_manager.get_uid()+'&dblclick');
            if(!dbl_alert){
                localStorage.setItem(this.login_manager.get_uid()+'&dblclick', true);
                this.alert_msg.normal('双击可打开消息内容');
            }
            if(this.is_read){
                return;
            }
            var that = this;
            let msg = {mid: that.mid};
            $.ajax({
                type:'post',
                url: "/msg/ar",
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                data: JSON.stringify(msg),
                processData: false,
                contentType: false,
                success:function (res){
                    if(that.console_debug){
                        console.log("(post)/msg/ar"+ " : " +res.status);
                    }
                    if(res.status == 0){
                        that.is_read = true;
                        that.$emit('refresh_count');
                    }
                    else{
                        //that.alert_msg.error('标记已读失败', '请重试');
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
    transition: all 0.1s linear;
}

.message-item:hover{
    background-color: #eee;
}

.el-divider{
    margin: 0;
}

.message-head{
    font-size: 18px;;
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

.profile span{
    font-size: 27px;
    color:#777;
    line-height: 34px;
    margin-left:20px;
}

.title{
    margin:15px 0 15px 25px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
    width:330px;
    color:#333;
}

.not-read{
    width:100%;
    height:100%;
    background-color: hsl(199, 68%, 69%);
    position: absolute;
    top:0;
    left:0;
    opacity: 0.2;
    color:hsl(19, 66%, 60%);
}

.comment{
    font-size: 14px;
    word-break:break-all;
    margin-left:25px;
    width: calc(100% - 70px);
}
</style>
