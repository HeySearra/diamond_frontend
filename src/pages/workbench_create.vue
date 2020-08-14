<template>
    <div class="workbench_create">
        <component 
            :is="view_type=='block'?'file-system-block':'file-system-list'"
            type="from_out"
            context="workbench"
            :drage="false"
            :out_list="list"
            @change_view="change_view"
            @open_info="open_info"
            @ref="file_system_item">
        </component>
    </div>
</template>

<script>
export default {
    data () {
        return {
            view_type:'list',
            page: 0,
            each: 15,
            list: [
                {
                    title:'我创建的',
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
            this.get_my_create_list();
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
        },

        get_my_create_list(){
            var that = this;
            this.page++;
            $.ajax({
                type:'get',
                url:"/workbench/create?page=" + that.page + "&each=" + that.each,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                processData: false,
                contentType: false,
                success:function (res){
                    if(that.console_debug){
                        console.log("(get)/workbench/create"+ " : " +res.status);
                    }
                    if(res.status == 0){
                        for(let i; i < res.list.length; i++){
                            that.list[0].content.push({
                                type: res.list[i].type,
                                id: res.list[i].id,
                                is_link: false,
                                is_starred: res.list[i].is_starred,
                                name: res.list[i].name,
                                create_time: res.list[i].create_dt,
                                creator: res.list[i].cname,
                            })
                        }
                        that.$refs.file_system_item.init();
                    }
                    else{
                        that.page--;
                        that.alert_msg.error('获取文件列表失败', '请重试');
                    }
                },
                error:function(){
                    that.page--;
                    that.alert_msg.error('连接失败');
                }
            });
        },
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

