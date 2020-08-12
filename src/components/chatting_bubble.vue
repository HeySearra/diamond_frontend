<template>
    <div style="position:relative" class="cb">
        <div class="ava" :class="type=='my'?'my_ava':'other_ava'">
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        </div>
        <div class="chatting_bubble" :class="type=='my'?'my':'other'">
            {{text}}
        </div>
        <div class="clear_both"></div>
    </div>
</template>
<script>
    export default {
        props:{
            type:{
                type:String,
                default:'my' // 'my', 'other'
            },
            src:{
                type:String,
                default:'/' // 'my', 'other'
            },
            text:{
                type:String,
                default:'草，是一种植物' // 'my', 'other'
            }
        },

        data() {
            return {

            }
        },

    }
</script>

<style scoped>
    @import url("../assets/common.css");

    .chatting_bubble{
        border:solid 1px;
    }

    .chatting_bubble{
        position: relative;
        top:3px;
        line-height:25px;
        padding: 10px 20px;
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
        right: 100%;
        top: 11px;
        border-top: 12px solid transparent;
        border-bottom: 12px solid transparent;
    }

    .ava{
        position: absolute;
    }

    .my_ava{
        top:5px;
        right:0;
    }

    .other_ava{
        top:5px;
        left:0;
    }

    .my{
        float:right;
        right:75px;
        background: #586378;
        color:white;
    }

    .my:before{
        left:100%;
        border-left: 24px solid #586378;
    }

    .other{
        float:left;
        left:75px;
        background: #eee;
        color:#586378;
    }

    .other:before{
        border-right: 24px solid #eee;
    }
</style>
