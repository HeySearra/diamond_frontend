<template>
  <div class="sidebar_menu sidebar_block" v-loading="is_loading">
    <div style="height:35px;"></div>
    <el-row>
      <div class="avatar"><el-avatar :src="user_src"></el-avatar></div>
      <div class="clear_both"></div>
      <div :span="16" class="username can_not_choose">{{user_name}}</div>
    </el-row>
    <el-divider></el-divider>
    <el-row class="team_info" v-if="context=='team'">
      <el-row>
        <el-col :span="8" class="team_avatar">
          <el-avatar :src="team_src"></el-avatar>
        </el-col>
        <el-col :span="16" class="teamname" style="line-height:40px">{{team_name}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="16" class="team_intro">{{team_intro}}</el-col>
      </el-row>
      <el-row class="team_member can_not_choose">
        <h4>创建者</h4>
        <el-divider></el-divider>
        <div class="member_img">
          <div class="item" @click="build_chat(creator_id)">
            <el-tooltip effect="dark" :content="creator_name" placement="top-end">
            <el-avatar :src="creator_src"></el-avatar>
          </el-tooltip>
          </div>
          <div class="clear_both"></div>
        </div>
        <div class="clear_both"></div>
        <h4 v-if="admin_list.length">管理员</h4>
        <el-divider v-if="admin_list.length"></el-divider>
        <div v-if="admin_list.length" class="member_img">
          <div class="item" v-for="item in admin_list" :key="item.uid" @click="build_chat(item.uid)">
            <el-tooltip effect="dark" :content="item.name" placement="top-end">
              <el-avatar :src="item.src"></el-avatar>
            </el-tooltip>
          </div>
          <div class="clear_both"></div>
        </div>
        <div class="clear_both"></div>
        <h4 v-if="member_list.length">成员</h4>
        <el-divider v-if="member_list.length"></el-divider>
        <div v-if="member_list.length" class="member_img">
          <div class="item" v-for="item in member_list" :key="item.uid" @click="build_chat(item.uid)">
            <el-tooltip effect="dark" :content="item.name" placement="top-end">
              <el-avatar :src="item.src"></el-avatar>
            </el-tooltip>
          </div>
          <div class="clear_both"></div>
        </div>
        <div class="clear_both"></div>
        <el-row><el-button type="primary" plain @click="$emit('edit_team_info', tid)">修 改 团 队 信 息</el-button></el-row>
        <el-row><el-button type="primary" plain @click="$emit('manage_member', tid)" v-if="is_admin||is_creator">管 理 成 员</el-button></el-row>
        <el-row><el-button type="primary" plain @click="$emit('send_all', tid)" v-if="is_admin||is_creator">群 发 通 知</el-button></el-row>
        <el-row><el-button type="primary" plain @click="$emit('edit_admin', tid)" v-if="is_creator">设 置 管 理 员</el-button></el-row>
        <el-row><el-button type="danger" @click="quit_team" v-if="is_member||is_admin">退 出 团 队</el-button></el-row>
        <el-row><el-button type="danger" @click="delete_team" v-if="is_creator">解 散 团 队</el-button></el-row>
      </el-row>
      <el-divider></el-divider>
    </el-row>
    <el-row class="doc_info" v-if="context==='doc'">
      <el-row>
        <div id="file_name">
          {{file_name}}
        </div>
      </el-row>
      <el-row>
        <div class="doc_info">
          <div class="doc_icon can_not_choose">
              <span class="icon iconfont">&#xe645;</span>
          </div>
          <div class="info_item" v-for="item in doc_info" :key="item.key">
            <div class="info_key">{{item.key}}：</div>
            <div class="info_value">{{item.value}}</div>
            <div class="clear_both"></div>
          </div>
        </div>
      </el-row>
      <div style="height:20px;"></div>
    </el-row>
    <div style="height:30px;"></div>
    <el-row class="function_buttons" :class="active=='workbench'?'function_buttons_active':''"><router-link :to="{path:'/workbench/'}">工作台</router-link></el-row>
    <el-row class="function_buttons" :class="active=='team_center'?'function_buttons_active':''"><router-link :to="{path:'/team/'}">我的团队</router-link></el-row>
    <el-row class="function_buttons" :class="active=='desktop'?'function_buttons_active':''"><router-link :to="{path:'/file/'}">我的桌面</router-link></el-row>
    <el-row class="function_buttons" :class="active=='template'?'function_buttons_active':''"><router-link :to="{path:'/template'}">模板库</router-link></el-row>
    <el-row class="function_buttons" :class="active=='recycle'?'function_buttons_active':''"><router-link :to="{path:'/recycle'}">回收站</router-link></el-row>
    <div style="height:50px"></div>
  </div>
</template>
<script>
export default {
    name: 'sidebar',

    props: {
      context:{
        type:String,
        default: 'normal',  // 'normal', 'team', 'team_center'
      },
      active:{
        type:String,
        default: 'none'
      },
      // file_name:{
      //   type:String,
      //   default: '',
      // }
  },

  mounted() {
    this.init();
  },

  data() {
    return {
      team_name:'',
      file_name:'',
      team_src:'',
      team_intro:'',
      creator_id:'',
      creator_name:'',
      creator_src:'',
      admin_list:[],
      member_list:[],
      is_creator:false,
      is_admin:false,
      is_member:false,
      tid:'',
      user_name:'',
      user_src:'',
      is_loading:false,
      doc_info:[/*{key:'',value:''}*/],
      did:'',
    }
  },

  methods: {
    init() {
      this.user_name = this.login_manager.get_name();
      this.user_src = this.login_manager.get_por();
      this.init_user_info();
    },

    click(){
      alert('')
    },

    init_user_info(){
      let url = '/user_info';
      var that = this;
      $.ajax({
          type:'get',
          url: url,
          headers: {'X-CSRFToken': this.getCookie('csrftoken')},
          processData: false,
          contentType: false,
          success:function (res){
              if(that.console_debug){
                  console.log(url +  '：' + res.status);
              }
              if(res.status == 0){
                  that.user_name = res.name;
                  that.user_src = res.portrait;
              }
              else{
                that.user_name = that.login_manager.get_name();
                that.user_src = that.login_manager.get_por();
              }
          },
          error:function(res){
             that.user_name = that.login_manager.get_name();
            that.user_src = that.login_manager.get_por();
          }
      });
    },

    refresh_user_info(){
      this.init_user_info();
    },

    getCookie (name) {
        var value = '; ' + document.cookie
        var parts = value.split('; ' + name + '=')
        if (parts.length === 2) return parts.pop().split(';').shift()
    },

    init_doc_info(did){
      this.did = did;

      let url = '/document/info?did=' + did;
      var that = this;
      this.is_loading = true;
       $.ajax({
          type:'get',
          url: url,
          headers: {'X-CSRFToken': this.getCookie('csrftoken')},
          processData: false,
          contentType: false,
          success:function (res){
              if(that.console_debug){
                  console.log(url +  '：' + res.status);
              }
              if(res.status == 0){
                  that.doc_info = [];
                  that.doc_info.push({
                    key:'文档名',
                    value:res.name
                  });
                  that.doc_info.push({
                    key:'创建者',
                    value:res.cname
                  });
                  that.doc_info.push({
                    key:'创建时间',
                    value:res.create_dt
                  });
                  that.doc_info.push({
                    key:'最近编辑用户',
                    value:res.ename
                  });
                  that.doc_info.push({
                    key:'最近编辑时间',
                    value:res.edit_dt
                  });
                  setTimeout(function(){
                    that.is_loading = false;
                  }, 180);
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

    init_team_info(tid, refresh){
      if(this.tid==tid && !refresh){
        return;
      }
      this.tid = tid;
      let url = '/team/info?tid=' + tid;
      var that = this;
      this.is_loading = true;
      $.ajax({
          type:'get',
          url: url,
          headers: {'X-CSRFToken': this.getCookie('csrftoken')},
          processData: false,
          contentType: false,
          success:function (res){
              if(that.console_debug){
                  console.log(url +  '：' + res.status);
              }
              if(res.status == 0){
                  that.team_name = res.name;
                  that.team_intro = res.intro;
                  that.team_src = res.portrait;
                  that.creator_id = res.cuid;
                  that.creator_name = res.cname;
                  that.creator_src = res.csrc;
                  that.admin_list = res.admin;
                  that.member_list = res.norm;
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

      let url2 = '/team/identity?tid=' + tid;
      $.ajax({
          type:'get',
          url: url2,
          headers: {'X-CSRFToken': this.getCookie('csrftoken')},
          processData: false,
          contentType: false,
          success:function (res){
              if(that.console_debug){
                  console.log(url2 +  '：' + res.status);
              }
              if(res.status == 0){
                  that.is_creator = false;
                  that.is_admin = false;
                  that.is_member = false;
                  switch(res.identity){
                    case 'owner':
                      that.is_creator = true;
                      break;
                    case 'admin':
                      that.is_admin = true;
                      break;
                    case 'member':
                      that.is_member = true;
                  }
                  setTimeout(function(){
                    that.is_loading = false;
                  }, 100);
              }
              else{
                  switch(res.status){
                      case 2:
                          that.alert_msg.error('权限不足');
                          break;
                      case 3:
                          that.alert_msg.error('找不到团队');
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

    quit_team(){
      var that = this;
      this.alert_box.confirm_msg('警告', '确定退出团队 ' + that.team_name + ' 吗？', function(){
        let url = '/team/quit'
        $.ajax({
            type:'post',
            url: url,
            headers: {'X-CSRFToken': that.getCookie('csrftoken')},
            data: JSON.stringify({tid:that.tid}),
            async:false,
            success:function (res){
                if(that.console_debug){
                    console.log(url +  '：' + res.status);
                }
                if(res.status == 0){
                    that.alert_box.msg('提示', '成功退出团队', function(){
                      that.$router.push({name:'team_center'});
                    });
                }
                else{
                    switch(res.status){
                        case 2:
                            that.alert_msg.error('权限不足');
                            break;
                        case 3:
                            that.alert_msg.error('找不到团队');
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
      });
    },

    delete_team(){
      var that = this;
      this.alert_box.confirm_msg('警告', '确定解散团队 ' + that.team_name + ' 吗？', function(){
        let url = '/team/delete'
        $.ajax({
            type:'post',
            url: url,
            headers: {'X-CSRFToken': that.getCookie('csrftoken')},
            data: JSON.stringify({tid:that.tid}),
            async:false,
            success:function (res){
                if(that.console_debug){
                    console.log(url +  '：' + res.status);
                }
                if(res.status == 0){
                    that.alert_box.msg('提示', '成功解散团队', function(){
                      that.$router.push({name:'team_center'});
                    });
                }
                else{
                    switch(res.status){
                        case 2:
                            that.alert_msg.error('权限不足');
                            break;
                        case 3:
                            that.alert_msg.error('找不到团队');
                            break;
                        case 4:
                            that.alert_box.msg('解散失败，解散团队后生成的文件夹会和您桌面文件夹重名，请修改您桌面文件的名称');
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
      });
    },

    edit_file_name() {
      console.log('edit', value);
      this.file_name = value;
    },

    build_chat(uid){
      if(uid == this.login_manager.get_uid()){
        let random = parseInt(Math.random()*100000);
        this.alert_msg.normal('你好寂寞' + this.magic_word[random%this.magic_word.length]);
        return;
      }
      var flag = true;
      let url = '/chat/build_chat';
      var that = this;
      $.ajax({
          type:'post',
          url: url,
          headers: {'X-CSRFToken': that.getCookie('csrftoken')},
          data: JSON.stringify({uid:uid}),
          async:false,
          success:function (res){
              if(that.console_debug){
                  console.log(url +  '：' + res.status);
              }
              if(res.status == 0){
                  flag = true;
              }
              else{
                  switch(res.status){
                      case 2:
                          that.alert_msg.error('权限不足');
                          break;
                      case 3:
                          that.alert_msg.error('找不到用户');
                          break;
                      default:
                          that.alert_msg.error('发生了未知错误');
                  }
                  flag = false;
              }
          },
          error:function(res){
              that.alert_msg.error('网络连接失败');
              flag = false;
          }
      });
      if(flag){
        this.$emit('open_chatting_dialog', uid);
      }
    }
  }
}

</script>

<style scoped>
@import url("../assets/common.css");

.sidebar_menu {
  font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif !important;
  margin:0 !important;

}

.team_info{
  height: fit-content;
  align-items: center;
}

.team_avatar{
  text-indent: 30px;
}

.team_intro{
  padding:20px 20px 10px 30px;
  width: 100%;
  font-size: 14px;
  line-height:23px;
}

.team_member{
  padding:20px 10px 10px 20px;
  cursor:default;
}

.team_member h4{
  letter-spacing: 1px;
  margin: 10px 0;
  padding-left: 10px;
}

.team_member .el-divider{
  margin: 0 0 10px 0;
}

.team_member .member_img{
  padding: 5px 15px;
  margin-bottom:25px !important;
}

.team_member .el-tooltip{
  cursor:pointer;
}

.team_info .el-button{
  margin: 5px 10px;
  width:90%;
}

.avatar{
  display:block;
  margin:0 auto;
  text-align: center;
}

.avatar .el-avatar{
  width:83px;
  height:83px;
}

.username{
  font-weight: bold;
  padding: 10px 15px;
  margin-top:15px;
  text-align: center;
  font-size: 21px;
  word-break: break-all;
}

.teamname{
  font-weight: bold;
  margin-left:-10px;
}

.new_buttons{
  margin:15px 15px;
}

.new_buttons .el-button{
  margin: 10px 10px;
  width:90%;
}

.function_buttons{
  height: 50px;
  line-height:50px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 3px;
  text-indent: 3px;
  cursor:pointer;
  border-bottom: solid 1px #dedede;
  transition: all 0.1s linear;
}

.function_buttons a{
  display: block;
  width: 100%;
  text-align: center;
  text-decoration: none;
  color: #333;
}

.function_buttons:hover{
  background-color: hsl(0, 0%, 87%);
}

.function_buttons_active{
  background-color: hsl(0, 0%, 80%) !important;
}

.el-button{
  margin-top: 2px;
  margin-bottom: 2px;
  width: 100%;
}

#file_name{
  font-weight: bold;
  font-size:17px;
  margin: 0 6px;
  width:auto;
  line-height:27px;
  word-break: break-all;
  text-align: center;
  border: none !important;
  background-color: rgba(0,0,0,0) !important;
  display: flex;
  justify-content: center;
}

.doc_info{
  padding: 0 10px;
  margin-bottom:10px;
}

.doc_info .info_item{
  float:none;
  clear:both;
  margin-top:21px;
  font-size: 15px;
}

.info_key{
  float:left;
  width:7em;
  text-align: right;
  word-break: break-all;
}

.info_value{
  float:right;
  width:169px;
  word-break: break-all;
}

.item{
  float:left;
  margin:7px;
}

.doc_icon{
  position: absolute;
  text-align: center;
  width: 96%;
  z-index: -1;
}

.doc_icon span{
    font-size: 200px;
    color: hsl(0, 0%, 90%);
}

</style>
