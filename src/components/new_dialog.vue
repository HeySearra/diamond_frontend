<template>
    <div class="new_dialog">
        <el-dialog
            class="dialog_style"
            :visible.sync="dia_vis"
            width="500px">
            <h3>{{title}}</h3>
            <div class="content">
                <div style="height:20px"></div>
                <el-input v-model="name" :placeholder="placeholder" maxLength="60"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dia_vis = false">取 消</el-button>
                <el-button type="primary" @click="dia_vis = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
        title:'',
        placeholder:'',
        dia_vis: false,
        name:'',
        type:'',
        fid:''
    }
  },
  methods:{
    open(type, fid){
        this.type = type;
        this.fid = fid;
        switch(type){
            case 'file':
                this.title = '创建新文件';
                this.placeholder = '请输入文件名称';
                break;
            case 'fold':
                this.title = '创建新文件夹';
                this.placeholder = '请输入文件夹名称';
                break;
            case 'team':
                this.title = '创建新团队';
                this.placeholder = '请输入团队名称';
                break;
        }
        this.name = '';
        this.dia_vis = true;
    }
  }
}
</script>


<style scoped>
@import url("../assets/common.css");
@import url("../assets/dialog_style.css");

</style>
