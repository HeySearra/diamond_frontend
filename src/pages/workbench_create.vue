<template>
    <div class="workbench_create">
        <component 
            :is="view_type=='block'?'file-system-block':'file-system-list'"
            type="from_out"
            context="workbench"
            :drage="false"
            :out_list="list"
            @change_view="change_view"
            @open_info="open_info">
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
                    title:'我创建的',
                    content:[
                        {
                            type: 'file',
                            id: 'id',
                            is_link:false,
                            is_starred:true,
                            name:'file',
                            creator:'',
                            recent_time:'',
                            create_time:''
                        },
                        {
                            type: 'file',
                            id: 'id',
                            is_link:false,
                            is_starred:false,
                            name:'file',
                            creator:'',
                            recent_time:'',
                            create_time:''
                        },
                        {
                            type: 'fold',
                            id: 'id',
                            is_link:false,
                            is_starred:true,
                            name:'file',
                            creator:'',
                            recent_time:'',
                            create_time:''
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
            let that = this;
            $.ajax({
                type:'get',
                url:"/workbench/create",
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                async:false,
                success:function (res){
                    if(that.console_debug){
                        console.log("(get)/workbench/create"+ " : " +res.status);
                    }
                    if(res.status == 0){
                        for(let i; i < res.list.length; i++){
                            that.list.content.push({
                                type: res.list[i].type,
                                pfid: res.list[i].pfid,
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

