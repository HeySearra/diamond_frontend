<template>
    <div class="manage_member_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            :close-on-click-modal="false"
            width="700px">
            <h3>{{title}}</h3>
            <div class="content">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="团内成员" name="1">
                        <div style="height:5px"></div>
                        <div style="padding:0 25px">
                            <div class="member_small_icon item can_not_choose" v-for="item in all_list" :key="item.uid" @click="function(){remove_member(item.uid, item.name)}">
                                <!-- <el-tooltip effect="dark" :content="item.name" placement="top"> -->
                                    <el-avatar class="close_icon"><span class="icon iconfont">&#xe79b;</span></el-avatar>
                                    <el-avatar class="user_port" :src="item.src"></el-avatar>
                                <!-- </el-tooltip> -->
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="邀请成员" name="2">
                        <div>
                            <div style="height:30px"></div>
                            <div class="search_input">
                                <el-input v-model="search_input" style="width:83%" placeholder="搜索用户账号" maxlength="70" @input="search_user" @keyup.enter.native="inviate()"></el-input>
                                <el-button type="primary" style="width:15%;float:right" @click="inviate">邀请</el-button>
                            </div>
                            <div style="height:35px"></div>
                            <div class="user_part" v-loading="search_loading">
                                <transition name="el-fade-in-linear">
                                    <div class="not_found ac" v-show="!search_list.length">输入用户账号来搜索用户</div>
                                </transition>
                                <user-list-item 
                                    type="search" 
                                    v-for="item in search_list" 
                                    :name="item.name"
                                    :key="item.uid" 
                                    :uid="item.uid"
                                    :account="item.acc"
                                    :src="item.portrait"
                                    @click_account="change_input"></user-list-item>
                                <div class="not_found" v-if="search_list.length" style="line-height:69px">这已经是全部的搜索内容了</div>
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
import user_list_item from '@/components/user_list_item';
export default {
    name: 'manage-member-dialog',

    components:{
        'user-list-item': user_list_item
    },

    data() {
        return {
            title:'团队成员管理',
            tid:'',
            dia_vis:false,
            activeName:'2',
            search_input:'',
            creator_id:'',
            all_list:[],
            search_list:[],
            search_loading:false
        }
    },

    methods:{
        open(tid){
            this.tid = tid;
            this.activeName = '1';
            this.search_input = '';
            this.search_list = [];
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
                    uid:res.admin[i].uid,
                    src:res.admin[i].src,
                    name:res.admin[i].name,
                    account:res.admin[i].acc
                });
                this.admin_list.push({
                    uid:res.admin[i].uid,
                    src:res.admin[i].src,
                    name:res.admin[i].name,
                    account:res.admin[i].acc
                });
            }
            for(let i=0; i<res.norm.length; i++){
                this.all_list.push({
                    uid:res.norm[i].uid,
                    src:res.norm[i].src,
                    name:res.norm[i].name,
                    account:res.norm[i].acc
                });
                this.member_list.push({
                    uid:res.norm[i].uid,
                    src:res.norm[i].src,
                    name:res.norm[i].name,
                    account:res.norm[i].acc
                });
            }
            return true;
        },

        apply_team_info(){
            let url = '/team/info?tid=' + this.tid;
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
                this.alert_msg.warning('对自己好一些' + this.magic_word[parseInt((Math.random()*1000))%this.magic_word.length]);
                return;
            }

            if(uid == this.creator_id){
                this.alert_msg.warning('你不能将创建者移出团队');
                return;
            }

            var that = this;
            this.alert_box.confirm_msg('警告', '确定将 ' + name + ' 移出团队吗？', function(){
                let url = '/team/remove';
                $.ajax({ 
                    type:'post',
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
                            that.$emit('refresh_team_info');
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
                                    that.alert_msg.warning(name + ' 已不在团队中');
                                    that.init_info();
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

        search_user(){
            this.search_loading = true;
            let url = '/search_user';
            var that = this;
            $.ajax({ 
                type:'post',
                url: url,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                data: JSON.stringify({key:that.search_input}),
                processData: false,
                contentType: false,
                success:function (res){ 
                    if(that.console_debug){
                        console.log(url +  '：' + res.status);
                    }
                    if(res.status == 0){
                        that.search_list = res.list;
                    }
                    that.search_loading = false;
                },
                error:function(res){
                    that.search_loading = false;
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
                data: JSON.stringify({tid:that.tid, acc:that.search_input}),
                async:false,
                success:function (res){ 
                    if(that.console_debug){
                        console.log(url +  '：' + res.status);
                    }
                    if(res.status == 0){
                        that.alert_msg.success('已发送邀请');
                        that.search_input = '';
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
                            case 5:
                                that.alert_msg.warning('系统不认识这个人');
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

.member_small_icon{
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

.member_small_icon:hover .close_icon{
    display: block;
}

.member_small_icon:hover .user_port{
    display: none;
}

.search_input{
    width:80%;
    margin:0 auto;
}

.user_part{
    border:solid 1px hsl(0, 0%, 75%);
    border-radius: 5px;
    height: 300px;
    width:80%;
    margin: 0 auto;
    overflow-x:hidden;
    overflow-y: overlay;
}

.ac{
    position: absolute;
    width:496px;
}

@media (max-width: 1200px){
    
}
</style>