<template>
  <div class="file_system">
    <el-container>
    <el-container class="mid">
      <el-container>
        <el-main>
          <div style="padding: 0 40px 0 30px;">
              <div style="height:20px"></div>
            <component
                ref="file_system_component"
                :is="view_type=='block'?'file-system-block':'file-system-list'"
                type="from_out"
                context="recycle"
                :drage="false"
                :out_list="list"
                @change_view="change_view"
                @open_info="open_info"
                @refresh="refresh">
            </component>
          </div>
          <div style="height:50px"></div>
        </el-main>
      </el-container>
      <el-aside>
        <sidebar ref="sidebar" active="recycle" @create_new_file="create_new_file" @create_new_fold="create_new_fold"></sidebar>
      </el-aside>
    </el-container>
    <file-info-dialog ref="file_info_dialog"></file-info-dialog>
    <el-footer></el-footer>
    </el-container>
    <new-dialog ref="new_dialog" :desktop_alert="true"></new-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
        view_type:'list',
        list: [
            {
                title:'回收站',
                content:[
                    {
                        type: 'file',
                        id: 'id',
                        is_link:false,
                        is_starred:true,
                        name:'file',
                        creator:'',
                        recent_time:'',
                        create_time:''
                    },
                ]
            }
        ]
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
        this.$emit('active_change');
        this.view_type = this.view_type_manager.get();
        var that = this;
        setTimeout(function(){
          that.apply_for_info();
        }, 0);
    },
        
    getCookie (name) {
        var value = '; ' + document.cookie
        var parts = value.split('; ' + name + '=')
        if (parts.length === 2) return parts.pop().split(';').shift()
    },

    refresh_user_info(){
      this.$refs.sidebar.refresh_user_info();
    },

    apply_for_info(){
      let url = '/fs/recycle/elem';
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
                var file = [];
                var fold = [];
                for(let i=0; i<res.list.length; i++){
                  let item = new Object();
                  item.id = res.list[i].id;
                  item.type = res.list[i].type=='doc' ? 'file' : 'fold';
                  item.is_link = false;
                  item.is_starred = false;
                  item.name = res.list[i].name;
                  item.delete_time = that.datetime_format(res.list[i].delete_dt, res.cur_dt);
                  item.rest_time = res.list[i].is_dia ? '永久' : parseInt((new Date((new Date(res.cur_dt).getTime()+30*24*60*60*1000))-new Date(res.list[i].delete_dt))/1000/60/60/24);
                  res.list[i].type=='doc' ? file.push(item) : fold.push(item);
                }
                that.list = [];
                fold.length ? that.list.push({title:'文件夹', content:fold}) : '';
                file.length ? that.list.push({title:'文件', content:file}) : '';

                setTimeout(function(){
                  that.$refs.file_system_component.init();
                }, 0);
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

    refresh(){
      this.apply_for_info();
    },

    change_view(){
        this.view_type = this.view_type=='block' ? 'list' : 'block';
        this.view_type_manager.set(this.view_type);
        var that = this;
        setTimeout(function(){
          that.$refs.file_system_component.init();
        }, 0);
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

h1{
    font-size: 30px;
    text-indent: 30px;
    margin-bottom:10px;
}

.el_divider{
    margin: 10px 0;
}

</style>
