<template>
  <div class="file_system blur_div">
    <el-container>
      <el-container class="mid">
        <el-container>
          <el-main>
            <div style="padding: 0 40px 0 30px;">
              <div style="height:20px"></div>
              <div>
                <template-display-block
                  v-bind:list="my_list"
                  context="user"
                  @refresh="refresh"
                  @create_doc_from_template="create_doc_from_template">
                </template-display-block>
                <div class="clear_both divide_type"></div>
                <!--template-display-block
                    title="学习"
                    context="official"
                    :list="[ {
                        tid: '1',
                        src: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                        name: '退学专用模板'
                    },]"></template-display-block-->
                <div v-for="item in official_list" :key="item.tid">
                  <template-display-block
                    context="official"
                    :title="item.title"
                    :list="item.temps"
                    @refresh="refresh"
                    @create_doc_from_template="create_doc_from_template">
                  </template-display-block>
                  <div class="clear_both divide_type"></div>
                </div>
              </div>
            </div>
            <div style="height:50px"></div>
          </el-main>
        </el-container>
        <el-aside>
          <sidebar ref="sidebar" active="template" @create_new_file="create_new_file" @create_new_fold="create_new_fold"></sidebar>
        </el-aside>
      </el-container>
      <el-footer></el-footer>
    </el-container>
    <new-dialog
      ref="new_dialog"
      @create_doc_from_template="create_doc_from_template">
    </new-dialog>
    <choose-path-dialog-for-template
      ref="choose_path_dialog_for_template"
      @create_file_from_template_choose_name="create_file_from_template_choose_name">
    </choose-path-dialog-for-template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      my_list: [],
      official_list: []
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if(!this.login_manager.get()){
        that.alert_msg.warning('您还未登录，请先登录账号');
        this.$router.push({name:'login'});
        return;
      }
      this.getAllTemplates();
    },

    error() {

    },

    refresh_user_info(){
      this.$refs.sidebar.refresh_user_info();
    },

    create_new_file() {
      this.$refs.new_dialog.open('file', this.fid);
    },

    create_new_fold() {
      this.$refs.new_dialog.open('fold', this.fid);
    },

    getCookie (name) {
      var value = '; ' + document.cookie
      var parts = value.split('; ' + name + '=')
      if (parts.length === 2) return parts.pop().split(';').shift()
    },

    getAllTemplates() {
      var that = this;
      $.ajax({
        type:'get',
        url:'/temp/all',
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        processData: false,
        contentType: false,
        async: false,
        success:function (res){
          if (that.console_debug) {
            console.log("(get)/temp/all" + " : " + res.status);
          }
          if (res.status === 0) {
            that.my_list = res.my_list;
            that.official_list = res.official_list;
          } else {
            switch (res.status) {
              default:
                that.alert_msg.error('未知错误');
            }
          }
        },
        error:function(){
          that.alert_msg.error('连接失败');
        }
      });
    },

    create_doc_from_template(tid, type, name){
      this.$refs.choose_path_dialog_for_template.open(tid, type, name);
    },

    create_file_from_template_choose_name(fid, tid, type, name){
      this.$refs.new_dialog.open_for_template(fid, tid, type, name);
    },

    open_chatting_dialog(){
      this.$emit('open_chatting_dialog');
    },

    refresh(){
      this.getAllTemplates();
    }
  }
}
</script>


<style scoped>
@import url("../assets/common.css");

.el-menu {
  margin-top: 10px;
  background-color: rgba(0, 0, 0, 0);
}

.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus, .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover, .el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  background-color: rgba(0, 0, 0, 0);
}

.el-menu a {
  text-decoration: none;
  display: inline-block;
  padding: 0 20px;
}

.el-menu-item {
  padding: 0;
  margin: 0 10px;
}

.divide_type {
  height: 30px;
}

</style>
