<template>
    <transition name="el-zoom-in-top">
        <div 
            v-show="show" 
            class="user_list_item can_not_choose" 
            :class="show?'hover_color':''" 
            v-ripple
            @click="click_account">
            <div style="height:56px;">
                <div style="display: inline-block;margin:8px 20px;float:left">
                    <el-avatar :src="src"></el-avatar>
                </div>
                <div style="display: inline-block;float:left;width:150px" class="no_display" :style="type=='shared'?'width: calc(63% - 150px);':''">
                    <div class="content">
                        {{name}}
                    </div>
                </div>
                <div style="display: inline-block;float:left;width:200px;color:#aaa" v-if="type=='admin'||type=='search'">
                    <div class="content">
                        {{account}}
                    </div>
                </div>
                <div style="display: inline-block;float:right;width:150px;color:#aaa; margin-right:70px" v-if="type=='shared'">
                    <div class="content">
                        <el-select v-model="shared_auth" placeholder="请选择权限" @change="change_shared_auth">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div style="position:absolute; right:36px" class="cancel_icon" v-if="type=='admin'||type=='shared'" @click="remove">
                    <span class="icon iconfont">&#xe79b;</span>
                </div>
            </div>
            <el-divider></el-divider>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'user-list-item',

    props: {
        uid: {
            type:String,
            default: 'uid'
        },
        name: {
            type:String,
            default: 'name'
        },
        account:{
            type:String,
            default: 'account'
        },
        src:{
            type:String,
            default: 'src'
        },
        type:{
            type:String,
            default: 'admin' // 'admin', 'search' or 'shared'
        },
        op:{
            type:String,
            default: 'read' // 'read', 'comment', 'write'
        },
        did:{
            type:String,
            default: ''
        }
    },

    data() {
        return {
            dia_vis:true,
            show:false,
            options: [
                {
                    value: 'read',
                    label: '只允许阅读',
                },
                {
                    value: 'comment',
                    label: '允许阅读和评论',
                },
                {
                    value: 'write',
                    label: '可以进行编辑',
                }
            ],
            shared_auth:''
        }
    },

    mounted(){
        this.init();
    },

    methods:{
        init(){
            this.show = true;
            this.shared_auth = this.op;
        },

        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },

        remove(){
            if(this.type == 'admin'){
                this.remove_admin();
            }
            else if(this.type == 'shared'){
                this.change_shared_auth('no_share');
            }
        },

        remove_admin(){
            this.show = false;
            var that = this;
            setTimeout(function(){
                that.$emit('remove_admin', that.uid);
            }, 100);    
        },

        click_account(){
            this.$emit('click_account', this.account);
        },

        change_shared_auth(type){
            if(type == ''){
                return;
            }
            let url = '/fs/share_dtd_change';
            var that = this;
            $.ajax({ 
                type:'post',
                url: url,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                data: JSON.stringify({acc:this.account, did:this.did, auth:type, is_new:false}),
                async:false, 
                success:function (res){ 
                    if(that.console_debug){
                        console.log(url +  '：' + res.status);
                    }
                    if(res.status == 0){
                        if(type == 'no_share'){
                            that.show = false;
                            setTimeout(function(){
                                that.$emit('refresh');
                            }, 100);
                            that.alert_msg.success('移除成功');
                        }
                        else{
                            that.alert_msg.success('修改成功');
                        }
                    }
                    else{
                        switch(that.status){
                            case 3:
                                that.alert_msg.error('找不到文档');
                                break;
                            case 4:
                                that.alert_msg.error('系统不认识这个人');
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
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");


.user_list_item{
    width:100%;
    height:56px;
    line-height:56px;
    cursor:pointer;
    position: relative;
    transition:all 0.1s linear;
}

.hover_color:hover{
    background-color: #f6f6f6;
}

.content{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
    padding:0 !important;
}

.el-divider{
    margin:0;
}

.el-avatar{
    display:block;
}

.cancel_icon{
    opacity: 0;
    color:#999;
    transition:all 0.1s linear;
}

.cancel_icon span{
    font-size: 21px;
}

.user_list_item:hover .cancel_icon{
    opacity: 1;
}

@media (max-width: 1130px){
    .no_display{
        display:none !important;
    }
}
</style>