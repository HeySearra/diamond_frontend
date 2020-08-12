<template>
  <div class="snow">
    <el-container>
      <el-header>
        <navbar class="nav"></navbar>
      </el-header>
      <el-main style="margin-top: 10px; margin-bottom: 10px; border: solid 2px">
        <doc-editor></doc-editor>
      </el-main>
      <!--el-container>
        <el-aside width="20vw">
          <sidebar></sidebar>
        </el-aside>
        <el-main style="margin-top: 10px">
          ckeditor所见即所得
          <div style="border: solid 2px">
            <ckeditor :editor="editor"
                      @ready="onReady"
                      v-model="editorData"
                      :config="editorConfig"></ckeditor>
          </div>
        </el-main>
      </el-container-->
    </el-container>
  </div>
</template>

<script>

export default {

  data() {
    return {

    }
  },
  methods: {

  }
}
</script>


<style scoped>
@import url("../assets/common.css");

.snow {
  background-image: url("../assets/snow.jpg");
  background-size: cover;
  height: 100vh;
  background-position: center;
}

.nav >>> .el-menu {
  background-color: rgba(255, 255, 255, 0.87) !important;
}

.el-main {
  background-color: rgba(0, 0, 0, 0);
  height: 98vh;
  overflow: hidden;
}
</style>
