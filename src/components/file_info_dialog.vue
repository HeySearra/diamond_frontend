<template>
    <div class="file_info_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            width="800px">
            <h3>{{title}}</h3>
            <div class="content">
                <div class="big_icon can_not_choose">
                    <span class="icon iconfont file_icon" v-if="type=='file'">&#xe645;</span>
                    <span class="icon iconfont fold_icon" v-if="type=='fold'">&#xe622;</span>
                    <span class="icon iconfont team_icon" v-if="type=='team'">&#xe6cb;</span>
                </div>
                <div class="info">
                    <div class="info_list" v-for="item in content" :key="item.key">
                        <div class="info_title">{{item.key}}：</div>
                        <div class="info_content">{{item.value}}</div>
                    </div>
                </div>
                <div class="clear_both"></div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dia_vis=false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'file-info-dialog',

    data() {
        return {
            title:'',
            content:[],
            dia_vis:false,
            type:''
        }
    },

    methods:{
        open_info(title, content, type){
            this.title = title;
            this.content = content;
            this.type = type;
            this.dia_vis = true;
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");
@import url("../assets/diadoc_icon.css");

.file_info_dialog{
    position: relative;
}

.divide_type{
    height: 10px;
}

.path{
    padding: 0 15px;
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

.big_icon{
    width:250px;
    height:250px;
    float:left;
    margin-left:30px;
    text-align: center;
    padding-top:30px;
}

.big_icon span{
    font-size:200px;
}

.file_icon{
    color:hsl(198, 10%, 69%);
}

.fold_icon{
    color:hsl(198, 56%, 56%);
}

.team_icon{
    color:hsl(198, 15%, 56%);
}

.info{
    float:right;
    width:430px;
    min-height:250px;
    font-weight: bold;
}

@media (max-width: 1200px){
    
}
</style>