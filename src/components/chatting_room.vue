<template>
    <div class="chatting_room">
        <div class="user_list"></div>
        <div class="chatting_area">
            <div class="bubble_window">
                <chatting-bubble></chatting-bubble>
                <chatting-bubble type="other"></chatting-bubble>
                <chatting-bubble></chatting-bubble>
                <chatting-bubble></chatting-bubble>
                <chatting-bubble></chatting-bubble>
                <chatting-bubble type="other"></chatting-bubble>
                <chatting-bubble></chatting-bubble>
                <chatting-bubble></chatting-bubble>
                <chatting-bubble></chatting-bubble>
                <chatting-bubble></chatting-bubble>
                <chatting-bubble text="花，不是一种植物"></chatting-bubble>
                <chatting-bubble type="other" text="气抖冷"></chatting-bubble>
            </div>
            <div class="input_area">
                <textarea style="resize:none" v-model="text"></textarea>
            </div>
            <div class="button_area">
                <el-button type="primary" plain :disabled="!text">发送</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                text:''
            }
        },

    }
</script>

<style scoped>
    @import url("../assets/common.css");

    .chatting_room{
        position: relative;
        width:750px;
        height:600px;
        /* border:1px solid #ccc; */
    }

    .user_list{
        position: absolute;
        top:0;
        left:0;
        height:100%;
        width:200px;
        overflow-y:auto;
        border:1px solid #ccc;
        border-right:unset;
    }

    .chatting_area{
        position: absolute;
        top:0;
        left:200px;
        height:100%;
        width: calc(100% - 200px);
        border:1px solid #ccc;
    }

    .bubble_window{
        position: absolute;
        top:0;
        left:0;
        height:430px;
        width: calc(100% - 20px);
        overflow-y:auto;
        padding:20px 10px;
    }

    .input_area{
        position: absolute;
        top:469px;
        left:0;
        height:calc(100% - 470px);
        width: 100%;
        border-top:1px solid #ccc;
        border-bottom:1px solid #ccc;
        overflow: hidden;
    }

    textarea{
        font-size:16px;
        line-height:23px;
        padding: 10px 20px;
        width:calc(100% - 20px);
        height:calc(100% - 20px);
        overflow-y:auto;
        font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif !important;
        color:#343434;
        border:unset;
    }

    textarea:focus{
        outline: none;
    }

    .button_area{
        position: absolute;
        bottom:6px;
        right:36px;
        width: 30px;
    }

    .button_area .el-button{
        padding:6px 15px;
    }

    .cb{
        margin-top:11px;
    }
</style>
