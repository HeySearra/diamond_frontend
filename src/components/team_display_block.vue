<template>
    <div class="team_display_block">
        <h1>{{title}}</h1>
        <el-divider></el-divider>
        <div class="team_area">
            <div class="item" 
                v-for="item in list" 
                :key="item.tid">
                <team-block
                    :tid="item.tid"
                    :is_creator="is_creator"
                    :name="item.name"
                    @open_info="open_info">
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

        open_info(title, content){
            this.$emit('open_info', title, content);
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");

h1{
    font-size: 30px !important;
    text-indent: 25px;
    margin-bottom:5px !important;;
}

.team_area{
    padding: 0 30px;
}

.item{
    margin: 6px 15px;
    float:left;
}

@media (max-width: 1200px){
    
}
</style>