<template>
<el-container>
    <el-button @click="drawer = true" type="primary" style="margin-left: 16px;">打开</el-button>
<el-drawer
  title="消息中心"
  :visible.sync="drawer"
  :with-header="true">
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
    >>>.el-drawer{
        width: 500px;
        min-width: 300px !important;
    }
    >>>.el-drawer__header{
        border: 0;
    }
</style>
