<template>
    <div class="chatting_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            :close-on-click-modal="false"
            width="800px"
            @close="close"
            @change_title="change_title">
            <h2>{{title}}</h2>
            <chatting-room ref="chatting_room"></chatting-room>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title:'',
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
                $(".dialog").scrollTop($(".dialog")[0].scrollHeight);
            }, 0);
        },

        close(){
            this.$refs.chatting_room.close();
            this.dia_vis = false;
        },

        change_title(title){
            this.title = title;
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
    left: 20px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
    width:700px;
}
</style>