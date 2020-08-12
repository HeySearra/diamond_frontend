<template>
    <div class="message-item" @click="mark_read">
        <div style="height:10px;"></div>
        <div class="item">
            <div class="profile">
                <span v-if="type!='comment'" class="icon iconfont">&#xe622;</span>
                <el-avatar v-if="type=='comment'" :src="img" style="vertical-align: middle;"></el-avatar>
            </div>
            <div class="content">
                <h4 class="title">
                    <div class="message-head" v-if="type=='comment'" @click="to_doc">{{title}}</div>
                    <div class="message-head" v-if="type=='join'" @click="confirm_join">{{team_name}}</div>
                    <div class="message-head" v-if="type=='admin' || type=='remove'" @click="type=='admin'? 'to_team':''">{{team_name}}</div>
                </h4>
                <div class='comment'>{{comment}}</div>
            </div>
        </div>
        <div class="not-read" v-if="!is_read"></div>
        <div class="clear_both"></div>
        <div style="height:25px;"></div>
        <el-divider></el-divider>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            // comment join admin remove member
            type:String,
            default: 'comment'
        },
        mid:{
            type:String,
            default:'mid'
        },
        is_read:{
            type:Boolean,
            default:false
        },
    },
    data () {
        return {
            did: 0, //文档id
            title: '我是文档标题 我是文档标题我是文档标题我是文档标题我是文档标题', //文档标题
            comment: '321凤凰发灰黑服啊和附件和佛教咖啡机能让肌肤发基坑俊娥既然你3', //评论
            tid: 0,
            muid:0, //发表评论的uid
            name:0, //发表评论的人
            img:'',
            loading: true,

        }
    },
    mounted(){
        this.init();
    },
    methods:{
        init(){

        },
        to_doc(){

        },
        confirm_join(){

        },
        to_team(){

        },
        mark_read(){
            this.is_read = true;
        },
    }
}
</script>
<style scoped>
.message-item{
    position: relative;
    padding: 0;
    cursor:pointer;
    width:100%;
}

.message-item:hover{
    background-color: #ccc;
}

.el-divider{
    margin: 0;
}
.item{
    display:flex;
    flex-direction: row;
    flex-wrap: nowrap;
}
.profile{
    justify-content: flex-start;
    position: relative;
    padding: 10px;
    width: 40px;
    margin: 0;
}

.title{
    margin:15px 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
    width:330px;
}
.not-read{
    width:100%;
    height:100%;
    background-color: rgb(77, 176, 221);
    position: absolute;
    top:0;
    left:0;
    opacity: 0.2;
}
.comment{
    font-size: 14px;
    word-break:break-all;
    width:320px;

}
</style>