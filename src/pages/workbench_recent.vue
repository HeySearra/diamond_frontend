<template>
    <div class="workbench_recent">
        <component 
            :is="view_type=='block'?'file-system-block':'file-system-list'"
            type="recent"
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
            this.get_recent_file_list();
        },

        get_recent_file_list(){
            let that = this;
            $.ajax({
                type:'get',
                url:"/workbench/recent_view",
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                processData: false,
                contentType: false,
                success:function (res){
                    if(that.console_debug){
                        console.log("(get)/workbench/recent_view"+ " : " +res.status);
                    }
                    if(res.status == 0){
                        for(let i; i < res.list.length; i++){
                            that.list.content.push({
                                type: 'file',
                                id: res.list[i].id,
                                is_link: false,
                                is_starred: res.list[i].is_starred,
                                name: res.list[i].name,
                                view_time: res.list[i].dt,
                            })
                        }
                        that.$refs.file_system_item.init();
                    }
                    else{
                        that.alert_msg.error('获取文件列表失败', '请重试');
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

