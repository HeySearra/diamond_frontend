<template>
<div class="snow">
  <el-container>
    <forget-set style="margin-top:27vh"></forget-set>
  </el-container>
</div>
</template>

<script>
import forget_set_block from '@/components/forget_set_block';
export default {
  components:{
    'forget-set': forget_set_block
  },

  data () {
    return {
    }
  },
  mounted(){
    // if(this.login_manager.get()){
    //   let url = this.$route.query&&this.$route.query.from ? this.$route.query.from : '/index';
    //   this.$router.push({path:url});
    // }
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
  /* opacity: 0.69; */
}

.nav>>>.el-menu{
  background-color: rgba(255, 255, 255, 0.87) !important;
}

</style>