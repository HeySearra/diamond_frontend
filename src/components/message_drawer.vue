<template>
    <el-drawer
    title="消息中心"
    width="100"
    :visible.sync="drawer"
    :with-header="false"
    class="message_box">
        <div class="el-drawer__header" style="height:50px;padding:5px 20px 0;line-height:50px;margin:0">
            <div class="el-drawer__title can_not_choose">消息中心</div>
            <div class="mark-read can_not_choose" @click="mark_all_read">全部已读</div>
            <!-- <div class="close-icon"><span v-if="type!='comment'" class="icon iconfont">&#xe79b;</span></div> -->
        </div>
        <el-divider></el-divider>
        <div v-infinite-scroll="load" class="message_area" style="overflow-x:hidden;overflow-y:auto;border:solid 1px;height:calc(100vh - 50px)">
            <component v-for="item in list" :key="item.mid" :mid="item.mid" ref="message_item" @confirm_to_join="deal_team_invite" :is="'message-item'"></component>
            <p v-if="is_loading" class="not_found">加载中 <i class="el-icon-loading"></i></p>
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
                        let item = that.$refs.message_item;
                        if(item){
                            setTimeout(() => {
                                if(item instanceof Array){
                                    for(let i = len; i<item.length; i++){
                                        item[i].init();
                                    }
                                }
                                else{
                                    item.init();
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
        open() {
            this.list = [];
            this.is_loading = false;
            this.is_final = false;
            this.drawer = true;
            this.page = 0;
            this.apply_for_info();
        },

        load(){this
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
                processData: false,
                contentType: false,
                success:function (res){
                    if(that.console_debug){
                        console.log("(get)/msg/ar_all"+ " : " +res.status);
                    }
                    if(res.status == 0){
                        let item = that.$refs.message_item;
                        if(item){
                            setTimeout(function(){
                                item[i].init();
                            }, 0);
                        }
                        that.alert_msg.success('已全部标记为已读');
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
            this.$emit("deal_team_invite", data);
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
        border: 2px;
        float: right;
        margin: 0 15px;
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
        width:430px !important;
    }
</style>
