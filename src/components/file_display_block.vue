<template>
    <div class="file_display_block">
        <h1 class="can_not_choose">{{title}} <span class="el-icon-circle-plus-outline add_button" v-if="add_type!='none'" @click="add_item"></span></h1>
        <el-divider></el-divider>
        <div class="file_area">
            <div v-if="!list.length" class="not_found">{{not_found_text[random]}}</div>
            <div class="file_item" 
                v-for="item in list" 
                :key="item.id"
                :draggable="drage&&!item.is_link"
                @drag="start_drag($event, item)"
                @drop="face_drop($event, item)"
                @dragover="allow_drop($event, item)"
                >
                <component 
                    ref="file_component"
                    :is="item.type=='file'?'file-block':'fold-block'" 
                    :is_link="item.is_link" 
                    :did="item.id" 
                    :fid="item.id" 
                    :eid="item.id"
                    :name="item.name" 
                    :context="context" 
                    :is_starred="item.is_starred"
                    :type="type"
                    :is_in_desktop="is_in_desktop"
                    :view_time="item.view_time"
                    @open_info="open_info"
                    @move_item="move_item"
                    @share_item="share_item"
                    @copy_item="copy_item"
                    @refresh="refresh"
                    @rename="rename">
                </component>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type:String,
            default: '文件展示块'
        },
        context: {
            type:String,
            default: 'file_system'
        },
        type: {
            type:String,
            default: 'self',
        },
        is_in_desktop:{
            type:Boolean,
            default: false,
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
                    // },
                    // {
                    //     type: 'fold', // or file
                    //     id: '2',
                    //     is_link: true,
                    //     is_starred: false,
                    //     name: 'folder',
                    // }
                ]
            }
        },
        drage:{
            type: Boolean,
            default:true
        },
        add_type:{
            type: String,
            default:'none'
        }
    },
    data() {
        return {
            dia_vis:false,
            dia_title:'team info',
            draging_type:'',
            draging_id:'',
            random:0,
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
                    if(item instanceof Array){
                        for(let i=0; i<item.length; i++){
                            item[i].init();
                        }
                    }
                    else{
                        item.init();
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

        allow_drop(e, item){
            if(item.type=='fold'&&(this.draging_type!='fold'||this.draging_id!=item.id)){
                e.preventDefault();
            }
        },

        face_drop(e, item){
            e.preventDefault();
            this.$emit('face_drop', item.type, item.id);
            //alert(this.draging_type + '：' + this.draging_id + ' to ' + item.type + '：' + item.id);
        },

        start_drag(e, item){
            this.draging_type = item.type;
            this.draging_id = item.id;
            this.$emit('start_drop', this.draging_type, this.draging_id);
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
@import url("../assets/diadoc_icon.css");
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

.file_item{
    margin: 3px;
    float:left;
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

@media (max-width: 1200px){
    
}
</style>