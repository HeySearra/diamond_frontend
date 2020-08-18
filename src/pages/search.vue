<template>
  <div class="search blur_div">
    <el-container>
    <el-container class="mid">
      <el-container>
        <el-main>
          <div style="padding: 0 40px 0 30px;">
            <div style="height:20px"></div>
            <component 
                :is="view_type=='block'?'file-system-block':'file-system-list'"
                context="workbench"
                type="from_out"
                :drage="false"
                :out_list="list"
                @change_view="change_view"
                @open_info="open_info"
                @share_item="share_item"
                ref="file_system_component"
                >
            </component>
            <div style="height:50px"></div>
          </div>
        </el-main>
      </el-container>
      <el-aside>
        <sidebar ref="sidebar"></sidebar>
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

    props: {

    },
  data () {
    return {
        list:[],
        opa:false,
        search_form:{
            key: '123',
            ord: 1,
            towards: 1,
            limit: 0,
        },
        view_type:'block',
        random:-1,
        is_loading:true,
        not_found_text:['这里啥玩意也没有', '这里什么也没有', '空空如也', '这里好凄凉', '难道？这里什么也没有', '什么东东都没有', '这里啥都没', '什么也没有~', '这里没东西，别看了', '啊，这里没东西啊'],
    }
  },
  watch:{
    $route(to,from){
      this.init();
    }
  },
  mounted(){
    this.init();
  },
    methods:{
         init(){
        //     this.init_scroll();
            this.view_type = this.view_type_manager.get();
            this.search_form.key = this.$route.query?this.$route.query.data:'';
            this.random = parseInt(Math.random()*100%this.not_found_text.length);
            this.search_form.key = this.$route.query.data;
            this.apply_for_info();
        },

        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },

        apply_for_info(){
            var that = this;
            $.ajax({
                type:'post',
                url:"/workbench/search",
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                data: JSON.stringify(that.search_form),
                processData: false,
                contentType: false,
                success:function (res){
                    if(that.console_debug){
                        console.log("(post)/workbench/search"+ " : " +res.status);
                    }
                    if(res.status == 0){
                        that.list = [];
                        var llist = [];
                        for(let i=0; i < res.list.length; i++){
                            llist.push({
                                type: res.list[i].type=="doc"?"file":"fold",
                                id: res.list[i].id,
                                is_link: false,
                                is_starred: res.list[i].is_starred,
                                name: res.list[i].name,
                                content: res.list[i].content,
                                create_time: that.datetime_format(res.list[i].create_dt, res.cur_dt),
                                creator: res.list[i].cname,
                                recent_edit_time: that.datetime_format(res.list[i].edit_dt, res.cur_dt),
                            })
                        }
                        that.list.push({title:'搜索结果', content:llist});
                        setTimeout(function(){
                          that.$refs.file_system_component.init();
                        }, 0);
                        that.is_loading = false;
                    }
                    else{
                        that.alert_msg.error('获取搜索结果失败', '请重试');
                    }
                },
                error:function(){
                    that.alert_msg.error('连接失败');
                }
            });
        },

        refresh_user_info(){
            this.$refs.sidebar.refresh_user_info();
        },

        refresh(){
            this.$refs.file_system_component.init();
        },

        open_info(title, content, type){
            this.$refs.file_info_dialog.open_info(title, content, type);
        },

        share_item(did, name){
          this.$refs.share_dialog.open(did, name);
        },

        change_view(){
            this.view_type = this.view_type=='block' ? 'list' : 'block';
            this.view_type_manager.set(this.view_type);
            var that = this;
            setTimeout(function(){
              that.$refs.file_system_component.init();
            }, 0);
        },

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
</style>
