<template>
    <div class="manage_member_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            width="700px">
            <h3>{{title}}</h3>
            <div class="content">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="团内成员" name="1">
                        <div style="height:5px"></div>
                        <div style="padding:0 25px">
                            <el-tooltip class="item" effect="dark" content="Top Center 提示文字" placement="top">
                                <div class="member_icon">
                                    <el-avatar class="close_icon"><span class="icon iconfont">&#xe79b;</span></el-avatar>
                                    <el-avatar class="user_port" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                                </div>
                            </el-tooltip>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="邀请成员" name="2">
                        <div>
                            <div style="height:30px"></div>
                            <div class="search_input">
                                <el-input v-model="search_input" style="width:83%" placeholder="搜索用户账号" maxlength="70"></el-input>
                                <el-button type="primary" style="width:15%;float:right">邀请</el-button>
                            </div>
                            <div style="height:35px"></div>
                            <div class="user_part">
                                <user-list-item type="search"></user-list-item>
                                <user-list-item type="search"></user-list-item>
                                <user-list-item type="search"></user-list-item>
                                <user-list-item type="search"></user-list-item>
                                <user-list-item type="search"></user-list-item>
                                <user-list-item type="search"></user-list-item>
                                <user-list-item type="search"></user-list-item>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dia_vis=false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title:'团队成员管理',
            tid:'',
            dia_vis:false,
            activeName:'2',
            search_input:''
        }
    },

    methods:{
        open(tid){
            this.tid = tid;
            this.activeName = '1';
            this.search_input = '';
            this.dia_vis = true;
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");

.member_icon{
    float:left;
    margin:5px 10px;
    cursor:pointer;
    width:40px;
    height:40px;
    overflow: hidden;
}

.close_icon{
    display: none;
}

.close_icon span{
    font-size:18px;
}

.member_icon:hover .close_icon{
    display: block;
}

.member_icon:hover .user_port{
    display: none;
}

.search_input{
    width:80%;
    margin:0 auto;
}

.user_part{
    border:solid 1px #000;
    height: 350px;
    width:80%;
    margin: 0 auto;
    overflow: overlay;
}

@media (max-width: 1200px){
    
}
</style>