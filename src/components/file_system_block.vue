<template>
    <div class="file_system_block">
        <div class="clear_both divide_type"></div>
        <div class="path" v-if="type=='self'&&path.length">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-for="item in path" :key="item.id">{{item.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="clear_both divide_type" style="height:10px"></div>
        <div v-for="item in list" :key="item.title">
            <file-display-block :title="item.title" :list="item.content" :drage="drage" :context="context" @open_info="open_info"></file-display-block>
            <div class="clear_both divide_type"></div>
        </div>
        <div class="icon_part can_not_choose" @click="change_view">
            <div class="icon_button"><span class="icon iconfont">&#xe7e4;</span></div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        fid: {
            type:String,
            default: '1'
        },
        drage:{
            type:Boolean,
            default:true
        },
        type:{
            type:String,
            default: 'self', // or 'from_out'
        },
        context:{
            type:String,
            default: 'file_system',
        },
        out_list:{
            type: Array,
            default(){
                return [
                    {
                        title:'标题',
                        content:[
                            {
                                type: 'file',
                                id: 'id',
                                is_link:false,
                                is_starred:false,
                                name:'file'
                            }
                        ]
                    }
                ]
            }
        }
    },
    data() {
        return {
            path: [{name:'Apath',id:'idA'},{name:'Bpath',id:'idB'},{name:'Cpath',id:'idC'}],
            list:[

            ]
        }
    },

    mounted(){
        this.init();
    },

    methods:{
        init(){
            if(this.type == 'from_out'){
                this.list = this.out_list;
            }
        },

        open_info(name, content){
            this.$emit('open_info', name, content);
        },

        change_view(){
            this.$emit('change_view');
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/diadoc_icon.css");
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