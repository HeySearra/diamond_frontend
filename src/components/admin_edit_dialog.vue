<template>
    <div class="admin_edit_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            width="700px">
            <h3>{{title}}</h3>
            <div class="content">
                <div class="member_part">
                    <div class="item" v-for="item in no_admin_list" :key="item.uid" @click="function(){add_admin(item.uid)}">
                        <el-tooltip effect="dark" :content="item.name" placement="top">
                            <div class="member_icon"
                                draggable="true"
                                @dragover.prevent>
                                <el-avatar :src="item.src"></el-avatar>
                            </div>
                        </el-tooltip>
                    </div>
                    <div class="clear_both"></div>
                </div>
                <div style="height:20px"></div>
                <div class="admin_part">
                    <user-list-item 
                        v-for="item in admin_list" 
                        :key="item.uid"
                        :uid="item.uid"
                        :name="item.name"
                        :account="item.acc"
                        :src="item.src"
                        @click="remove_admin(function(){item.uid})">
                    </user-list-item>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dia_vis=false">取 消</el-button>
                <el-button type="primary" @click="dia_vis=false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title:'管理员设置',
            tid:'',
            dia_vis:false,
            no_admin_list: [],
            admin_list: [],
            creator_uid: '',
        }
    },

    methods:{
        open(tid){
            this.tid = tid;
            this.init_info();
        },

        init_info(){
            let url = '/team/info' + this.tid;
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
                        that.no_admin_list = [];
                        that.admin_list = [];
                        that.creator_uid = res.cuid;
                        that.no_admin_list.push({
                            uid:res.cuid,
                            name:res.cname,
                            src:res.csrc,
                            acc:res.cacc,
                        });
                        for(let i=0; i<res.norm.length; i++){
                            that.no_admin_list.push({
                                uid:res.norm[i].cuid,
                                name:res.norm[i].cname,
                                src:res.norm[i].csrc,
                                acc:res.norm[i].cacc,
                            });
                        }
                        this.admin_list = res.admin;
                        that.dia_vis = true;
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

        add_admin(uid){
            if(uid == this.creator_uid){
                this.alert_msg.normal('Ta 已经是管理员了');
                return;
            }

            var nl = [];
            let index;
            for(let i=0; i<this.no_admin_list.length; i++){
                if(this.no_admin_list[i].uid != uid){
                    nl.push(this.no_admin_list[i]);
                }
                else{
                    index = i;
                }
            }

            var al = [];
            al.push(this.no_admin_list[index]);
            for(let i=0; i<this.admin_list.length; i++){
                al.push(this.admin_list[i]);
            }
            this.admin_list = al;
        },

        remove_admin(uid){
            for(let i=0; i<this.admin_list.length; i++){
                if(this.admin_list[i].uid == uid){
                    this.no_admin_list.push(this.admin_list[i]);
                    break;
                }
            }

            var al = [];
            for(let i=0; i<this.admin_list.length; i++){
                if(this.admin_list[i].uid == uid){
                    continue;
                }
                al.push(this.admin_list[i]);
            }
            this.admin_list = al;
        },

        submit(){
            var list = [];
            for(let i=0; i<this.admin_list.length; i++){
                list.push(this.admin_list[i].uid);
            }

            let url = '/team/auth';
            var that = this;
            $.ajax({ 
                type:'post',
                url: url,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                data: JSON.stringify({tid:that.tid, list:list}),
                async:false,
                
                success:function (res){ 
                    if(that.console_debug){
                        console.log(url +  '：' + res.status);
                    }
                    if(res.status == 0){
                        that.alert_msg.success('已修改管理员');
                        that.dia_vis = false;
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
                                that.alert_msg.error('里面有系统不认识的人');
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
@import url("../assets/dialog_style.css");

.member_part{
    border:solid 1px;
}

.member_icon{
    float:left;
    margin:6px 10px 5px;
    cursor:pointer;
}

.member_icon .el-avatar{
    border:solid 1px #000;

}

.admin_part{
    border:solid 1px #000;
    height: 300px;
    width:80%;
    margin: 0 auto;
    overflow: overlay;
}
@media (max-width: 1200px){
    
}
</style>