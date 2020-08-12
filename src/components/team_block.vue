<template>
    <div class="can_not_choose team_block">
        <div class="click_area" :class="focus?'click_area_focus':''"></div>
        <div class="big_icon">
            <div>
                <span class="icon iconfont">&#xe6cb;</span>
            </div>
        </div>
        <div class="name">{{tname}}</div>
        <div class="more_menu" :class="focus?'more_menu_focus':''">
            <el-dropdown trigger="click" 
                @visible-change="vis_change"
                @command="click_dropdown_item">
                <span class="el-dropdown-link">
                    <i class="el-icon-s-tools"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>进入</el-dropdown-item>
                    <el-dropdown-item command="team_info">团队信息</el-dropdown-item>
                    <el-dropdown-item v-if="!is_creator" class="red_text">退出团队</el-dropdown-item>
                    <el-dropdown-item v-if="is_creator" class="red_text">解散团队</el-dropdown-item>
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
        tname:{
            type:String,
            default: 'new team aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        },
        is_creator:{
            type:Boolean,
            default:false
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
            if(command == 'team_info'){
                this.$emit('open_info', this.tname, '');
            }
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/diadoc_icon.css");

.team_block{
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

.team_block:hover .click_area, .click_area_focus{
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

.team_block:hover .more_menu, .more_menu_focus{
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