<template>
  <div class="search blur_div">
    <el-container>
    <el-container class="mid">
      <el-container>
        <el-main>
            <el-form ref="search_form" :model="search_form" label-width="100px" size="mini">
            <el-form-item label="搜索范围：" style="text-align:left">
                <el-radio v-model="search_form.limit" :label="0">全部</el-radio>
                <el-radio v-model="search_form.limit" :label="1">仅文档</el-radio>
                <el-radio v-model="search_form.limit" :label="2">团队或文件夹</el-radio>
            </el-form-item>
            <el-form-item label="搜索排序：" style="text-align:left">
                <el-radio v-model="search_form.ord" :label="1">按最近编辑时间排序</el-radio>
                <el-radio v-model="search_form.ord" :label="2">按创建时间排序</el-radio>
            </el-form-item>
            <el-form-item label="搜索排序：" style="text-align:left">
                <el-radio v-model="search_form.towards" :label="1">时间倒序</el-radio>
                <el-radio v-model="search_form.towards" :label="2">时间正序</el-radio>
            </el-form-item>
            </el-form>
          <div style="padding: 0 40px 0 30px;">
            <div style="height:20px"></div>
            <search-display
                ref="search_display"
                :title="'搜索结果'" 
                :list="list" 
                :is_in_desktop="is_in_desktop"
                @refresh="refresh"
                >
            </search-display>
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
export default {
    props: {
        type:{
            type:String,
            default: 'self', // or 'from_out' 'recent'
        },
        context:{
            type:String,
            default: 'search',
        },
        is_in_desktop:{
            type:Boolean,
            default: false,
        },
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
        draging:{
            type:'',
            id:''
        },
        random:-1,
        is_loading:true,
        not_found_text:['这里啥玩意也没有', '这里什么也没有', '空空如也', '这里好凄凉', '难道？这里什么也没有', '什么东东都没有', '这里啥都没', '什么也没有~', '这里没东西，别看了', '啊，这里没东西啊'],
        stop_flag: false
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
            this.search_form.key = this.$route.query?this.$route.query.data:'';
            this.random = parseInt(Math.random()*100%this.not_found_text.length);
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
                        that.list = []
                        console.log(that.search_form.key);
                        var args = that.search_form.key.trim().replace(new RegExp(/(\s)+/g)," ").split(' ');
                        for(let i=0; i < res.list.length; i++){
                            res.list[i].name = that.checkData(res.list[i].name);
                            res.list[i].content = that.checkData(res.list[i].content);
                            for(let i=0; i<args.length; i++){
                                args[i] = that.checkData(args[i]);
                                let reg = new RegExp(args[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'ig');
                                // res.list[i].name = res.list[i].name.replace(reg, function(word){
                                //     return '<hl>'+word+'</hl>';
                                // });
                                // res.list[i].content = res.list[i].content.replace(reg, function(word){
                                //     return '<hl>'+word+'</hl>';
                                // });
                            }
                            that.list.push({
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
                        that.$refs.search_display.init();
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
       checkData(v) {
            return v.replace(/[<>"&]/g, function(match, pos, originalText){
                    switch(match){
                    case "<": return "&lt;"; 
                    case ">":return "&gt;";
                    case "&":return "&amp;"; 
                    case "\"":return "&quot;"; 
                } 
            }); 
        },
        refresh_user_info(){
            this.$refs.sidebar.refresh_user_info();
        },

        refresh(){
            this.$refs.file_system_component.init();
        },

    error(){
        this.$router.push({path:'/'});
    },

    in_loading(){
      this.is_loading = true;
    },

    out_loading(){
      this.is_loading = false;
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
</style>
