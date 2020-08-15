<template>
    <el-dialog   
        class="dialog_style"
        :visible.sync="DialogVisible"
        :close-on-click-modal="false">
        <div class="path" v-if="path.length">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-for="item in path" :key="item.id">{{item.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="file_item" v-for="item in list" :key="item.id">
            <component 
                :is="'fold-list-item'" 
                :is_link="item.is_link"
                :fid="item.id" 
                :name="item.name" 
                :context="context" 
                :is_starred="false"
                :type="'move'"
                @open_info="open">
            </component>
        </div>
        <div class="button">
            <el-button class="back_button" @click="DialogVisible = false">取 消</el-button>
            <el-button class="confirm_button" type="primary" @click="click_to_confirm">确 定</el-button>
        <div class="clear_both"></div>
        </div>
    </el-dialog>
</template>

<script>
export default {
    props: {
        context: {
            type:String,
            default: 'file_system'
        },
        list: {
            type: Array,
            default() {
                return [
                    {
                        type: 'file', // or fold
                        id: '1',
                        is_link: false,
                        is_starred: true,
                        name: 'file',
                    },
                    {
                        type: 'fold', // or file
                        id: '2',
                        is_link: true,
                        is_starred: false,
                        name: 'folder',
                    }
                ]
            }
        }
    },
    data(){
        return {
            fid: '',
            path: [{name:'Apath',id:'idA'},{name:'Bpath',id:'idB'},{name:'Cpath',id:'idC'}],
            DialogVisible: false,
        }
    },
    methods: {
        click_to_confirm(){
            this.DialogVisible = false;
            
        },
        open(){
            this.DialogVisible = true;
        },
    }
}
</script>

<style scoped>
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");
>>>.dialog_style{
    z-index: 100000;
}
.path{
    padding: 0 15px;
    border: solid 1px;
    margin-right:100px;
}
.item_list{
    float: left;
}

.divide_type{
    height: 10px;
}

.big_icon{
    position: absolute;
    top:0;
    left:23px;
    text-align: center;
    line-height:50px;
    width:fit-content;
    color:hsl(219, 15%, 23%);
    font-size:27px;
}

.folder-name{
    position: absolute;
    width:36%;
    line-height:50px;
    height:50px;
    top:0;
    left:69px;
    word-break: break-all;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
}

.button{
    margin: 30px;
}

.back_button{
    float: left;
}

.confirm_button{
    float: right;
}
</style>