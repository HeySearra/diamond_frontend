<template>
  <div class="workbench">
    <el-container>
    <el-container class="mid">
      <el-container>
        <el-main>
          <el-menu :default-active="active_index" class="workbench_menu" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1"><router-link class="register_link" :to="{path:'/workbench/recent_view'}">最近浏览</router-link></el-menu-item>
          <el-menu-item index="2"><router-link class="register_link" :to="{path:'/workbench/star_view'}">我的收藏</router-link></el-menu-item>
          <el-menu-item index="3"><router-link class="register_link" :to="{path:'/workbench/create_view'}">我创建的</router-link></el-menu-item>
          <el-menu-item index="4"><router-link class="register_link" :to="{path:'/workbench/share_view'}">共享文件</router-link></el-menu-item>
        </el-menu>
          <div style="padding: 0 40px 0 30px;">
            <router-view @active_change="active_change" @open_info="open_info"></router-view>
          </div>
          <div style="height:50px"></div>
        </el-main>
      </el-container>
      <el-aside>
        <sidebar active="workbench" @create_new_file="create_new_file" @create_new_fold="create_new_fold"></sidebar>
      </el-aside>
    </el-container>
    <el-footer></el-footer>
    </el-container>
    <new-dialog ref="new_dialog"></new-dialog>
    <file-info-dialog ref="file_info_dialog"></file-info-dialog>
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
    },

    open_info(title, content){
        this.$refs.file_info_dialog.open_info(title, content);
    },

    create_new_file(){
        this.$refs.new_dialog.open('file', this.fid);
    },

    create_new_fold(){
        this.$refs.new_dialog.open('fold', this.fid);
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
