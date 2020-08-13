<template>
    <div class="can_not_choose team_block">
        <div class="click_area" :class="focus?'click_area_focus':''" @click="open"></div>
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
                    <el-dropdown-item command="in">进入</el-dropdown-item>
                    <el-dropdown-item command="team_info">团队信息</el-dropdown-item>
                    <el-dropdown-item v-if="!is_creator" class="red_text" @click="quit_team">退出团队</el-dropdown-item>
                    <el-dropdown-item v-if="is_creator" class="red_text" @click="delete_team">解散团队</el-dropdown-item>
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
            default: 'new team'
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

        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },


        vis_change(value){
            this.focus = value;
        },

        click_dropdown_item(command){
            switch(command){
                case 'team_info':
                    this.open_team_info();
                    break;
                case 'in':
                    this.open();
                    break;
            }
        },
        quit_team(){
            var that = this;
            this.alert_box.confirm_msg('警告', '确定退出团队 ' + that.team_name + ' 吗？', function(){
                let url = '/team/quit'
                $.ajax({ 
                    type:'post',
                    url: url,
                    headers: {'X-CSRFToken': that.getCookie('csrftoken')},
                    data: JSON.stringify({tid:that.tid}),
                    processData: false,
                    contentType: false, 
                    success:function (res){ 
                        if(that.console_debug){
                            console.log(url +  '：' + res.status);
                        }
                        if(res.status == 0){
                            that.alert_box.msg('提示', '成功退出团队', function(){
                                that.$router.push({name:team_center});
                            });
                        }
                        else{
                            switch(res.status){
                                case 2:
                                    that.alert_msg.error('权限不足');
                                    break;
                                case 3:
                                    that.alert_msg.error('找不到团队');
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
            });
        },
        delete_team(){
            var that = this;
            this.console('rwr');
            this.alert_box.confirm_msg('警告', '确定解散团队 ' + that.team_name + ' 吗？', function(){
                let url = '/team/delete'
                $.ajax({ 
                    type:'post',
                    url: url,
                    headers: {'X-CSRFToken': that.getCookie('csrftoken')},
                    data: JSON.stringify({tid:that.tid}),
                    processData: false,
                    contentType: false, 
                    success:function (res){ 
                        if(that.console_debug){
                            console.log(url +  '：' + res.status);
                        }
                        if(res.status == 0){
                            that.alert_box.msg('提示', '成功解散团队', function(){
                            that.$router.push({name:team_center});
                            });
                        }
                        else{
                            switch(res.status){
                                case 2:
                                    that.alert_msg.error('权限不足');
                                    break;
                                case 3:
                                    that.alert_msg.error('找不到团队');
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
            });
        },



        open_team_info(){
            let url = '/team/info?tid=' + this.tid;
            var that = this;
            $.ajax({ 
                type:'get',
                url: url,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                async:false, 
                success:function (res){ 
                    if(that.console_debug){
                        console.log(url +  '：' + res.status);
                    }
                    if(res.status == 0){
                        var content = [];
                        content.push({
                            key:'团队名',
                            value:res.name
                        });
                        content.push({
                            key:'团队介绍',
                            value:res.intro
                        });
                        content.push({
                            key:'创建者',
                            value:res.cname
                        });
                        content.push({
                            key:'创建时间',
                            value:res.create_dt
                        });
                        content.push({
                            key:'文件数',
                            value:res.doc_num
                        });
                        that.$emit('open_info', that.tname, content);
                    }
                    else{
                        switch(res.status){
                            case 2:
                                that.alert_msg.error('权限不足');
                                break;
                            case 3:
                                that.alert_msg.error('找不到团队');
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

        open(){
            let url = '/fs/team/root?tid=' + this.tid;
            var that = this;
            $.ajax({ 
                type:'get',
                url: url,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                async:false, 
                success:function (res){ 
                    if(that.console_debug){
                        console.log(url +  '：' + res.status);
                    }
                    if(res.status == 0){
                        that.$router.push({path: "/team/" + that.tid + "/file/"+ that.id});
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