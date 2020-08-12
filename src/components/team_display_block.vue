<template>
    <div class="team_display_block">
        <h1>{{title}}</h1>
        <el-divider></el-divider>
        <div class="team_area">
            <div class="item" 
                v-for="item in list" 
                :key="item.tid">
                <team-block
                    :tid="item.tid"
                    :is_creator="is_creator"
                    :name="item.name"
                    @open_team_info="open_team_info">
                </team-block>
            </div>
        </div>
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            width="700px">
            <h3>{{dia_title}}</h3>
            <div class="content">
                <div class="info_list">
                    <div class="info_title">团队介绍：</div>
                    <div class="info_content">介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容介绍的内容</div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dia_vis=false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type:String,
            default: '我的团队'
        },
        is_creator: {
            type:Boolean,
            default: false
        },
        list: {
            type: Array,
            default() {
                return [
                    {
                        tid: '1',
                        name: 'team',
                    },
                ]
            }
        }
    },
    data() {
        return {
            dia_vis:false,
            dia_title:'team info',

        }
    },

    mounted(){
        this.init();
    },

    methods:{
        init(){

        },

        open_team_info(tid, tname){
            this.dia_title = tname;
            this.dia_vis = true;
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");

h1{
    font-size: 30px !important;
    text-indent: 25px;
    margin-bottom:5px !important;;
}

.team_area{
    padding: 0 30px;
}

.item{
    margin: 6px 15px;
    float:left;
}

@media (max-width: 1200px){
    
}
</style>