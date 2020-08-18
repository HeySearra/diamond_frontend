<template>
    <div class="new_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            :close-on-click-modal="false"
            width="500px">
            <h3>{{title}}</h3>
            <div class="content">
                <div style="height:20px"></div>
                <el-input ref="input" v-model="name" :placeholder="placeholder" maxLength="60" @keyup.enter.native="click_confirm()"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="click_confirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'new-dialog',

  data () {
    return {
        title:'',
        placeholder:'',
        dia_vis: false,
        name:'',
        type:'',
        fid:'',
        desktop_alert:'',
        is_rename:false,
        id:'',
        template_type:''
    }
  },
  methods:{
    open(type, fid, desktop_alert){
        this.type = type;
        this.fid = fid;
        this.is_rename = false;
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
        var that = this;
        setTimeout(function(){
            that.$refs.input.focus();
        }, 0);
    },

    open_for_rename(id, type, name){
        this.is_rename = true;
        this.type = type;
        this.id = id;
        this.title = '重命名 ' + name;
        switch(type){
            case 'file':
                this.placeholder = '请输入文件的新名称';
                break;
            case 'fold':
                this.placeholder = '请输入文件夹的新名称';
                break;
        }
        this.name = name;
        this.dia_vis = true;
        var that = this;
        setTimeout(function(){
            that.$refs.input.focus();
        }, 0);
    },

    open_for_template(fid, tid, type, name){
        this.is_rename = false;
        this.type = 'template';
        this.template_type = type;
        this.id = tid;
        this.fid = fid;
        this.title = '新文件的名称为';
        this.placeholder = '请输入新文件的名称';
        this.name = name;
        this.dia_vis = true;
        var that = this;
        setTimeout(function(){
            that.$refs.input.focus();
        }, 0);
    },

    getCookie (name) {
        var value = '; ' + document.cookie
        var parts = value.split('; ' + name + '=')
        if (parts.length === 2) return parts.pop().split(';').shift()
    },

    click_confirm(){
        if(!this.dia_vis){
            return;
        }
        if(this.is_rename){
            this.rename();
        }
        else{
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
                case 'template':
                    this.create_from_template();
                    break;
            }
        }
    },

    rename(){
        if(!this.dia_vis){
            return;
        }
        let url = '/fs/rename';

        if(this.name.trim() == ''){
            this.alert_msg.warning('请输入'+(this.type=='file'?'文件':'文件夹')+'名称');
            return;
        }

        let json_data = {name:this.name, id:this.id, type:this.type=='file'?'doc':'fold'};
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
                    that.alert_msg.success('重命名成功');
                    that.$emit('refresh');
                    that.dia_vis = false;
                }
                else{
                    switch(res.status){
                        case 2:
                            that.alert_msg.error('权限不足');
                            break;
                        case 3:
                            that.alert_msg.error('该目录下已存在同名文件或文件夹');
                            break;
                        case 4:
                            that.alert_msg.error((that.type=='file'?'文件':'文件夹')+'名称非法');
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

    create_new_item(type){
        if(!this.dia_vis){
            return;
        }
        let url = '/fs/new';

        if(this.name.trim() == ''){
            this.alert_msg.warning('请输入'+(type=='file'?'文件':'文件夹')+'名称');
            return;
        }

        let json_data = {name:this.name, pfid:this.fid, type:type};
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
        if(!this.dia_vis){
            return;
        }
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
    },

    create_from_template(){
        if(!this.dia_vis){
            return;
        }
        var that = this;
        let msg = {
          'tid': this.id,
          'name': this.name,
          'pfid': this.fid,
          'type': this.template_type,
        };
        $.ajax({
          type:'post',
          url:'/temp/new_doc',
          headers: {'X-CSRFToken': this.getCookie('csrftoken')},
          data: JSON.stringify(msg),
          async: false,
          success:function (res){
            if (that.console_debug) {
              console.log("(post)/temp/new_doc" + " : " + res.status);
            }
            if (res.status === 0) {
                that.alert_msg.success('创建成功');
                that.$router.push({name:'doc', params:{did:res.did}});
            } else {
              switch (res.status) {
                case 1:
                  that.alert_msg.error('创建失败', '键错误');
                  break;
                case 2:
                  that.alert_msg.error('权限不足');
                  break;
                case 3:
                  that.alert_msg.error('父文件夹不存在');
                  break;
                case 4:
                  that.alert_msg.error('新建文件将会与目录中的的文件或文件夹重名');
                  break;
                case 5:
                  that.alert_msg.error('文件名非法');
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
    },

    close(){
        if(!this.dia_vis){
            return;
        }
        if(this.type == 'template'){
            this.$emit('create_doc_from_template', this.id, this.template_type, this.name);
            var that = this;
            setTimeout(function(){
                    that.dia_vis = false;
            }, 10);
        }
        else{
            this.dia_vis = false;
        }
    }
  }
}
</script>


<style scoped>
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");

</style>
