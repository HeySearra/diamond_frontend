<template>
  <div class="team_center">
    <el-container>
      <el-header>
      <navbar></navbar>
    </el-header>
    <el-container class="mid">
      <el-container>
        <el-main>
          <div style="padding: 0 40px 0 30px;">
            <team-display-block title="我创建的团队" :is_creator="true"></team-display-block>
            <div class="clear_both"></div>
            <team-display-block title="我参与的团队" :is_creator="false"></team-display-block>
          </div>
          <div style="height:50px"></div>
        </el-main>
      </el-container>
      <el-aside>
        <sidebar active="team_center" context="team_center"></sidebar>
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
