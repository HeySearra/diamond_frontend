<template>
    <div class="chatting_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            :close-on-click-modal="false"
            width="830px"
            fullscreen
            :modal="false"
            :show-close="false">
            <div style="height:6vh"></div>
            <chatting-room ref="chatting_room" @close="close"></chatting-room>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dia_vis:false
        }
    },

    methods:{
        open(uid){
            $('.blur_div').addClass('blur_style');
            this.init_info(uid);
        },

        init_info(uid){
            this.dia_vis = true;
            var that = this;
            setTimeout(function(){
                that.$refs.chatting_room.open(uid);
                $(".el-dialog").scrollTop($(".el-dialog")[0].scrollHeight);
            }, 0);
        },

        close(){
            $('.blur_div').removeClass('blur_style');
            this.dia_vis = false;
        }
    }
}
</script>

<style scoped>
@import url("../assets/common.css");
.chatting_dialog>>>.el-dialog{
    overflow:hidden !important;
}

h2{
    position: absolute;
    top: 0;
    left: 27px;
    width:700px;
}

.chatting_room{
    margin:0 auto;
}

>>>.el-dialog{
    background-color: hsla(0, 0%, 0%, 0.06) !important;        
}
</style>