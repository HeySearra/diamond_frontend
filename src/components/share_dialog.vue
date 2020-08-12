<template>
    <div class="edit_team_info_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            width="600px"
            height="500px">
            <h3>{{title}}</h3>
            <div class="content">
                <div style="height:20px;"></div>
                <div style="padding:15px 30px;border:solid 1px">
                    <span>允许分享该文档<span>（关闭后仅{{context=='normal'?'自己':'团队成员'}}可查看）</span>：</span>
                    <el-switch
                        style="float:right"
                        v-model="sharable"
                        active-color="#67C23A"
                        inactive-color="#bbb">
                    </el-switch>
                </div>
                <div style="height:50px;"></div>
                <div style="width:fit-content; margin:0 auto">
                    <el-radio-group v-model="share_type" @change="change_share_type">
                        <el-radio-button label="文档阅读分享"></el-radio-button>
                        <el-radio-button label="文档评论分享"></el-radio-button>
                        <el-radio-button label="文档编辑分享"></el-radio-button>
                    </el-radio-group>
                </div>
                <div style="height:30px;"></div>
                <div style="width:96%;margin:0 auto">
                    <el-input v-model="url" readonly :disabled="!sharable"></el-input>
                    <el-button :disabled="!sharable" type="primary" plain>复制链接</el-button>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dia_vis=false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props:{
        context:{
            type:String,
            default:'normal'
        }
    },
    data() {
        return {
            title:'分享',
            dia_vis:false,
            did:'',
            url:'123',
            sharable:true,
            share_type:''
        }
    },

    methods:{
        open(did, name){
            this.did = did;
            this.title = '分享 ' + name;
            this.dia_vis = true;
        },

        change_share_type(value){

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

@media (max-width: 1200px){
    
}
</style>