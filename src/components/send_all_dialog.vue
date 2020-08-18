<template>
    <div class="choose_path_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            width="600px">
            <h3 style="margin-left:-6px;line-height:30px;">发送团队消息</h3>
            <div class="content">
                <div style="height:10px"></div>
                <div class="item_area">
                    <el-input
                        type="textarea"
                        placeholder="请输入消息内容"
                        v-model="msg"
                        autofocus
                        :autosize="{minRows: 3, maxRows: 15}"
                        maxlength="300"
                        show-word-limit
                        resize="none">
                    </el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dia_vis = false">取 消</el-button>
                <el-button type="primary" @click="send" :disabled="!msg.trim().length">发 送</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'team-invite-dialog',

    data() {
        return {
            tid:'',
            msg:'',
            dia_vis:false
        }
    },

    methods:{
        open(tid){
            this.tid = tid;
            this.msg = '';
            this.dia_vis = true;
        },

        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },

        send(){
            var that = this;
            if(this.msg.trim().length <= 0){
                this.alert_msg.warning('请输入消息内容');
                return;
            }
            $.ajax({
                type:'post',
                url:"/team/send_all",
                data: JSON.stringify({tid:this.tid, content:this.msg}),
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                async:false, 
                success:function (res){
                    if(that.console_debug){
                        console.log("/team/send_all"+ " : " +res.status);
                    }
                    if(res.status == 0){
                        that.alert_msg.success('成功发送团队消息');
                        that.dia_vis = false;
                    }
                    else{
                        switch(res.status){
                            case 2:
                                that.alert_msg.error('未登录或权限不足');
                                break;
                            case 3:
                                that.alert_msg.error('找不到团队');
                                break;
                            default:
                                that.alert_msg.error('发生未知错误');
                        }
                    }
                },
                error:function(){
                    that.alert_msg.error('网络连接失败');
                }
            });
        },
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");


.item_area{
    overflow-y: overlay;
}

@media (max-width: 1200px){
    
}
</style>