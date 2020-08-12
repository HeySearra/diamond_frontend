<template>
  <div class="sidebar_menu sidebar_block">
    <div style="height:20px;"></div>
    <el-row class="user_info">
      <el-col :span="8" class="avatar">
        <el-avatar></el-avatar>
      </el-col>
      <el-col :span="16" class="username">DiaDoc钻石带会员</el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row class="new_buttons">
      <div class="button_container">
        <el-row><el-button type="info" v-if="context!='team_center'" @click="$emit('create_new_file')">新 建 文 档</el-button></el-row>
        <el-row><el-button type="info" v-if="context!='team_center'" @click="$emit('create_new_fold')">新 建 文 件 夹</el-button></el-row>
        <el-row><el-button type="info" v-if="context=='team_center'" @click="$emit('create_new_team')">新 建 团 队</el-button></el-row>
      </div>
    </el-row>
    <el-divider></el-divider>
    <el-row class="team_info" v-if="context=='team'">
      <el-row>
        <el-col :span="8" class="avatar">
          <el-avatar></el-avatar>
        </el-col>
        <el-col :span="16" class="teamname" style="line-height:40px">{{team_name}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="16" class="team_intro">介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍</el-col>
      </el-row>
      <el-row class="team_member can_not_choose">
        <h4>创建者</h4>
        <el-divider></el-divider>
        <div class="member_img">
          <el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
            <el-avatar></el-avatar>
          </el-tooltip>
        </div>
        <h4>管理员</h4>
        <el-divider></el-divider>
        <div class="member_img">
          <el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
            <el-avatar></el-avatar>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
            <el-avatar></el-avatar>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
            <el-avatar></el-avatar>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
            <el-avatar></el-avatar>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
            <el-avatar></el-avatar>
          </el-tooltip>
        </div>
        <h4>成员</h4>
        <el-divider></el-divider>
        <div class="member_img">
          <el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
            <el-avatar></el-avatar>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
            <el-avatar></el-avatar>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
            <el-avatar></el-avatar>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
            <el-avatar></el-avatar>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
            <el-avatar></el-avatar>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
            <el-avatar></el-avatar>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
            <el-avatar></el-avatar>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
            <el-avatar></el-avatar>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
            <el-avatar></el-avatar>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
            <el-avatar></el-avatar>
          </el-tooltip>
        </div>
        <el-row><el-button type="info" @click="$emit('manage_member')">管 理 成 员</el-button></el-row>
        <el-row><el-button type="info" @click="$emit('setting_admin')">设 置 管 理 员</el-button></el-row>
        <el-row><el-button type="danger" @click="$emit('leave_team')">退 出 团 队</el-button></el-row>
        <el-row><el-button type="danger" @click="$emit('destroy_team')">解 散 团 队</el-button></el-row>
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
      tid:{
        type:String,
        default:'team'
      }
  },

  mounted() {
    this.init();
  },

  data() {
    return {
      team_name:'DiaDoc团队',
    }
  },

  methods: {
    init() {
      this.apply_for_info();
    },

    apply_for_info() {
      //向后台请求一些内容
    },
  }
}
</script>

<style scoped>
@import url("../assets/common.css");

.sidebar_menu {
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
  margin-bottom:15px;
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

</style>
