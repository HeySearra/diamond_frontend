<template>
    <div class="workbench_create" v-loading="is_loading">
        <component 
            ref="file_system_item"
            :is="view_type=='block'?'file-system-block':'file-system-list'"
            type="from_out"
            context="workbench"
            :drage="false"
            :out_list="list"
            @change_view="change_view"
            @open_info="open_info"
            @share_item="share_item">
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
            ],
            is_loading:true
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        init(){
            this.is_loading = true;
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
            var that = this;
            setTimeout(function(){
                that.$refs.file_system_item.init();
            }, 0);
        },

        open_info(title, content, type){
            this.$emit('open_info', title, content, type);
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
                        for(let i=0; i < res.list.length; i++){
                            that.list[0].content.push({
                                type: res.list[i].type=="doc"?"file":"fold",
                                id: res.list[i].id,
                                is_link: false,
                                is_starred: res.list[i].is_starred,
                                name: res.list[i].name,
                                i_pfid:res.list[i].pfid,
                                create_time: that.datetime_format(res.list[i].create_dt, res.cur_dt),
                                creator: res.list[i].cname,
                                recent_edit_time: that.datetime_format(res.list[i].edit_dt, res.cur_dt),
                            })
                        }
                        that.$refs.file_system_item.init();
                        that.is_loading = false;
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
        
        share_item(did, name){
            this.$emit("share_item", did, name);
        },
    }
}
</script>

<style scoped>
@import url("../assets/common.css");

.workbench_create{
    width: calc(100% - 350px);
    height:calc(100% - 130px);
    min-width:600px;
}

h1{
    font-size: 30px;
    text-indent: 30px;
    margin-bottom:10px;
}

.el_divider{
    margin: 10px 0;
}
</style>

