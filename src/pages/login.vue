<template>
<div class="snow">
  <el-container>
    <el-header>
      <navbar class="nav"></navbar>
    </el-header>
    <!--div style="margin-top:27vh; border: solid 2px"></div-->
    <el-container>
      <el-aside><sidebar></sidebar></el-aside>
      <login id="login" style="border: solid 2px; margin-top: 27vh"></login>
    </el-container>
  </el-container>
</div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted(){
    if(this.login_manager.get()){
      let url = this.$route.query&&this.$route.query.from ? this.$route.query.from : '/index';
      this.$router.push({path:url});
    }
    document.documentElement.scrollTop = 0;
    $(window).off('scroll');
  }
}
</script>


<style scoped>
@import url("../assets/common.css");

.snow{
  background-image: url("../assets/snow.jpg");
  background-size: cover;
  height:100vh;
  background-position: center;
}

.nav>>>.el-menu{
  background-color: rgba(255, 255, 255, 0.87) !important;
}

</style>
