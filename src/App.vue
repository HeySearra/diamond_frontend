<template>
  <div id="app">
    <el-header>
      <navbar></navbar>
    </el-header>
    <router-view/>
    <el-backtop></el-backtop>
    
  </div>
</template>

<script>

export default {
  name: 'App',
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
