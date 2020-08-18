<template>
    <div class="file_system_list">
        <div class="clear_both"></div>
        <div style="height:6vh;" v-if="!list.length&&!is_loading"></div>
        <div v-if="!list.length&&!is_loading&&random>=0" class="not_found">{{not_found_text[random]}}</div>
        <div class="go_button can_not_choose blur_div" v-if="type=='self'&&path.length">
            <div @click="go_left" :class="opa?'opa':''"><span class="el-icon-arrow-left"></span></div>
            <div @click="go_right" :class="opa?'opa':''"><span class="el-icon-arrow-right"></span></div>
        </div>
        <div class="path blur_div" :class="opa?'opa':''" v-if="type=='self'&&path.length">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-for="item in path" :key="item.fid">
                    <router-link :to="item.fid!=''?'/file/'+item.fid:''">{{item.name}}</router-link>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="clear_both divide_type blur_div" :style="type=='self'&&path.length?'height:50px':'height:20px'"></div>
        <div v-for="item in list" :key="item.title">
            <file-display-list 
                class="blur_div"
                ref="display_component"
                :title="item.title" 
                :list="item.content" 
                :drage="drage" 
                :add_type="item.add_type"
                :context="context" 
                :type="type"
                :is_in_desktop="is_in_desktop"
                @start_drop="start_drag"
                @face_drop="end_drag"
                @open_info="open_info"
                @move_item="move_item"
                @share_item="share_item"
                @dtd_share="dtd_share"
                @copy_item="copy_item"
                @refresh="refresh"
                @add_item="add_item"
                @rename="rename"></file-display-list>
            <div class="clear_both divide_type"></div>
        </div>
        <div class="clear_both" style="height:50px"></div>
        <div class="icon_part can_not_choose blur_div" :class="opa?'opa':''" @click="change_view" v-if="list.length">
            <div class="icon_button"><span class="icon iconfont">&#xe663;</span></div>
        </div>
    </div>
</template>

