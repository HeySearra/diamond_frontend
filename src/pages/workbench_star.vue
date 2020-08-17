<template>
    <div class="workbench_star" v-loading="is_loading">
        <component
            :is="view_type=='block'?'file-system-block':'file-system-list'"
            type="from_out"
            context="workbench"
            :drage="false"
            :out_list="list"
            @change_view="change_view"
            @open_info="open_info"
            @share_item="share_item"
            ref="file_system_component">
        </component>
        <div style="height:50px"></div>
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
            this.get_star_file_list();
        },

        get_star_file_list(){
            var that = this;
            that.page++;
            $.ajax({
                type:'get',
                url:"/workbench/star",
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
                                type: res.list[i].type=="doc"?"file":"fold",
                                id: res.list[i].id,
                                is_link: false,
                                is_starred: true,
                                name: res.list[i].name,
                                create_time: that.datetime_format(res.list[i].create_dt, res.cur_dt),
                                creator: res.list[i].cname,
                                recent_edit_time: that.datetime_format(res.list[i].edit_dt, res.cur_dt),
                            })
                        }
                        that.$refs.file_system_component.init();
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

        open_info(title, content, type){
            this.$emit('open_info', title, content, type);
        },
        
        share_item(did, name){
            this.$emit("share_item", did, name);
        },
    }
}
</script>

<style scoped>
@import url("../assets/common.css");

.workbench_star{
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

