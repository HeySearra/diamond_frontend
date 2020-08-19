<template>
    <div class="dtd_share_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            :close-on-click-modal="false"
            fullscreen>
            <h3>{{title}}</h3>
            <div class="content">
                <div class="left">
                    <div>
                        <div style="height:30px"></div>
                        <div class="search_input">
                            <el-input v-model="search_input" style="width:80%" placeholder="搜索用户账号" maxlength="70"  @input="search_user"></el-input>
                            <el-button type="primary" style="width:18%;float:right" @click="inviate">邀 请</el-button>
                        </div>
                        <div style="height:18px"></div>
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
                                @click_account="change_input">
                            </user-list-item>
                            <div class="not_found" v-if="search_list.length" style="line-height:69px">这已经是全部的搜索内容了</div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="shared_part">
                        <transition name="el-fade-in-linear">
                            <div class="not_found ac" v-show="!member_list.length">用户加入团队后会显示在此</div>
                        </transition>
                        <user-list-item 
                            type="member" 
                            ref="member_item"
                            v-for="item in member_list" 
                            :name="item.name"
                            :key="item.uid" 
                            :uid="item.uid"
                            :tid="tid"
                            :account="item.acc"
                            :src="item.src"
                            :op="item.op"
                            :identity="item.identity"
                            @refresh="refresh"
                        ></user-list-item>
                    </div>
                </div>
                <div class="clear_both"></div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dia_vis=false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import user_list_item from '@/components/user_list_item';
export default {
    name: 'dtd-share-dialog',

    components:{
        'user-list-item': user_list_item
    },

    props:{
        context:{
            type:String,
            default:'normal'
        }
    },
    data() {
        return {
            title:'管理团队成员',
            dia_vis:false,
            search_list: [],
            search_loading:false,
            share_loading:false,
            member_list:[],
            tid:'',
            search_input: ''
        }
    },

    methods:{
        open(tid){
            this.tid = tid;
            this.search_list = [];
            this.apply_for_team();
            this.dia_vis = true;
        },

        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
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

        apply_for_team(){
            this.shared_loading = true;
            let url = '/team/info?tid=' + this.tid;
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
                        that.member_list = [];
                        that.member_list.push({
                            uid: res.cuid,
                            name: res.cname,
                            src: res.csrc,
                            acc: res.cacc,
                            op: 'write',
                            identity: 'creator'
                        });
                        for(let i=0; i<res.admin.length; i++){
                            that.member_list.push({
                                uid: res.admin[i].uid,
                                name: res.admin[i].name,
                                src: res.admin[i].src,
                                acc: res.admin[i].acc,
                                op: 'write',
                                identity: 'admin'
                            });
                        }
                        for(let i=0; i<res.norm.length; i++){
                            that.member_list.push({
                                uid: res.norm[i].uid,
                                name: res.norm[i].name,
                                src: res.norm[i].src,
                                acc: res.norm[i].acc,
                                op: res.norm[i].auth,
                                identity: 'member'
                            });
                        }
                        setTimeout(function(){
                            let item = that.$refs.member_item;
                            if(item){
                                for(let i=0; i<item.length; i++){
                                    item[i].init();
                                }
                            }
                            that.shared_loading = false;
                        }, 0);
                    }
                    else{
                        that.alert_msg.error('信息加载失败');
                        that.dia_vis = false;
                    }
                },
                error:function(res){
                    that.alert_msg.error('网络连接失败');
                    that.dia_vis = false;
                }
            });
        },

        inviate(){
            if(this.search_input.trim() == ''){
                this.alert_msg.warning('请输入用户账号');
                return;
            }
            let url = '/team/invitation';
            var that = this;
            $.ajax({ 
                type:'post',
                url: url,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                data: JSON.stringify({tid:this.tid, acc:this.search_input, auth:'read', is_new:true}),
                async:false, 
                success:function (res){ 
                    if(that.console_debug){
                        console.log(url +  '：' + res.status);
                    }
                    if(res.status == 0){
                        that.search_input = '';
                        that.alert_msg.success('邀请成功');
                    }
                    else{
                        switch(res.status){
                            case 3:
                                that.alert_msg.error('找不到文档');
                                break;
                            case 4:
                                that.alert_msg.warning('系统不认识这个人');
                                break;
                            case 5:
                            case 6:
                                that.alert_msg.normal('Ta 已经在团队中了');
                                break;
                            default:
                                that.alert_msg.error('发生未知错误');
                        }
                    }
                },
                error:function(res){
                    that.alert_msg.error('网络连接失败');
                }
            });
        },

        refresh(){
            this.apply_for_team();
        },

        change_input(value){
            this.search_input = value;
        },
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");

>>>.el-dialog{
    width:87vw !important;
    height:78vh !important;
    top:10vh;
    max-width:1200px;
    min-width: 1000px;
}

.el-input{
    width:75%;
}

.content .el-button{
    width:23%;
    float:right;
}

>>>.el-radio-group label{
    outline:none !important;
    box-shadow: unset !important;
}

.left, .right{
    height:56vh;
    width:calc(50% - 23px);
    padding-left: 10px;
    padding-right: 10px;
}

.left{
    float:left;
}

.right{
    float:right;
}

.search_input{
    width:96%;
    margin:0 auto;
}

.user_part{
    border:solid 1px hsl(0, 0%, 75%);
    border-radius: 5px;
    height: calc(56vh - 88px);
    width:96%;
    margin: 0 auto;
    overflow-x:hidden;
    overflow-y: overlay;
}

.shared_part{
    border:solid 1px hsl(0, 0%, 75%);
    border-radius: 5px;
    height: 56vh;
    width:100%;
    margin: 0 auto;
    overflow-x:hidden;
    overflow-y: overlay;
}

.ac{
    position: absolute;
    width:calc(46% - 34px);
}

@media (max-width: 1200px){
    
}
</style>