<template>
    <div class="can_not_choose fold_block">
        <div class="click_area" :class="focus?'click_area_focus':''"></div>
        <div class="big_icon">
            <div>
                <span class="icon iconfont">&#xe7ed;</span>
            </div>
        </div>
        <div class="link_icon" v-if="is_link">
            <span class="icon iconfont">&#xe60c;</span>
        </div>
        <div class="starred_icon" v-if="is_starred">
            <span class="icon iconfont">&#xe7b2;</span>
        </div>
        <div class="name">{{name}}</div>
        <div class="more_menu" :class="focus?'more_menu_focus':''">
            <el-dropdown trigger="click" 
                @visible-change="vis_change"
                @command="click_dropdown_item">
                <span class="el-dropdown-link">
                    <i class="el-icon-s-tools"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="context!='recycle'">打开</el-dropdown-item>
                    <el-dropdown-item v-if="false">权限管理</el-dropdown-item>
                    <el-dropdown-item v-if="(is_link||context=='workbench')&&can_trade">打开所在文件夹</el-dropdown-item>
                    <el-dropdown-item v-if="is_in_desktop">转化为团队文件夹</el-dropdown-item>
                    <el-dropdown-item command="move" v-if="(context=='file_system'||context=='team')&&!is_link">移动</el-dropdown-item>
                    <el-dropdown-item command="copy" v-if="(context=='file_system'||context=='team')&&!is_link&&false">复制</el-dropdown-item>
                    <el-dropdown-item v-if="(context=='file_system'||context=='team'||context=='workbench')&&!is_link">{{is_starred ? '取消收藏' : '收藏'}}</el-dropdown-item>
                    <el-dropdown-item class="red_text" v-if="is_link">移除快捷方式</el-dropdown-item>
                    <el-dropdown-item v-if="context=='recycle'">恢复</el-dropdown-item>
                    <el-dropdown-item class="red_text" v-if="context=='recycle'">彻底删除</el-dropdown-item>
                    <el-dropdown-item v-if="false">导出</el-dropdown-item>
                    <el-dropdown-item class="red_text" v-if="(context=='file_system'||context=='team')&&!is_link">删除</el-dropdown-item>
                    <el-dropdown-item command="open_info" v-if="!is_link">文件夹信息</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        is_link: {
            type:Boolean,
            default: false
        },
        fid:{
            type:String,
            default: ''
        },
        name:{
            type:String,
            default: 'new file aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        },
        context:{
            type:String,
            default:'file_system' //所处的环境，分'recycel'，'file_system'，'root'，'workbench', 'team'
        },
        is_starred:{
            type:Boolean,
            default:false
        },
        is_in_desktop:{
            type:Boolean,
            default:false
        },
    },
    data() {
        return {
            focus: false,
            can_trade: false
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
                case 'open_info':
                    this.$emit('open_info', this.name, 'file');
                    break;
                case 'move':
                    this.$emit('move_item', this.did, 'file', this.name);
                    break;
            }
        },

        refresh(){
            this.$emit('refresh');
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/diadoc_icon.css");

.fold_block{
    position: relative;
    cursor:pointer;
    border: solid 1px;
    width:150px;
    height:145px;
    padding: 15px;
    overflow: hidden;
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

.fold_block:hover .click_area, .click_area_focus{
    opacity: 1 !important;
}

.big_icon{
    position: absolute;
    top:23px;
    left:15px;
    text-align: center;
    width:150px;
    color:hsl(219, 15%, 23%);
}

.big_icon .icon{
    font-size:75px;
}

.link_icon{
    position: absolute;
    top:65px;
    left:100px;
    color:hsl(202, 38%, 39%);
    font-weight: bold;
    border: solid 1px;
    width:45px;
    height:45px;
    line-height:45px;
    text-align: center;
    border-radius: 50%;
    background-color: #fafafa;
}

.link_icon .icon, .starred_icon .icon{
    font-size:36px;
}

.starred_icon{
    position: absolute;
    top:65px;
    left:100px;
    color:hsl(51, 100%, 50%);
    font-weight: bold;
    width:45px;
    height:45px;
    line-height:45px;
    text-align: center;
}

.fold_block:hover .more_menu, .more_menu_focus{
    opacity: 1 !important;
}

.more_menu{
    position: absolute;
    bottom:7px;
    right:10px;
    font-size:15px;
    opacity: 0;
    z-index:3
}

.more_menu>>>.el-icon-s-tools{
    font-size:18px;
}

.name{
    position: absolute;
    width:130px;
    top:105px;
    left:25px;
    text-align: center;
    margin-top:10px;
    word-break: break-all;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /* 行数 */
    overflow: hidden;
}

.red_text{
    color:red !important;
}
</style>