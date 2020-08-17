<template>
    <transition name="el-zoom-in-center">
        <div class="can_not_choose file_list_item" v-show="show">
            <div class="click_area" :class="focus?'click_area_focus':''" @click="click"></div>
            <div class="big_icon">
                <div>
                    <span class="icon iconfont" v-if="type=='file'">&#xe645;</span>
                    <span class="icon iconfont" v-if="type=='fold'">&#xe622;</span>
                </div>
            </div>
            <div class="link_icon" v-if="is_link">
                <span class="icon iconfont">&#xe60c;</span>
            </div>
            <div class="starred_icon" v-if="is_starred&&!is_link">
                <span class="icon iconfont">&#xe7b2;</span>
            </div>
            <div class="name">{{name}}</div>
            <div class="info_area">
                <div v-if="type=='recycle'">{{delete_time}}</div>
                <div v-if="type=='recycle'">{{rest_time}}天</div>
                <div v-if="type=='recent'">{{view_time}}</div>
                <div v-if="type!='recycle'&&type!='recent'">{{creator}}</div>
                <div v-if="type!='recycle'&&type!='recent'">{{recent_edit_time}}</div>
                <div v-if="type!='recycle'&&type!='recent'" class="min_hide">{{create_time}}</div>
            </div>
            <div></div>
        </div>
        <!-- 求个css！ 
        加了hl标签的
        -->
        <div class="content">{{content}}</div>
    </transition>
</template>

<script>
export default {
    props: {
        is_link: {
            type:Boolean,
            default: false
        },
        id:{
            type:String,
            default: ''
        },
        type:{
            type:String,
            default:''
        },
        name:{
            type:String,
            default: 'new file'
        },
        content:{
            type:String,
            default:'file_system' //所处的环境，分'recycle'，'file_system'，'root'，'workbench', 'team'
        },
        is_starred:{
            type:Boolean,
            default:false
        },
        create_time:{
            type:String,
            default:'yyyy-mm-dd hh:mm:ss'
        },
        recent_edit_time:{
            type:String,
            default:'yyyy-mm-dd hh:mm:ss'
        },
        creator:{
            type:String,
            default:'ansdoasoda'
        },
    },
    data() {
        return {
            focus: false,
            pfid:'',
            timer:undefined,
            click_flag: false,
            show: true
        }
    },

    mounted(){
        
    },

    methods:{
        init(){
            this.apply_for_parent();
        },

        getCookie (name) {
            var value = '; ' + document.cookie
            var parts = value.split('; ' + name + '=')
            if (parts.length === 2) return parts.pop().split(';').shift()
        },

        click(){
            this.timer ? clearTimeout(this.timer) : '';
            if(this.click_flag){
                this.open_doc(this.fid);
            }
            else{
                this.click_flag = true;
                var that = this;
                this.timer = setTimeout(function(){
                    that.click_flag = false;
                }, 500);
            }
        },

        apply_for_parent(){
            if(this.context!='workbench'&&!this.is_link){
                return;
            }
            let url = '/fs/father?id=' + this.id + this.type=='file'?'&type=doc':'&type=fold';
            var that = this;
            $.ajax({
                type:'get',
                url: url,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                processData: false,
                contentType: false,
                success:function (res){
                    if(that.console_debug){
                        console.log(url +  '：' + res.status);
                    }
                    if(res.status == 0){
                        that.pfid = res.pfid;
                    }
                    else{
                        switch(res.status){
                            case 2:
                            case 3:
                            case 4:
                                that.pfid = '';
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

        vis_change(value){
            this.focus = value;
        },


        refresh(){
            this.$emit('refresh');
        },

        open_info(){
            let url = '/fs/doc/info?did=' + this.did;
            var that = this;
            $.ajax({
                type:'get',
                url: url,
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                processData: false,
                contentType: false,
                success:function (res){
                    if(that.console_debug){
                        console.log(url +  '：' + res.status);
                    }
                    if(res.status == 0){
                        var content = [];
                        content.push({
                            key:'文档名',
                            value:that.name
                        });
                        content.push({
                            key:'创建者',
                            value:res.cname
                        });
                        content.push({
                            key:'字数',
                            value:res.size
                        });
                        content.push({
                            key:'是否可分享',
                            value:res.is_locked?'否':'是'
                        });
                        let path = '';
                        for(let i=0; i<res.path.length; i++){
                            path += res.path[i].name;
                            path += ' > ';
                        }
                        path += that.name;
                        content.push({
                            key:'路径',
                            value:path
                        });
                        that.$emit('open_info', that.name, content, 'file');
                    }
                    else{
                        switch(res.status){
                            case 2:
                                that.alert_msg.error('权限不足');
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

        open_fold(fid){
            if(this.context == 'team'){
                this.$router.push({name:'team_file_system', params:{id:fid, tid:this.$route.params.tid}});
            }
            else{
                this.$router.push({name:'file_system', params:{id:fid}});
            }
        },

        open_doc() {
            this.$router.push({name:'doc', params:{did:this.did}});;
        },
    }

}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/diadoc_icon.css");

.file_list_item{
    position: relative;
    /* cursor:pointer; */
    /* border: solid 1px; */
    border-bottom: solid 1px rgba(0, 0, 0, 0.1);
    height:50px;
    overflow: hidden;
    color:#343434;
}

.click_area{
    width: 100%;
    height:100%;
    background-color: hsla(0, 0%, 0%, 0.05);
    position: absolute;
    top:0;
    left:0;
    z-index:2;
    opacity: 0;
    transition: all 0.1s linear;
}

.file_list_item:hover .click_area, .click_area_focus{
    opacity: 1 !important;
}

.big_icon{
    position: absolute;
    top:0;
    left:23px;
    text-align: center;
    line-height:50px;
    width:fit-content;
    color:hsl(198, 10%, 69%);
}

.big_icon .icon{
    font-size:27px;
}

.link_icon{
    position: absolute;
    top:23px;
    left:36px;
    color:hsl(202, 38%, 39%);
    font-weight: bold;
    border: solid 1px;
    width:18px;
    height:18px;
    line-height:15px;
    text-align: center;
    border-radius: 50%;
    background-color: hsl(0, 0%, 98%, 0.78);
}

.link_icon .icon{
    font-size:12px;
}

.starred_icon .icon{
    font-size:15px;
}

.starred_icon{
    position: absolute;
    top:27px;
    left:39px;
    color:hsl(51, 100%, 50%);
    font-weight: bold;
    width:18px;
    height:18px;
    line-height:15px;
    text-align: center;
}

.file_list_item:hover .more_menu, .more_menu_focus{
    opacity: .7 !important;
}

.more_menu{
    position: absolute;
    line-height:50px;
    top:0;
    right:18px;
    font-size:15px;
    opacity: 0;
    z-index:3;
    cursor:pointer;
    transition: all 0.1s linear;
}

.more_menu span{
    color:hsl(198, 25%, 35%)
}

.more_menu>>>.el-icon-s-tools{
    font-size:18px;
}

.name{
    position: absolute;
    width:36%;
    line-height:50px;
    height:50px;
    top:0;
    left:75px;
    word-break: break-all;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
}

.info_area{
    position: absolute;
    width:56%;
    line-height:50px;
    height:50px;
    top:0;
    right:39px;
    color:#999
}

.info_area div{
    width:33%;
    float:left;
    line-height:50px;
    height:50px;
    text-align: center;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
}

.red_text{
    color:red !important;
}

@media (max-width: 1500px){
    .min_hide{
        display: none;
    }

    .info_area{
        width:50%;
    }

    .info_area div{
        width:50%;
    }
}
</style>
