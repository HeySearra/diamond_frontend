<template>
  <el-main>
    <el-aside>
      <sidebar context="doc"></sidebar>
    </el-aside>
    <el-row style="z-index: 999">
      <!-- Toolbar Container -->
      <div id="toolbar-container"></div>
    </el-row>
    <el-row>
      <!--el-col :span="5">
        <sidebar></sidebar>
      </el-col-->
      <el-col class="editor-container" style="border: solid 2px;" :span="18">
        <!-- Editor Container -->
        <div id="editor">
          <p>This is the initial editor content.</p>
        </div>
      </el-col>
      <el-col :span="6" id="comment-sidebar" style="border: solid 2px;"><br></el-col>
    </el-row>
  </el-main>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn';
const appData = {
  // Users data.
  users: [],

  // The ID of the current user.
  userId: 'user-1',

  // Editor initial data.
  initialData:
    '<h2>\
                    <comment id="thread-1" type="start"></comment>\
                    Bilingual Personality Disorder\
                    <comment id="thread-1" type="end"></comment>\
                </h2>\
                <p>\
                    This may be the first time you hear about this made-up disorder but it actually isn’t so far from the truth.\
                    As recent studies show, the language you speak has more effects on you than you realize.\
                    According to the studies, the language a person speaks affects their cognition,\
                    behavior, emotions and hence <strong>their personality</strong>.\
                </p>\
                <p>\
                    This shouldn’t come as a surprise\
                    <a href="https://en.wikipedia.org/wiki/Lateralization_of_brain_function">since we already know</a>\
                    that different regions of the brain become more active depending on the activity.\
                    The structure, information and especially <strong>the culture</strong> of languages varies substantially\
                    and the language a person speaks is an essential element of daily life.\
                </p>'
};

class CommentsAdapter {
  constructor(editor) {
    this.editor = editor;
  }

