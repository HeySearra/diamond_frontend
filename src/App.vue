<template>
  <div id="app">
    <el-header>
      <navbar 
        class="blur_div"
        @open-drawer="open_drawer"
        @edit_user_info="edit_user_info"
        @change_password="change_password"
        @chatting="chatting"
        @open_chatting_dialog_with_uid="chatting_with_uid"
        ref="header"></navbar>
    </el-header>
    <router-view 
      ref="rw"
      @open_chatting_dialog_with_uid="chatting_with_uid"
      @refresh_online_list="refresh_online_list" />
    <el-backtop></el-backtop>
    <message-drawer ref="message_drawer" @deal-team-invite="deal_team_invite" @refresh_message_count="refresh_message_count"></message-drawer>
    <edit-user-info-dialog ref="edit_user_info_dialog" @refresh_user_info="refresh_user_info"></edit-user-info-dialog>
    <change-password-dialog ref="change_password_dialog"></change-password-dialog>
    <chatting-dialog ref="chatting_dialog"></chatting-dialog>
    <team-invite-dialog @close_msg="close_msg" @refresh_msg="refresh_msg" ref="team_invite_dialog"></team-invite-dialog>
  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return {
      show_drawer: true,
      timer:undefined
    }
  },
  mounted(){
    var that = this;
    this.timer ? clearInterval(this.timer) : '';
    this.timer = setInterval(function(){
      let item = that.$refs.header;
      if(item){
        item.refresh_message_count();
      }
    }, 1000*5);
  },
  methods:{
    open_drawer(){
      this.$refs.message_drawer.open();
    },
    edit_user_info(){
      this.$refs.edit_user_info_dialog.open();
    },
    change_password(){
      this.$refs.change_password_dialog.open();
    },
    chatting(){
      this.$refs.chatting_dialog.open();
    },
    chatting_with_uid(uid){
      this.$refs.chatting_dialog.open(uid);
    },
    refresh_user_info(){
      this.$refs.header.init();
      this.$refs.rw.refresh_user_info();
    },
    deal_team_invite(data){
      this.$refs.team_invite_dialog.open(data);
    },
    refresh_message_count(){
      //this.$refs.header.refresh_message_count();
    },
    close_msg(){
      this.$refs.message_drawer.close();
    },
    refresh_msg(){
      this.$refs.message_drawer.refresh();
    },
    refresh_online_list(list){
      this.$refs.header.refresh_online_list(list);
    }
  },
}
</script>

<style>
  body, .el-header, .el-footer{
    margin:0;
    padding:0;
    min-width: 1200px;
  }

  body{
    background-color: hsl(0, 0%, 99%);
    overflow-x:hidden;
    overflow-y:overlay;
  }

  /* #app{
    overflow-y: scroll;
  } */
</style>
