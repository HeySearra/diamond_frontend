<template>
    <el-drawer
    title="消息中心"
    :visible.sync="drawer"
    :with-header="false">
        <div class="el-drawer__header">
            <div class="el-drawer__title">消息中心</div>
            <div class="mark-read">全部已读</div>
            <!-- <div class="close-icon"><span v-if="type!='comment'" class="icon iconfont">&#xe79b;</span></div> -->
        </div>
        <message-item></message-item>
        <message-item></message-item>
        <message-item :is_read=true></message-item>
        <message-item :is_read=true></message-item>
        <!-- <el-table :data="gridData">
        <el-table-column property="date" label="日期" width="150"></el-table-column>
        <el-table-column property="name" label="姓名" width="200"></el-table-column>
        <el-table-column property="address" label="地址"></el-table-column>
        </el-table> -->
    </el-drawer>
</template>

<script>
export default {
    data(){
        return {
            drawer: false,
            page: 0,
            each: 10,
            amount: 0,
            list: [],
        }
    },
    props: {
    },
    mounted(){
    },
    methods:{
        init(){
            var that = this;
            that.loading = true;
            that.page++;
            $.ajax({
                type:'get',
                url:"/msg/list?page="+that.page+"&each=10",
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                processData: false,
                contentType: false,
                success:function (res){
                    that.page += 1;
                    if(that.type=='search' && args && args.length){
                        res.title = that.checkData(res.title);
                        res.simple_content = that.checkData(res.simple_content);
                        for(let i=0; i<args.length; i++){
                            args[i] = that.checkData(args[i]);
                            let reg = new RegExp(args[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'ig');
                            res.title = res.title.replace(reg, function(word){
                                return '<hl>'+word+'</hl>';
                            });
                            res.simple_content = res.simple_content.replace(reg, function(word){
                                return '<hl>'+word+'</hl>';
                            });
                        }
                    }
                    that.title = res.title;
                    that.tag = res.tag;
                    that.intro = res.simple_content;
                    that.url = '/article/'+that.aid;
                    that.view = res.views;
                    that.like = res.likes;
                    that.collect = res.stars;
                    that.comment_cnt = res.comments;
                    that.author_p_src = res.author_portrait_url;
                    that.author_name = res.author_name;
                    that.is_member = res.author_is_member;
                    that.auid = res.auid;
                    that.loading = false;
                    that.$emit('done');
                },
                error:function(){
                    that.page--;
                    console.log('连接失败');
                    that.$emit('done');
                }
            });
        },
        open() {
            this.drawer = true;
        },
    }
};
</script>

<style scoped>
    >>>.el-drawer__body{
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
    }
</style>
