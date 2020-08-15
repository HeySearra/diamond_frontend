<template>
  <div id="app">
    <el-header>
      <navbar 
        @open-drawer="open_drawer"
        @edit_user_info="edit_user_info"
        @change_password="change_password"
        @chatting="chatting"
        ref="header"></navbar>
    </el-header>
    <router-view/>
    <el-backtop></el-backtop>
    <message-drawer ref="message_drawer" @deal-team-invite="deal_team_invite" @refresh_message_count="refresh_message_count"></message-drawer>
    <edit-user-info-dialog ref="edit_user_info_dialog" @apply_for_info='apply_for_info'></edit-user-info-dialog>
    <change-password-dialog ref="change_password_dialog"></change-password-dialog>
    <chatting-dialog ref="chatting_dialog"></chatting-dialog>
    <team-invite-dialog ref="team_invite_dialog"></team-invite-dialog>
  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return {
      show_drawer: true,
    }
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
    apply_for_info(){
      this.$refs.header.apply_for_info();
    },
    deal_team_invite(data){
      this.$refs.team_invite_dialog.open(data);
    },
    refresh_message_count(){
      this.$refs.header.refresh_message_count();
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
