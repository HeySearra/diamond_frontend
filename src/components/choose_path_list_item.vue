<template>
    <div class="choose_path_list_item can_not_choose" @click="click">
        <div class="big_icon">
            <div>
                <span class="icon iconfont fold" v-if="type=='fold'">&#xe622;</span>
            </div>
            <div>
                <span class="icon iconfont fold" v-if="type=='fold_root'">&#xe635;</span>
            </div>
            <div>
                <span class="icon iconfont team" v-if="type=='team'">&#xe6cb;</span>
            </div>
            <div>
                <span class="icon iconfont file" v-if="type=='file'||type=='doc'">&#xe645;</span>
            </div>
        </div>
        <div class="link_icon" v-if="is_link">
            <span class="icon iconfont">&#xe60c;</span>
        </div>
        <div class="starred_icon" v-if="is_starred&&!is_link">
            <span class="icon iconfont">&#xe7b2;</span>
        </div>
        <div class="name" :style="gray?'color:#aaa':''">{{name}}</div>
    </div>
</template>

<script>
export default {
    name: 'choose-path-list-item',

    props: {
        id: {
            type:String,
            default: 'id'
        },
        name: {
            type:String,
            default: 'name'
        },
        is_link: {
            type:Boolean,
            default: false
        },
        is_starred:{
            type:Boolean,
            default:false
        },
        gray:{
            type:Boolean,
            default:false
        },
        type:{
            type:String,
            default:'fold'
        }
    },

    data() {
        return {
            
        }
    },

    methods:{
        click(){
            if(this.type=='file' || this.type=='doc'){
                return;
            }
            else{
                this.$emit('open', this.id);
            }
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");


.choose_path_list_item{
    border-bottom: solid 1px rgba(0, 0, 0, 0.1);
    height: 50px;
    position: relative;
    cursor:pointer;
    transition: all 0.1s linear;
}

.choose_path_list_item:hover{
    background-color: hsla(0, 0%, 0%, 0.05);
}

.big_icon{
    position: absolute;
    top:0;
    left:23px;
    text-align: center;
    line-height:50px;
    width:fit-content;
}

.file{
    color:hsl(198, 10%, 69%);
    font-size:26px;
    margin-left:2px;
}

.fold{
    color:hsl(198, 56%, 56%);
    font-size:27px;
}

.team{
    color:hsl(198, 15%, 56%);
    font-size:30px;
}

.link_icon{
    position: absolute;
    top:25px;
    left:40px;
    color:hsl(202, 38%, 39%);
    font-weight: bold;
    border: solid 1px;
    width:18px;
    height:18px;
    line-height:17px;
    text-align: center;
    border-radius: 50%;
    background-color: hsl(0, 0%, 98%, 0.78);
}

.link_icon .icon{
    font-size:12px;
}

.starred_icon .icon{
    font-size:13px;
}

.starred_icon{
    position: absolute;
    top:27px;
    left:42px;
    color:hsl(51, 100%, 50%);
    font-weight: bold;
    width:18px;
    height:18px;
    line-height:15px;
    text-align: center;
}

.name{
    position: absolute;
    width:83%;
    line-height:50px;
    height:50px;
    top:0;
    left:75px;
    word-break: break-all;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
}

@media (max-width: 1200px){
    
}
</style>