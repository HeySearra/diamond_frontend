<template>
    <div class="chatting_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            :close-on-click-modal="false"
            width="800px"
            @close="close">
            <chatting-room ref="chatting_room"></chatting-room>
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
            this.init_info(uid);
        },

        init_info(uid){
            this.dia_vis = true;
            var that = this;
            setTimeout(function(){
                that.$refs.chatting_room.open(uid);
            }, 0);
        },

        close(){
            this.$refs.chatting_room.close();
            this.dia_vis = false;
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");

</style>