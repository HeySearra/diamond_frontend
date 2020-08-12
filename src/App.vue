<template>
  <div id="app">
    <el-header>
      <navbar 
        @open_drawer="open_drawer"
        @edit_user_info="edit_user_info"
        @change_password="change_password"
        @chatting="chatting"></navbar>
    </el-header>
    <router-view/>
    <el-backtop></el-backtop>
    <message-drawer ref="message_drawer"></message-drawer>
    <edit-user-info-dialog ref="edit_user_info_dialog"></edit-user-info-dialog>
    <change-password-dialog ref="change_password_dialog"></change-password-dialog>
    <chatting-dialog ref="chatting_dialog"></chatting-dialog>
  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return {
      show_drawer: false,
    }
  },
  methods:{
    open_drawer(){
      this.show_drawer = true;
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
    background-color: #f6f6f6;
    width:100vw !important;
    overflow-x: hidden;
  }

  /* #app{
    overflow-y: scroll;
  } */
</style>
