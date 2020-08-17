<template>
    <div class="chat_user_list_item" @click="click">
        <el-avatar size="large" :src="src"></el-avatar>
        <h3 class="name">{{name}}</h3>
        <div class="content">{{content}}</div>
    </div>
</template>

<script>
export default {
    props: {
        uid:{
            type:String,
            default:'',
        },
        src:{
            type:String,
            default:''
        },
        name:{
            type:String,
            default:'name'
        },
        content:{
            type:String,
            default:'content'
        }
    },
    data () {
        return {
            
        }
    },
    methods:{
        click(){
            this.$emit('click', this.uid);
        }
    }
}
</script>
<style scoped>
@import url("../assets/diadoc_icon.css");

.chat_user_list_item{
    border-bottom: solid 1px #ddd;
    height: 4.5em;
    width:100%;
    position: relative;
    cursor: pointer;
    transition: background-color 0.1s linear;
}

.chat_user_list_item:hover{
    background-color: #eee;
}

.el-avatar{
    position: absolute;
    top:10px;
    left:10px;
}

.name{
    position: absolute;
    top:10px;
    left:60px;
    margin:0;
    width: 125px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
}

.content{
    position: absolute;
    top:32px;
    left:60px;
    width: 125px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
}
</style>
