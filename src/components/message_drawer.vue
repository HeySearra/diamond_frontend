<template>
    <el-drawer
    title="消息中心"
    width="100"
    :visible.sync="drawer"
    :with-header="false"
    class="message_box">
        <div class="el-drawer__header" style="height:50px;padding:5px 20px 0;line-height:50px;margin:0">
            <div class="el-drawer__title can_not_choose">消息中心</div>
            <div class="mark-read can_not_choose">全部已读</div>
            <!-- <div class="close-icon"><span v-if="type!='comment'" class="icon iconfont">&#xe79b;</span></div> -->
        </div>
        <el-divider></el-divider>
        <div v-infinite-scroll="load" class="message_area" style="overflow-x:hidden;overflow-y:auto;border:solid 1px;height:calc(100vh - 50px)">
            <message-item></message-item>
            <message-item></message-item>
            <message-item></message-item>
            <message-item></message-item>
            <message-item></message-item>
            <message-item></message-item><message-item></message-item>
            <message-item></message-item>
            <message-item></message-item>
            <message-item></message-item>
            <message-item></message-item>
            <message-item></message-item><message-item></message-item>
            <message-item></message-item>
            <message-item></message-item>
            <message-item></message-item>
            <message-item></message-item>
            <message-item></message-item>
            <p v-if="is_loading" class="not_found">加载中 <i class="el-icon-loading"></i></p>
        </div>
        
    </el-drawer>
</template>

<script>
export default {
    data(){
        return {
            drawer: false,
            page: 0,
            each: 10,
            list: [],
            is_loading:false
        }
    },
    props: {
    },
    mounted(){
    },
    methods:{
        init(){
            
        },
        open() {
            this.drawer = true;
        },

        load(){
            this.is_loading = true;
        }
    }
};
</script>

<style scoped>
    /* >>>.el-drawer__body{
        width: 600px;
        min-width: 300px !important;
    }
    >>>.el-drawer{
        width: 600px;
        min-width: 300px !important;
    }
    >>>.el-drawer__header{
        border: 0;
        padding: 0;
        margin: 0;
    }
    >>>.el-drawer__title{
        margin: 15px 15px;
        border: 2px;
        cursor: default;
    }
    /* .close-icon{
        padding: 0 10px 0 0;
        border: 2px;
        vertical-align: top;
    } */
    .mark-read{
        font-size: 90%;
        border: 2px;
        float: right;
        margin: 0 15px;
        cursor: pointer;
    }
    .mark-read:hover{
        color: hsl(219, 15%, 23%);
    } */

    .el-drawer__body>>>.message_area{
        height:calc(100vh - 50px) !important;
    }

    .el-divider{
        margin: 5px 0 0 0;
    }

    .message_box>>>.el-drawer__open .el-drawer.rtl{
        width:430px !important;
    }
</style>
