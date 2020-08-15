<template>
  <div class="team_center">
    <el-container>
    <el-container class="mid">
      <el-container>
        <el-main v-loading="is_loading">
          <div style="padding: 0 40px 0 30px;">
            <div style="height:30px"></div>
            <team-display-block title="我创建的团队" 
              :is_creator="true" 
              @open_info="open_info"
              :list="my_list"
              addable="team"
              @add_item="add_item"
              @refresh="refresh"
            ></team-display-block>
            <div class="clear_both"></div>
            <team-display-block title="我参与的团队" 
              :is_creator="false" 
              @open_info="open_info" 
              :list="other_list"
              @refresh="refresh"
            ></team-display-block>
          </div>
          <div style="height:50px"></div>
        </el-main>
      </el-container>
      <el-aside>
        <sidebar ref="sidebar" active="team_center" context="team_center"></sidebar>
      </el-aside>
    </el-container>
    <el-footer></el-footer>
    </el-container>
    <file-info-dialog ref="team_info_dialog" @refresh="refresh"></file-info-dialog>
    <new-dialog ref="new_dialog" @refresh="refresh" :desktop_alert="true"></new-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      my_list:[],
      other_list:[],
      is_loading:true
    }
  },
  mounted(){
    this.init();
  },
  methods:{
    init(){
      this.apply_for_info();
    },

    getCookie (name) {
      var value = '; ' + document.cookie
      var parts = value.split('; ' + name + '=')
      if (parts.length === 2) return parts.pop().split(';').shift()
    },

    refresh_user_info(){
      this.$refs.sidebar.refresh_user_info();
    },

    apply_for_info(){
      this.is_loading = true;
      let url = '/team/all';
      var that = this;
      $.ajax({ 
          type:'get',
          url: url,
          headers: {'X-CSRFToken': this.getCookie('csrftoken')},
          async:false, 
          success:function (res){ 
            if(that.console_debug){
                console.log(url +  '：' + res.status);
            }
            if(res.status == 0){
              that.my_list = res.my_team;
              that.other_list = res.join_team;
              that.is_loading = false;

            }
            else{
                switch(res.status){
                    case 2:
                        that.alert_msg.error('权限不足');
                        break;
                    default:
                        that.alert_msg.error('请求团队信息错误');
                }
            }
          },
          error:function(res){
              that.alert_msg.error('网络连接失败');
          }
      });
    },

    refresh(){
      this.apply_for_info();
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

    add_item(){
        this.$refs.new_dialog.open('team');
    },

    open_info(title, content, type){
        this.$refs.team_info_dialog.open_info(title, content, type);
    },
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
