<template>
    <div class="choose_path_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            :close-on-click-modal="false"
            width="600px">
            <h3>{{title}}</h3>
            <div class="content">
                <div style="height:10px"></div>
                <div class="item_area" id="item_list">
                    <choose-path-fold-list-item v-if="!is_root" name="（返回上层目录）" :id="pfid" type="fold" @open="change_path" gray></choose-path-fold-list-item>
                    <choose-path-fold-list-item
                        v-for="item in fold_list"
                        :key="item.id"
                        :is_starred="item.is_starred"
                        :is_link="item.is_link"
                        :name="item.name"
                        :id="item.id"
                        :type="item.type"
                        @open="change_path">
                    </choose-path-fold-list-item>
                    <div style="height:30px"></div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dia_vis=false">取 消</el-button>
                <el-button type="primary" @click="confirm">{{button_text}}</el-button>
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
            fid:'',
            pfid:'',
            fold_list:[],
            button_text:''
        }
    },

    methods:{
        open(fid, type, id, name, op_type){
            this.type = type;
            this.id = id;
            this.fid = fid;
            this.op_type = op_type;
            this.title = (this.op_type=='move'?'移动':'复制') + ' ' + name + ' 到';
            this.button_text = this.op_type=='move' ? '移 动' : '复 制';

            if(!this.judge_root(fid)){
                return;
            }
            if(!this.open_fold(fid)){
                return;
            }

            this.dia_vis = true;
        },

        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },

        judge_root(fid){
            var result = true;
            let url = '/fs/father?id=' + fid + '&type=fold';
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
                        that.pfid = res.pfid;
                        that.is_root = false;
                        result = true;
                    }
                    else{
                        if(res.status == 4){
                            that.is_root = true;
                            result = true;
                        }
                        else{
                            that.alert_msg.error('加载消息失败，请重试');
                            result = false;
                        }
                    }
                },
                error:function(){
                    that.alert_msg.error('连接失败');
                    result = false;
                }
            });
            return result;
        },

        open_fold(fid){
            var result = true;
            let url = '/fs/fold/elem?fid=' + fid;
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
                        that.fold_list = [];
                        for(let i=0; i<res.list.length; i++){
                            if(res.list[i].type == 'fold'){
                                that.fold_list.push(res.list[i]);
                            }
                        }
                        that.fid = fid;
                        result = true;
                    }
                    else{
                        that.alert_msg.error('加载消息失败，请重试');
                        result = false;
                    }
                },
                error:function(){
                    that.alert_msg.error('连接失败');
                    result = false;
                }
            });
            return result;
        },

        change_path(fid){
            let last_root = this.is_root;
            if(!this.judge_root(fid)){
                return;
            }
            if(!this.open_fold(fid)){
                this.is_root = last_root;
                return;
            }
            document.getElementById('item_list').scrollTop = 0;
        },

        confirm(){
            if(this.op_type == 'move'){
                this.move();
            }
            else{
                this.copy();
            }
        },

        move(){
            let url = '/fs/father?id=' + fid + '&type=fold';
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
                        that.pfid = res.pfid;
                        that.is_root = false;
                        result = true;
                    }
                    else{
                        if(res.status == 4){
                            that.is_root = true;
                            result = true;
                        }
                        else{
                            that.alert_msg.error('加载消息失败，请重试');
                            result = false;
                        }
                    }
                },
                error:function(){
                    that.alert_msg.error('连接失败');
                    result = false;
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
    border:solid 1px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    height:390px;
    overflow-y: overlay;
    width: 470px;
    margin: 10px auto 0;
}

@media (max-width: 1200px){
    
}
</style>