<script>
import file_display_list from '@/components/file_display_list';
export default {
    name: 'file-system-list',

    components:{
        'file-display-list': file_display_list,
    },

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
        },
        addable:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            path: [/*{name:'Apath',id:'idA'},{name:'Bpath',id:'idB'},{name:'Cpath',id:'idC'}*/],
            list:[],
            opa:false,
            draging:{
                type:'',
                id:''
            },
            is_loading:true,
            random:-1,
            not_found_text:['这里啥玩意也没有', '这里什么也没有', '空空如也', '这里好凄凉', '难道？这里什么也没有', '什么东东都没有', '这里啥都没', '什么也没有~', '这里没东西，别看了', '啊，这里没东西啊'],
            stop_flag: false
        }
    },

    mounted(){

    },

    methods:{
        init(){
            this.init_scroll();
            this.random = parseInt(Math.random()*100%this.not_found_text.length);
            if(this.type == 'from_out' || this.type == 'recent'){
                this.list = this.out_list;
                var that = this;
                this.is_loading = false;
                setTimeout(function(){
                    let item = that.$refs.display_component;
                    if(item){
                        for(let i=0; i<item.length; i++){
                            item[i].init();
                        }
                    }
                }, 0);
            }
            else if(this.type == 'self'){
                this.apply_for_info();
            }
        },

        init_scroll(){
            var that = this;
            $('#main').off('scroll');
            $('#main').scroll(function() {
                var scroH = $('#main').scrollTop();
                if(scroH >= 69){  //距离顶部大于100px时
                    that.opa = true;
                }
                else{
                    that.opa = false;
                }
                //console.log(scroH);
            });
        },

        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },

        apply_for_info(no_loading){
            if(!no_loading){
                this.$emit('in_loading');
            }
            let url = '/fs/fold/elem?fid=' + this.fid;
            var that = this;
            $.ajax({ 
                type:'get',
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
                        that.path.push({
                            fid:'',
                            name:res.name
                        });
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
                                    can_share: res.list[i].can_share,
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
                        if(that.addable==true||fold.length){
                            that.list.push({
                                title: '文件夹',
                                add_type: 'fold',
                                content: fold,
                            });
                        }
                        if(that.addable==true||file.length){
                            that.list.push({
                                title: '文件',
                                add_type: 'file',
                                content: file,
                            });
                        }

                        setTimeout(function(){
                            let item = that.$refs.display_component;
                            if(item){
                                for(let i=0; i<item.length; i++){
                                    item[i].init();
                                }
                            }
                        }, 0);
                        that.is_loading = false;
                        that.$emit('out_loading');
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

        refresh(out_list, no_loading){
            if(this.type == 'self'){
                this.apply_for_info(no_loading);
            }
            else if(this.type == 'from_out'){
                this.$emit('refresh');
            }
        },

        open_info(name, content, type){
            this.$emit('open_info', name, content, type);
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

        dtd_share(did, name){
            this.$emit('dtd_share', did, name);
        },

        copy_item(id, type, name){
            this.$emit('copy_item', id, type, name);
        },

        add_item(type){
            this.$emit('add_item', type, this.fid);
        },

        go_left(){
            history.go(-1);
        },

        go_right(){
            history.go(1);
        },

        start_drag(type, id){
            this.draging.type = type=='file' ? 'doc' : 'fold';
            this.draging.id = id;
        },

        end_drag(type, id){
            let url = '/fs/move';
            var that = this;
            $.ajax({
                type:'post',
                url: url,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                data: JSON.stringify({id:this.draging.id, type:this.draging.type, pfid:id}),
                async:false, 
                success:function (res){
                    if(that.console_debug){
                        console.log(url+ " : " +res.status);
                    }
                    if(res.status == 0){
                        that.refresh({}, true);
                    }
                    else{
                        switch(res.status){
                            case 2:
                                that.alert_msg.error('权限不足');
                                break;
                            case 3:
                                that.alert_msg.warning('该目录下已经有同名的文件或文件夹');
                                break;
                            case 4:
                                that.alert_msg.normal('该'+(that.draging.type=='file'?'文件':'文件夹')+'已经在目录中');
                                break;
                            case 5:
                                that.alert_msg.error('找不到内容');
                                break;
                            case 6:
                                if(that.stop_flag){
                                    return;
                                }
                                that.stop_flag = true;
                                that.alert_msg.normal('你好');
                                setTimeout(function(){
                                    that.alert_msg.normal('请问你上过B站吗？')
                                }, 1000);
                                setTimeout(function(){
                                    that.alert_msg.normal('听说过禁止套娃的弹幕吗？')
                                }, 3000);
                                setTimeout(function(){
                                    that.alert_msg.normal('你现在就在做这种事')
                                }, 5000);
                                setTimeout(function(){
                                    that.alert_msg.normal('这种事对文件系统很不好的呢')
                                }, 7000);
                                setTimeout(function(){
                                    that.alert_msg.warning('所以就此收手吧')
                                    that.stop_flag = false;
                                }, 9000);
                                break;
                            default:
                                that.alert_msg.error('发生未知错误');
                        }
                    }
                },
                error:function(){
                    that.alert_msg.error('连接失败');
                }
            });
        },

        rename(id, type, name){
            this.$emit('rename', id, type, name);
        }
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");
.file_system_list{
    position: relative;
    min-width:700px;
}

.divide_type{
    height: 10px;
}

.path{
    padding: 1px 15px;
    border-radius: 3px;
    margin-right:100px;
    background-color: hsla(0, 0%, 93%, .7);
    border:2px solid hsl(0, 0%, 93%);
    color:#555;
    position: fixed;
    left:438px;
    width: calc(83% - 350px);
    transition:background-color 0.2s linear;
    z-index:3;
}

.go_button{
    padding: 1px 0;
    position: fixed;
    z-index:3;
}

.go_button div{
    display:inline-block;
    padding: 3px 8px;
    border:solid 1px;
    background-color: hsla(0, 0%, 93%, .7);
    border:2px solid hsl(0, 0%, 93%);
    border-radius: 3px;
    cursor:pointer;
    color:#999;
    font-weight: bold;
    transition:all 0.2s linear;
}

.opa{
    opacity: .3;
    color:#ccc;
}

.opa a{
    color:#ccc !important;
}

.path:hover, .go_button div:hover{
    background-color: hsla(0, 0%, 93%, .96);
    border:2px solid hsl(0, 0%, 87%);
    color:#999;
    opacity: 1;
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

.path>>>.router-link-active, .path>>>.el-breadcrumb__item[aria-current="page"] span{
    cursor:default !important;
    text-decoration: none !important;
}

.icon_part{
    height:40px;
    width:60px;
    position: fixed;
    top:78px;
    right:25px;
    /* border:solid 1px; */
    text-align: center;
    border-radius: 5px;
    transition:all 0.1s linear;
    cursor:pointer
}

.icon_part:hover{
    opacity: 1;
    background-color: hsla(0, 0%, 0%, 0.05);
    color: hsl(0, 0%, 43%);
}

.icon_part .icon_button{
    display:inline-block;
    height:40px;
    line-height:40px;
    padding: 0 5px;
}

.icon_part .icon_button .icon{
    font-size:27px;
}

@media (max-width: 1200px){
    
}
</style>