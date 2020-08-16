<template>
    <div class="team_display_block">
        <h1 class="can_not_choose">{{title}} <span class="el-icon-circle-plus-outline add_button" v-if="addable!='none'" @click="add_item"></span></h1>
        <el-divider></el-divider>
        <div class="team_area">
            <div v-if="!list.length&&random>=0" class="not_found">{{not_found_text[random]}}</div>
            <div class="item" 
                v-for="item in list" 
                :key="item.tid">
                <team-block
                    :tid="item.tid"
                    :is_creator="is_creator"
                    :tname="item.name"
                    :name="item.name"
                    :refresh="refresh"
                    @open_info="open_info"
                    @refresh="refresh">
                </team-block>
            </div>
        </div>
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
        },
        addable:{
            type:String,
            default:'none'
        }
    },
    data() {
        return {
            random:-1,
            not_found_text:['这里啥玩意也没有', '这里什么也没有', '空空如也', '这里好凄凉', '难道？这里什么也没有', '这里没有任何的团队', '这里啥都没', '什么团队也没有~', '这里没团队，别看了', '啊，这里没团队啊']
        }
    },

    mounted(){
        this.random = parseInt(Math.random()*100%this.not_found_text.length);
    },

    methods:{
        refresh(){
            this.$emit("refresh");
        },

        open_info(title, content, type){
            this.$emit('open_info', title, content, type);
        },

        add_item(){
            this.$emit('add_item');
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

.team_area{
    padding: 0 30px;
}

.item{
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