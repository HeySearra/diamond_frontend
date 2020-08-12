<template>
  <div class="file_system">
    <el-container>
    <el-container class="mid">
      <el-container>
        <el-main>
          <div style="padding: 0 40px 0 30px;">
              <div style="height:20px"></div>
            <component
                :is="view_type=='block'?'file-system-block':'file-system-list'"
                :fid="fid"
                @change_view="change_view">
            </component>
          </div>
          <div style="height:50px"></div>
        </el-main>
      </el-container>
      <el-aside>
        <sidebar :active="sidebar_active"></sidebar>
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
      view_type:'block',
      fid:'desktop',
      sidebar_active:''
    }
  },
  mounted(){
    this.init();
  },
  methods:{
    init(){
        this.view_type = this.view_type_manager.get();
        this.fid = this.$route.params.id?this.$route.params.id:'desktop';
        this.sidebar_active = this.fid=='desktop' ? 'desktop' : '';
    },

    change_view(){
        this.view_type = this.view_type=='block' ? 'list' : 'block';
        this.view_type_manager.set(this.view_type);
    },

    error(){
        this.$router.push({path:'/'});
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
