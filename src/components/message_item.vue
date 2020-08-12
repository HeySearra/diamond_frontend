<template>
    <div class="message-item" @click="mark_read">
        <div class="item">
            <div class="profile">
                <span v-if="type!='comment'" class="icon iconfont">&#xe622;</span>
                <el-avatar v-if="type=='comment'" :src="img" size="big" style="vertical-align: middle;"></el-avatar>
            </div>
            <div class="content">
                <h4 class="title">
                    <div class="content">{{content}}</div>
                    <div class="message-head" v-if="type=='comment'" @click="to_doc">{{title}}</div>
                    <div class="message-head" v-if="type=='join'" @click="confirm_join">{{team_name}}</div>
                    <div class="message-head" v-if="type=='admin' || type=='remove'" @click="type=='admin'? 'to_team':''">{{team_name}}</div>
                </h4>
                <div class='comment'>{{comment}}</div>
            </div>
        </div>
        <div class="not-read" v-if="!is_read"></div>
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
            type:Number,
            default:0
        },
        is_read:{
            type:Boolean,
            default:false
        },
    },
    data () {
        return {
            content: '我是前缀', //前缀
            did: 0, //文档id
            title: '我是文档标题 我是文档标题我是文档标题我是文档标题我是文档标题', //文档标题
            comment: '321凤凰发灰黑服啊和附件和佛教咖啡机能让肌肤发基坑俊娥既然你3', //评论
            tid: 0,
            team_name: '我是团队名',
            muid:0, //发表评论的uid
            name:0, //发表评论的人
            img:'',
            loading: true,
            is_read: false,
            if_click: true,
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        init(){

        }
    }
}
</script>
<style scoped>
.message-item{
    position: relative;
    padding: 5px 0;
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
    margin: 0 0 0 0;
}
.content{
    display: flex;
    flex-direction: column;
    margin-right: 4px;
    width:auto;
    word-break:keep-all;
    white-space:nowrap
}
.message-head{
    display:inline-block;
    width: auto;
    max-width: 300px;
    min-width: 180px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.title{
    display: inline-flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width:fit-content;
    width:-webkit-fit-content;
    width:-moz-fit-content;
    margin: 10px 0px;
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
    font-size: 95%;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    flex-grow:0;
    flex-shrink:0;

}
</style>