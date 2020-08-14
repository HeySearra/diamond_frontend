<template>
  <div class="sidebar_menu sidebar_block">
    <div style="height:20px;"></div>
    <el-row class="user_info">
      <el-col :span="8" class="avatar">
        <el-avatar :src="user_src"></el-avatar>
      </el-col>
      <el-col :span="16" class="username">{{user_name}}</el-col>
    </el-row>
    <el-divider v-if="context!='doc'"></el-divider>
    <el-row class="new_buttons" v-if="context!='doc'">
      <div class="button_container">
        <el-row><el-button type="primary" v-if="context!='team_center'" @click="$emit('create_new_file')">新 建 文 档</el-button></el-row>
        <el-row><el-button type="primary" v-if="context!='team_center'" @click="$emit('create_new_fold')">新 建 文 件 夹</el-button></el-row>
        <el-row><el-button type="primary" v-if="context=='team_center'" @click="$emit('create_new_team')">新 建 团 队</el-button></el-row>
      </div>
    </el-row>
    <el-divider></el-divider>
    <el-row class="team_info" v-if="context=='team'">
      <el-row>
        <el-col :span="8" class="avatar">
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
          <div class="item">
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
          <div class="item" v-for="item in admin_list" :key="item.uid">
            <el-tooltip effect="dark" :content="item.name" placement="top-end">
              <el-avatar :src="item.src"></el-avatar>
            </el-tooltip>
          </div>
        </div>
        <div class="clear_both"></div>
        <h4 v-if="member_list.length">成员</h4>
        <el-divider v-if="member_list.length"></el-divider>
        <div v-if="member_list.length" class="member_img">
          <div class="item" v-for="item in member_list" :key="item.uid">
            <el-tooltip effect="dark" :content="item.name" placement="top-end">
              <el-avatar :src="item.src"></el-avatar>
            </el-tooltip>
          </div>
        </div>
        <div class="clear_both"></div>
        <el-row><el-button type="primary" plain @click="$emit('edit_team_info', tid)">修 改 团 队 信 息</el-button></el-row>
        <el-row><el-button type="primary" plain @click="$emit('manage_member', tid)" v-if="is_admin||is_creator">管 理 成 员</el-button></el-row>
        <el-row><el-button type="primary" plain @click="$emit('edit_admin', tid)" v-if="is_creator">设 置 管 理 员</el-button></el-row>
        <el-row><el-button type="danger" @click="quit_team" v-if="is_member||is_admin">退 出 团 队</el-button></el-row>
        <el-row><el-button type="danger" @click="delete_team" v-if="is_creator">解 散 团 队</el-button></el-row>
      </el-row>
      <div style="height:20px;"></div>
    </el-row>
    <el-row class="doc_info" v-if="context=='doc'">
      <el-row>
        <el-col :span="16" class="file_name">{{file_name}}</el-col>
      </el-row>
      <el-row>
        <div class="doc_info">
          <div class="info_item">
            <div class="info_key">key：</div>
            <div class="info_value">valuevaluevaluevaluevaluevaluevaluevaluevaluevaluevaluevaluevaluevaluevalue</div>
            <div class="clear_both"></div>
          </div>
          <div class="info_item">
            <div class="info_key">key：</div>
            <div class="info_value">valuevaluevaluevaluevaluevaluevaluevaluevaluevaluevaluevaluevaluevaluevalue</div>
            <div class="clear_both"></div>
          </div>
          <div class="info_item">
            <div class="info_key">key：</div>
            <div class="info_value">valuevaluevaluevaluevaluevaluevaluevaluevaluevaluevaluevaluevaluevaluevalue</div>
            <div class="clear_both"></div>
          </div>
        </div>
      </el-row>
      <div style="height:20px;"></div>
    </el-row>
    <el-row class="function_buttons" :class="active=='workbench'?'function_buttons_active':''"><router-link :to="{path:'/workbench/'}">工作台</router-link></el-row>
    <el-row class="function_buttons" :class="active=='team_center'?'function_buttons_active':''"><router-link :to="{path:'/team/'}">我的团队</router-link></el-row>
    <el-row class="function_buttons" :class="active=='desktop'?'function_buttons_active':''"><router-link :to="{path:'/file/'}">我的桌面</router-link></el-row>
    <el-row class="function_buttons" :class="active=='template'?'function_buttons_active':''"><router-link :to="{path:'/template'}">模版库</router-link></el-row>
    <el-row class="function_buttons" :class="active=='recycle'?'function_buttons_active':''"><router-link :to="{path:'/recycle'}">回收站</router-link></el-row>

  </div>
</template>
<script>
export default {
    props: {
      context:{
        type:String,
        default: 'normal',  // 'normal', 'team', 'team_center'
      },
      active:{
        type:String,
        default: 'none'
      },
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
    }
  },

  methods: {
    init() {
      this.user_name = this.login_manager.get_name();
      this.user_src = this.login_manager.get_por();
    },

    getCookie (name) {
        var value = '; ' + document.cookie
        var parts = value.split('; ' + name + '=')
        if (parts.length === 2) return parts.pop().split(';').shift()
    },

    init_team_info(tid){
      this.tid = tid;
      let url = '/team/info?tid=' + tid;
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
            processData: false,
            contentType: false, 
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
            processData: false,
            contentType: false, 
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
    }
  }
}
</script>

<style scoped>
@import url("../assets/common.css");

.sidebar_menu {
  background-color: #fefefe;
  font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif !important;
  border: solid 1px;
  margin:0 !important;

}

.user_info{
  border: solid 1px;
  height: 60px;
  display: flex;
  align-items: center;
}

.team_info{
  height: fit-content;
  align-items: center;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.username{
  display: flex;
  align-items: center;
}

.username, .teamname{
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
  border: solid 2px;
  height: 50px;
  line-height:50px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 3px;
  text-indent: 3px;
  cursor:pointer
}

.function_buttons a{
  display: block;
  width: 100%;
  text-align: center;
  text-decoration: none;
  color: #333;
}

.function_buttons:hover, .function_buttons_active{
  background-color: #ccc;
}

.el-button{
  margin-top: 2px;
  margin-bottom: 2px;
  width: 100%;
}

.file_name{
  font-weight: bold;
  font-size:17px;
  margin: 0 6px;
  width:auto;
  line-height:27px;
  word-break: break-all;
}

.doc_info{
  padding: 0 10px 5px;
}

.doc_info .info_item{
  float:none;
  clear:both;
  margin-top:10px;
  font-size: 15px;
}

.info_key{
  float:left;
  width:60px;
  text-align: right;
  word-break: break-all;
}

.info_value{
  float:right;
  width:196px;
  word-break: break-all;
}

.item{
  float:left;
  margin:6px;
}

</style>
