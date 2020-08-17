<template>
    <el-drawer
    title="消息中心"
    :visible.sync="drawer"
    :with-header="false"
    class="message_box">
        <div class="el-drawer__header" style="height:50px;padding:5px 20px 0;line-height:50px;margin:0">
            <div class="el-drawer__title can_not_choose">消息中心</div>
            <transition name="el-fade-in-linear">
                <div class="mark-read can_not_choose" @click="mark_all_read" v-show="unread_count" v-ripple>标记全部已读</div>
            </transition>
            <!-- <div class="close-icon"><span v-if="type!='comment'" class="icon iconfont">&#xe79b;</span></div> -->
        </div>
        <el-divider></el-divider>
        <div v-infinite-scroll="load" class="message_area" style="overflow-x:hidden;overflow-y:auto;height:calc(100vh - 50px)">
            <message-item
                v-for="item in list"
                :key="item.mid"
                :mid="item.mid"
                ref="message_item"
                @confirm-to-join="deal_team_invite"
                @refresh_count="refresh_count"
                @close="close"
                v-ripple>
            </message-item>
            <transition name="el-fade-in-linear">
                <p v-show="is_loading" class="not_found">加载中 <i class="el-icon-loading"></i></p>
            </transition>
            <p v-if="is_final&&list.length==0" class="not_found">你没有收到任何消息</p>
        </div>

    </el-drawer>
</template>

<script>
export default {
    data(){
        return {
            drawer: false,
            page: 0,
            each: 15,
            amount: 0,
            list: [],
            is_loading:false,
            is_final: false,
            unread_count:0
        }
    },
    props: {
    },
    mounted(){
        //this.init();
    },
    methods:{
        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },

        apply_for_info(){
            var that = this;
            this.apply_for_message();
            if(this.is_final){
                return;
            }
            that.page++;
            $.ajax({
                type:'get',
                url:"/msg/list?page=" + that.page + "&each=" + that.each,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                async: false,
                success:function (res){
                    if(that.console_debug){
                        console.log("(get)/msg/list/"+ " : " +res.status);
                    }
                    if(res.status == 0){
                        that.amount = res.amount;
                        let len = that.list.length;
                        for(let i = 0; i < res.list.length; i++){
                            that.list.push(res.list[i]);
                        }
                        if(that.list.length >= res.amount){
                            that.is_final = true;
                        }
                        if(that.list.length){
                            setTimeout(() => {
                                let item = that.$refs.message_item;
                                if(item){
                                    if(item instanceof Array){
                                        for(let i = len; i<item.length; i++){
                                            item[i].init();
                                        }
                                    }
                                    else{
                                        item.init();
                                    }
                                }
                            }, 0);

                        }
                    }
                    else{
                        that.page--;
                        that.alert_msg.error('加载消息失败，请重试');
                        that.is_final = true;
                        that.drawer = false;
                    }
                },
                error:function(){
                    that.page--;
                    that.alert_msg.error('连接失败');
                    that.is_final = true;
                    that.drawer = false;
                }
            });
        },

        apply_for_message(){
            let url = '/msg/unread_count';
            var that = this;
            $.ajax({
                type:'get',
                url:url,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                async: false,
                success:function (res){
                    if(that.console_debug){
                        console.log(url + '：' + res.status);
                    }
                    if(res.status == 0){
                        that.unread_count = res.count;
                    }
                    else{
                        that.unread_count = 0;
                    }
                },
                error:function(){
                    that.unread_count = 0;
                }
            });
        },

        open() {
            this.list = [];
            this.is_loading = false;
            this.is_final = false;
            this.page = 0;
            this.apply_for_info();
            this.drawer = true;
        },

        load(){
            if(this.is_final){
                return;
            }
            var that = this;
            setTimeout(function(){
                that.apply_for_info();
            })
        },

        mark_all_read(){
            var that = this;
            $.ajax({
                type:'post',
                url:"/msg/ar_all",
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                async:false,
                success:function (res){
                    if(that.console_debug){
                        console.log("(get)/msg/ar_all"+ " : " +res.status);
                    }
                    if(res.status == 0){
                        let item = that.$refs.message_item;
                        if(item){
                            setTimeout(function(){
                                for(let i=0; i<item.length; i++){
                                    item[i].init();
                                }
                            }, 0);
                        }
                        that.unread_count = 0;
                        that.apply_for_message();
                        that.alert_msg.success('已全部标记为已读');
                        that.$emit('refresh_message_count');
                    }
                    else{
                        that.alert_msg.error('获取消息失败，请重试');
                    }
                },
                error:function(){
                    that.alert_msg.error('连接失败');
                }
            });
        },

        deal_team_invite(data){
            this.$emit("deal-team-invite", data);
        },

        refresh_count(){
            this.$emit('refresh_message_count');
        },

        refresh(){
            this.open();
        },

        close(){
            this.drawer = false;
        }
    }
};
</script>

<style scoped>
    /* >>>.el-drawer__body{
        width: 600px;
        min-width: 300px !important;
    }
    >>>.el-drawer{
        width: 600px;
        min-width: 300px !important;
    }
    >>>.el-drawer__header{
        border: 0;
        padding: 0;
        margin: 0;
    }
    >>>.el-drawer__title{
        margin: 15px 15px;
        border: 2px;
        cursor: default;
    }
    /* .close-icon{
        padding: 0 10px 0 0;
        border: 2px;
        vertical-align: top;
    } */
    .mark-read{
        font-size: 90%;
        float: right;
        padding: 0 15px;
        cursor: pointer;
    }
    .mark-read:hover{
        color: hsl(219, 15%, 23%);
    } */

    .el-drawer__body>>>.message_area{
        height:calc(100vh - 50px) !important;
    }

    .el-divider{
        margin: 5px 0 0 0;
    }

    .message_box>>>.el-drawer__open .el-drawer.rtl{
        /* width:430px !important; */
    }

    >>>.el-drawer:focus{
        outline: none !important;
    }
</style>
