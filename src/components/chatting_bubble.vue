<template>
    <div style="position:relative" class="cb">
        <div class="ava" :class="type=='my'?'my_ava':'other_ava'">
            <el-avatar :src="src" :key="src"></el-avatar>
        </div>
        <div class="chatting_bubble" :class="type=='my'?'my':'other'">
            {{text}}
        </div>
        <div class="clear_both"></div>
    </div>
</template>
<script>
    export default {
        name: 'chatting-bubble',

        props:{
            type:{
                type:String,
                default:'my' // 'my', 'other'
            },
            src:{
                type:String,
                default:'' // 'my', 'other'
            },
            text:{
                type:String,
                default:'草，是一种植物' // 'my', 'other'
            }
        },

        data() {
            return {
                show:false,

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
    @import url("../assets/common.css");
    

    .chatting_bubble{
        /* border:solid 1px; */
    }

    .chatting_bubble{
        position: relative;
        top:3px;
        line-height:25px;
        padding: 6px 15px;
        width:fit-content;
        border-radius: 11px;
        max-width:69%;
        word-break: break-all;
    }

    .chatting_bubble:before{
        position: absolute;
        content: "";
        width: 0;
        height: 0;
        right: calc(100% - 10px);
        top: 6px;
        border-top: 12px solid transparent;
        border-bottom: 12px solid transparent;
    }

    .ava{
        position: absolute;
    }

    .my_ava{
        top:0px;
        right:0;
    }

    .other_ava{
        top:0px;
        left:0;
    }

    .my{
        float:right;
        right:69px;
        background: #586378;
        color:white;
    }

    .my:before{
        left:calc(100% - 12px);
        border-left: 24px solid #586378;
    }

    .other{
        float:left;
        left:69px;
        background: #ddd;
        color:#333;
    }

    .other:before{
        border-right: 21px solid #ddd;
    }
</style>
