<template>
    <transition name="el-zoom-in-center">
        <el-tooltip 
            class="item" 
            effect="dark" 
            :content="name" 
            placement="top-start"
            v-show="show"
            >
        <el-avatar :src="src"></el-avatar>
        </el-tooltip>
    </transition>
</template>

<script>
export default {
    name: 'header-user-icon',

    props: {
        name: {
            type:String,
            default: 'name'
        },
        src:{
            type:String,
            default: 'src'
        },
    },

    data() {
        return {
            show:false
        }
    },

    mounted(){
        this.show = true;
    },

    methods:{
        close(){
            this.show = false;
        }
    }
}
</script>

<style scoped>
@import url("../assets/common.css");


.user_list_item{
    width:100%;
    height:56px;
    line-height:56px;
    cursor:pointer;
    position: relative;
    transition:all 0.1s linear;
}

.hover_color:hover{
    background-color: #f6f6f6;
}

.content{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
    padding:0 !important;
}

.el-divider{
    margin:0;
}

.el-avatar{
    display:block;
}

.cancel_icon{
    opacity: 0;
    color:#999;
    transition:all 0.1s linear;
}

.cancel_icon span{
    font-size: 21px;
}

.user_list_item:hover .cancel_icon{
    opacity: 1;
}

@media (max-width: 1200px){
    
}
</style>