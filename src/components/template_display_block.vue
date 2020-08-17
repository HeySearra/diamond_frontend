<template>
    <div class="template_display_block">
        <h1>{{title}}</h1>
        <el-divider></el-divider>
        <div class="not_found" v-if="context=='my'&&!list.length">你还没有模板{{magic}}&nbsp;&nbsp;&nbsp;快从文档新建一个模板吧</div>
        <div class="template_area">
            <template-block
                class="template_item"
                v-for="item in list"
                :key="item.tid"
                :name="item.title"
                :tid="item.tid"
                :src="item.src"
                :context="context"
                :type="item.type"
                @refresh="refresh"
                @create_doc_from_template="create_doc_from_template">
            </template-block>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type:String,
            default: '我的模板'
        },
        context: {
            type:String,
            default: 'my'
        },
        list: {
            type: Array,
            default() {
                return [
                    {
                        tid: '1',
                        src: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                        name: 'my template'
                    },
                ]
            }
        }
    },
    data() {
        return {
            magic:''
        }
    },

    mounted(){
        this.init();
    },

    methods:{
        init(){
            let random = parseInt(Math.random()*10000);
            this.magic = this.magic_word[random%this.magic_word.length];
        },

        open_info(id, name, type){
            this.dia_title = name;
            this.dia_vis = true;
        },

        create_doc_from_template(tid, type, name){
            this.$emit('create_doc_from_template', tid, type, name);
        },

        refresh(){
            this.$emit('refresh');
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

.template_area{
    padding: 0 30px;
}

.template_item{
    margin: 10px 15px;
    float:left;
}

@media (max-width: 1200px){

}
</style>
