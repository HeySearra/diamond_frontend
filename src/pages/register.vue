<template>
<div class="snow">
  <el-container>
    <reg style="margin-top:18vh"></reg>
  </el-container>
</div>
</template>

<script>
import reg from '@/components/register_block';
export default {
  components:{
    'reg': reg
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
  /* opacity:0.69; */
}

.nav>>>.el-menu{
  background-color: rgba(255, 255, 255, 0.87) !important;
}
</style>