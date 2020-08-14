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
        </div>
      </el-col>
      <el-col :span="6" id="comment-sidebar" style="border: solid 2px;"><br></el-col>
    </el-row>
  </el-main>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn';
import {alert_box, alert_msg, console_debug} from "../assets/global";

const pageData = {
  did: '',
  commentsOnly: false,
  readOnly: false,
  // Users data.
  users: [],
  // The ID of the current user.
  userId: 'user-1',
  // Editor initial data(for testing).
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
    for (const user of pageData.users) {
      usersPlugin.addUser(user);
    }

    // Set the current user.
    usersPlugin.defineMe(pageData.userId);

    // Set the adapter on the `CommentsRepository#adapter` property.
    commentsRepositoryPlugin.adapter = {

      getCookie (name) {
        var value = '; ' + document.cookie
        var parts = value.split('; ' + name + '=')
        if (parts.length === 2) return parts.pop().split(';').shift()
      },

      addComment(data) {
        console.log('Comment added', data);
        /*let msg = {
          did: pageData.did,
          uid: pageData.userId,
          threadId: data.threadId,
          commentId: data.commentId,
          content: data.content
        };
        $.ajax({
          type: 'post',
          url: '/doc/comment/add',
          data: JSON.stringify(msg),
          headers: {'X-CSRFToken': this.getCookie('csrftoken')},
          processData: false,
          contentType: false,
          async: false,
          success: function (res) {
            if (console_debug) {
              console.log("(post)/doc/comment/add" + " : " + res.status);
            }
            if (res.status !== 0) {
              switch (res.status) {
                case 1:
                  alert_box.msg('上传评论失败', '键值错误');
                  break;
                case 2:
                  alert_box.msg('上传评论失败', '您的权限不足或还没有登录');
                  break;
                case 3:
                  alert_box.msg('上传评论失败', '文档不存在');
                  break;
                default:
                  alert_msg.error('未知错误');
              }
            }
          },
          error: function () {
            alert_msg.error('连接失败');
          }
        });*/
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
        /*let msg = {
          did: pageData.did,
          uid: pageData.userId,
          threadId: data.threadId,
          commentId: data.commentId,
          content: data.content
        };
        $.ajax({
          type: 'post',
          url: '/doc/comment/update',
          data: JSON.stringify(msg),
          headers: {'X-CSRFToken': this.getCookie('csrftoken')},
          processData: false,
          contentType: false,
          async: false,
          success: function (res) {
            if (console_debug) {
              console.log("(post)/doc/comment/update" + " : " + res.status);
            }
            if (res.status !== 0) {
              switch (res.status) {
                case 1:
                  alert_box.msg('上传评论失败', '键值错误');
                  break;
                case 2:
                  alert_box.msg('上传评论失败', '您的权限不足或还没有登录');
                  break;
                case 3:
                  alert_box.msg('上传评论失败', '文档不存在');
                  break;
                default:
                  alert_msg.error('未知错误');
              }
            }
          },
          error: function () {
            alert_msg.error('连接失败');
          }
        });*/
        // Write a request to your database here. The returned `Promise`
        // should be resolved when the request has finished.
        return Promise.resolve();
      },

      removeComment(data) {
        console.log('Comment removed', data);
        /*let msg = {
          did: pageData.did,
          uid: pageData.userId,
          threadId: data.threadId,
          commentId: data.commentId,
        };
        $.ajax({
          type: 'post',
          url: '/doc/comment/remove',
          data: JSON.stringify(msg),
          headers: {'X-CSRFToken': this.getCookie('csrftoken')},
          processData: false,
          contentType: false,
          async: false,
          success: function (res) {
            if (console_debug) {
              console.log("(post)/doc/comment/remove" + " : " + res.status);
            }
            if (res.status !== 0) {
              switch (res.status) {
                case 1:
                  alert_box.msg('上传评论失败', '键值错误');
                  break;
                case 2:
                  alert_box.msg('上传评论失败', '您的权限不足或还没有登录');
                  break;
                case 3:
                  alert_box.msg('上传评论失败', '文档不存在');
                  break;
                default:
                  alert_msg.error('未知错误');
              }
            }
          },
          error: function () {
            alert_msg.error('连接失败');
          }
        });*/
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
          //commmets: this.getCommentsOfThread(data.threadId),
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
      },

      getCommentsOfThread(threadId) {
        let msg = {
          did: pageData.did,
          threadId: threadId
        };
        $.ajax({
          type: 'get',
          url: '/doc/comment/get_comments_of_thread',
          data: JSON.stringify(msg),
          headers: {'X-CSRFToken': this.getCookie('csrftoken')},
          processData: false,
          contentType: false,
          async: false,
          success: function (res) {
            if (console_debug) {
              console.log("(get)/doc/comment/get_comments_of_thread" + " : " + res.status);
            }
            if (res.status === 0) {
              return res.list;
            } else {
              switch (res.status) {
                case 1:
                  alert_box.msg('加载评论失败', '键值错误');
                  break;
                case 2:
                  alert_box.msg('加载评论失败', '您的权限不足或还没有登录');
                  break;
                case 3:
                  alert_box.msg('加载评论失败', '文档不存在');
                  break;
                default:
                  alert_msg.error('未知错误');
              }
            }
          },
          error: function () {
            alert_msg.error('连接失败');
          }
        });
      }
    };
  }
}

