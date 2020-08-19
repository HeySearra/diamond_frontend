<template>
  <!--div class="history_block">
    <el-row>
      <el-col :span="4" @click="toHistoryPage"><el-avatar :src="portrait"></el-avatar></el-col>
      <el-col class="name" :span="18" @click="toHistoryPage">{{name}}</el-col>
      <el-col :span="2" style="z-index: 1200" @click="addToEditor">
        <el-tooltip class="item" effect="dark" content="导出到编辑器" placement="bottom">
          <span class="icon iconfont">&#xe7f3;</span>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row style=" font-size: 11px; margin-left:5em; position:absolute; top:45px; left:23px">修改于：{{dt}}</el-row>
  </div-->
  <div>
    <el-col :span="20" class="selection-block" @click.native="toHistoryPage">
      <el-row style="margin: 18px 0 18px 20px">
        <el-col :span="6"><el-avatar :src="portrait"></el-avatar></el-col>
        <el-col :span="18" class="name">
          <el-row class="name">{{name}}</el-row>
          <el-row class="dt">修改于：{{dt}}</el-row>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="4" class="selection-block" style="height: 81px" @click.native="addToEditor">
      <div style="margin-top: 15px; margin-left: 15px">
        <el-button type="text" @click="open"><span class="icon iconfont">&#xe7f3;</span></el-button>
      </div>
    </el-col>
  </div>
</template>

<script>
export default {
  name: "history_block",
  props: {
    portrait: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    dt: {
      type: String,
      default: ''
    },
    ver: {
      type: Number,
      default: ''
    },
    did: {
      type: String,
      default: ''
    }
  },
  methods: {
    toHistoryPage() {
      let newPage = this.$router.resolve({
        name: 'doc_history',
        params:{
          did: this.did,
          ver: this.ver,
        }
      });
      console.log(newPage);
      window.open(newPage.href, '_blank');
    },
    addToEditor() {
      this.$confirm('您的编辑器中的内容会被替换成历史版本的内容。\n您正在编辑的内容将会丢失，确认继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('rollbackHistory', this.ver);
      }).catch(() => {

      });

    }
  },
}
</script>

<style scoped>
.history_block{
  padding: 18px 20px;
  cursor: pointer;
  border-bottom: solid 1px #ddd;
  transition:all 0.1s linear;
  position:relative;
}

.history_block:hover{
  background-color: hsla(0, 0%, 0%, 0.09);
}

.selection-block{
  cursor: pointer;
  transition:all 0.1s linear;
}

.selection-block:hover{
  background-color: hsla(0, 0%, 0%, 0.09);
}

.name{
  margin:-2px 0 0 0;
  text-indent:1em;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; /* 行数 */
  overflow: hidden;
}

.dt{
  font-size: 11px;
  margin-top: 7px;
}
</style>
