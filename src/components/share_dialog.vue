<template>
    <div class="edit_team_info_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            :close-on-click-modal="false"
            width="600px"
            height="500px">
            <h3>{{title}}</h3>
            <div class="content">
                <div style="height:20px;"></div>
                <div style="padding:15px 30px;">
                    <span>允许分享该文档<span>（关闭后仅{{context=='normal'?'自己':'团队成员'}}可查看）</span>：</span>
                    <el-switch
                        style="float:right"
                        v-model="sharable"
                        active-color="#67C23A"
                        inactive-color="#bbb"
                        @change="change_switch">
                    </el-switch>
                </div>
                <div style="height:50px;"></div>
                <div class="can_not_choose" style="width:fit-content; margin:0 auto">
                    <el-radio-group v-model="share_type" @change="change_share_type">
                        <el-radio-button :label="1" :disabled="read_link_disabled">文档阅读分享</el-radio-button>
                        <el-radio-button :label="2" :disabled="comment_link_disabled">文档评论分享</el-radio-button>
                        <el-radio-button :label="3" :disabled="write_link_disabled">文档编辑分享</el-radio-button>
                    </el-radio-group>
                </div>
                <div style="height:30px;"></div>
                <div style="width:96%;margin:0 auto">
                    <el-input v-model="url" readonly :disabled="!sharable"></el-input>
                    <el-button :disabled="!sharable" type="primary" plain 
                        v-clipboard:copy="url" v-clipboard:success="copy_success" v-clipboard:error="copy_error">复制链接</el-button>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dia_vis=false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props:{
        context:{
            type:String,
            default:'normal'
        }
    },
    data() {
        return {
            title:'分享',
            dia_vis:false,
            did:'',
            url:'',
            sharable:true,
            share_type:1,
            write_url:'',
            comment_url:'',
            read_url:'',
            read_link_disabled: true,
            comment_link_disabled: true,
            write_link_disabled: true,
        }
    },

    methods:{
        open(did, name){
            this.did = did;
            this.title = '分享 ' + name;
            var flag = false;
            
            this.url = '';
            var that = this;
            $.ajax({ 
                type:'get',
                url:'/doc/lock?did=' + that.did,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                async:false, 
                success:function (res){ 
                    if(that.console_debug){
                        console.log('/doc/lock?did=' + that.did +  '：' + res.status);
                    }
                    if(res.status == 0){
                        that.sharable = !res.is_locked;
                        flag = true;
                    }
                    else{
                        switch(res.status){
                            case 2:
                                that.alert_msg.error('文档不存在');
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

            if(!flag){
                return;
            }

            flag = false;
            $.ajax({ 
                type:'post',
                url:'/fs/share',
                data: JSON.stringify({did: that.did, auth: 'write'}),
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                async:false, 
                success:function (res){ 
                    if(that.console_debug){
                        console.log('/fs/share?did=' + that.did + '&auth=write' +  '：' + res.status);
                    }
                    if(res.status == 0){
                        that.write_url = that.$host + '/doc/add_write?dk=' + res.key;
                        that.url = that.write_url;
                        flag = true;
                    }
                    else{
                        switch(res.status){
                            case 2:
                                that.write_link_disabled = false;
                                flag = true;
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

            if(!flag){
                return;
            }

            flag = false;
            $.ajax({ 
                type:'post',
                url:'/fs/share',
                data: JSON.stringify({did: that.did, auth: 'comment'}),
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                async:false, 
                success:function (res){ 
                    if(that.console_debug){
                        console.log('/fs/share?did=' + that.did + '&auth=comment' +  '：' + res.status);
                    }
                    if(res.status == 0){
                        that.comment_url = that.$host + '/doc/add_comment?dk=' + res.key;
                        flag = true;
                    }
                    else{
                        switch(res.status){
                            case 2:
                                that.comment_link_disabled = false;
                                flag = true;
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

            if(!flag){
                return;
            }

            flag = false;
            $.ajax({ 
                type:'post',
                url:'/fs/share',
                data: JSON.stringify({did: that.did, auth: 'read'}),
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                async:false, 
                success:function (res){ 
                    if(that.console_debug){
                        console.log('/fs/share?did=' + that.did + '&auth=read' +  '：' + res.status);
                    }
                    if(res.status == 0){
                        that.read_url = that.$host + '/doc/add_read?dk=' + res.key;
                        that.url = that.read_url;
                        flag = true;
                    }
                    else{
                        switch(res.status){
                            case 2:
                                that.read_link_disabled = false;
                                flag = true;
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

            if(!flag){
                return;
            }

            this.dia_vis = true;
        },

        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },

        change_share_type(value){
            if(!this.sharable){
                return;
            }
            switch(value){
                case 1:
                    this.url = this.read_url;
                    break;
                case 2:
                    this.url = this.comment_url;
                    break;
                case 3:
                    this.url = this.write_url;
                    break;
            }
        },

        copy_success(){
            this.alert_msg.success('复制成功');
        },

        copy_error(){
            this.alert_msg.error('复制失败');
        },

        change_switch(value){
            let url = '/doc/lock';
            let json_data = {did:this.did, is_locked:!value};
            var that = this;
            $.ajax({ 
                type:'post',
                url: url,
                data: JSON.stringify(json_data),
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                async:false, 
                success:function (res){ 
                    if(that.console_debug){
                        if(value){
                            switch(that.share_type){
                                case 1:
                                    that.url = that.read_url;
                                    break;
                                case 2:
                                    that.url = that.comment_url;
                                    break;
                                case 3:
                                    that.url = that.write_url;
                                    break;
                            }
                        }
                        else{
                            that.url = '';
                        }
                        console.log(url +  '：' + res.status);
                    }
                    if(res.status == 0){
 
                    }
                    else{
                        that.sharable = !value;
                        switch(res.status){
                            case 2:
                                that.alert_msg.error('文档不存在');
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
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");

.el-input{
    width:75%;
}

.content .el-button{
    width:23%;
    float:right;
}

>>>.el-radio-group label{
    outline:none !important;
    box-shadow: unset !important;
}

@media (max-width: 1200px){
    
}
</style>