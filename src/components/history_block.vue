<template>
  <div class="history_block" @click="toHistoryPage">
    <el-row>
      <el-col :span="4"><el-avatar :src="portrait"></el-avatar></el-col>
      <el-col class="name" :span="20">{{name}}</el-col>
    </el-row>
    <el-row style=" font-size: 11px; margin-left:5em; position:absolute; top:45px; left:23px">修改于：{{dt}}</el-row>
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
      type: String,
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
    }
  }
}
</script>

<style scoped>
.history_block{
  padding: 18px 20px;
  cursor: pointer;
  transition:all 0.1s linear;
  position:relative;
}

.history_block:hover{
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
</style>
