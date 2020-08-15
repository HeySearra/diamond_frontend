<template>
  <div class="header">
      <el-menu
      :default-active="''+active_index"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#f6f6f6"
      :class="opa?'opa':''"
      text-color="#333"
      active-text-color="#efb7b6">
      <h1><a class="logo_a" @click="$router.push({path:'/'});"></a></h1>
      <div class="online_icon" v-if="is_login">
        <el-avatar>
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="online_icon_dropdown">
              <el-dropdown-item>
                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                <span>这是一个人</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                <span>这是一个人</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                <span>这是一个人</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                <span>这是一个人</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                <span>这是一个人</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                <span>这是一个人</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-avatar>
        <el-tooltip class="item" effect="dark" content="lkw" placement="top-start">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="wlt" placement="top-start">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="lrq" placement="top-start">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        </el-tooltip>
      </div>
      <div class="user">
          <span class="el-dropdown-link" @click="to_login" v-if="!is_login&&!opa">
              <el-avatar>登录</el-avatar>
          </span>
          <el-dropdown @click.native="dialogVisible = true" @command="click_dropdown" v-if="is_login">
              <span class="el-dropdown-link">
                  <el-avatar :src="photo_src"></el-avatar>
              </span>
              <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="user_info">修改信息</el-dropdown-item>
                  <el-dropdown-item command="change_password">修改密码</el-dropdown-item>
                  <el-dropdown-item command="help">使用帮助</el-dropdown-item>
                  <el-dropdown-item command="logout" @click="logout">登出</el-dropdown-item>
              </el-dropdown-menu>
              </el-dropdown>
        </div>
      <div class="header_icon can_not_choose" @click="$emit('open-drawer')" v-if="is_login">
        <el-badge class="item" :value="message_count" :max="99" :hidden="message_count<=0">
          <span class="icon iconfont">&#xe60b;</span>
        </el-badge>
      </div>
      <div class="header_icon can_not_choose" @click="$emit('chatting')" v-if="is_login">
        <el-badge class="item" :is-dot="have_chat">
          <span class="icon iconfont">&#xe7fe;</span>
        </el-badge>
      </div>
      <div class="search" v-if="is_login">
          <div>
              <el-input v-model="search" placeholder="请输入搜索内容" @keyup.enter.native="click_search" maxLength="50">
                <el-button slot="append" @click="click_search" icon="el-icon-search"></el-button>
              </el-input>
          </div>
      </div>
      </el-menu>
  </div>
</template>

<script>
  export default {
    name:'navbar',
    watch:{
      $route(to,from){
        this.init();
      }
    },
    mounted(){
      this.init();
    },
    data() {
      return {
        search: '',
        active_index: 0,
        uid:0,
        is_login:false,
        photo_src:'',
        online_icon_list:[],
        message_count:0,
        have_chat:false,
        opa:false
      };
    },
    methods: {
      getCookie (name) {
        var value = '; ' + document.cookie
        var parts = value.split('; ' + name + '=')
        if (parts.length === 2) return parts.pop().split(';').shift()
      },
      
      init(){
        if(this.$route.name=='login'||this.$route.name=='register'||this.$route.name=='forget'||this.$route.name=='forget_set'){
          this.opa = true;
        }
        else{
          this.opa = false;
        }
        if(this.login_manager.get()){
          this.is_login = true;
          this.photo_src = this.login_manager.get_por();
          this.name = this.login_manager.get_name();
        }
        else{
          let route_name = this.$router.history.current.name;
          if(route_name!='login' && route_name!='register' && route_name!='forget' && route_name!='forget_set'){
            this.$router.push({name:'login'});
          }
        }
        this.apply_for_magic_word();
        this.apply_for_message();
        this.get_info();
      },

      refresh_message_count(){
        this.apply_for_message();
      },

      apply_for_message(){
        let url = '/msg/unread_count';
        var that = this;
        $.ajax({
          type:'get',
          url:url,
          headers: {'X-CSRFToken': this.getCookie('csrftoken')},
          processData: false,
          contentType: false,
          success:function (res){
            if(that.console_debug){
              console.log(url + '：' + res.status);
            }
            if(res.status == 0){
              that.message_count = res.count;
            }
            else{
              that.message_count = 0;
            }
          },
          error:function(){
            that.message_count = 0;
          }
        });
      },

      get_info(){
        var that = this;
        $.ajax({
            type:'get',
            url:'/user_info',
            headers: {'X-CSRFToken': this.getCookie('csrftoken')},
            processData: false,
            contentType: false,
            success:function (res){
              if(that.console_debug){
                console.log('/user_info：' + res.status);
              }
              if(res.status == 0){
                that.uid = res.uid;
                // if(!that.login_manager.get_por() || that.login_manager.get_por()!=res.portrait)
                  that.photo_src = res.portrait;
                that.is_login = true;
                that.login_manager.set(true, res.uid, res.name, res.portrait);
              }
              else{
                that.uid = 0;
                that.photo_src = ''
                that.is_login = false;
                that.login_manager.clear();
              }
            },
            error:function(){
              that.uid = 0;
              that.photo_src = ''
              that.is_login = false;
              if(that.console_debug){
                console.log('/user_info：' + 'error');
              }
            }
        });
      },

      to_login(){
        this.$router.push({path:'/login', query:{from:this.$route.path}});
      },

      click_dropdown(command){
          switch(command){
            case 'user_info':
              this.$emit('edit_user_info');
              break;
            case 'change_password':
              this.$emit('change_password');
              break;
            case 'help':
              break;
            case 'logout':
              this.logout();
              break;
          }
      },

      logout(){
        var that = this;
        $.ajax({
            type:'get',
            url:'/user/logout/submit',
            headers: {'X-CSRFToken': this.getCookie('csrftoken')},
            processData: false,
            contentType: false,
            success:function (res){
              if(that.console_debug){
                  console.log("/user/logout/submit"+ " : " +res.status);
              }
              if(res.status == 0){
                that.alert_msg.success('登出成功');
                that.login_manager.clear();
                that.$router.push({path: '/login'});
                // that.$router.go(0); //刷新
              }
              else{
                that.alert_msg.error('登出失败，请重试');
              }
            },
            error:function(){
              that.alert_msg.error('连接失败');
            }
        });
      },

      click_search(){
        if(this.search == ''){
          this.alert_msg.normal('请输入搜索内容');
          return;
        }
        let flag = this.$route.path=='/search';
        this.$router.push({path:'/search',query:{data:this.search}});
        var that = this;
        if(flag){
          setTimeout(function(){
            that.$emit('init');
          }, 0)
        }
      },

      set_search_word(keyword){
        this.search = keyword;
      },

      apply_for_magic_word(){
        var that = this;
        $.ajax({
            type:'get',
            url:'/hell/words',
            headers: {'X-CSRFToken': this.getCookie('csrftoken')},
            processData: false,
            contentType: false,
            success:function (res){
              that.magic_word = res.words;
            }
        });
      }
  }
}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/diadoc_icon.css");

