<template>
    <div class="new_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            width="500px">
            <h3>{{title}}</h3>
            <div class="content">
                <div style="height:20px"></div>
                <el-input v-model="name" :placeholder="placeholder" maxLength="60"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dia_vis = false">取 消</el-button>
                <el-button type="primary" @click="click_confirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
        title:'',
        placeholder:'',
        dia_vis: false,
        name:'',
        type:'',
        fid:'',
        desktop_alert:true
    }
  },
  methods:{
    open(type, fid, desktop_alert){
        this.type = type;
        this.fid = fid;
        this.desktop_alert = desktop_alert ? true : false;
        switch(type){
            case 'file':
                this.title = '创建新文件';
                this.placeholder = '请输入文件名称';
                break;
            case 'fold':
                this.title = '创建新文件夹';
                this.placeholder = '请输入文件夹名称';
                break;
            case 'team':
                this.title = '创建新团队';
                this.placeholder = '请输入团队名称';
                break;
        }
        this.name = '';
        this.dia_vis = true;
    },

    getCookie (name) {
        var value = '; ' + document.cookie
        var parts = value.split('; ' + name + '=')
        if (parts.length === 2) return parts.pop().split(';').shift()
    },

    click_confirm(){
        switch(this.type){
            case 'file':
                this.create_new_item('doc');
                break;
            case 'fold':
                this.create_new_item('fold');
                break;
            case 'team':
                this.create_new_team();
                break;
        }
    },

    create_new_item(type){
        let url = '/fs/new';

        if(this.name.trim() == ''){
            this.alert_msg.warning('请输入'+(this.type=='file'?'文件':'文件夹')+'名称');
            return;
        }

        let json_data = {name:this.name, pfid:this.fid, type:type};
        var that = this;
        $.ajax({ 
            type:'post',
            url: url,
            data: JSON.stringify(json_data),
            headers: {'X-CSRFToken': this.getCookie('csrftoken')},
            processData: false,
            contentType: false,
            success:function (res){ 
                if(that.console_debug){
                    console.log(url +  '：' + res.status);
                }
                if(res.status == 0){
                    if(that.desktop_alert){
                        that.alert_box.msg('提示', '已成功在桌面创建 '+that.name + '！', function(){
                            that.$router.push({name:'file_system', params:{id:'desktop'}});
                        });
                        that.dia_vis = false;
                    }
                    else{
                        that.$emit('refresh');
                        that.dia_vis = false;
                    }
                    
                }
                else{
                    switch(res.status){
                        case 2:
                            that.alert_msg.error('权限不足');
                            break;
                        case 3:
                            that.alert_msg.error('路径解析错误');
                            break;
                        case 4:
                            that.alert_msg.error((that.type=='file'?'文件':'文件夹')+'名称非法');
                            break;
                        case 5:
                            that.alert_msg.error((that.desktop_alert?'桌面下':'该目录下')+'已存在同名文件或文件夹');
                            break;
                        default:
                            that.alert_msg.error('发生了未知错误');
                    }
                    
                }
            },
            error:function(res){
                that.alert_msg.error('网络连接失败');
            }
        });
    },

    create_new_team(){
        let url = '/team/new';

        if(this.name.trim() == ''){
            this.alert_msg.warning('请输入团队名称');
            return;
        }

        let json_data = {name:this.name};
        var that = this;
        $.ajax({ 
            type:'post',
            url: url,
            data: JSON.stringify(json_data),
            headers: {'X-CSRFToken': this.getCookie('csrftoken')},
            async:false, 
            success:function (res){ 
                if(that.console_debug){
                    console.log(url +  '：' + res.status);
                }
                if(res.status == 0){
                    that.alert_msg.success('成功创建团队');
                    that.dia_vis = false;
                    that.$emit('refresh');
                }
                else{
                    switch(res.status){
                        case 2:
                            that.alert_msg.error('权限不足');
                            break;
                        case 3:
                            that.alert_msg.error('团队名字非法');
                            break;
                        default:
                            that.alert_msg.error('发生了未知错误');
                    }
                }
            },
            error:function(res){
                that.alert_msg.error('网络连接失败');
            }
        });
    }
  }
}
</script>


<style scoped>
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");

</style>
