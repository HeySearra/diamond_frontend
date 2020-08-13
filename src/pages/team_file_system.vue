<template>
  <div class="team_file_system">
    <el-container>
    <el-container class="mid">
      <el-container>
        <el-main>
          <div style="padding: 0 40px 0 30px;">
              <div style="height:20px"></div>
            <component
                :is="view_type=='block'?'file-system-block':'file-system-list'"
                :fid="fid"
                @change_view="change_view"
                @open_info="open_info"
                @move_item="move_item"
                @share_item="share_item"
                @copy_item="copy_item">
            </component>
          </div>
          <div style="height:50px"></div>
        </el-main>
      </el-container>
      <el-aside>
        <sidebar context="team" 
            :tid="tid" 
            @create_new_file="create_new_file" 
            @create_new_fold="create_new_fold"
            @edit_admin="edit_admin"
            @manage_member="manage_member"
            @edit_team_info="edit_team_info"></sidebar>
      </el-aside>
    </el-container>
    <el-footer></el-footer>
    </el-container>
    <new-dialog ref="new_dialog"></new-dialog>
    <file-info-dialog ref="file_info_dialog"></file-info-dialog>
    <admin-edit-dialog ref="admin_edit_dialog"></admin-edit-dialog>
    <manage-member-dialog ref="manage_member_dialog"></manage-member-dialog>
    <choose-path-dialog ref="choose_path_dialog"></choose-path-dialog>
    <edit-team-info-dialog ref="edit_team_info_dialog"></edit-team-info-dialog>
    <share-dialog ref="share_dialog" context="team"></share-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      view_type:'block',
      fid:'desktop',
      tid:''
    }
  },
  mounted(){
    this.init();
  },
  methods:{
    init(){
        this.$emit('active_change');
        this.view_type = this.view_type_manager.get();
        try{
          this.tid = this.$route.params.tid;
        }
        catch(err){
          this.$router.push({path:'/'});
        }
        this.fid = this.$route.params.id?this.$route.params.id:'desktop';

        fid=='desktop' ? this.get_desktop_id() : '';
        setTimeout(function(){
          this.$refs.file_system_component.init();
        }, 0);
    },

    getCookie (name) {
      var value = '; ' + document.cookie
      var parts = value.split('; ' + name + '=')
      if (parts.length === 2) return parts.pop().split(';').shift()
    },

    refresh(){
      this.$refs.file_system_component.init();
    },

    get_desktop_id(){
      let url = 'fs/team/root?tid=' + this.tid;
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
                that.fid = res.fid;
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
    },

    error(){
        this.$route.push({path:'/'});
    },

    open_info(title, content){
        this.$refs.file_info_dialog.open_info(title, content);
    },

    create_new_file(){
        this.$refs.new_dialog.open('file', this.fid);
    },

    create_new_fold(){
        this.$refs.new_dialog.open('fold', this.fid);
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
