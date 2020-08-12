<template>
    <div class="choose_path_fold_list_item">
        <div class="big_icon">
            <div>
                <span class="icon iconfont">&#xe7ed;</span>
            </div>
        </div>
        <div class="link_icon" v-if="is_link">
            <span class="icon iconfont">&#xe60c;</span>
        </div>
        <div class="starred_icon" v-if="is_starred">
            <span class="icon iconfont">&#xe7b2;</span>
        </div>
        <div class="name">{{name}}</div>
    </div>
</template>

<script>
export default {
    props: {
        fid: {
            type:String,
            default: 'fid'
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
    },

    data() {
        return {
            
        }
    },

    methods:{
        click(){
            this.$emit('open_fold', this.fid);
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/diadoc_icon.css");

.choose_path_fold_list_item{
    border:solid 1px;
    height: 50px;
    position: relative;
    cursor:pointer;
}

.choose_path_fold_list_item:hover{
    background-color: #ccc;
}

.big_icon{
    position: absolute;
    top:0;
    left:23px;
    text-align: center;
    line-height:50px;
    width:fit-content;
    color:hsl(219, 15%, 23%);
}

.big_icon .icon{
    font-size:27px;
}

.link_icon{
    position: absolute;
    top:23px;
    left:36px;
    color:hsl(202, 38%, 39%);
    font-weight: bold;
    border: solid 1px;
    width:18px;
    height:18px;
    line-height:17px;
    text-align: center;
    border-radius: 50%;
    background-color: #fafafa;
}

.link_icon .icon, .starred_icon .icon{
    font-size:12px;
}

.starred_icon{
    position: absolute;
    top:27px;
    left:40px;
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
    left:69px;
    word-break: break-all;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
}

@media (max-width: 1200px){
    
}
</style>