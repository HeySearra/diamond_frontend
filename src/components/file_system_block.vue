<template>
    <div class="file_system_block">
        <div class="clear_both divide_type"></div>
        <div class="path">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-for="item in path" :key="item.id">{{item.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="clear_both divide_type" style="height:10px"></div>
        <file-display-block title="文件夹"></file-display-block>
        <div class="clear_both divide_type"></div>
        <file-display-block title="文件"></file-display-block>
    </div>
</template>

<script>
export default {
    props: {
        fid: {
            type:String,
            default: '1'
        },
    },
    data() {
        return {
            path: [{name:'Apath',id:'idA'},{name:'Bpath',id:'idB'},{name:'Cpath',id:'idC'}],
            fold_list:[],
            file_list:[],
        }
    },

    mounted(){
        this.init();
    },

    methods:{
        init(){

        },

        open_info(id, name, type){
            this.dia_title = name;
            this.dia_vis = true;
        },

    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");

.divide_type{
    height: 30px;
}

.path{
    padding: 0 15px;
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

@media (max-width: 1200px){
    
}
</style>