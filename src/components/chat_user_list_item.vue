<template>
    <div class="chat_user_list_item can_not_choose" :class="chosen?'chat_user_list_item_chosen':''" @click="click">
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
            chosen:false,
            show:false
        }
    },
    methods:{
        click(){
            this.$emit('click', this.uid);
        },

        choose(uid){
            if(this.uid == uid){
                this.chosen = true;
            }
            else{
                this.chosen = false;
            }
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

.chat_user_list_item:hover, .chat_user_list_item_chosen{
    background-color: hsl(0, 0%, 96%);
}

.el-avatar{
    position: absolute;
    top:10px;
    left:10px;
}

.name{
    position: absolute;
    top:11px;
    left:60px;
    margin:0;
    width: 125px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
    font-size:15px;
    color:#555;
}

.content{
    position: absolute;
    top:34px;
    left:61px;
    width: 124px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
    font-size:12px;
    color:#565656;
}
</style>
