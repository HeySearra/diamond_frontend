<template>
    <div class="message-block" @click="mark_read">
        <div class="profile" :style="opa01?'filter:blur(5px)':''">
            <i slot="prefix" class=""></i>
            <el-avatar v-if="type=='comment'" :src="img" size="small" style="vertical-align: middle;"></el-avatar>
        </div>
        <h4>
            <div>{{content}}</div>
            <div v-if="type=='comment'" @click="to_doc">{{title}}</div>
            <div v-if="type=='join'" @click="confirm_join">{{team_name}}</div>
            <div v-if="type=='admin' || type=='remove'" @click="type=='admin'? 'to_team':''">{{team_name}}</div>
        </h4>
        <div class='comment'>{{comment}}</div>
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
            url:'/',
            content: '', //前缀
            did: 0, //文档id
            title: '123', //文档标题
            comment: '3213', //评论
            tid: 0,
            team_name: '31',
            muid:0, //发表评论的uid
            name:0, //发表评论的人
            img:'',
            loading: true,
            is_read: false,
            if_click: true,
        }
    },
}
</script>
<style scoped>

</style>