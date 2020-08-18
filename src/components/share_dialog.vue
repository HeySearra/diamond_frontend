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
                    <span>允许通过链接分享<span>（关闭后链接共享将失效）</span>：</span>
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
                    <el-radio-group v-model="share_type" @change="change_radio">
                        <el-radio-button :label="1" :disabled="!sharable">允许阅读文档</el-radio-button>
                        <el-radio-button :label="2" :disabled="!sharable">允许评论文档</el-radio-button>
                        <el-radio-button :label="3" :disabled="!sharable">允许编辑文章</el-radio-button>
                    </el-radio-group>
                </div>
                <div style="height:30px;"></div>
                <div style="width:96%;margin:0 auto">
                    <el-input v-model="display_url" readonly :disabled="!sharable"></el-input>
                    <el-button :disabled="!sharable" type="primary" plain 
                        v-clipboard:copy="url" v-clipboard:success="copy_success" v-clipboard:error="copy_error">复制链接
                    </el-button>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="reset_link" v-show="sharable">重新生成链接</el-button>
                <el-button type="primary" @click="dia_vis=false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'share-dialog',

    props:{
        context:{
            type:String,
            default:'normal'
        }
    },

    data() {
        return {
            title:'通过链接共享文件',
            dia_vis:false,
            did:'',
            url:'',
            sharable:true,
            share_type:0,
            display_url:''
        }
    },

    watch:{
        url(val){
            if(this.sharable){
                this.display_url = val;
            }
        },
        sharable(val){
            if(val){
                this.display_url = this.url;
            }
            else{
                this.display_url = '';
            }
        }
    },

    methods:{
        open(did, name){
            this.did = did;
            this.url = '';
            var that = this;
            $.ajax({ 
                type:'post',
                url:'/fs/share_link',
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                data: JSON.stringify({did:did}),
                async:false, 
                success:function (res){ 
                    if(that.console_debug){
                        console.log(url +  '：' + res.status);
                    }
                    if(res.status == 0){
                        switch(res.auth){
                            case 'read':
                                that.share_type = 1;
                                break;
                            case 'comment':
                                that.share_type = 2;
                                break;
                            case 'write':
                                that.share_type = 3;
                                break;
                            case 'no_share':
                                that.share_type = 0;
                                that.sharable = false;
                        }
                        switch(res.auth){
                            case 'read':
                            case 'comment':
                            case 'write':
                                that.sharable = true;
                        }
                        that.url = that.$host + '/document/share?dk=' + res.key;
                        that.dia_vis = true;
                    }
                    else{
                        switch(res.status){
                            case 2:
                                that.alert_msg.error('文档不存在');
                                break;
                            case 3:
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
        },

        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },

        change_radio(value){
            switch(value){
                case 1:
                    this.change_share_type('read');
                    break;
                case 2:
                    this.change_share_type('comment');
                    break;
                case 3:
                    this.change_share_type('write');
                    break;
            }
        },

        change_share_type(type){
            let url = '/fs/share_change_auth';
            var that = this;
            $.ajax({ 
                type:'post',
                url:url,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                data: JSON.stringify({did:this.did, auth:type}),
                async:false, 
                success:function (res){ 
                    if(that.console_debug){
                        console.log(url +  '：' + res.status);
                    }
                    if(res.status == 0){
                        switch(type){
                            case 'read':
                            case 'comment':
                            case 'write':
                                that.sharable = true;
                                break;
                            case 'no_share':
                                that.sharable = false;
                                break;
                        }
                    }
                    else{
                        switch(res.status){
                            case 3:
                                that.alert_msg.error('权限不足');
                                break;
                            case 3:
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
        },

        copy_success(){
            this.alert_msg.success('复制成功');
        },

        copy_error(){
            this.alert_msg.error('复制失败');
        },

        change_switch(value){
            if(value){
                if(!this.share_type){
                    this.share_type = 1;
                }
                this.change_radio(this.share_type);
            }
            else{
                this.share_type = 0;
                this.change_share_type('no_share');
            }
        },

        reset_link(){
            var that = this;
            function a(is_clear){
                let url = '/fs/share_reset';
                $.ajax({ 
                    type:'post',
                    url:url,
                    headers: {'X-CSRFToken': that.getCookie('csrftoken')},
                    data: JSON.stringify({did:that.did, is_clear:is_clear}),
                    async:false, 
                    success:function (res){ 
                        if(that.console_debug){
                            console.log(url +  '：' + res.status);
                        }
                        if(res.status == 0){
                            that.url = that.$host + '/document/share?dk=' + res.key;
                            that.alert_msg.success('已重置链接');
                        }
                        else{
                            switch(res.status){
                                case 3:
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
            this.$confirm('是否清除之前被分享用户的访问权限，这样用户需要通过访问新的链接才能获取对该文件权限。', '清除之前被分享用户的权限', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
                }).then(() => {
                    a(false);
                })
                .catch(() => {
                    a(true);
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