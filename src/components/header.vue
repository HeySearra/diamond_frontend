<template>
  <div class="header">
      <el-menu
      :default-active="''+active_index"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#fff"
      text-color="#333"
      active-text-color="#efb7b6">
      <h1>
        <a class="logo_a" @click="$router.push({path:'/index'});renew_active()"></a></h1>
      <el-menu-item index="1" @click="$router.push({path:'/index'});renew_active()">主页</el-menu-item>
      <el-menu-item index="2" @click="$router.push({path:'/index/new'});renew_active()" v-if="login_manager.get()">动态</el-menu-item>
      <el-menu-item index="3" @click="$router.push({path:'/index/hotart'});renew_active()">热门</el-menu-item>
      <div class="user">
          <span class="el-dropdown-link" @click="to_login" v-if="!is_login">
              <el-avatar>登录</el-avatar>
          </span>
          <el-dropdown @click.native="dialogVisible = true" @command="to_link" v-if="is_login">
              <span class="el-dropdown-link" @click="function(){$router.push({path:'/userInfo/'+uid})}">
                  <el-avatar :src="photo_src"></el-avatar>
              </span>
              <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="'/userInfo/'+uid">个人主页</el-dropdown-item>
                  <el-dropdown-item command="/create/article">管理中心</el-dropdown-item>
                  <el-dropdown-item command="to_collection">收藏管理</el-dropdown-item>
                  <el-dropdown-item command="/create/message">消息</el-dropdown-item>
                  <el-dropdown-item command="/create/setting/myinfo">设置</el-dropdown-item>
                  <el-dropdown-item command="/create/vip">VIP</el-dropdown-item>
                  <el-dropdown-item command="logout">登出</el-dropdown-item>
              </el-dropdown-menu>
              </el-dropdown>
      </div>
      <div class="write" v-if="is_login">
        <!-- <el-button type="primary" @click="function(){$router.push({path:'/edit', query:{from:$route.path}})}">写文章</el-button> -->
      </div>
      <div class="search">
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
    mounted(){
      this.init();
    },
    data() {
      return {
        search: '',
        active_index: 0,
        uid:0,
        is_login:false,
        photo_src:''
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        //console.log(key, keyPath);
      },

      getCookie (name) {
        var value = '; ' + document.cookie
        var parts = value.split('; ' + name + '=')
        if (parts.length === 2) return parts.pop().split(';').shift()
      },

      init(){
        if(this.login_manager.get()){
          this.is_login = true;
          this.photo_src = this.login_manager.get_por();
        }
        this.renew_active();
        this.apply_for_info();
      },

      renew_active(){
        if(this.$route.name == 'index'){
          this.active_index = 1;
        }
        else if(this.$route.name == 'follow_new'){
          this.active_index = 2;
        }
        else if(this.$route.name == 'hot'){
          this.active_index = 3;
        }
      },

      apply_for_info(){
        var that = this;
        $.ajax({ 
            type:'get', 
            url:'/simple_user_info',
            headers: {'X-CSRFToken': this.getCookie('csrftoken')}, 
            processData: false,
            contentType: false,
            success:function (res){ 
              if(res.uid){
                that.uid = res.uid;
                if(!that.login_manager.get_por() || that.login_manager.get_por()!=res.portrait)
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
            }
        });
      },
      
      to_login(){
        this.$router.push({path:'/login', query:{from:this.$route.path}});
      },

      to_link(url){
        if(url == 'logout'){
          this.logout();
          return;
        }
        if(url == 'to_collection'){
          if(this.$route.name != 'collection'){
            this.$router.push({path:'/collection?from='+this.$route.path});
          }
          return;
        }
        this.$router.push({path:url});
      },

      logout(){
        var that = this;
        $.ajax({ 
            type:'get', 
            url:'/login/submit',
            headers: {'X-CSRFToken': this.getCookie('csrftoken')}, 
            processData: false,
            contentType: false,
            success:function (res){ 
              if(res.status == 0){
                that.alert_msg.success('登出成功');
                that.$router.go(0);
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
      }
    }
  }
</script>

<style scoped>
@import url("../assets/common.css");

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
    border-color: #efb7b6 !important;
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
    color: hsl(1, 69%, 78%);
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
</style>