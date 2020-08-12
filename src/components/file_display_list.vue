<template>
    <div class="file_display_block">
        <h1>{{title}}</h1>
        <el-divider></el-divider>
        <div class="file_area">
            <div class="can_not_choose list_head">
                <div class="info_area">
                    <div>创建者</div>
                    <div>最近编辑时间</div>
                    <div class="min_hide">创建时间</div>
                </div>
            </div>
            <div class="file_item" 
                v-for="item in list" 
                :key="item.id"
                draggable="true"
                @drag="start_drag($event, item)"
                @drop="face_drop($event, item)"
                @dragover="allow_drop($event, item)"
                >
                <component 
                    :is="item.type=='file'?'file-list-item':'fold-list-item'" 
                    :is_link="item.is_link" 
                    :did="item.id" 
                    :fid="item.id" 
                    :name="item.name" 
                    :context="context" 
                    :is_starred="item.is_starred"
                    @open_info="open_info">
                </component>
            </div>
        </div>
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            width="700px">
            <h3>{{dia_title}}</h3>
            <div class="content">
                <div class="info_list">
                    <div class="info_title">文件名：</div>
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
            default: '文件展示列表'
        },
        context: {
            type:String,
            default: 'file_system'
        },
        list: {
            type: Array,
            default() {
                return [
                    {
                        type: 'file', // or fold
                        id: '1',
                        is_link: false,
                        is_starred: true,
                        name: 'file',
                    },
                    {
                        type: 'fold', // or file
                        id: '2',
                        is_link: true,
                        is_starred: false,
                        name: 'folder',
                    }
                ]
            }
        }
    },
    data() {
        return {
            dia_vis:false,
            dia_title:'team info',
            draging_type:'',
            draging_id:'',
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
        
        allow_drop(e, item){
            if(item.type=='fold'&&(this.draging_type!='fold'||this.draging_id!=item.id)){
                e.preventDefault();
            }
        },

        face_drop(e, item){
            e.preventDefault();
            this.$emit('face_drop', item.type, item.id);
            alert(this.draging_type + '：' + this.draging_id + ' to ' + item.type + '：' + item.id);
        },

        start_drag(e, item){
            this.draging_type = item.type;
            this.draging_id = item.id;
            this.$emit('set_draging_info', this.draging_type, this.draging_id);
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");

h1{
    text-indent: 25px;
}

.file_area{
    padding: 0 30px;
}

.list_head{
    position: relative;
    border: solid 1px;
    height:50px;
    overflow: hidden;
}

.info_area{
    position: absolute;
    width:56%;
    line-height:50px;
    height:50px;
    top:0;
    right:39px;
}

.info_area div{
    width:33%;
    float:left;
    line-height:50px;
    height:50px;
    text-align: center;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
}

@media (max-width: 1200px){
    .min_hide{
        display: none;
    }

    .info_area{
        width:50%;
    }

    .info_area div{
        width:50%;
    }
}
</style>