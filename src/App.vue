<template>
  <div id="app">
    <el-header>
      <navbar @open_drawer="open_drawer"></navbar>
    </el-header>
    <router-view/>
    <el-backtop></el-backtop>
    <message-drawer ref="message_drawer"></message-drawer>
  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return {
      show_drawer: false,
    }
  },
  methods:{
    open_drawer(){
      this.show_drawer = true;
      this.$refs.message_drawer.open();
    },
  },
}
</script>

<style>
  body, .el-header, .el-footer{
    margin:0;
    padding:0;
    min-width: 1200px;
  }

  body{
    background-color: #f6f6f6;
    width:100vw !important;
    overflow-x: hidden;
  }

  /* #app{
    overflow-y: scroll;
  } */
</style>
