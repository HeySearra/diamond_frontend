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
                            <el-button type="primary" style="width:18%;float:right" @click="inviate">添 加</el-button>
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
                            <div class="not_found ac" v-show="!shared_list.length">用户得到分享后会显示在此</div>
                        </transition>
                        <user-list-item 
                            type="shared" 
                            ref="shared_item"
                            v-for="item in shared_list" 
                            :name="item.name"
                            :key="item.uid" 
                            :uid="item.uid"
                            :account="item.acc"
                            :src="item.src"
                            :op="item.auth"
                            :did="did"
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
            title:'分享给指定用户',
            dia_vis:false,
            search_list: [],
            search_loading:false,
            share_loading:false,
            shared_list:[],
            tid:'',
            did:'',
            search_input: ''
        }
    },

    methods:{
        open(did, tid){
            this.did = did;
            this.tid = tid;
            this.apply_for_team();
            this.apply_for_share_info();
            this.dia_vis = true;
        },

        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },

        apply_for_share_info(){
            this.share_loading = true;
            let url = '/fs/share_dtd_list?did=' + this.did;
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
                        that.shared_list = res.list;
                        setTimeout(function(){
                            let item = that.$refs.shared_item;
                            if(item){
                                for(let i=0; i<item.length; i++){
                                    item[i].init();
                                }
                            }
                            that.share_loading = false;
                        }, 0);
                    }
                    else{
                        switch(res.status){
                            case 2:
                                that.alert_msg.error('权限不足');
                                break;
                            case 3:
                                that.alert_msg.error('找不到文档');
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

        search_user(){
            this.search_loading = true;
            let url = '/search_user';
            var that = this;
            if(this.search_input=='' && this.tid){
                this.apply_for_team();
                return;
            }
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
            this.search_loading = true;
            if(this.tid || this.tid==''){
                return;
            }
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
                        that.search_list = [];
                        that.search_list.push({
                            uid: res.cuid,
                            name: res.cname,
                            src: res.csrc,
                            acc: res.cacc
                        });
                        for(let i=0; i<that.admin.length; i++){
                            that.search_list.push({
                                uid: res.admin[i].uid,
                                name: res.admin[i].name,
                                src: res.admin[i].src,
                                acc: res.admin[i].acc
                            });
                        }
                        for(let i=0; i<that.norm.length; i++){
                            that.search_list.push({
                                uid: res.norm[i].uid,
                                name: res.norm[i].name,
                                src: res.norm[i].src,
                                acc: res.norm[i].acc
                            });
                        }
                    }
                    that.search_loading = false;
                },
                error:function(res){
                    that.search_loading = false;
                }
            });
        },

        inviate(){
            if(this.search_input.trim() == ''){
                this.alert_msg.warning('请输入用户账号');
                return;
            }
            let url = '/fs/share_dtd_change';
            var that = this;
            $.ajax({ 
                type:'post',
                url: url,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                data: JSON.stringify({did:this.did, acc:this.search_input, auth:'read', is_new:true}),
                async:false, 
                success:function (res){ 
                    if(that.console_debug){
                        console.log(url +  '：' + res.status);
                    }
                    if(res.status == 0){
                        that.shared_list.push({
                            name: res.user_info.name,
                            uid: res.user_info.uid,
                            src: res.user_info.src,
                            acc: that.search_input,
                            type: 'read'
                        });
                        that.search_input = '';
                        that.alert_msg.success('添加成功');
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
                                that.alert_msg.normal('你不需要添加'+(that.tid?'团队创建者或':'')+'你自己');
                                break;
                            case 6:
                                that.alert_msg.normal('Ta 已经在分享列表中了');
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
            this.apply_for_share_info();
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
    width:496px;
}

@media (max-width: 1200px){
    
}
</style>