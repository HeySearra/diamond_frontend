<template>
    <div class="chatting_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            width="fit-content">
            <chatting-room></chatting-room>
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
        open(){
            this.dia_vis = true;
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");

</style>