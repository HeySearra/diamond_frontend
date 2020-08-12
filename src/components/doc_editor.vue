<template>
  <div class="editor-container" style="border: solid 2px">
    <!-- Toolbar Container -->
    <div id="toolbar-container"></div>
    <!-- Editor Container -->
    <div id="editor">
      <p>This is the initial editor content.</p>
    </div>
  </div>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn'; //中文包
export default {
  mounted() {
    this.initCKEditor()
  },

  data() {
    return {
      Editor: null,//editor instance
    }
  },

  methods: {
    init() {
      this.apply_for_info();
    },

    apply_for_info() {
      //向后台请求一些内容
    },

    initCKEditor() {
      CKEditor.create(document.querySelector('#editor'), {
        language: 'zh-cn',
        /*ckfinder: {
          uploadUrl: ''
          // Back-end processing upload logic returns json data, including uploaded (option true / false) and url two fields
        },*/
        toolbar: {
          items: [
            'exportPdf',
            'undo',
            'redo',
            '|',
            'heading',
            '|',
            'fontSize',
            'fontFamily',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'highlight',
            '|',
            'alignment',
            'pageBreak',
            '|',
            'numberedList',
            'bulletedList',
            '|',
            'indent',
            'outdent',
            '|',
            'todoList',
            'link',
            'blockQuote',
            'imageUpload',
            'insertTable',
            'mediaEmbed',
            '|',
            'codeBlock',
            'code',
            'MathType',
            'ChemType'
          ]
        },
        image: {
          toolbar: [
            'imageTextAlternative',
            'imageStyle:full',
            'imageStyle:side'
          ]
        },
        table: {
          contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells'
          ]
        },
      }).then(editor => {
        const toolbarContainer = document.querySelector('#toolbar-container');
        toolbarContainer.appendChild(editor.ui.view.toolbar.element);
        This.editor = editor //Save the editor to get the contents of the editor at any time, perform some operations
      }).catch(error => {
        console.error(error);
      });
    },

  },
}
</script>

<style scoped>
@import url("../assets/common.css");

.ck-editor__editable {
  border: 1px solid #ccc !important;
  background-color: #ffffff;
}

.editor-container {
  width: 70%;
}

#editor {
  height: 93%;
  margin-top: 1%;
  margin-left: 5%;
  margin-right: 5%;
}

</style>