  init() {
    const usersPlugin = this.editor.plugins.get('Users');
    const commentsRepositoryPlugin = this.editor.plugins.get('CommentsRepository');

    // Load the users data.
    for (const user of appData.users) {
      usersPlugin.addUser(user);
    }

    // Set the current user.
    usersPlugin.defineMe(appData.userId);

    // Set the adapter on the `CommentsRepository#adapter` property.
    commentsRepositoryPlugin.adapter = {
      addComment(data) {
        console.log('Comment added', data);

        // Write a request to your database here. The returned `Promise`
        // should be resolved when the request has finished.
        // When the promise resolves with the comment data object, it
        // will update the editor comment using the provided data.
        return Promise.resolve({
          createdAt: new Date()       // Should be set on the server side.
        });
      },

      updateComment(data) {
        console.log('Comment updated', data);

        // Write a request to your database here. The returned `Promise`
        // should be resolved when the request has finished.
        return Promise.resolve();
      },

      removeComment(data) {
        console.log('Comment removed', data);

        // Write a request to your database here. The returned `Promise`
        // should be resolved when the request has finished.
        return Promise.resolve();
      },

      getCommentThread(data) {
        console.log('Getting comment thread', data);
        console.log(new Date());
        // data是thread的编号
        // Write a request to your database here. The returned `Promise`
        // should resolve with the comment thread data.
        return Promise.resolve({
          threadId: data.threadId,
          comments: [
            {
              commentId: 'comment-1',
              authorId: 'user-2',
              content: '<p>Are we sure we want to use a made-up disorder name?</p>',
              createdAt: new Date()
            },
            {
              commentId: 'comment-2',
              authorId: 'user-1',
              content: '<p>We want to use a made-up disorder name.</p>',
              createdAt: new Date()
            }
          ],
          isFromAdapter: true
        });
      }
    };
  }
}
let window_editor;
export default {
  mounted() {
    appData.users = [
      {
        id: 'user-1',
        name: 'Joe Doe',
        // Note that the avatar is optional.
        avatar: 'https://randomuser.me/api/portraits/thumb/men/26.jpg'
      },
      {
        id: 'user-2',
        name: 'Ella Harper',
        avatar: 'https://randomuser.me/api/portraits/thumb/women/65.jpg'
      }
    ];
    this.initCKEditor();
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
      var that = this;
      CKEditor.create(document.querySelector('#editor'), {
        language: 'zh-cn',
        initialData: appData.initialData,
        extraPlugins: [CommentsAdapter],
        //initialData: appData.initialData,
        //extraPlugins: [CommentsAdapter],
        /*ckfinder: {
          uploadUrl: ''
          // Back-end processing upload logic returns json data, including uploaded (option true / false) and url two fields
        },*/
        toolbar: {
          items: [
            'undo',
            'redo',
            'exportPdf',
            '|',
            'heading',
            '|',
            'fontSize',
            'fontFamily',
            'fontColor',
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
            'comment',
            'code',
            'codeBlock',
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
        //plugins: [Autosave],
        licenseKey: 'seuYU5TnNtW9thIKlRcf3ArZw9c7Rf5d1JuDv3q8iNeo+V8m4o9xnds=',
        sidebar: {
          container: document.querySelector('#comment-sidebar')
        },
        autosave: {
          save( editor ) {
            that.updateDocContent(editor.getData());
            //console.log( editor.getData() );
          }
        }

      }).then(editor => {
        window.editor = editor; //Save the editor to get the contents of the editor at any time, perform some operations
        window_editor = editor;
        //editor.plugins.get('Users').addUser({id: '0'});
        //editor.plugins.get('Users').defineMe('0');
        //editor.isReadOnly = true;
        const toolbarContainer = document.querySelector('#toolbar-container');
        toolbarContainer.appendChild(editor.ui.view.toolbar.element);
        document.querySelector('.ck-toolbar').classList.add('ck-reset_all');
      }).catch(error => {
        console.error(error);
      });
    },
    getDocContent() {
      //通过路由获取文章id
      const did = '1';
      $.ajax({
        type: 'get',
        url: '',
        data: {
          'did': did
        },
        dataType: 'json',
        success: function (res) {
          if (res.status === 0) {
            //res.name
            appData.initialData = res.content;
          } else {
            switch (res.status) {
              case 1:
                this.alert_box.msg('加载失败', '键值错误');
                break;
              case 2:
                this.alert_box.msg('加载失败', '您的权限不足或还没有登录');
                break;
              case 3:
                this.alert_box.msg('加载失败', '文档不存在');
                break;
              default:
                this.alert_msg.error('未知错误');
            }
            //跳转到首页
          }
        },
        error: function () {
          this.alert_msg.error('连接失败');
        }
      })
    },
    updateDocContent(content) {
      console.log( content );
    },
    updateDocContent1(content) {
      //通过路由获取文章id
      const did = '1';
      $.ajax({
        type: 'post',
        url: '',
        data: {
          'did': did,
          'content': content,
          'name': ''
        },
        dataType: 'json',
        success: function (res) {
          if (res.status === 0) {
            //提示成功
          } else {
            switch (res.status) {
              case 1:
                this.alert_box.msg('编辑失败', '键值错误');
                break;
              case 2:
                this.alert_box.msg('编辑失败', '您的权限不足或还没有登录');
                break;
              case 3:
                this.alert_box.msg('编辑失败', '您的标题不合法');
                break;
              case 4:
                this.alert_box.msg('编辑失败', '您的内容不合法');
                break;
              case 5:
                this.alert_box.msg('编辑失败', '同目录下存在同名文件');
                break;
              default:
                this.alert_msg.error('未知错误');
            }
          }
        },
        error: function () {
          this.alert_msg.error('连接失败');
        }
      })
    }
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
  height: 90vh;
}

#editor {
  height: 95%;
  margin-top: 1%;
}

#comment-sidebar {
  height: 90vh;
}

.el-main {
  background-color: rgba(0, 0, 0, 0);
  border: solid 2px;
  overflow: inherit;
  margin-top: 60px;
}

</style>
