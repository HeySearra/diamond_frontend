<template>
  <div style="margin-left: 20px; margin-bottom: 18px; cursor: pointer;" @click="toHistoryPage">
    <el-row>
      <el-col :span="4"><el-avatar :src="portrait"></el-avatar></el-col>
      <el-col :span="20" style="margin-top: 9px">{{name}}</el-col>
    </el-row>
    <el-row style="margin-top: 5px; font-size: 11px;">修改于：{{dt}}</el-row>
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
        query:{
          did: this.did,
          ver: this.ver,
        }
      })
      window.open(newPage.href, '_blank');
    }
  }
}
</script>

<style scoped>

</style>