export default {
  mounted() {
    pageData.did = this.$route.params.did;
    pageData.users = [
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

    // this.getDocAuth();
    this.getInitialDocContent();
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

    getCookie (name) {
      var value = '; ' + document.cookie
      var parts = value.split('; ' + name + '=')
      if (parts.length === 2) return parts.pop().split(';').shift()
    },

    initCKEditor() {
      var that = this;
      CKEditor.create(document.querySelector('#editor'), {
        language: 'zh-cn',
        initialData: pageData.initialData,
        extraPlugins: [CommentsAdapter],
        /*ckfinder: {
          uploadUrl: ''
          // Back-end processing upload logic returns json data, including uploaded (option true / false) and url two fields
        },*/
        simpleUpload: {
          // The URL that the images are uploaded to.
          uploadUrl: 'http://example.com',

          // Enable the XMLHttpRequest.withCredentials property.
          withCredentials: true,

          // Headers sent along with the XMLHttpRequest to the upload server.
          headers: {
            'X-CSRF-TOKEN': 'CSFR-Token',
            Authorization: 'Bearer <JSON Web Token>'
          }
        },
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
        licenseKey: 'seuYU5TnNtW9thIKlRcf3ArZw9c7Rf5d1JuDv3q8iNeo+V8m4o9xnds=',
        sidebar: {
          container: document.querySelector('#comment-sidebar')
        },
        commentsOnly: pageData.commentsOnly,
        autosave: {
          //waitingTime: 5000,
          save(editor) {
            that.updateDocContent(editor.getData());
            //console.log(editor.model.document.getRootNames());
            //editor.model.change( writer => {
            //writer.setSelection( writer.createPositionAt( editor.model.document.getRoot(), 0 ) );
            //} );
            // autosave.forceDisabled("key");
            //this.forceDisabled("autosave");
            //editor.setData("ko"); //并不适合在此处更新文章
            //this.autosave.clearForceDisabled("autosave");
            //console.log( editor.getData() );
          }
        }
      }).then(editor => {
        window.editor = editor; //Save the editor to get the contents of the editor at any time, perform some operations
        //editor.plugins.get('Users').addUser({id: '0'});
        //editor.plugins.get('Users').defineMe('0');
        editor.isReadOnly = pageData.readOnly;
        const toolbarContainer = document.querySelector('#toolbar-container');
        toolbarContainer.appendChild(editor.ui.view.toolbar.element);
        document.querySelector('.ck-toolbar').classList.add('ck-reset_all');
      }).catch(error => {
        console.error(error);
      });
    },
    getDocAuth() {
      var that = this;
      const did = this.$route.params.did;
      let msg = {
        did: did
      };
      $.ajax({
        type: 'get',
        url: '/doc/auth',
        data: JSON.stringify(msg),
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        processData: false,
        contentType: false,
        async: false,
        success: function (res) {
          if (that.console_debug) {
            console.log("(get)/doc/auth" + " : " + res.status);
          }
          if (res.status === 0) {
            switch (res.auth) {
              case "read":
                pageData.readOnly = true;
                break;
              case "comment":
                pageData.commentsOnly = true;
                break;
              default:
                break;
            }
          } else {
            switch (res.status) {
              case 1:
                that.alert_box.msg('加载失败', '键值错误');
                break;
              case 2:
                that.alert_box.msg('加载失败', '您的权限不足或还没有登录');
                break;
              case 3:
                that.alert_box.msg('加载失败', '文档不存在');
                break;
              default:
                that.alert_msg.error('未知错误');
            }
            //that.$router.push({path:'/workbench/recent_view'});
          }
        },
        error: function () {
          that.alert_msg.error('连接失败');
        }
      });
    },
    getInitialDocContent() {
      //通过路由获取文章id
      var that = this;
      var did = this.$route.params.did;
      console.log(did);
      var msg = {
        did: did,
      };
      console.log(msg);
      console.log(JSON.stringify(msg));
      $.ajax({
        type: 'get',
        url: '/doc/all',
        data: JSON.stringify(msg),
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        processData: false,
        contentType: false,
        async: false,
        success: function (res) {
          if (that.console_debug) {
            console.log("(get)/doc/all" + " : " + res.status);
          }
          if (res.status === 0) {
            //res.name
            pageData.initialData = res.content;
            console.log(res.content);
          } else {
            switch (res.status) {
              case 1:
                that.alert_box.msg('加载失败', '键值错误');
                break;
              case 2:
                that.alert_box.msg('加载失败', '您的权限不足或还没有登录');
                break;
              case 3:
                that.alert_box.msg('加载失败', '文档不存在');
                break;
              default:
                that.alert_msg.error('未知错误');
            }
            //跳转到首页
            // that.$router.push({path:'/workbench/recent_view'});
          }
        },
        error: function () {
          that.alert_msg.error('连接失败');
        }
      })
    },
    updateDocContent1(content) {
      //console.log( window.editor.getData() );
      console.log(content);
    },
    updateDocContent(content) {
      var that = this;
      const did = this.$route.params.did;
      let msg = {
        did: did,
        content: content,
        name: ''
      };
      $.ajax({
        type: 'post',
        url: '/doc/edit',
        data: JSON.stringify(msg),
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        processData: false,
        contentType: false,
        success: function (res) {
          if (that.console_debug) {
            console.log("(post)/doc/edit" + " : " + res.status);
          }
          if (res.status === 0) {
            that.alert_msg.success('保存成功');
            //提示成功
          } else {
            switch (res.status) {
              case 1:
                that.alert_msg.error('编辑失败: 键值错误');
                break;
              case 2:
                that.alert_msg.error('编辑失败: 您的权限不足或还没有登录');
                break;
              case 3:
                that.alert_msg.error('编辑失败: 您的标题不合法');
                break;
              case 4:
                that.alert_msg.error('编辑失败: 您的内容不合法');
                break;
              case 5:
                that.alert_msg.error('编辑失败: 同目录下存在同名文件');
                break;
              default:
                that.alert_msg.error('编辑失败: 未知错误');
            }
            //that.$router.push({path:'/workbench/recent'});
          }
        },
        error: function () {
          that.alert_msg.error('连接失败');
        }
      })
    }
  },

  //将文档内容存储为模版
  saveAsTemplate() {
    var that = this;
    const did = this.$route.params.did;
    let msg = {
      name: '',
      content: content,
    };
    $.ajax({
      type: 'post',
      url: '/temp/new',
      data: JSON.stringify(msg),
      headers: {'X-CSRFToken': this.getCookie('csrftoken')},
      processData: false,
      contentType: false,
      async: false,
      success: function (res) {
        if (that.console_debug) {
          console.log("(post)/temp/new" + " : " + res.status);
        }
        if (res.status === 0) {
          return res.tid;
        } else {
          switch (res.status) {
            case 1:
              that.alert_box.msg('保存模板失败', '键值错误');
              break;
            case 2:
              that.alert_box.msg('保存模板失败', '您的权限不足或还没有登录');
              break;
            case 3:
              that.alert_box.msg('保存模板失败', '您的模板名称不合法');
              break;
            /*case 4:
              that.alert_box.msg('保存模板失败', '您的内容不合法');
              break;
            case 5:
              that.alert_box.msg('保存模板失败', '同目录下存在同名文件');
              break;*/
            default:
              that.alert_msg.error('未知错误');
          }
        }
      },
      error: function () {
        that.alert_msg.error('连接失败');
      }
    })
  },

  getAllCommentedUsers() {
    var that = this;
    const did = this.$route.params.did;
    let msg = {
      did: did
    };
    $.ajax({
      type: 'get',
      url: '/doc/comment/get_users',
      data: JSON.stringify(msg),
      headers: {'X-CSRFToken': this.getCookie('csrftoken')},
      processData: false,
      contentType: false,
      async: false,
      success: function (res) {
        if (that.console_debug) {
          console.log("(get)/doc/comment/get_users" + " : " + res.status);
        }
        if (res.status === 0) {
          pageData.users = res.list;
        } else {
          switch (res.status) {
            case 1:
              that.alert_box.msg('加载评论用户失败', '键值错误');
              break;
            case 2:
              that.alert_box.msg('加载评论用户失败', '您的权限不足或还没有登录');
              break;
            case 3:
              that.alert_box.msg('加载评论用户失败', '文档不存在');
              break;
            default:
              that.alert_msg.error('未知错误');
          }
        }
        //跳转到首页
        //that.$router.push({path:'/workbench/recent'});
      },
      error: function () {
        that.alert_msg.error('连接失败');
      }
    });
  },
  getCurrentUserId(){
    var that = this;
    $.ajax({
      type:'get',
      url:'/user_info',
      headers: {'X-CSRFToken': this.getCookie('csrftoken')},
      processData: false,
      contentType: false,
      async: false,
      success:function (res){
        if (that.console_debug) {
          console.log("(get)/user_info" + " : " + res.status);
        }
        if (res.status === 0) {
          pageData.userId = res.uid;
        } else {
          switch (res.status) {
            case 1:
              that.alert_box.msg('加载用户信息失败', '键值错误');
              break;
            case 2:
              that.alert_box.msg('加载用户信息失败', '您还没有登录');
              break;
            default:
              that.alert_msg.error('未知错误');
          }
        }
      },
      error:function(){
        that.alert_msg.error('连接失败');
      }
    });
  },
  //is_stared: true：请求收藏，false：请求取消收藏
  starTheDoc(is_stared) {
    var that = this;
    const did = this.$route.params.did;
    let msg = {
      id: did,
      type: 'doc',
      is_stared: is_stared
    };
    $.ajax({
      type:'post',
      url:'/fs/star',
      headers: {'X-CSRFToken': this.getCookie('csrftoken')},
      data: JSON.stringify(msg),
      processData: false,
      contentType: false,
      success:function (res){
        if (that.console_debug) {
          console.log("(post)/fs/star" + " : " + res.status);
        }
        if (res.status === 0) {
          //提示收藏成功/收藏图标变化
        } else {
          const op = is_stared ? '收藏' : '取消收藏';
          switch (res.status) {
            case 1:
              that.alert_box.msg(op + '失败', '键值错误');
              break;
            case 2:
              that.alert_box.msg(op + '失败', '您的权限不足或还没有登录');
              break;
            case 3:
              that.alert_box.msg(op + '失败', '文档不存在');
              break;
            default:
              that.alert_msg.error('未知错误');
          }
        }
      },
      error:function(){
        that.alert_msg.error('连接失败');
      }
    });
  },

  getStarStatus() {
    var that = this;
    const did = this.$route.params.did;
    let msg = {
      id: did,
      type: 'doc',
    };
    $.ajax({
      type:'get',
      url:'/fs/star_condition',
      headers: {'X-CSRFToken': this.getCookie('csrftoken')},
      data: JSON.stringify(msg),
      processData: false,
      contentType: false,
      async: false,
      success:function (res){
        if (that.console_debug) {
          console.log("(post)/fs/star_condition" + " : " + res.status);
        }
        if (res.status === 0) {
          return res.is_stared;
        } else {
          switch (res.status) {
            case 1:
              that.alert_box.msg('获取收藏状态失败', '键值错误');
              break;
            case 2:
              that.alert_box.msg('获取收藏状态失败', '文档不存在');
              break;
            default:
              that.alert_msg.error('未知错误');
          }
        }
      },
      error:function(){
        that.alert_msg.error('连接失败');
      }
    });
  },

  //多人实时同步编辑不好实现
  //此函数可以用来获取当前正在浏览这篇文章的用户
  getCurrentEditingUser(){
    var that = this;
    const did = this.$route.params.did;
    let msg = {
      id: did,
    };
    $.ajax({
      type:'get',
      url:'/doc/online',
      headers: {'X-CSRFToken': this.getCookie('csrftoken')},
      data: JSON.stringify(msg),
      processData: false,
      contentType: false,
      success:function (res){
        if (that.console_debug) {
          console.log("(get)/doc/online" + " : " + res.status);
        }
        if (res.status === 0) {
          return res.list;
        } else {
          switch (res.status) {
            case 1:
              that.alert_box.msg('获取正在编辑用户失败', '键值错误');
              break;
            case 2:
              that.alert_box.msg('获取正在编辑用户失败', '您的权限不足或还没有登录');
              break;
            case 3:
              that.alert_box.msg('获取正在编辑用户失败', '文档不存在');
              break;
            default:
              that.alert_msg.error('未知错误');
          }
        }
      },
      error:function(){
        that.alert_msg.error('连接失败');
      }
    });
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

.el-aside::-webkit-scrollbar {
  width: 0 !important;
}

.el-aside {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

</style>
