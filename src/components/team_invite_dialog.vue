<template>
    <div class="choose_path_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            width="600px">
            <h3>来自{{team_name}}的{{title}}</h3>
            <div class="content">
                <div style="height:10px"></div>
                <div class="item_area">
                    是否接受团队<b> {{team_name}} </b>的加入邀请？接受后您将成为该团队的成员
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="danger" @click="click_to_accept(false)">拒 绝</el-button>
                <el-button type="success" @click="click_to_accept(true)">接 受</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title:'团队邀请',
            team_name: 'team_name',
            mid:'',
            dia_vis:false
        }
    },

    methods:{
        open(data){
            this.mid = data.mid;
            this.dia_vis = true;
        },

        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },

        click_to_accept(if_accept){
            var that = this;
            var msg = {
                mid: that.mid,
                result: if_accept,
            };
            $.ajax({
                type:'post',
                url:"/team/invitation/confirm",
                data: JSON.stringify(msg),
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                async:false, 
                success:function (res){
                    if(that.console_debug){
                        console.log("(post)/team/invitation/confirm"+ " : " +res.status);
                    }
                    if(res.status == 0){
                        that.alert_msg.success('已' + (if_accept?'成功':'拒绝') +'加入团队！');
                        if_accept ? that.$router.push({path: '/team/' + res.tid + "/file/desktop"}) : '';
                        that.dia_vis = false;
                    }
                    else{
                        if(if_accept){
                            switch(res.status){
                                case 2:
                                    that.alert_msg.error('用户未登录或没有权限');
                                    break;
                                case 3:
                                    that.alert_msg.normal('您已在团队中');
                                    break;
                                default:
                                    that.alert_msg.error('出错啦');
                            }
                        }
                        else{
                            switch(res.status){
                                case 2:
                                    that.alert_msg.error('用户未登录或没有权限');
                                    break;
                                default:
                                    that.alert_msg.error('出错啦');
                            }
                        }
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
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");

.item_area{
    overflow-y: auto;
}

@media (max-width: 1200px){
    
}
</style>