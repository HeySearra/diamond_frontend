<template>
  <div class="team_center">
    <el-container>
    <el-container class="mid">
      <el-container>
        <el-main>
          <div style="padding: 0 40px 0 30px;">
            <team-display-block title="我创建的团队" :is_creator="true" @open_info="open_info"></team-display-block>
            <div class="clear_both"></div>
            <team-display-block title="我参与的团队" :is_creator="false" @open_info="open_info"></team-display-block>
          </div>
          <div style="height:50px"></div>
        </el-main>
      </el-container>
      <el-aside>
        <sidebar active="team_center" context="team_center" @create_new_team="open_create_new_team_dialog"></sidebar>
      </el-aside>
    </el-container>
    <el-footer></el-footer>
    </el-container>
    <el-dialog
      class="dialog_style"
      :visible.sync="new_team_dialog_vis"
      width="500px">
      <h3>创建新团队</h3>
      <div class="content">
        <div style="height:20px"></div>
        <el-input v-model="new_team_name" placeholder="请输入团队名称" maxLength="60"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="new_team_dialog_vis = false">取 消</el-button>
        <el-button type="primary" @click="new_team_dialog_vis = false">确 定</el-button>
      </span>
    </el-dialog>
    <file-info-dialog ref="team_info_dialog"></file-info-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active_index: '1',
      new_team_dialog_vis: false,
      new_team_name:''
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

    open_create_new_team_dialog(){
        this.new_team_name = '';
        this.new_team_dialog_vis = true;
    },

    open_info(title, content){
        this.$refs.team_info_dialog.open_info(title, content);
    }
  }
}
</script>


<style scoped>
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");

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
