<template>
    <div class="can_not_choose fold_block" :class="focus?'fold_block_focus':''">
        <div class="click_area" :class="focus?'click_area_focus':''" @click="click"></div>
        <div class="big_icon">
            <div>
                <span class="icon iconfont">&#xe622;</span>
            </div>
        </div>
        <div class="link_icon" v-if="is_link">
            <span class="icon iconfont">&#xe60c;</span>
        </div>
        <div class="starred_icon" v-if="is_starred&&!is_link">
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
                    <el-dropdown-item command="open" v-if="context!='recycle'">打开</el-dropdown-item>
                    <el-dropdown-item v-if="false">权限管理</el-dropdown-item>
                    <el-dropdown-item command="parent" v-if="(is_link||context=='workbench')&&pfid!=''">打开所在文件夹</el-dropdown-item>
                    <el-dropdown-item command="team" v-if="is_in_desktop&&!is_link">转化为团队文件夹</el-dropdown-item>
                    <el-dropdown-item command="create_link" v-if="(context=='file_system'||context=='team')&&!is_link&&!is_in_desktop">创建快捷方式到桌面</el-dropdown-item>
                    <el-dropdown-item command="move" v-if="(context=='file_system'||context=='team')&&!is_link">移动</el-dropdown-item>
                    <el-dropdown-item command="copy" v-if="(context=='file_system'||context=='team')&&!is_link&&false">复制</el-dropdown-item>
                    <el-dropdown-item command="star" v-if="(context=='file_system'||context=='team'||context=='workbench')&&!is_link">{{is_starred ? '取消收藏' : '收藏'}}</el-dropdown-item>
                    <el-dropdown-item command="remove_link" class="red_text" v-if="is_link">移除快捷方式</el-dropdown-item>
                    <el-dropdown-item command="recover" v-if="context=='recycle'" @click="click_to_recover">恢复</el-dropdown-item>
                    <el-dropdown-item command="delete_forever" class="red_text" v-if="context=='recycle'" @click="click_to_delete_forever">彻底删除</el-dropdown-item>
                    <el-dropdown-item v-if="false">导出</el-dropdown-item>
                    <el-dropdown-item command="delete" class="red_text" v-if="(context=='file_system'||context=='team')&&!is_link">删除</el-dropdown-item>
                    <el-dropdown-item command="open_info" v-if="!is_link&&context!='recycle'">文件夹信息</el-dropdown-item>
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
            default: 'new file'
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
            pfid:'',
            timer:undefined,
            click_flag: false
        }
    },

    mounted(){

    },

    methods:{
        init(){
            this.apply_for_parent();
        },

        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },

        click(){
            this.timer ? clearTimeout(this.timer) : '';
            if(this.click_flag){
                this.open_fold(this.fid);
            }
            else{
                this.click_flag = true;
                var that = this;
                this.timer = setTimeout(function(){
                    that.click_flag = false;
                }, 500);
            }
        },

        apply_for_parent(){
            if(this.context!='workbench'&&!this.is_link){
                return;
            }
            let url = '/fs/father?id=' + this.fid + '&type=fold';
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
                        that.pfid = res.pfid;
                    }
                    else{
                        switch(res.status){
                            case 2:
                            case 3:
                            case 4:
                                that.pfid = '';
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

        vis_change(value){
            this.focus = value;
        },

        click_to_delete_forever(){
            var that = this;
            this.alert_box.confirm_msg('警告', '确定彻底删除文件夹 ' + that.name + ' 吗？', function(){
                var msg = {
                    id: that.fid,
                    type: 'fold',
                };
                let url = '/fs/recycle/delete'
                $.ajax({
                    type:'post',
                    url: url,
                    headers: {'X-CSRFToken': that.getCookie('csrftoken')},
                    data: JSON.stringify(msg),
                    async:false, 
                    success:function (res){
                        if(that.console_debug){
                            console.log(url +  '：' + res.status);
                        }
                        if(res.status == 0){
                            that.alert_msg.success('已彻底删除 ' + that.name);
                            that.$emit('refresh');
                        }
                        else{
                            switch(res.status){
                                case 2:
                                    that.alert_msg.error('权限不足');
                                    break;
                                case 3:
                                    that.alert_msg.error('找不到该内容');
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

        click_to_recover(){
            var that = this;
            var msg = {
                id: that.fid,
                type: 'fold',
            };
            let url = '/fs/recycle/recover'
            $.ajax({
                type:'post',
                url: url,
                headers: {'X-CSRFToken': that.getCookie('csrftoken')},
                data: JSON.stringify(msg),
                async:false, 
                success:function (res){
                    if(that.console_debug){
                        console.log(url +  '：' + res.status);
                    }
                    if(res.status == 0){
                        that.alert_msg.success('已成功恢复 ' + that.name);
                        that.$emit('refresh');
                    }
                    else{
                        switch(res.status){
                            case 2:
                                that.alert_msg.error('权限不足');
                                break;
                            case 3:
                                that.alert_msg.error('找不到该内容');
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

        click_dropdown_item(command){
            switch(command){
                case 'open_info':
                    this.open_info();
                    break;
                case 'move':
                    this.$emit('move_item', this.fid, 'file', this.name);
                    break;
                case 'parent':
                    this.open_fold(this.pfid);
                    break;
                case 'create_link':
                    this.create_link();
                    break;
                case 'remove_link':
                    this.remove_link();
                    break;
                case 'star':
                    this.star();
                    break;
                case 'delete':
                    this.delete();
                    break;
                case 'team':
                    this.team();
                    break;
                case 'open':
                    this.open_fold(this.fid);
                    break;
                case 'recover':
                    this.click_to_recover();
                    break;
                case 'delete_forever':
                    this.click_to_delete_forever();
                    break;
            }
        },

        refresh(){
            this.$emit('refresh');
        },

        open_info(){
            let url = '/fs/fold/info?fid=' + this.fid;
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
                    if(res.status === 0){
                        var content = [];
                        content.push({
                            key:'文件夹名称',
                            value:that.name
                        });
                        content.push({
                            key:'创建者',
                            value:res.cname
                        });
                        let path = '';
                        for(let i=0; i<res.path.length; i++){
                            path += res.path[i].name;
                            path += ' > ';
                        }
                        path += that.name;
                        content.push({
                            key:'路径',
                            value:path
                        });
                        that.$emit('open_info', that.name, content, 'fold');
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

        open_fold(fid){
            if(this.context == 'team'){
                this.$router.push({name:'team_file_system', params:{id:fid, tid:this.$route.params.tid}});
            }
            else if(this.context !== 'recycle'){
                this.$router.push({name:'file_system', params:{id:fid}});
            }
        },

        create_link(){
            let url = '/fs/link/new';
            let json_data = {id:this.fid, type:'doc'};
            var that = this;
            $.ajax({
                type:'post',
                url: url,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                data: JSON.stringify(json_data),
                async:false, 
                success:function (res){
                    if(that.console_debug){
                        console.log(url +  '：' + res.status);
                    }
                    if(res.status === 0){
                        that.alert_box.msg('提示', '成功创建快捷方式', function(){
                            that.$router.push({name:'file_system', params:{id:'desktop'}});
                        });
                    }
                    else{
                        switch(res.status){
                            case 2:
                                that.alert_msg.error('权限不足');
                                break;
                            case 3:
                                that.alert_msg.normal('快捷方式已存在');
                                break;
                            case 4:
                                that.alert_msg.error('找不到文件');
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

        remove_link(){
            let url = '/fs/delete_link';
            let json_data = {id:this.fid, type:'fold'};
            var that = this;
            $.ajax({
                type:'post',
                url: url,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                data: JSON.stringify(json_data),
                async:false, 
                success:function (res){
                    if(that.console_debug){
                        console.log(url +  '：' + res.status);
                    }
                    if(res.status == 0){
                        that.$emit('refresh');
                    }
                    else{
                        switch(res.status){
                            case 2:
                                that.alert_msg.error('权限不足');
                            case 3:
                                that.alert_msg.error('找不到快捷方式');
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

        star(){
            let url = '/fs/star';
            let json_data = {id:this.fid, type:'fold', is_starred:!this.is_starred};
            var that = this;
            $.ajax({
                type:'post',
                url: url,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                data: JSON.stringify(json_data),
                async:false, 
                success:function (res){
                    if(that.console_debug){
                        console.log(url +  '：' + res.status);
                    }
                    if(res.status == 0){
                        that.is_starred = !that.is_starred;
                        that.alert_msg.success(that.is_starred?'收藏成功':'已取消收藏');
                    }
                    else{
                        switch(res.status){
                            case 2:
                                that.alert_msg.error('权限不足');
                            case 3:
                                that.alert_msg.error('找不到文件');
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

        delete(){
            var that = this;
            that.alert_box.confirm_msg('提示', '确定删除 ' + that.name + ' ？', function(){
                let url = '/fs/delete';
                let json_data = {id:that.fid, type:'fold'};
                $.ajax({
                    type:'post',
                    url: url,
                    headers: {'X-CSRFToken': that.getCookie('csrftoken')},
                    data: JSON.stringify(json_data),
                    async:false, 
                    success:function (res){
                        if(that.console_debug){
                            console.log(url +  '：' + res.status);
                        }
                        if(res.status === 0){
                            that.alert_msg.success('已删除 ' + that.name);
                            that.$emit('refresh');
                        }
                        else{
                            switch(res.status){
                                case 2:
                                    that.alert_msg.error('权限不足');
                                case 3:
                                    that.alert_msg.error('找不到文件夹');
                                default:
                                    that.alert_msg.error('发生了未知错误');
                            }
                        }
                    },
                    error:function(res){
                        that.alert_msg.error('网络连接失败');
                    }
                });
            })
        },

        team(){
            var that = this;
            that.alert_box.confirm_msg('提示', '确定将 ' + that.name + ' 转为团队文件夹吗？', function(){
                let url = '/team/new_from_fold';
                let json_data = {fid:that.fid};
                $.ajax({
                    type:'post',
                    url: url,
                    headers: {'X-CSRFToken': that.getCookie('csrftoken')},
                    data: JSON.stringify(json_data),
                    async:false, 
                    success:function (res){
                        if(that.console_debug){
                            console.log(url +  '：' + res.status);
                        }
                        if(res.status == 0){
                            that.alert_msg.success('已转化为团队文件夹');
                            that.$router.push({name:'team_center'});
                        }
                        else{
                            switch(res.status){
                                case 2:
                                    that.alert_msg.error('权限不足');
                                case 3:
                                    that.alert_msg.error('转化过程中发生错误');
                                default:
                                    that.alert_msg.error('发生了未知错误');
                            }
                        }
                    },
                    error:function(res){
                        that.alert_msg.error('网络连接失败');
                    }
                });
            })
        }
    }
}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/diadoc_icon.css");

.fold_block{
    position: relative;
    border: solid 2px rgba(0, 0, 0, 0);
    width:130px;
    height:125px;
    padding: 15px;
    overflow: hidden;
    border-radius: 5px;
    /* cursor:pointer; */
}

.fold_block:hover, .fold_block_focus{
    border: solid 2px rgba(0, 0, 0, 0.1);
}

.click_area{
    width: 100%;
    height:100%;
    background-color: hsla(0, 0%, 0%, 0.02);
    position: absolute;
    top:0;
    left:0;
    z-index:2;
    opacity: 0;
    transition: all 0.1s linear;
}

.fold_block:hover .click_area, .click_area_focus{
    opacity: 1 !important;
}

.big_icon{
    position: absolute;
    top:23px;
    left: 5px;
    text-align: center;
    width:150px;
    color:hsl(198, 56%, 56%);
}

.big_icon .icon{
    font-size:65px;
}

.link_icon{
    position: absolute;
    top:60px;
    left:90px;
    color:#586378;
    font-weight: bold;
    border: solid 2px #586378;
    width:35px;
    height:35px;
    line-height:35px;
    text-align: center;
    border-radius: 50%;
    background-color: hsl(0, 0%, 98%, 0.78);
}

.link_icon .icon{
    font-size:25px;
}

.starred_icon .icon{
    font-size:27px;
}

.starred_icon{
    position: absolute;
    top:65px;
    left:96px;
    color:hsl(51, 100%, 50%);
    font-weight: bold;
    width:35px;
    height:35px;
    line-height:35px;
    text-align: center;
}

.fold_block:hover .more_menu, .more_menu_focus{
    opacity: .7 !important;
}

.more_menu{
    position: absolute;
    bottom:7px;
    right:10px;
    font-size:15px;
    opacity: 0;
    z-index:3;
    cursor:pointer;
    transition: all 0.1s linear;
}

.more_menu span{
    color:hsl(198, 25%, 35%)
}

.more_menu>>>.el-icon-s-tools{
    font-size:18px;
}

.name{
    position: absolute;
    width:120px;
    top:90px;
    left:18px;
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
