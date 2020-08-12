<template>
    <div class="workbench_share">
        <component 
            :is="view_type=='block'?'file-system-block':'file-system-list'"
            type="from_out"
            context="workbench"
            :drage="false"
            :out_list="list"
            @change_view="change_view">
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
                    title:'共享文件',
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
            
        },
        
        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },
        
        change_view(){
            this.view_type = this.view_type=='block' ? 'list' : 'block';
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

