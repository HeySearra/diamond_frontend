<template>
    <div class="file_info_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            width="700px">
            <h3>{{title}}</h3>
            <div class="content">
                <div class="info_list" v-for="item in content" :key="item.key">
                    <div class="info_title">{{item.key}}：</div>
                    <div class="info_content">{{item.value}}</div>
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
    data() {
        return {
            title:'',
            content:[],
            dia_vis:false
        }
    },

    methods:{
        open_info(title, content){
            this.title = title;
            this.content = content;
            this.dia_vis = true;
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");

.file_system_block{
    position: relative;
}

.divide_type{
    height: 10px;
}

.path{
    padding: 0 15px;
    border: solid 1px;
    margin-right:100px;
}

.el-breadcrumb{
    line-height:25px;
}

.path>>>.el-breadcrumb__inner{
    cursor:pointer !important;
}

.path>>>.el-breadcrumb__inner:hover{
    text-decoration: underline;
}

.icon_part{
    height:30px;
    width:80px;
    position: absolute;
    top:27px;
    right:10px;
    border:solid 1px;
    text-align: center;
}

.icon_part .icon_button{
    display:inline-block;
    height:30px;
    line-height:30px;
    padding: 0 5px;
    cursor:pointer
}

.icon_part .icon_button .icon{
    font-size:27px;
}

@media (max-width: 1200px){
    
}
</style>