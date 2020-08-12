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
                    </el-form>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dia_vis=false">取 消</el-button>
                <el-button type="primary" @click="dia_vis=false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title:'修改个人信息',
            dia_vis:false,
            form:{
                img: '',
                name: '',
            }
        }
    },

    methods:{
        open(){
            this.dia_vis = true;
        },

        beforeAvatarUpload(file) {
            const is_pic = file.type=='image/jpeg' || file.type=='image/png';
            const isLt2M = file.size / 1024 / 1024 < 10;

            if (!is_pic) {
                this.alert_msg.error('请上传图片');
            }
            if (!isLt2M) {
                this.alert_msg.error('上传图片的大小不能超过 10MB');
            }
            return isJPG && isLt2M;
        },

        upload_por(f){
            var that = this;
            let form = new FormData();
            form.append('file', f.file);
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