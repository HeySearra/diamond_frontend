<template>
  <div class="workbench">
    <el-container>
    <el-container class="mid">
      <el-container>
        <el-main>
          <el-menu :default-active="active_index" class="workbench_menu blur_div" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1"><router-link class="register_link" :to="{path:'/workbench/recent_view'}">最近浏览</router-link></el-menu-item>
            <el-menu-item index="2"><router-link class="register_link" :to="{path:'/workbench/star_view'}">我的收藏</router-link></el-menu-item>
            <el-menu-item index="3"><router-link class="register_link" :to="{path:'/workbench/create_view'}">我创建的</router-link></el-menu-item>
            <el-menu-item index="4"><router-link class="register_link" :to="{path:'/workbench/share_view'}">共享文件</router-link></el-menu-item>
        </el-menu>
          <div style="padding: 0 40px 0 30px;">
            <router-view class="workbench_content" @active_change="active_change" @open_info="open_info" @share_item="share_item"></router-view>
          </div>
        </el-main>
      </el-container>
      <el-aside class=" blur_div">
        <sidebar ref="sidebar" active="workbench" @create_new_file="create_new_file" @create_new_fold="create_new_fold"></sidebar>
      </el-aside>
    </el-container>
    <el-footer></el-footer>
    </el-container>
    <new-dialog ref="new_dialog" :desktop_alert="true"></new-dialog>
    <file-info-dialog ref="file_info_dialog"></file-info-dialog>
    <share-dialog ref="share_dialog"></share-dialog>
  </div>
</template>

<script>
import new_dialog from '@/components/new_dialog';
import file_info_dialog from '@/components/file_info_dialog';
import share_dialog from '@/components/share_dialog';
export default {
  components:{
    'new-dialog': new_dialog,
    'file-info-dialog': file_info_dialog,
    'share-dialog': share_dialog
  },

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
      if(!this.login_manager.get()){
        that.alert_msg.warning('您还未登录，请先登录账号');
        this.$router.push({name:'login'});
        return;
      }
    },

    refresh_user_info(){
      this.$refs.sidebar.refresh_user_info();
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

    open_info(title, content, type){
        this.$refs.file_info_dialog.open_info(title, content, type);
    },

    create_new_file(){
        this.$refs.new_dialog.open('file', this.fid, true);
    },

    create_new_fold(){
        this.$refs.new_dialog.open('fold', this.fid, true);
    },

    share_item(did, name){
        this.$refs.share_dialog.open(did, name);
    },

    open_chatting_dialog(){
      this.$emit('open_chatting_dialog');
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

.workbench_menu{
  position:fixed;
  width:100%;
}

.workbench_content{
  position:fixed;
  top:132px;
  overflow-y: overlay;
  right: 0;
  padding-left: 31px;
  min-width:600px;
}

</style>
