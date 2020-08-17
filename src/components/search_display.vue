<template>
    <div class="file_display_block">
        <h1 class="can_not_choose">{{title}} <span class="el-icon-circle-plus-outline add_button" v-if="add_type!='none'" @click="add_item"></span></h1>
        <el-divider></el-divider>
        <div class="file_area">
            <div v-if="!list.length&&random>=0" class="not_found">{{not_found_text[random]}}</div>
            <div class="can_not_choose list_head" v-if="list.length">
                <div class="info_area">
                    <div>创建者</div>
                    <div>最近编辑时间</div>
                    <div>创建时间</div>
                </div>
            </div>
            <div class="file_item"
                v-for="item in list"
                :key="item.id"
                >
                <search-item
                    ref="file_component"
                    :is_link="item.is_link"
                    :did="item.id"
                    :fid="item.id"
                    :name="item.name"
                    :view_time="item.view_time"
                    :create_time="item.create_time"
                    :recent_edit_time="item.recent_edit_time"
                    :creator="item.creator"
                    :content="item.content"
                    :is_starred="item.is_starred"
                    :type="item.type"
                    @refresh="refresh">
                </search-item>
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
        type:{
            type:String,
            default: "self", //'recent' 'from_out'
        },
        list: {
            type: Array,
            default() {
                return [
                    // {
                    //     type: 'file', // or fold
                    //     id: '1',
                    //     is_link: false,
                    //     is_starred: true,
                    //     name: 'file',
                    //     time: '',
                    // },
                    // {
                    //     type: 'fold', // or file
                    //     id: '2',
                    //     is_link: true,
                    //     is_starred: false,
                    //     name: 'folder',
                    //     time: '',
                    // }
                ]
            }
        },
        drage:{
            type: Boolean,
            default:true
        },
        add_type:{
            type:String,
            default:'none'
        }
    },
    data() {
        return {
            dia_vis:false,
            dia_title:'team info',
            draging_type:'',
            draging_id:'',
            random:-1,
            not_found_text:['这里啥玩意也没有', '这里什么也没有', '空空如也', '这里好凄凉', '难道？这里什么也没有', '什么东东都没有', '这里啥都没', '什么也没有~', '这里没东西，别看了', '啊，这里没东西啊']
        }
    },

    mounted(){
        
    },

    methods:{
        init(){
            var that = this;
            this.random = parseInt(Math.random()*100%this.not_found_text.length);
            setTimeout(function(){
                let item = that.$refs.file_component;
                if(item){
                    for(let i=0; i<item.length; i++){
                        item[i].init();
                    }
                }
            }, 0);
        },

        refresh(){
            this.$emit('refresh');
        },

        open_info(title, content, type){
            this.$emit('open_info', title, content, type);
        },

        move_item(id, type, name){
            this.$emit('move_item', id, type, name);
        },

        share_item(did, name){
            this.$emit('share_item', did, name);
        },

        copy_item(id, type, name){
            this.$emit('copy_item', id, type, name);
        },

        add_item(){
            this.$emit('add_item', this.add_type);
        },

        rename(id, type, name){
            this.$emit('rename', id, type, name);
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");

h1{
    font-size: 23px !important;
    text-indent: 25px;
    margin-bottom:-6px !important;
    color:hsl(0, 0%, 39%);
}

.file_area{
    padding: 0 30px;
}

.list_head{
    position: relative;
    border-bottom: solid 1px rgba(0, 0, 0, 0.1);
    height:50px;
    overflow: hidden;
    color:#343434;
}

.info_area{
    position: absolute;
    width:56%;
    line-height:50px;
    height:50px;
    top:0;
    right:39px;
    color:#999
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

.add_button{
    cursor: pointer;
    display:inline-block;
    font-size:21px !important;
    margin-left:-10px;
    opacity:.5;
    transition: all 0.1s linear;
}

h1:hover .add_button{
    opacity: 1;
}

@media (max-width: 1500px){
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
