<template>
    <div class="can_not_choose template_block">
        <div class="click_area" :class="focus?'click_area_focus':''"></div>

        <el-image
            class="preview_img"
            :src="src"
            fit="cover">
        </el-image>
        <div class="name">{{name}}</div>
        <el-button class="use_button" type="primary" plain>使用</el-button>
        <div class="more_menu" :class="focus?'more_menu_focus':''" v-if="context=='my'">
            <el-dropdown trigger="click"
                @visible-change="vis_change"
                @command="click_dropdown_item">
                <span class="el-dropdown-link">
                    <i class="el-icon-s-tools"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item class="red_text" v-if="context=='my'">删除</el-dropdown-item>
                    <!--是否需要对删除的二次确认-->
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div ></div>
    </div>
</template>

<script>
export default {
    props: {
        tid:{
            type:String,
            default: ''
        },
        name:{
            type:String,
            default: 'new template'
        },
        src:{
            type:String,
            default: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        },
        context:{
            type:String,
            default:'my'
        },
    },
    data() {
        return {
            focus: false,
        }
    },

    mounted(){
        this.init();
    },

    methods:{
        init(){

        },

        vis_change(value){
            this.focus = value;
        },

        click_dropdown_item(command){
            switch(command){

            }
        },

        deleteMyTemplate() {
          var that = this;
          let msg = {
            'tid': this.tid
          };
          $.ajax({
            type:'post',
            url:'/temp/delete',
            headers: {'X-CSRFToken': this.getCookie('csrftoken')},
            data: JSON.stringify(msg),
            processData: false,
            contentType: false,
            async: false,
            success:function (res){
              if (that.console_debug) {
                console.log("(post)/temp/delete" + " : " + res.status);
              }
              if (res.status === 0) {
                this.alert_box.msg('删除成功', '您的模版已删除');
              } else {
                switch (res.status) {
                  case 1:
                    this.alert_box.msg('删除失败', '键错误');
                    break;
                  case 2:
                    this.alert_box.msg('删除失败', '您的权限不足或还没有登录');
                    break;
                  case 3:
                    this.alert_box.msg('删除失败', '模版不存在');
                    break;
                  default:
                    this.alert_msg.error('未知错误');
                }
              }
            },
            error:function(){
              this.alert_msg.error('连接失败');
            }
          });
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/diadoc_icon.css");

.template_block{
    position: relative;
    cursor:pointer;
    border: solid 1px;
    width:230px;
    height:150px;
    overflow: hidden;
    border-radius: 5px;
}

.click_area{
    width: 100%;
    height:100%;
    background-color: hsla(0, 0%, 0%, 0.06);
    position: absolute;
    top:0;
    left:0;
    z-index:2;
    opacity: 0;
}

.template_block:hover .click_area, .click_area_focus{
    opacity: 1 !important;
}

.template_block:hover .more_menu, .more_menu_focus{
    opacity: 1 !important;
}

.preview_img{
    width:100%;
    height:109px;
}

.more_menu{
    position: absolute;
    top:7px;
    right:10px;
    font-size:15px;
    opacity: 0;
    z-index:3;
}

.more_menu>>>.el-icon-s-tools{
    font-size:18px;
    color:white;
}

.name{
    position: absolute;
    width:200px;
    top:117px;
    left:15px;
    text-align: left;
    word-break: break-all;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
}

.use_button{
    position: absolute;
    width:50px;
    height:27px;
    line-height:27px;
    padding:0;
    top:116px;
    right:11px;
    text-align: center;
    z-index:3;
    opacity: 0;
}

.template_block:hover .use_button{
    opacity: 1;
}

.template_block:hover .name{
    width:150px;
}

.el-dropdown-menu{
    padding:0;
}

.red_text{
    color:red !important;
}
</style>
