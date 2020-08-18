<template>
  <div class="team_file_system blur_div">
    <el-container>
    <el-container class="mid">
      <el-container>
        <el-main v-loading="is_loading">
          <div style="padding: 0 40px 0 30px;">
              <div style="height:20px"></div>
            <component
                ref="file_system_component"
                :is="view_type=='block'?'file-system-block':'file-system-list'"
                :fid="fid"
                :addable="true"
                context="team"
                @change_view="change_view"
                @open_info="open_info"
                @move_item="move_item"
                @share_item="share_item"
                @copy_item="copy_item"
                @add_item="add_item"
                @refresh="refresh"
                @in_loading="in_loading"
                @out_loading="out_loading"
                @rename="rename">
            </component>
          </div>
          <div style="height:50px"></div>
        </el-main>
      </el-container>
      <el-aside>
        <sidebar context="team" 
            ref="sidebar"
            @edit_admin="edit_admin"
            @manage_member="manage_member"
            @edit_team_info="edit_team_info"
            @open_user_info="open_user_info"
            @send_all="send_all"></sidebar>
      </el-aside>
    </el-container>
    <el-footer></el-footer>
    </el-container>
    <new-dialog ref="new_dialog" @refresh="refresh"></new-dialog>
    <file-info-dialog ref="file_info_dialog"></file-info-dialog>
    <admin-edit-dialog @refresh_team_info="refresh_team_info_force" ref="admin_edit_dialog"></admin-edit-dialog>
    <manage-member-dialog ref="manage_member_dialog"></manage-member-dialog>
    <choose-path-dialog ref="choose_path_dialog"></choose-path-dialog>
    <edit-team-info-dialog ref="edit_team_info_dialog" @refresh="refresh_team_info_force"></edit-team-info-dialog>
    <share-dialog ref="share_dialog" context="team"></share-dialog>
    <send-all-dialog ref="send_all_dialog"></send-all-dialog>
  </div>
</template>

<script>
import new_dialog from '@/components/new_dialog';
import file_info_dialog from '@/components/file_info_dialog';
import choose_path_dialog from '@/components/choose_path_dialog';
import share_dialog from '@/components/share_dialog';
import admin_edit_dialog from '@/components/admin_edit_dialog';
import manage_member_dialog from '@/components/manage_member_dialog';
import edit_team_info_dialog from '@/components/edit_team_info_dialog';
import send_all_dialog from '@/components/send_all_dialog';
export default {
  components:{
    'new-dialog': new_dialog,
    'file-info-dialog': file_info_dialog,
    'choose-path-dialog': choose_path_dialog,
    'share-dialog': share_dialog,
    'admin-edit-dialog': admin_edit_dialog,
    'manage-member-dialog': manage_member_dialog,
    'edit-team-info-dialog': edit_team_info_dialog,
    'send-all-dialog': send_all_dialog
  },

  data () {
    return {
      view_type:'block',
      fid:'desktop',
      tid:'',
      is_loading:true
    }
  },
  watch:{
    $route(to,from){
      this.init();
    }
  },
  mounted(){
    this.init();
  },
  methods:{
    init(){
        if(!this.login_manager.get()){
          that.alert_msg.warning('您还未登录，请先登录账号');
          this.$router.push({name:'login'});
          return;
        }
        this.$emit('active_change');
        this.view_type = this.view_type_manager.get();
        try{
          this.tid = this.$route.params.tid;
        }
        catch(err){
          this.$router.push({path:'/'});
        }
        this.fid = this.$route.params.id?this.$route.params.id:'desktop';

        this.get_desktop_id();
        if(this.fid == 'desktop'){
          var that = this;
          setTimeout(function(){
            that.alert_msg.error('请求团队文件夹的信息发生了错误');
          }, 0)
          return;
        }
        var that = this;
        setTimeout(function(){
          that.$refs.file_system_component.init();
          that.$refs.sidebar.init_team_info(that.tid);
        }, 0);
    },

    refresh_user_info(){
      this.$refs.sidebar.refresh_user_info();
    },

    getCookie (name) {
      var value = '; ' + document.cookie
      var parts = value.split('; ' + name + '=')
      if (parts.length === 2) return parts.pop().split(';').shift()
    },

    refresh(){
      this.$refs.file_system_component.init();
    },

    refresh_team_info_force(){
      this.$refs.sidebar.init_team_info(this.tid, true);
    },

    refresh_team_info(){
      this.$refs.sidebar.init_team_info(this.tid);
    },

    get_desktop_id(){
      let url = '/fs/team/root?tid=' + this.tid;
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
                if(that.fid == 'desktop'){
                  that.fid = res.fid;
                }
              }
              else{
                  switch(res.status){
                      case 2:
                          that.alert_msg.error('权限不足');
                          break;
                      default:
                          that.alert_msg.error('发生了未知错误');
                  }
              }
          },
          error:function(res){
              that.alert_msg.error('网络连接失败');
          }
      });
    },

    change_view(){
        this.view_type = this.view_type=='block' ? 'list' : 'block';
        this.view_type_manager.set(this.view_type);
        var that = this;
        setTimeout(function(){
          that.$refs.file_system_component.init();
        }, 0);
    },

    error(){
        this.$route.push({path:'/'});
    },

    open_info(title, content, type){
        this.$refs.file_info_dialog.open_info(title, content, type);
    },

    add_item(type, fid){
        this.$refs.new_dialog.open(type, fid);
    },

    rename(type, id, name){
        this.$refs.new_dialog.open_for_rename(type, id, name);
    },

    edit_admin(){
        this.$refs.admin_edit_dialog.open(this.tid);
    },

    manage_member(){
        this.$refs.manage_member_dialog.open(this.tid);
    },

    move_item(id, type, name){
        this.$refs.choose_path_dialog.open(this.fid, type, id, name, 'move')
    },

    edit_team_info(){
      this.$refs.edit_team_info_dialog.open(this.tid);
    },

    share_item(did, name){
      this.$refs.share_dialog.open(did, name);
    },

    copy_item(id, type, name){
        this.$refs.choose_path_dialog.open(this.fid, type, id, name, 'copy');
    },
    
    in_loading(){
      this.is_loading = true;
    },

    out_loading(){
      this.is_loading = false;
    },

    open_user_info(uid){
      this.$emit('open_user_info', uid);
    },

    send_all(tid){
      this.$refs.send_all_dialog.open(tid);
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