.hearer{
  z-index: 1000;
  font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif !important;
}

.header>>>li{
  color:#444 !important;
  font-size: 16px;
}

.header>>>.el-menu--horizontal>.el-menu-item.is-active{
  font-weight: bolder;
}

.header .el-menu-item:hover{
  background: rgba(0, 0, 0, 0) !important;
}

.el-menu>>>li{
  background: rgba(0, 0, 0, 0) !important;
}

.el-menu--horizontal>.el-menu-item.is-active {
    border-bottom: 3px solid;
    color: #333;
    border-color: #586378 !important;
}

.el-menu--horizontal>.el-menu-item{
  border-bottom: 3px solid;
}

.el-menu--horizontal>.el-menu-item:not(.is-active):focus, .el-menu--horizontal>.el-menu-item:not(.is-active):hover{
  border-color: #666 !important;
}

.el-menu-item{
    width:auto;
    padding: 0 20px;
    margin:0 10px !important;
}

h1{
    float:left;
    height:61px;
    margin:0;
    width:150px;
    cursor: pointer;
}

h1 a{
  color:#333;
  text-decoration: none;
  display: inline-block;
  width: 100%;
  height: 100%;
}

h1 a:hover{
  opacity: 0.75;
}

.header_icon{
  font-weight: normal;
  float:right;
  margin: 15px 3px;
  height: 30px;
  width:30px;
  margin-left:20px;
  padding: 0;
  line-height: 30px;
  cursor:pointer;
}

.header_icon .iconfont{
  font-size: 25px;
  color:#586378;
}

.search{
    width:250px;
    float: right;
}

.search>div{
    width:100%;
    float: left;
}

.search:focus, .search>div:focus{
    outline: none;
}

.write{
  float: right;
}

.write>>>.el-button{
    width: 75px !important;
    margin-left: 30px;
}

.user{
    float:right;
    margin: 10px 35px 10px 20px;
    height:40px;
    overflow: hidden;
}

.el-dropdown-link {
    cursor: pointer;
    /* color: hsl(1, 69%, 78%); */
    display: inline-block;
    width:50px;
  }

.el-dropdown-menu{
    text-align: center;
    width:100px;
}

.header>>>.el-dialog{
    max-width:600px;
    min-width:450px;
    z-index: 9999;
}

.header>>>.el-avatar:focus, .user:focus{
  outline: none;
}

.header>>>.el-button{
  padding:0;
  height:40px;
  width:41px;
}

.logo_a{
  background-image: url("../assets/logo.png");
  background-size: 106px;
  background-position: center;
  background-repeat: no-repeat;
  transition:0.1s linear opacity;
}

.online_icon{
  float:left;
  margin: 10px 35px 10px 50px;
  height:40px;
  width:300px;
}

.online_icon>>>.el-avatar{
  float:right;
  margin-left:11px;
  border:solid 1px #000;
  cursor:pointer;
  height:36px;
  width:36px;
  margin-top:2px;
}

.online_icon>>>.el-dropdown-link{
  width:36px;
  color:#586378;
  background-color: #fff;
}

.online_icon_dropdown{
  width: fit-content !important;
}

.online_icon_dropdown li{
  height:45px;
  line-height:45px;
}

.online_icon_dropdown>>>.el-avatar--circle{
  height:30px;
  width:30px;
  float:left;
  margin: 6px 10px 0 -3px;
}

.opa{
  background-color: rgba(255, 255, 255, 0.69) !important;
}
</style>
