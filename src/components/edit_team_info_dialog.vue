<template>
    <div class="edit_team_info_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            width="600px">
            <h3>{{title}}</h3>
            <div class="content">
                <div style="height:10px"></div>
                <div style="padding-right:30px">
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="团队头像">
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
                        <el-form-item label="团队名称">
                            <el-input ref="name" v-model="form.name" clearable placeholder="请输入团队名称" maxlength="64" @keyup.enter.native="$refs.intro.focus()"></el-input>
                        </el-form-item>
                        <el-form-item label="团队介绍">
                            <el-input
                                type="textarea"
                                :autosize="{ minRows: 3, maxRows: 6}"
                                placeholder="请输入团队介绍"
                                v-model="form.intro"
                                resize="none"
                                maxlength="300"
                                ref="intro"
                                @keyup.enter.native="submit()"
                                show-word-limit>
                            </el-input>
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
    name: 'edit-team-info-dialog',

    data() {
        return {
            title:'修改团队信息',
            dia_vis:false,
            form:{
                tid:'',
                img: '',
                name: '',
                intro: ''
            }
        }
    },

    methods:{
        open(tid){
            this.form.tid = tid;
            //this.dia_vis = true;
            this.open_team_info();
        },
        
        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },

        open_team_info(){
            let url = '/team/info?tid=' + this.form.tid;
            var that = this;
            $.ajax({ 
                type:'get',
                url: url,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                async:false, 
                success:function (res){ 
                    if(that.console_debug){
                        console.log(url +  '：' + res.status);
                    }
                    if(res.status == 0){
                        that.form.intro = res.intro;
                        that.form.name = res.name;
                        that.form.img = res.portrait;
                        that.dia_vis = true;
                    }
                    else{
                        switch(res.status){
                            case 2:
                                that.alert_msg.error('权限不足');
                                break;
                            case 3:
                                that.alert_msg.error('找不到团队');
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

        submit(){
            if(this.form.name.trim() == ''){
                this.alert_msg.warning('团队名称不得为空');
                return;
            }
            
            let url = '/team/edit_info';
            var that = this;
            $.ajax({ 
                type:'post',
                url: url,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                data: JSON.stringify(this.form),
                processData: false,
                contentType: false,
                async:false, 
                success:function (res){ 
                    if(that.console_debug){
                        console.log(url +  '：' + res.status);
                    }
                    if(res.status == 0){
                        that.alert_msg.success('信息修改成功');
                        that.$emit('refresh');
                        that.dia_vis = false;
                    }
                    else{
                        switch(res.status){
                            case 2:
                                that.alert_msg.error('权限不足');
                                break;
                            case 3:
                                that.alert_msg.error('找不到团队');
                                break;
                            case 4:
                                that.alert_msg.error('团队名称非法');
                                break;
                            case 5:
                                that.alert_msg.error('你的团队介绍不行'+that.magic_word[parseInt(Math.random()*10000)%magic_word.length]);
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
            var isJPG = f.file.type === 'image/jpeg';
            if (!isJPG) {
                this.alert_msg.error('上传头像图片只能是 JPG 格式');
                return;
            }
            var that = this;
            let form = new FormData();
            form.append('profile', f.file);
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
                        if(res.src[0] != '/'){
                            that.form.img = '/' + that.form.img;
                        }
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