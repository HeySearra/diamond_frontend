<template>
  <div class="workbench">
    <el-container>
    <el-container class="mid">
      <el-container>
        <el-main>
          <el-menu :default-active="active_index" class="workbench_menu" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1"><router-link class="register_link" :to="{path:'/workbench/recent'}">最近浏览</router-link></el-menu-item>
          <el-menu-item index="2"><router-link class="register_link" :to="{path:'/workbench/star'}">我的收藏</router-link></el-menu-item>
          <el-menu-item index="3"><router-link class="register_link" :to="{path:'/workbench/create'}">我创建的</router-link></el-menu-item>
          <el-menu-item index="4"><router-link class="register_link" :to="{path:'/workbench/share'}">共享文件</router-link></el-menu-item>
        </el-menu>
          <div style="padding: 0 40px 0 30px;">
            <router-view @active_change="active_change"></router-view>
          </div>
          <div style="height:50px"></div>
        </el-main>
      </el-container>
      <el-aside>
        <sidebar active="workbench"></sidebar>
      </el-aside>
    </el-container>
    <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active_index: '1'
    }
  },
  mounted(){
    this.init();
  },
  methods:{
    init(){

    },

    handleSelect(key, keypath){

    },

    active_change(){
      if(this.$route.name == 'workbench_recent'){
        this.active_index = '1';
      }
      else if(this.$route.name == 'workbench_star'){
        this.active_index = '2';
      }
      else if(this.$route.name == 'workbench_create'){
        this.active_index = '3';
      }
      else if(this.$route.name == 'workbench_share'){
        this.active_index = '4';
      }
    }
  }
}
</script>


<style scoped>
@import url("../assets/common.css");

.el-menu{
  margin-top:10px;
  background-color: rgba(0, 0, 0, 0);
}

.el-menu--horizontal>.el-menu-item:not(.is-disabled):focus, .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover, .el-menu--horizontal>.el-submenu .el-submenu__title:hover{
  background-color: rgba(0, 0, 0, 0);
}

.el-menu a{
  text-decoration: none;
  display:inline-block;
  padding: 0 20px;
}

.el-menu-item{
  padding:0;
  margin: 0 10px;
}

</style>
