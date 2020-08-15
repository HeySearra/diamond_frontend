<template>
    <transition name="el-zoom-in-top">
        <div 
            v-show="show" 
            class="user_list_item can_not_choose" 
            :class="show?'hover_color':''" 
            v-ripple
            @click="click_account">
            <div style="height:56px;">
                <div style="display: inline-block;margin:8px 20px;float:left">
                    <el-avatar :src="src"></el-avatar>
                </div>
                <div style="display: inline-block;float:left;width:150px">
                    <div class="content">
                        {{name}}
                    </div>
                </div>
                <div style="display: inline-block;float:left;width:200px;color:#aaa">
                    <div class="content">
                        {{account}}
                    </div>
                </div>
                <div style="position:absolute; right:36px" class="cancel_icon" v-if="type=='admin'" @click="remove_admin">
                    <span class="icon iconfont">&#xe79b;</span>
                </div>
            </div>
            <el-divider></el-divider>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        uid: {
            type:String,
            default: 'uid'
        },
        name: {
            type:String,
            default: 'name'
        },
        account:{
            type:String,
            default: 'account'
        },
        src:{
            type:String,
            default: 'src'
        },
        type:{
            type:String,
            default: 'admin' // 'admin' or 'search'
        }
    },

    data() {
        return {
            dia_vis:true,
            show:false
        }
    },

    mounted(){
        this.show = true;
    },

    methods:{
        remove_admin(){
            this.show = false;
            var that = this;
            setTimeout(function(){
                that.$emit('remove_admin', that.uid);
            }, 100);    
        },

        click_account(){
            this.$emit('click_account', this.account);
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/diadoc_icon.css");

.user_list_item{
    width:100%;
    height:56px;
    line-height:56px;
    cursor:pointer;
    position: relative;
    transition:all 0.1s linear;
}

.hover_color:hover{
    background-color: #f6f6f6;
}

.content{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
    padding:0 !important;
}

.el-divider{
    margin:0;
}

.el-avatar{
    display:block;
}

.cancel_icon{
    opacity: 0;
    color:#999;
    transition:all 0.1s linear;
}

.cancel_icon span{
    font-size: 21px;
}

.user_list_item:hover .cancel_icon{
    opacity: 1;
}

@media (max-width: 1200px){
    
}
</style>