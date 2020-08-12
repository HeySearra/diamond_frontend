<template>
    <div class="user_list_item">
        <div style="height:56px;">
            <div style="display: inline-block;margin:8px 20px;float:left">
                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            </div>
            <div style="display: inline-block;float:left;width:150px">
                <div class="content">
                    {{name}}
                </div>
            </div>
            <div style="display: inline-block;float:left;width:200px">
                <div class="content">
                    {{account}}
                </div>
            </div>
            <div style="position:absolute; right:36px" class="cancel_icon" v-if="type=='admin'">
                <span class="icon iconfont">&#xe79b;</span>
            </div>
        </div>
        <el-divider></el-divider>
    </div>
</template>

<script>
export default {
    props: {
        uid: {
            type:String,
            default: 'uid'
        },
        name: {
            type:String,
            default: 'name'
        },
        account:{
            type:String,
            default: 'account'
        },
        src:{
            type:String,
            default: 'src'
        },
        type:{
            type:String,
            default: 'admin' // 'admin' or 'search'
        }
    },

    data() {
        return {
            dia_vis:true
        }
    },

    methods:{
        
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/diadoc_icon.css");

.user_list_item{
    width:100%;
    height:56px;
    line-height:56px;
    cursor:pointer;
    position: relative;
}

.user_list_item:hover{
    background-color: #ccc;
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
}

.user_list_item:hover .cancel_icon{
    opacity: 1;
}

@media (max-width: 1200px){
    
}
</style>