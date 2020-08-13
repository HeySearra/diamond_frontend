<template>
    <div class="file_system_list">
        <div class="clear_both divide_type"></div>
        <div class="path" v-if="type=='self'&&path.length">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-for="item in path" :key="item.fid">
                    <router-link :to="'/file/'+item.fid">{{item.name}}</router-link>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="clear_both divide_type" style="height:10px"></div>
        <div v-for="item in list" :key="item.title">
            <file-display-list 
                ref="display_component"
                :title="item.title" 
                :list="item.content" 
                :drage="drage" 
                :context="context" 
                :type="type"
                :is_in_desktop="is_in_desktop"
                @open_info="open_info"
                @move_item="move_item"
                @share_item="share_item"
                @copy_item="copy_item"
                @refresh="refresh"></file-display-list>
            <div class="clear_both divide_type"></div>
        </div>
        <div class="icon_part can_not_choose" @click="change_view">
            <div class="icon_button"><span class="icon iconfont">&#xe663;</span></div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        fid: {
            type:String,
            default: '1'
        },
        drage:{
            type:Boolean,
            default:true
        },
        type:{
            type:String,
            default: 'self', // or 'from_out' or 'recent'
        },
        context:{
            type:String,
            default: 'file_system',
        },
        is_in_desktop:{
            type:Boolean,
            default: false,
        },
        out_list:{
            type: Array,
            default(){
                return [
                    {
                        title:'标题',
                        content:[
                            {
                                type: 'file',
                                id: 'id',
                                is_link:false,
                                is_starred:false,
                                name:'file',
                                time:'',
                            }
                        ]
                    }
                ]
            }
        }
    },
    data() {
        return {
            path: [{name:'Apath',id:'idA'},{name:'Bpath',id:'idB'},{name:'Cpath',id:'idC'}],
            list:[

            ]
        }
    },

    mounted(){

    },

    methods:{
        init(){
            if(this.type == 'from_out' || this.type == 'recent'){
                this.list = this.out_list;
                setTimeout(function(){
                    let item = this.$refs.display_component;
                    for(let i=0; i<item.length; i++){
                        item[i].init();
                    }
                }, 0);
            }
            else if(this.type == 'self'){
                this.apply_for_info();
            }
        },

        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },

        apply_for_info(){
            let url = '/fs/fold/elem?fid=' + this.fid;
            var that = this;
            $.ajax({ 
                type:'post',
                url: url,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                async:false, 
                success:function (res){ 
                    if(that.console_debug){
                        console.log(url +  '：' + res.status);
                    }
                    if(res.status == 0){
                        that.list = [];
                        that.path = res.path;
                        let fold = [];
                        let file = [];
                        for(let i=0; i<res.list.length; i++){
                            if(res.list[i].type == 'doc'){
                                file.push({
                                    type:'file',
                                    id: res.list[i].id,
                                    name: res.list[i].name,
                                    is_link: res.list[i].is_link,
                                    is_starred: res.list[i].is_starred,
                                    creator: res.list[i].cname,
                                    create_time: that.datetime_format(res.list[i].create_dt, res.cur_dt),
                                    recent_edit_time: that.datetime_format(res.list[i].edit_dt, res.cur_dt),
                                });
                            }
                            else if(res.list[i].type == 'fold'){
                                fold.push({
                                    type:'fold',
                                    id: res.list[i].id,
                                    name: res.list[i].name,
                                    is_link: res.list[i].is_link,
                                    is_starred: res.list[i].is_starred,
                                    creator: res.list[i].cname,
                                    create_time: that.datetime_format(res.list[i].create_dt, res.cur_dt),
                                    recent_edit_time: that.datetime_format(res.list[i].edit_dt, res.cur_dt),
                                });
                            }
                        }
                        if(fold.length){
                            that.list.push({
                                title: '文件夹',
                                content: fold,
                            });
                        }
                        if(file.length){
                            that.list.push({
                                title: '文件',
                                content: file,
                            });
                        }

                        setTimeout(function(){
                            let item = that.$refs.display_component;
                            for(let i=0; i<item.length; i++){
                                item[i].init();
                            }
                        }, 0);
                    }
                    else{
                        switch(res.status){
                            case 2:
                                that.alert_msg.error('权限不足');
                                break;
                            case 3:
                                that.alert_msg.error('文件夹不存在');
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

        refresh(out_list){
            if(this.type == 'self'){
                this.apply_for_info();
            }
            else if(this.type == 'from_out'){
                this.list = out_list;
            }
        },


        open_info(name, content){
            this.$emit('open_info', name, content);
        },

        change_view(){
            this.$emit('change_view');
        },

        move_item(id, type, name){
            this.$emit('move_item', id, type, name);
        },

        share_item(did, name){
            this.$emit('share_item', did, name);
        },

        copy_item(id, type, name){
            this.$emit('copy_item', id, type, name);
        },
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");
.file_system_list{
    position: relative;
}

.divide_type{
    height: 10px;
}

.path{
    padding: 0 15px;
    border: solid 1px;
    margin-right:100px;
}

.el-breadcrumb{
    line-height:25px;
}

.path>>>.el-breadcrumb__inner{
    cursor:pointer !important;
}

.path>>>.el-breadcrumb__inner:hover{
    text-decoration: underline;
}

.icon_part{
    height:30px;
    width:80px;
    position: absolute;
    top:27px;
    right:10px;
    border:solid 1px;
    text-align: center;
}

.icon_part .icon_button{
    display:inline-block;
    height:30px;
    line-height:30px;
    padding: 0 5px;
    cursor:pointer
}

.icon_part .icon_button .icon{
    font-size:27px;
}

@media (max-width: 1200px){
    
}
</style>