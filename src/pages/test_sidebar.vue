<template>
  <div class="snow">
    <el-container>
      <el-header>
        <navbar class="nav"></navbar>
      </el-header>
      <el-container>
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
      </el-container>
    </el-container>
  </div>
</template>

<script>
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn'; //中文包
export default {

  data() {
    return {
      editor: DecoupledEditor,
      editorData: '<p>Content of the editor.</p>',
      editorConfig: {
        // The configuration of the editor.
        language: 'zh-cn',  // 中文
      },
    }
  },
  methods: {
    onReady( editor )  {
      // Insert the toolbar before the editable area.
      editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
    }
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

</style>
