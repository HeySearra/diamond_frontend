<template>
    <div class="choose_path_dialog_for_template">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            width="600px">
            <h3>{{title}}</h3>
            <div class="content">
                <div style="height:10px"></div>
                <div class="item_area" id="item_list">
                    <choose-path-list-item v-if="!is_all_root" name="（返回上层目录）" :id="pfid" type="fold" @open="change_path" gray></choose-path-list-item>
                    <choose-path-list-item
                        v-for="item in list"
                        :key="item.id"
                        :is_starred="item.is_starred"
                        :is_link="item.is_link"
                        :name="item.name"
                        :id="item.id"
                        :type="item.type"
                        @open="change_path">
                    </choose-path-list-item>
                    <div style="height:30px"></div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dia_vis=false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title:'将新文档创建在',
            tid:'',
            type:'user', // 'user', 'official'
            dia_vis:false,
            is_root:false,
            is_all_root:false,
            fid:'',
            pfid:'',
            list:[],
            tid:'',
            name:''
        }
    },

    methods:{
        open(tid, type, name){
            this.tid = tid;
            this.type = type;
            this.name = name;
            this.is_all_root = true;
            this.init_info();
        },

        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },

        init_info(){
            let url = '/team/all';
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
                        that.list = [];
                        that.is_all_root = true;
                        for(let i=0; i<res.my_team.length; i++){
                            that.list.push({
                                id: res.my_team[i].tid,
                                name: res.my_team[i].name,
                                type: 'team',
                            });
                        }
                        for(let i=0; i<res.join_team.length; i++){
                            that.list.push({
                                id: res.join_team[i].tid,
                                name: res.join_team[i].name,
                                type: 'team',
                            });
                        }
                        that.list.push({
                            id: 'desktop',
                            name: '我的桌面',
                            type: 'fold_root'
                        });
                        that.dia_vis = true;
                    }
                    else{
                        that.alert_msg.error('加载消息失败，请重试');
                    }
                },
                error:function(){
                    that.alert_msg.error('连接失败');
                }
            });
        },

        open_all_root(){
            this.init_info();
        },

        judge_root(fid){
            if(this.is_all_root){
                this.pfid = '-1';
                return true;
            }
            if(fid == '-1'){
                return true;
            }
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
                            that.pfid = '-1';
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
                        that.list = [];
                        for(let i=0; i<res.list.length; i++){
                            if(res.list[i].type == 'fold'){
                                that.list.push(res.list[i]);
                            }
                        }
                        that.is_all_root = false;
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
            if(fid == '-1'){
                this.open_all_root();
            }
            else if(this.is_all_root){
                this.open_root(fid);
            }
            else{
                if(!this.open_fold(fid)){
                    this.is_root = last_root;
                    return;
                }
            }
            $('#item_list')[0].scrollTop = 0;
        },

        open_root(fid){
            var that = this;
            if(fid == 'desktop'){
                let url = '/fs/user/root';
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
                            that.open_fold(res.fid);
                        }
                        else{
                            switch(res.status){
                                case 2:
                                    that.alert_msg.error('权限不足');
                                    break;
                                default:
                                    that.alert_msg.error('发生未知错误');
                            }
                        }
                    },
                    error:function(){
                        that.alert_msg.error('连接失败');
                    }
                });
            }
            else{
                let url = '/fs/team/root?tid=' + fid;
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
                            that.open_fold(res.fid);
                        }
                        else{
                            switch(res.status){
                                case 2:
                                    that.alert_msg.error('权限不足');
                                    break;
                                default:
                                    that.alert_msg.error('发生未知错误');
                            }
                        }
                    },
                    error:function(){
                        that.alert_msg.error('连接失败');
                    }
                });
            }
        },

        confirm(){
            if(this.is_all_root){
                this.alert_msg.warning('请选择要创建在哪个文件夹');
            }
            else{
                this.$emit('create_file_from_template_choose_name', this.fid, this.tid, this.type, this.name);
                var that = this;
                setTimeout(function(){
                     that.dia_vis = false;
                }, 10);
            }
        },
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
