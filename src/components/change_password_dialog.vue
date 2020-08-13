<template>
    <div class="change_password_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            width="600px">
            <h3>{{title}}</h3>
            <div class="content">
                <div style="height:10px"></div>
                <div style="padding-right:30px">
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="旧密码">
                            <el-input v-model="form.old_pwd" placeholder="请输入旧密码" maxlength="16" show-password></el-input>
                        </el-form-item>
                        <el-form-item label="新密码">
                            <el-input v-model="form.new_pwd" placeholder="请输入新密码" maxlength="16" show-password></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dia_vis=false">取 消</el-button>
                <el-button type="primary" @click="click_confirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title:'修改密码',
            dia_vis:false,
            form:{
                old_pwd:'',
                new_pwd:''
            }
        }
    },

    methods:{
        open(){
            this.form.old_pwd = '';
            this.form.new_pwd = '';
            this.dia_vis = true;
        },

        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },

        click_confirm(){
            if(this.form.old_pwd == ''){
                this.alert_msg.warning('请填写旧密码');
                return;
            }
            if(this.form.new_pwd == ''){
                this.alert_msg.warning('请填写新密码');
                return;
            }
            
            let json_data = form
            var that = this;
            $.ajax({ 
                type:'post',
                url:'/user/set_pwd',
                data: JSON.stringify(json_data),
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                async:false, 
                success:function (res){ 
                    if(that.console_debug){
                        console.log('/user/set_pwd/：' + res.status);
                    }
                    if(res.status == 0){
                        that.alert_box.msg('提醒', '成功修改密码', function(){
                            that.dia_vis = false;
                        });
                    }
                    else{
                        switch(res.status){
                            case 2:
                                that.alert_box.msg('修改密码失败', '旧密码错误');
                                break;
                            case 3:
                                that.alert_box.msg('修改密码失败', '密码长度限定为 6-32 ，且至少含有数字、小写字母、大写字母、特殊字符中的两个');
                                break;
                            default:
                                that.alert_box.msg('修改密码失败', '发生了未知的错误');
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

.el-form>>>.avatar-uploader .el-upload {
    border: 1px dashed hsl(219, 15%, 69%);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-form>>>.avatar-uploader .el-upload:hover {
    border-color: #586378;
  }
  .el-form>>>.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .el-form>>>.avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

@media (max-width: 1200px){
    
}
</style>