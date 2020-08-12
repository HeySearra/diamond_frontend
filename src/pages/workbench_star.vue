<template>
    <div class="workbench_star">
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
                    title:'我的收藏',
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
                            is_starred:true,
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

