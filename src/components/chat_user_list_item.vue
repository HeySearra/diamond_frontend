<template>
    <div class="chat_user_list_item can_not_choose" :class="chosen?'chat_user_list_item_chosen':''" @click="click">
        <el-avatar size="large" :src="src" :key="src"></el-avatar>
        <h3 class="name">{{name}}</h3>
        <div class="content">{{content}}</div>
    </div>
</template>

<script>
export default {
    name: 'chat-user-list-item',
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


.chat_user_list_item{
    border-bottom: solid 1px #ccc;
    height: 5.5em;
    width:100%;
    position: relative;
    cursor: pointer;
    transition: background-color 0.1s linear;
}

.chat_user_list_item:hover, .chat_user_list_item_chosen{
    background-color: hsl(0, 0%, 87%);
}

.el-avatar{
    position: absolute;
    top:15px;
    left:15px;
    width:50px;
    height:50px;
}

.name{
    position: absolute;
    top:18px;
    left:78px;
    margin:0;
    width: 125px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
    font-size:18px;
    color:#555;
}

.content{
    position: absolute;
    top:43px;
    left:78px;
    width: 124px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
    font-size:15px;
    color:hsl(0, 0%, 56%);
}
</style>
