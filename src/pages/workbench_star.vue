<template>
    <div class="workbench_star">
        <component
            :is="view_type=='block'?'file-system-block':'file-system-list'"
            type="from_out"
            context="workbench"
            :drage="false"
            :out_list="list"
            @change_view="change_view"
            @open_info="open_info"
            ref="file_system_component">
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
                    title:'我的收藏',
                    content:[
                        // {
                        //     type: 'file',
                        //     id: 'id',
                        //     is_link:false,
                        //     is_starred:true,
                        //     name:'file',
                        //     creator:'',
                        //     recent_time:'',
                        //     create_time:''
                        // },
                        // {
                        //     type: 'file',
                        //     id: 'id',
                        //     is_link:false,
                        //     is_starred:true,
                        //     name:'file',
                        //     creator:'',
                        //     recent_time:'',
                        //     create_time:''
                        // },
                        // {
                        //     type: 'fold',
                        //     id: 'id',
                        //     is_link:false,
                        //     is_starred:true,
                        //     name:'file',
                        //     creator:'',
                        //     recent_time:'',
                        //     create_time:''
                        // }
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
            // this.list = [];
            this.$emit('active_change');
            this.view_type = this.view_type_manager.get();
            this.get_star_file_list();
        },

        get_star_file_list(){
            var that = this;
            that.page++;
            $.ajax({
                type:'get',
                url:"/workbench/star?page=" + that.page + "&each=" + that.each,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                processData: false,
                contentType: false,
                success:function (res){
                    if(that.console_debug){
                        console.log("(get)/workbench/star"+ " : " +res.status);
                    }
                    if(res.status == 0){
                        for(let i=0; i < res.list.length; i++){
                            that.list[0].content.push({
                                type: res.list[i].type,
                                id: res.list[i].id,
                                is_link: false,
                                is_starred: true,
                                name: res.list[i].name,
                                create_time: res.list[i].create_dt,
                                creator: res.list[i].cname,
                            })
                        }
                        that.$refs.file_system_component.init();
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

        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },

        change_view(){
            this.view_type = this.view_type=='block' ? 'list' : 'block';
            this.view_type_manager.set(this.view_type);
            var that = this;
            setTimeout(function(){
                that.$refs.file_system_component.init();
            }, 0);
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

