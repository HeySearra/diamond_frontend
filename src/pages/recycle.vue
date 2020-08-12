<template>
  <div class="file_system">
    <el-container>
    <el-container class="mid">
      <el-container>
        <el-main>
          <div style="padding: 0 40px 0 30px;">
              <div style="height:20px"></div>
            <component 
                :is="view_type=='block'?'file-system-block':'file-system-list'"
                type="from_out"
                context="recycle"
                :drage="false"
                :out_list="list"
                @change_view="change_view"
                @open_info="open_info">
            </component>
          </div>
          <div style="height:50px"></div>
        </el-main>
      </el-container>
      <el-aside>
        <sidebar active="recycle" @create_new_file="create_new_file" @create_new_fold="create_new_fold"></sidebar>
      </el-aside>
    </el-container>
    <file-info-dialog ref="file_info_dialog"></file-info-dialog>
    <el-footer></el-footer>
    </el-container>
    <new-dialog ref="new_dialog"></new-dialog>
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
                    {
                        type: 'file',
                        id: 'id',
                        is_link:false,
                        is_starred:false,
                        name:'file',
                        creator:'',
                        recent_time:'',
                        create_time:''
                    },
                    {
                        type: 'fold',
                        id: 'id',
                        is_link:false,
                        is_starred:true,
                        name:'file',
                        creator:'',
                        recent_time:'',
                        create_time:''
                    }
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
            this.$emit('active_change');
            this.view_type = this.view_type_manager.get();
        },
        
    getCookie (name) {
        var value = '; ' + document.cookie
        var parts = value.split('; ' + name + '=')
        if (parts.length === 2) return parts.pop().split(';').shift()
    },
    
    change_view(){
        this.view_type = this.view_type=='block' ? 'list' : 'block';
        this.view_type_manager.set(this.view_type);
    },

    open_info(title, content){
        this.$refs.file_info_dialog.open_info(title, content);
    },

    create_new_file(){
        this.$refs.new_dialog.open('file', this.fid);
    },

    create_new_fold(){
        this.$refs.new_dialog.open('fold', this.fid);
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
