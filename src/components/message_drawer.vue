<template>
<el-container>
    <el-button @click="drawer = true" type="primary" style="margin-left: 16px;">打开</el-button>
<el-drawer
  title="我是标题"
  :visible.sync="drawer"
  :with-header="false">

     <el-table :data="gridData">
      <el-table-column property="date" label="日期" width="150"></el-table-column>
      <el-table-column property="name" label="姓名" width="200"></el-table-column>
      <el-table-column property="address" label="地址"></el-table-column>
    </el-table>
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
    .drawer {
        position: absolute;
        height: 100vh;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 1000000 !important;
    }
    .drawer .drawer_body {
        height: 100%;
        position: absolute;
        z-index: 1000001;
        background: #fff;
        width: auto;
        left: auto;
        right: 0;
        overflow-y: hidden;
        width: 400px;
        background-color: #fff;
    }
    .mask {
        height: 100vh;
        width: 100vw;
        position: absolute;
        z-index: 1000000;
        top: 0;
        left: 0;
        background-color: #000;
        opacity: 0.3;
    }
    .slide-right-enter-active,
    .slide-right-leave-active,
    .slide-left-enter-active,
    .slide-left-leave-active {
        will-change: transform;
        transition: transform 400ms;
        position: absolute;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }
    .slide-right-enter,
    .slide-right-leave-active {
        transform: translate(-100%, 0);
    }
    .slide-left-leave-active,
    .slide-left-enter {
        transform: translate(100%, 0);
    }
</style>
