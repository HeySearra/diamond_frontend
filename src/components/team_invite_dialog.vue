<template>
    <div class="choose_path_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            width="600px">
            <h3>{{title}}</h3>
            <div class="content">
                <div style="height:10px"></div>
                <div class="item_area">
                    是否接受团队<b>{{team_name}}</b>的加入邀请？接受后您将成为该团队的成员
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="click_to_accept">接 受</el-button>
                <el-button type="primary" @click="dia_vis=false">拒 绝</el-button>
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
            tid:'',
            dia_vis:false
        }
    },

    methods:{
        open(data){
            this.tid = data.tid;
            this.team_name = data.team_name;
            this.dia_vis = true;
        },
        click_to_accept(){

        },
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");

.item_area{
    border:solid 1px;
    height:400px;
    overflow-y: auto;
}

@media (max-width: 1200px){
    
}
</style>