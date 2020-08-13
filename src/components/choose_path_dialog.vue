<template>
    <div class="choose_path_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            width="600px">
            <h3>{{title}}</h3>
            <div class="content">
                <div style="height:10px"></div>
                <div class="item_area">
                    <choose-path-fold-list-item name="..."></choose-path-fold-list-item>
                    <choose-path-fold-list-item is_link></choose-path-fold-list-item>
                    <choose-path-fold-list-item is_starred></choose-path-fold-list-item>
                    <choose-path-fold-list-item></choose-path-fold-list-item>
                    <choose-path-fold-list-item></choose-path-fold-list-item>
                    <choose-path-fold-list-item></choose-path-fold-list-item>
                    <choose-path-fold-list-item></choose-path-fold-list-item>
                    <choose-path-fold-list-item></choose-path-fold-list-item>
                    <choose-path-fold-list-item></choose-path-fold-list-item>
                    <choose-path-fold-list-item></choose-path-fold-list-item>
                    <choose-path-fold-list-item></choose-path-fold-list-item>
                    <div style="height:30px"></div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dia_vis=false">取 消</el-button>
                <el-button type="primary" @click="dia_vis=false">移 动</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title:'移动到',
            id:'',
            type:'file', // 'file', 'fold'
            op_type:'',
            dia_vis:false,
            is_root:false,
            fid:''
        }
    },

    methods:{
        open(fid, type, id, name, op_type){
            this.type = type;
            this.id = id;
            this.fid = fid;
            this.op_type = op_type;
            this.title = (this.op_type=='move'?'移动':'复制') + ' ' + name + ' 到';
            this.dia_vis = true;
        },

        judge_root(){
            let url = '/fs/father?fid=' + this.fid;
            var that = this;
            $.ajax({
                type:'get',
                url: url,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                async:false, 
                success:function (res){
                    if(that.console_debug){
                        console.log(url+ " : " +res.status);
                    }
                    if(res.status == 0){
                        
                    }
                    else{
                        that.alert_msg.error('加载消息失败，请重试');
                    }
                },
                error:function(){
                    that.alert_msg.error('连接失败');
                }
            });
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");

.item_area{
    border:solid 1px;
    height:400px;
    overflow-y: auto;
}

@media (max-width: 1200px){
    
}
</style>