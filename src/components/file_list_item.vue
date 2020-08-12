<template>
    <div class="can_not_choose file_list_item">
        <div class="click_area" :class="focus?'click_area_focus':''"></div>
        <div class="big_icon">
            <div>
                <span class="icon iconfont">&#xe644;</span>
            </div>
        </div>
        <div class="link_icon" v-if="is_link">
            <span class="icon iconfont">&#xe60c;</span>
        </div>
        <div class="starred_icon" v-if="is_starred">
            <span class="icon iconfont">&#xe7b2;</span>
        </div>
        <div class="name">{{name}}</div>
        <div class="info_area">
            <div>{{creator}}</div>
            <div>{{recent_edit_time}}</div>
            <div class="min_hide">{{create_time}}</div>
        </div>
        <div class="more_menu" :class="focus?'more_menu_focus':''">
            <el-dropdown trigger="click" 
                @visible-change="vis_change"
                @command="click_dropdown_item">
                <span class="el-dropdown-link">
                    <i class="el-icon-s-tools"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="context!='recycle'">打开</el-dropdown-item>
                    <el-dropdown-item v-if="context==false">权限管理</el-dropdown-item>
                    <el-dropdown-item v-if="can_trade">打开所在文件夹</el-dropdown-item>
                    <el-dropdown-item command="move" v-if="(context=='file_system'||context=='team')&&!is_link">移动</el-dropdown-item>
                    <el-dropdown-item command="copy" v-if="(context=='file_system'||context=='team')&&!is_link">复制</el-dropdown-item>
                    <el-dropdown-item command="share" v-if="(context=='file_system'||context=='team')&&!is_link">分享</el-dropdown-item>
                    <el-dropdown-item v-if="(context=='file_system'||context=='team'||context=='workbench')&&!is_link">{{is_starred ? '取消收藏' : '收藏'}}</el-dropdown-item>
                    <el-dropdown-item class="red_text" v-if="is_link">移除快捷方式</el-dropdown-item>
                    <el-dropdown-item v-if="context=='recycle'">恢复</el-dropdown-item>
                    <el-dropdown-item class="red_text" v-if="context=='recycle'">彻底删除</el-dropdown-item>
                    <el-dropdown-item v-if="false">导出</el-dropdown-item>
                    <el-dropdown-item class="red_text" v-if="(context=='file_system'||context=='team')&&!is_link">删除</el-dropdown-item>
                    <el-dropdown-item command="open_info" v-if="!is_link">文档信息</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div ></div>
    </div>
</template>

<script>
export default {
    props: {
        is_link: {
            type:Boolean,
            default: false
        },
        did:{
            type:String,
            default: ''
        },
        name:{
            type:String,
            default: 'new file aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        },
        context:{
            type:String,
            default:'file_system' //所处的环境，分'recycle'，'file_system'，'root'，'workbench', 'team'
        },
        is_starred:{
            type:Boolean,
            default:false
        },
        create_time:{
            type:String,
            default:'yyyy-mm-dd hh:mm:ss'
        },
        recent_edit_time:{
            type:String,
            default:'yyyy-mm-dd hh:mm:ss'
        },
        creator:{
            type:String,
            default:'ansdoasoda'
        }
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
                case 'share':
                    this.$emit('share_item', this.did, this.name);
                    break;
                case 'copy':
                    this.$emit('copy_item', this.did, 'file', this.name);
                    break;
            }
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/diadoc_icon.css");

.file_list_item{
    position: relative;
    cursor:pointer;
    border: solid 1px;
    height:50px;
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

.file_list_item:hover .click_area, .click_area_focus{
    opacity: 1 !important;
}

.big_icon{
    position: absolute;
    top:0;
    left:23px;
    text-align: center;
    line-height:50px;
    width:fit-content;
    color:hsl(219, 15%, 23%);
}

.big_icon .icon{
    font-size:27px;
}

.link_icon{
    position: absolute;
    top:23px;
    left:36px;
    color:hsl(202, 38%, 39%);
    font-weight: bold;
    border: solid 1px;
    width:18px;
    height:18px;
    line-height:15px;
    text-align: center;
    border-radius: 50%;
    background-color: #fafafa;
}

.link_icon .icon, .starred_icon .icon{
    font-size:12px;
}

.starred_icon{
    position: absolute;
    top:27px;
    left:40px;
    color:hsl(51, 100%, 50%);
    font-weight: bold;
    width:18px;
    height:18px;
    line-height:15px;
    text-align: center;
}

.file_list_item:hover .more_menu, .more_menu_focus{
    opacity: 1 !important;
}

.more_menu{
    position: absolute;
    line-height:50px;
    top:0;
    right:18px;
    font-size:15px;
    opacity: 0;
    z-index:3
}

.more_menu>>>.el-icon-s-tools{
    font-size:18px;
}

.name{
    position: absolute;
    width:36%;
    line-height:50px;
    height:50px;
    top:0;
    left:69px;
    word-break: break-all;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
}

.info_area{
    position: absolute;
    width:56%;
    line-height:50px;
    height:50px;
    top:0;
    right:39px;
}

.info_area div{
    width:33%;
    float:left;
    line-height:50px;
    height:50px;
    text-align: center;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
}

.red_text{
    color:red !important;
}

@media (max-width: 1500px){
    .min_hide{
        display: none;
    }

    .info_area{
        width:50%;
    }

    .info_area div{
        width:50%;
    }
}
</style>