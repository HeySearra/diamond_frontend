<template>
    <div class="can_not_choose file_list_item">
        <div class="click_area" :class="focus?'click_area_focus':''" @click="click"></div>
        <div class="big_icon">
            <div>
                <span class="icon iconfont">&#xe645;</span>
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
            <div v-if="type=='recycle'">{{delete_time}}</div>
            <div v-if="type=='recycle'">{{rest_time}}天</div>
            <div v-if="type=='recent'">{{view_time}}</div>
            <div v-if="type!='recycle'&&type!='recent'">{{creator}}</div>
            <div v-if="type!='recycle'&&type!='recent'">{{recent_edit_time}}</div>
            <div v-if="type!='recycle'&&type!='recent'" class="min_hide">{{create_time}}</div>
        </div>
        <div class="more_menu" :class="focus?'more_menu_focus':''">
            <el-dropdown trigger="click"
                @visible-change="vis_change"
                @command="click_dropdown_item">
                <span class="el-dropdown-link">
                    <i class="el-icon-s-tools"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="open" v-if="context!='recycle'">打开</el-dropdown-item>
                    <el-dropdown-item v-if="context==false">权限管理</el-dropdown-item>
                    <el-dropdown-item command="parent" v-if="(is_link||context=='workbench')&&pfid!=''">打开所在文件夹</el-dropdown-item>
                    <el-dropdown-item command="create_link" v-if="(context=='file_system'||context=='team')&&!is_link&&!is_in_desktop">创建快捷方式到桌面</el-dropdown-item>
                    <el-dropdown-item command="move" v-if="(context=='file_system'||context=='team')&&!is_link">移动</el-dropdown-item>
                    <el-dropdown-item command="copy" v-if="(context=='file_system'||context=='team')&&!is_link">复制</el-dropdown-item>
                    <el-dropdown-item command="share" v-if="(context=='file_system'||context=='team')&&!is_link">分享</el-dropdown-item>
                    <el-dropdown-item command="star" v-if="(context=='file_system'||context=='team'||context=='workbench')&&!is_link">{{is_starred ? '取消收藏' : '收藏'}}</el-dropdown-item>
                    <el-dropdown-item command="remove_link" class="red_text" v-if="is_link">移除快捷方式</el-dropdown-item>
                    <el-dropdown-item v-if="context=='recycle'" @click="click_to_recover">恢复</el-dropdown-item>
                    <el-dropdown-item class="red_text" v-if="context=='recycle'" @click="click_to_delete_forever">彻底删除</el-dropdown-item>
                    <el-dropdown-item v-if="false">导出</el-dropdown-item>
                    <el-dropdown-item command="delete" class="red_text" v-if="(context=='file_system'||context=='team')&&!is_link">删除</el-dropdown-item>
                    <el-dropdown-item command="open_info" v-if="!is_link&&context!='recycle'">文档信息</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div></div>
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
        type:{
            type:String,
            default:''
        },
        name:{
            type:String,
            default: 'new file'
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
        },
        delete_time:{
            type:String,
            default:'delete_time'
        },
        rest_time:{
            type:String,
            default:'rest_time'
        },
        view_time: {
            type:String,
            default: 'recent_time',
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
                this.open_doc(this.fid);
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
            if(this.context == 'recycle'){
                return;
            }
            let url = '/fs/father?id=' + this.did + '&type=doc';
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
            this.alert_box.confirm_msg('警告', '确定彻底删除文件 ' + that.team_name + ' 吗？', function(){
                var that = this;
                var msg = {
                    id: that.did,
                    type: 'doc',
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
                            that.alert_box.msg('提示', '删除成功');
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
                id: that.did,
                type: 'doc',
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
                        that.alert_box.msg('提示', '恢复成功');
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
                    this.$emit('move_item', this.did, 'file', this.name);
                    break;
                case 'share':
                    this.$emit('share_item', this.did, this.name);
                    break;
                case 'copy':
                    this.$emit('copy_item', this.did, 'file', this.name);
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
                case 'open':
                    this.open_fold(this.fid);
                    break;
            }
        },

        refresh(){
            this.$emit('refresh');
        },

        open_info(){
            let url = '/fs/doc/info?did=' + this.did;
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
                        var content = [];
                        content.push({
                            key:'文档名',
                            value:that.name
                        });
                        content.push({
                            key:'创建者',
                            value:res.cname
                        });
                        content.push({
                            key:'字数',
                            value:res.size
                        });
                        content.push({
                            key:'是否可分享',
                            value:res.is_locked?'否':'是'
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
                        that.$emit('open_info', that.name, content, 'file');
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
            else{
                this.$router.push({name:'file_system', params:{id:fid}});
            }
        },

        open_doc() {
            this.$router.push({path: '/doc/' + this.did});
        },

        create_link(){
            let url = '/fs/link/new';
            let json_data = {id:this.did, type:'doc'};
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
                        that.alert_box.msg('提示', '成功创建快捷方式', function(){
                            that.$router.push({name:'file_system', params:{id:'desktop'}});
                        });
                    }
                    else{
                        switch(res.status){
                            case 2:
                                that.alert_msg.error('权限不足');
                            case 3:
                                that.alert_msg.error('快捷方式已存在');
                            case 4:
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

        remove_link(){
            let url = '/fs/delete_link';
            let json_data = {id:this.did, type:'doc'};
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
            let json_data = {id:this.did, type:'doc', is_starred:!this.is_starred};
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
                let json_data = {id:that.did, type:'doc'};
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
                            that.alert_msg.success('已删除 ' + that.name);
                            that.$emit('refresh');
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
            })
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/diadoc_icon.css");

.file_list_item{
    position: relative;
    /* cursor:pointer; */
    /* border: solid 1px; */
    border-bottom: solid 1px rgba(0, 0, 0, 0.1);
    height:50px;
    overflow: hidden;
    color:#343434;
}

.click_area{
    width: 100%;
    height:100%;
    background-color: hsla(0, 0%, 0%, 0.05);
    position: absolute;
    top:0;
    left:0;
    z-index:2;
    opacity: 0;
    transition: all 0.1s linear;
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
    color:hsl(198, 10%, 69%);
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
    background-color: hsl(0, 0%, 98%, 0.78);
}

.link_icon .icon{
    font-size:12px;
}

.starred_icon .icon{
    font-size:15px;
}

.starred_icon{
    position: absolute;
    top:27px;
    left:39px;
    color:hsl(51, 100%, 50%);
    font-weight: bold;
    width:18px;
    height:18px;
    line-height:15px;
    text-align: center;
}

.file_list_item:hover .more_menu, .more_menu_focus{
    opacity: .7 !important;
}

.more_menu{
    position: absolute;
    line-height:50px;
    top:0;
    right:18px;
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
    width:36%;
    line-height:50px;
    height:50px;
    top:0;
    left:75px;
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
    color:#999
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
