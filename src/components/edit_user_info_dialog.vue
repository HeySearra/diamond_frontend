<template>
    <div class="edit_user_info_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            width="600px">
            <h3>{{title}}</h3>
            <div class="content">
                <div style="height:10px"></div>
                <div style="padding-right:30px">
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="头像">
                            <el-upload
                                class="avatar-uploader"
                                action=""
                                :show-file-list="false"
                                :http-request="upload_por"
                                :before-upload="beforeAvatarUpload">
                                <img v-if="form.img" :src="form.img" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="昵称">
                            <el-input v-model="form.name" clearable placeholder="请输入昵称" maxlength="64"></el-input>
                        </el-form-item>
                        <el-form-item label="个人简介">
                            <el-input v-model="form.intro" type="textarea" resize="none" :rows="5" clearable placeholder="请输入你的个人简介" maxlength="300"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dia_vis=false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'edit-user-info-dialog',

    data() {
        return {
            title:'修改个人信息',
            dia_vis:false,
            form:{
                img: '',
                name: '',
                intro:''
            },
        }
    },
    mounted(){
        //this.init();
    },
    methods:{
        init(){
            //this.get_user_info();
        },
        open(){
            this.get_user_info();
        },

        close(){
            this.dia_vis = false;
        },

        get_user_info(){
            let that = this;
            $.ajax({ 
                type:'get', 
                url:'/user_info',
                headers: {'X-CSRFToken': this.getCookie('csrftoken')}, 
                processData: false,
                contentType: false,
                success:function (res){ 
                    if(res.status == 0){
                        that.form.img = res.portrait;
                        that.form.name = res.name;
                        that.form.intro = res.intro;
                        that.dia_vis = true;
                    }
                    else{
                        that.dia_vis = false;
                        that.form.img = '';
                        that.form.name = '';
                        that.form.intro = '';
                        that.alert_msg.error('获取信息失败');
                    }
                },
                error:function(){
                    that.alert_msg.error('连接失败');
                }
            });
        },

        beforeAvatarUpload(file) {
            var is_pic = file.type=='image/jpeg' || file.type=='image/png';
            var isLt2M = file.size / 1024 / 1024 < 10;

            if (!is_pic) {
                this.alert_msg.error('请上传图片');
            }
            if (!isLt2M) {
                this.alert_msg.error('上传图片的大小不能超过 10MB');
            }
            return is_pic && isLt2M;
        },

        upload_por(f){
            var is_pic = f.file.type=='image/jpeg' || f.file.type=='image/png';
            if (!is_pic) {
                this.alert_msg.error('请上传 jpg 或 png 格式的图片');
                return;
            }
            var that = this;
            let form = new FormData();
            form.append('file', f.file);
            $.ajax({ 
                type:'post', 
                url:'/upload/port',
                headers: {'X-CSRFToken': this.getCookie('csrftoken')}, 
                data:form,
                processData: false,
                contentType: false,
                async:false, 
                success:function (res){ 
                    if(res.status == 0){
                        that.form.img = res.src;
                        //f.onSuccess();
                    }
                    else{
                        switch(res){
                            case 1:
                                that.alert_msg.error('错误，图片过大');
                                break;
                            default:
                                that.alert_msg.error('上传头像失败，请重试');
                        }
                        //that.form.img = '';
                        //f.onError();
                    }
                },
                error:function(){
                    that.alert_msg.error('连接失败');
                    //that.form.img = '';
                    //f.onError();
                }
            });
        },

        submit(){
            var that = this;
            if(that.form.name.trim() == ''){
                that.alert_msg.warning('昵称不得为空');
                return;
            }
            $.ajax({ 
                type:'post', 
                url:"/user/edit_info",
                headers: {'X-CSRFToken': this.getCookie('csrftoken')}, 
                data: JSON.stringify(that.form),
                async:false,
                success:function (res){
                    if(that.console_debug){
                        console.log('/info：' + res.status);
                    }
                    if(res.status == 0){
                        that.$emit('refresh_user_info');
                        // that.$emit('apply_for_info');
                        that.alert_msg.success('修改信息成功！');
                        that.close();
                    }
                    else{
                        switch(res.status){
                            case 2:
                                that.alert_msg.error('您未登录本站');
                                break;
                            case 3:
                                that.alert_msg.error('昵称不合法，请检查您的信息')
                                break;
                            case 4:
                                that.alert_msg.error('头像保存失败，请重新上传');
                                break;
                            case 5:
                                that.alert_msg.error('个人简介不合法，请修改');
                                break;
                            default:
                                that.alert_msg.error('修改信息失败，请检查你的信息');
                        }
                    }
                },
                error:function(){
                    console.log('连接失败');
                }
            });
        },

        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },
    },
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