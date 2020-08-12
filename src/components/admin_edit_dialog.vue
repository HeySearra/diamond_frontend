<template>
    <div class="admin_edit_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            width="700px">
            <h3>{{title}}</h3>
            <div class="content">
                <div class="member_part">
                    <el-tooltip class="item" effect="dark" content="Top Center 提示文字" placement="top">
                        <div class="member_icon"
                            draggable="true"
                            @dragover.prevent>
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                        </div>
                    </el-tooltip>
                    <div class="clear_both"></div>
                </div>
                <div style="height:20px"></div>
                <div class="admin_part">
                    <user-list-item></user-list-item>
                    <user-list-item></user-list-item>
                    <user-list-item></user-list-item>
                    <user-list-item></user-list-item>
                    <user-list-item></user-list-item>
                    <user-list-item></user-list-item>
                    <user-list-item></user-list-item>
                    <user-list-item></user-list-item>
                    <user-list-item></user-list-item>
                    <user-list-item></user-list-item>
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
            title:'管理员设置',
            tid:'',
            dia_vis:false
        }
    },

    methods:{
        open(tid){
            this.tid = tid;
            this.dia_vis = true;
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");

.member_part{
    border:solid 1px;
}

.member_icon{
    float:left;
    margin:6px 10px 5px;
    cursor:pointer;
}

.member_icon .el-avatar{
    border:solid 1px #000;

}

.admin_part{
    border:solid 1px #000;
    height: 300px;
    width:80%;
    margin: 0 auto;
    overflow: overlay;
}
@media (max-width: 1200px){
    
}
</style>