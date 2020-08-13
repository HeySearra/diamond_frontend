<template>
    <div class="manage_member_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            width="700px">
            <h3>{{title}}</h3>
            <div class="content">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="团内成员" name="1">
                        <div style="height:5px"></div>
                        <div style="padding:0 25px">
                            <div class="member_icon" v-for="item in all_list" :key="item.uid" @click="function(){remove_member(item.uid, item.name)}">
                                <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                                    <el-avatar class="close_icon"><span class="icon iconfont">&#xe79b;</span></el-avatar>
                                    <el-avatar class="user_port" :src="item.src"></el-avatar>
                                </el-tooltip>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="邀请成员" name="2">
                        <div>
                            <div style="height:30px"></div>
                            <div class="search_input">
                                <el-input v-model="search_input" style="width:83%" placeholder="搜索用户账号" maxlength="70" @input="search_user"></el-input>
                                <el-button type="primary" style="width:15%;float:right">邀请</el-button>
                            </div>
                            <div style="height:35px"></div>
                            <div class="user_part">
                                <user-list-item 
                                    type="search" 
                                    v-for="item in search_list" 
                                    :key="item.uid" 
                                    :uid="item.uid"
                                    :account="item.acc"
                                    :src="item.portrait"
                                    @click="function(){change_input(item.acc)}"></user-list-item>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dia_vis=false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title:'团队成员管理',
            tid:'',
            dia_vis:true,
            activeName:'1',
            search_input:'',
            creator_id:'',
            all_list:[],
            search_list:[]
        }
    },

    methods:{
        open(tid){
            this.tid = tid;
            this.activeName = '1';
            this.search_input = '';
            if(this.init_info()){
                this.dia_vis = true;
            }
        },

        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },

        init_info(){
            var res = this.apply_team_info();
            if(res == {}){
                return false;
            }
            this.all_list = [];
            this.admin_list = [];
            this.member_list = [];
            this.creator_id = res.cuid;
            this.all_list.push({
                uid:res.cuid,
                src:res.csrc,
                name:res.cname,
                account:res.cacc,
            });
            for(let i=0; i<res.admin.length; i++){
                this.all_list.push({
                    uid:res.admin[i].cuid,
                    src:res.admin[i].csrc,
                    name:res.admin[i].cname,
                    account:res.admin[i].acc
                });
                this.admin_list.push({
                    uid:res.admin[i].cuid,
                    src:res.admin[i].csrc,
                    name:res.admin[i].cname,
                    account:res.admin[i].acc
                });
            }
            for(let i=0; i<res.norm.length; i++){
                this.all_list.push({
                    uid:res.norm[i].cuid,
                    src:res.norm[i].csrc,
                    name:res.norm[i].cname,
                    account:res.norm[i].acc
                });
                this.member_list.push({
                    uid:res.norm[i].cuid,
                    src:res.norm[i].csrc,
                    name:res.norm[i].cname,
                    account:res.norm[i].acc
                });
            }
            return true;
        },

        apply_team_info(){
            let url = '/team/info' + this.tid;
            var that = this;
            var result;
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
                        result = res;
                    }
                    else{
                        result = {};
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
                    result = {};
                    that.alert_msg.error('网络连接失败');
                }
            });
            return result;
        },

        remove_member(uid, name){
            if(uid == this.login_manager.get_uid()){
                this.alert_msg.warning('对自己好一些，呵呵');
                return;
            }

            if(uid == this.creator_id){
                this.alert_msg.warning('你不能将创建者移出团队');
                return;
            }

            var that = this;
            this.alert_box.confirm_msg('警告', '确定将 ' + name + ' 移出团队吗？', function(){
                let url = '/team/remove';
                var that = this;
                $.ajax({ 
                    type:'get',
                    url: url,
                    headers: {'X-CSRFToken': that.getCookie('csrftoken')},
                    data: JSON.stringify({tid:that.tid, uid:uid}),
                    async:false, 
                    success:function (res){ 
                        if(that.console_debug){
                            console.log(url +  '：' + res.status);
                        }
                        if(res.status == 0){
                            that.alert_msg.success('已成功将 ' + name + ' 移出团队');
                            that.init_info();
                        }
                        else{
                            switch(res.status){
                                case 2:
                                    that.alert_msg.error('权限不足');
                                    break;
                                case 3:
                                    that.alert_msg.error('找不到团队');
                                    break;
                                case 4:
                                    that.alert_msg.warning(name + ' 已不再团队中');
                                    that.init_info();
                                    break;
                                default:
                                    that.alert_msg.error('发生了未知错误');
                            }
                        }
                    },
                    error:function(res){
                        result = {};
                        that.alert_msg.error('网络连接失败');
                    }
                });
            });
        },

        search_input(){
            let url = '/search_user/';
            var that = this;
            $.ajax({ 
                type:'post',
                url: url,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                data: {key:that.search_input},
                processData: false,
                contentType: false,
                success:function (res){ 
                    if(that.console_debug){
                        console.log(url +  '：' + res.status);
                    }
                    if(res.status == 0){
                        that.search_list = res.list;
                    }
                },
                error:function(res){
                    
                }
            });
        },

        change_input(value){
            this.search_input = value;
        },

        inviate(){
            if(this.search_input.trim() == ''){
                this.alert_msg.warning('请填写邀请对象的账号');
                return;
            }

            let url = '/team/invitation';
            var that = this;
            $.ajax({ 
                type:'post',
                url: url,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                data: {tid:that.tid, account:that.search_input},
                async:false,
                success:function (res){ 
                    if(that.console_debug){
                        console.log(url +  '：' + res.status);
                    }
                    if(res.status == 0){
                        that.alert_msg.success('已发送邀请');
                    }
                    else{
                        switch(res.status){
                            case 2:
                                that.alert_msg.error('权限不足');
                                break;
                            case 3:
                                that.alert_msg.error('找不到团队');
                                break;
                            case 4:
                                that.alert_msg.normal('Ta 已经在团队里啦');
                                break;
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
@import url("../assets/dialog_style.css");

.member_icon{
    float:left;
    margin:5px 10px;
    cursor:pointer;
    width:40px;
    height:40px;
    overflow: hidden;
}

.close_icon{
    display: none;
}

.close_icon span{
    font-size:18px;
}

.member_icon:hover .close_icon{
    display: block;
}

.member_icon:hover .user_port{
    display: none;
}

.search_input{
    width:80%;
    margin:0 auto;
}

.user_part{
    border:solid 1px #000;
    height: 350px;
    width:80%;
    margin: 0 auto;
    overflow: overlay;
}

@media (max-width: 1200px){
    
}
</style>