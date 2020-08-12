<template>
<el-container>
    <el-button @click="drawer = true" type="primary" style="margin-left: 16px;">打开</el-button>
    <el-drawer
    title="消息中心"
    :visible.sync="drawer"
    :with-header="false">
        <div class="el-drawer__header">
            <div class="el-drawer__title">消息中心</div>
            <div class="mark-read">全部已读</div>
            <!-- <div class="close-icon"><span v-if="type!='comment'" class="icon iconfont">&#xe79b;</span></div> -->
        </div>
        <message-item></message-item>
        <message-item></message-item>
        <message-item :is_read=true></message-item>
        <message-item :is_read=true></message-item>
        <!-- <el-table :data="gridData">
        <el-table-column property="date" label="日期" width="150"></el-table-column>
        <el-table-column property="name" label="姓名" width="200"></el-table-column>
        <el-table-column property="address" label="地址"></el-table-column>
        </el-table> -->
    </el-drawer>
</el-container>
</template>

<script>
export default {
    data(){
        return {
            drawer: false,
        }
    },
    props: {
        // 是否显示drawer
        drawerVisible: Boolean,
        // drawer方向
        direction: {
            type: String,
            default: 'right',
        },
        title: String,
    },
    methods:{
         visible() {
            this.drawerVisible = true;
            this.title = "123";
        },
         close() {
            this.drawerVisible = false;
            this.$emit("update:drawerVisible", false);
            this.$emit("close");
        }
    }
};
</script>

<style scoped>
    >>>.el-drawer__body{
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
    }
</style>
