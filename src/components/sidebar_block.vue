<template>
  <div class="sidebar_menu">
    <el-row class="user_info">
      <el-col :span="8" class="avatar">
        <el-avatar></el-avatar>
      </el-col>
      <el-col :span="16" class="username">DiaDoc钻石带会员</el-col>
    </el-row>
    <el-row class="new_buttons">
      <div class="button_container">
        <el-row><el-button type="info">新建文档</el-button></el-row>
        <el-row><el-button type="info">新建文件夹</el-button></el-row>
      </div>
    </el-row>
    <el-row class="function_buttons">工作台</el-row>
    <el-row class="function_buttons">我的团队</el-row>
    <el-row class="function_buttons">我的桌面</el-row>
    <el-row class="function_buttons">模版库</el-row>
    <el-row class="function_buttons">回收站</el-row>
  </div>
</template>
<script>
export default {
  mounted() {
    this.init();
  },

  data() {
    return {
      //data
    }
  },

  methods: {
    init() {
      this.apply_for_info();
    },

    apply_for_info() {
      //向后台请求一些内容
    }
  }
}
</script>

<style scoped>
@import url("../assets/common.css");

.sidebar_menu {
  font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif !important;
  margin-top: 10px;
  width: 18vw;
  height: 100%;
  border: solid 2px;
}

.user_info{
  border: solid 2px;
  height: 60px;
  display: flex;
  align-items: center;
}

.avatar{
  display: flex;
  align-items: center;
  justify-content: center;
}

.username{
  display: flex;
  align-items: center;
}

.new_buttons{
  border: solid 2px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button_container{
  width: 90%;
  border: solid 2px;
}

.function_buttons{
  border: solid 2px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

}

.el-button{
  margin-top: 2px;
  margin-bottom: 2px;
  width: 100%;
}

</style>
