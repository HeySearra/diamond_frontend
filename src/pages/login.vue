<template>
  <div class="snow">
    <el-container>
      <login id="login" style="margin-top:27vh"></login>
    </el-container>
  </div>
</template>

<script>
import login from '@/components/login_block';
export default {
  components:{
    'login': login
  },

  data () {
    return {
    }
  },
  mounted(){
    if(this.login_manager.get()){
      let url = this.$route.query&&this.$route.query.from ? this.$route.query.from : '/workbench/recent_view';
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
  background-image: url("../assets/panda.jpg");
  background-size: cover;
  height:100vh;
  background-position: center;
}

</style>
