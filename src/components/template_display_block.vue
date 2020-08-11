<template>
    <div class="template_display_block">
        <h1>{{title}}</h1>
        <el-divider></el-divider>
        <div class="template_area">
            <template-block 
                class="template_item" 
                v-for="item in list" 
                :key="item.tid"
                :name="item.name"
                :tid="item.tid"
                :src="item.src"
                :context="context">
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

h1{
    text-indent: 25px;
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