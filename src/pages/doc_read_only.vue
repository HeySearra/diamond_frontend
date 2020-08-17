<template>
  <el-main>
    <el-aside class="blur_div">
      <sidebar ref="sidebar"></sidebar>
    </el-aside>
    <el-row style="z-index: 999" class="blur_div">
      <!-- Toolbar Container -->
      <div id="toolbar-container"></div>
    </el-row>
    <el-row class="blur_div">
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
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn'; //中文包
const appData = {
  // Users data.
  users: [
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
  ],

  // The ID of the current user.
  userId: 'user-1',

  // Editor initial data.
  initialData: ''
};
class CommentsAdapter {
  constructor( editor ) {
    this.editor = editor;
  }

  init() {
    const usersPlugin = this.editor.plugins.get( 'Users' );
    const commentsRepositoryPlugin = this.editor.plugins.get( 'CommentsRepository' );

    // Load the users data.
    for ( const user of appData.users ) {
      usersPlugin.addUser( user );
    }

    // Set the current user.
    usersPlugin.defineMe( appData.userId );

    // Set the adapter on the `CommentsRepository#adapter` property.
    commentsRepositoryPlugin.adapter = {
      addComment( data ) {
        console.log( 'Comment added', data );

        // Write a request to your database here. The returned `Promise`
        // should be resolved when the request has finished.
        // When the promise resolves with the comment data object, it
        // will update the editor comment using the provided data.
        return Promise.resolve( {
          createdAt: new Date()       // Should be set on the server side.
        } );
      },

      updateComment( data ) {
        console.log( 'Comment updated', data );

        // Write a request to your database here. The returned `Promise`
        // should be resolved when the request has finished.
        return Promise.resolve();
      },

      removeComment( data ) {
        console.log( 'Comment removed', data );

        // Write a request to your database here. The returned `Promise`
        // should be resolved when the request has finished.
        return Promise.resolve();
      },

      getCommentThread( data ) {
        console.log( 'Getting comment thread', data );

        // Write a request to your database here. The returned `Promise`
        // should resolve with the comment thread data.
        return Promise.resolve( {
          threadId: data.threadId,
          comments: [
            {
              commentId: 'comment-1',
              authorId: 'user-2',
              content: '<p>Are we sure we want to use a made-up disorder name?</p>',
              createdAt: new Date()
            }
          ],
          isFromAdapter: true
        } );
      }
    };
  }
}
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

    refresh_user_info(){
      this.$refs.sidebar.refresh_user_info();
    },

    initCKEditor() {
      CKEditor.create(document.querySelector('#editor'), {
        language: 'zh-cn',
        //initialData: appData.initialData,
        //extraPlugins: [CommentsAdapter],
        /*ckfinder: {
          uploadUrl: ''
          // Back-end processing upload logic returns json data, including uploaded (option true / false) and url two fields
        },*/
        licenseKey: 'seuYU5TnNtW9thIKlRcf3ArZw9c7Rf5d1JuDv3q8iNeo+V8m4o9xnds=',
        sidebar: {
          container: document.querySelector('#comment-sidebar')
        },
      }).then(editor => {
        window.editor = editor //Save the editor to get the contents of the editor at any time, perform some operations
        editor.plugins.get('Users').addUser({id: '0'});
        editor.plugins.get('Users').defineMe('0');
        editor.isReadOnly = true;
        const toolbarContainer = document.querySelector('#toolbar-container');
        //toolbarContainer.appendChild(editor.ui.view.toolbar.element);
        document.querySelector('.ck-toolbar').classList.add('ck-reset_all');
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
  height: 92vh;
}

#editor {
  height: 99%;
  margin-top: 1%;
}

#comment-sidebar {
  height: 95vh;
}

.el-main {
  background-color: rgba(0, 0, 0, 0);
  border: solid 2px;
  overflow: inherit;
  margin-top: 60px;
}

</style>
