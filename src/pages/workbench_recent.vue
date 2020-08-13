<template>
    <div class="workbench_recent">
        <component 
            :is="view_type=='block'?'file-system-block':'file-system-list'"
            type="from_out"
            context="workbench"
            :drage="false"
            :out_list="list"
            @change_view="change_view"
            @open_info="open_info"
            ref="file_system_item">
        </component>
    </div>
</template>

<script>
export default {
    data () {
        return {
            view_type:'list',
            list: [
                {
                    title:'最近浏览',
                    content:[
                        {
                            type: 'file',
                            id: 'id',
                            is_link:false,
                            is_starred:false,
                            name:'file'
                        },
                        {
                            type: 'file',
                            id: 'id',
                            is_link:false,
                            is_starred:false,
                            name:'file'
                        },
                        {
                            type: 'file',
                            id: 'id',
                            is_link:false,
                            is_starred:false,
                            name:'file'
                        }
                    ]
                }
            ]
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        init(){
            this.$emit('active_change');
            this.view_type = this.view_type_manager.get();
            $.ajax({
                type:'get',
                url:"/workbench/recent_view",
                data: JSON.stringify(msg),
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                processData: false,
                contentType: false,
                success:function (res){
                    if(that.console_debug)console.log("(get)/workbench/recent_view"+ " : " +res.status);
                    if(res.status == 0){
                        for(let i; i < res.list.length; i++){
                            that.list.content.push({
                                type: 'file',
                                id: res.list[i].id,
                                is_link: false,
                                is_starred: false,
                                name: res.list[i].name,
                            })
                        }
                        that.$refs.file_system_item.init();
                    }
                    else{
                        switch(res.status){
                            case 4:
                                that.alert_box.msg('重置失败', '密文不正确');
                                break;
                            case 2:
                                that.alert_box.msg('注册失败', '账号不存在');
                                break;
                            case 3:
                                that.alert_box.msg('注册失败', '密码长度应为6-32个字符，必须包含数字、小写字母、大写字母、特殊字符中至少两种');
                                break;
                            default:
                                that.alert_box.msg('注册失败', '请检查你所填写的信息');
                                break;
                        }
                        //that.alert_msg.normal('error:'+res.status);
                    }
                },
                error:function(){
                    that.alert_msg.error('连接失败');
                }
            });
        },
        
        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },

        change_view(){
            this.view_type = this.view_type=='block' ? 'list' : 'block';
            this.view_type_manager.set(this.view_type);
        },

        open_info(title, content){
            this.$emit('open_info', title, content);
        }
        
    }
}
</script>

<style scoped>
@import url("../assets/common.css");

h1{
    font-size: 30px;
    text-indent: 30px;
    margin-bottom:10px;
}

.el_divider{
    margin: 10px 0;
}
</style>

