<template>
  <el-main>
    <el-aside>
      <sidebar
        ref="sidebar"
        context="doc"
        :file_name="file_name"
      ></sidebar>
    </el-aside>
    <div v-loading="is_loading">
      <el-row style="z-index: 999">
        <!-- Toolbar Container -->
        <div class="new_toobar">
          <div class="append_tools can_not_choose">
            <el-tooltip class="item" effect="dark" content="保存" placement="bottom">
              <span class="icon iconfont" @click="updateDocContent">&#xe82a;</span>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="保存为模板" placement="bottom">
              <span class="icon iconfont" @click="saveAsTemplate">&#xe672;</span>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="收藏" placement="bottom">
              <span class="icon iconfont" v-if="!is_starred" @click="starTheDoc(is_starred)">&#xe65c;</span>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="取消收藏" placement="bottom">
              <span class="icon iconfont" v-if="is_starred" @click="starTheDoc(is_starred)">&#xe65e;</span>
            </el-tooltip>
            <!--el-tooltip class="item" effect="dark" content="历史记录" placement="bottom">
              <span class="icon iconfont">&#xe7de;</span>
            </el-tooltip-->
          </div>
          <div id="toolbar-container" style="min-height:38.67px;">

          </div>
        </div>

      </el-row>
      <el-row>
        <!--el-col :span="5">
          <sidebar></sidebar>
        </el-col-->
        <el-col class="editor-container" :span="18">
          <!-- Editor Container -->
          <input class="editor_title" v-model="file_name" maxlength="60"/>
          <div id="editor">

          </div>
          <div class="editor_bottom"><span></span></div>
        </el-col>
        <el-col :span="6" id="comment-sidebar"><br></el-col>
      </el-row>
    </div>
    <el-progress
        :percentage="loading_percentage"
        class="loading_bar"
        :show-text="false">
    </el-progress>
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
  userId: '',
  // Editor initial data(for testing).
  initialData: '',
  file_name: '',
  ver: -1,
};

class MyUploadAdapter {

  constructor(loader) {
    // The file loader instance to use during the upload.
    this.loader = loader;
    this.xhr = null;
  }

  // Starts the upload process.
  upload() {
    return this.loader.file
      .then(file => new Promise((resolve, reject) => {
        this.uploadFile(file, resolve);
      }));
  }

  getCookie(name) {
    var value = '; ' + document.cookie
    var parts = value.split('; ' + name + '=')
    if (parts.length === 2) return parts.pop().split(';').shift()
  }

  uploadFile(file, resolve) {
    // 上传文件
    var form = new FormData();
    form.append('img', file);
    this.xhr = $.ajax({
      url: "/uploadImg",
      type: 'POST',
      data: form,
      headers: {'X-CSRFToken': this.getCookie('csrftoken')},
      processData: false,
      contentType: false,
      success: function (respJson) {
        console.log(respJson);
        if (respJson.code === 0) {
          resolve({
            default: respJson.url
          });
        } else {
          console.log('上传错误');
        }
      },
      error: function (e) {
        console.log('error uploading img');
        console.log(e);
      }
    });
  }

  // Aborts the upload process.
  abort() {
    // Reject the promise returned from the upload() method.
    if (this.xhr) {
      this.xhr.abort();
      console.log('abort uploading img');
    }
  }
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    // Configure the URL to the upload script in your back-end here!
    return new MyUploadAdapter(loader);
  };
}

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

      refresh_user_info(){
        this.$refs.sidebar.refresh_user_info();
      },

      updateDocContent() {
        var that = this;
        var status = -1;
        let msg = {
          did: pageData.did,
          content: window.editor.getData(),
          name: pageData.file_name,
          ver: pageData.ver,
          auth: 'comment'
        };
        $.ajax({
          type: 'post',
          url: '/document/edit',
          data: JSON.stringify(msg),
          headers: {'X-CSRFToken': this.getCookie('csrftoken')},
          processData: false,
          contentType: false,
          success: function (res) {
            status = res.status;
            if (console_debug) {
              console.log("(post)/document/edit" + " : " + res.status);
            }
            if (res.status === 0) {
              pageData.ver = res.ver;
              alert_msg.success('保存成功');
              //提示成功
            } else {
              switch (res.status) {
                case 1:
                  alert_msg.error('编辑失败: 键值错误');
                  break;
                case 2:
                  alert_msg.error('编辑失败: 您的权限不足或还没有登录');
                  break;
                case 3:
                  alert_msg.error('编辑失败: 您的标题不合法');
                  break;
                case 4:
                  alert_msg.error('编辑失败: 您的内容不合法');
                  break;
                case 5:
                  alert_msg.error('编辑失败: 同目录下存在同名文件');
                  break;
                case 6:
                  alert_msg.warning('请手动合并文档');
                  pageData.ver = res.ver;
                  let newPage = that.$router.resolve({
                    name: 'doc_merge',
                    query:{
                      did: pageData.did
                    }
                  })
                  window.open(newPage.href, '_blank');
                  break;
                case 7:
                  alert_msg.warning('系统已经自动合并文档');
                  that.applyDocContent();
                  window.editor.setData(pageData.initialData);
                  break;
                default:
                  alert_msg.error('编辑失败: 未知错误');
              }
              //that.$router.push({path:'/workbench/recent'});
            }
          },
          error: function () {
            alert_msg.error('连接失败');
          }
        })
        return status;
      },

      applyDocContent() {
        var that = this;
        // this.ver = this.$route.query.ver ? this.$route.query.ver : -1;
        alert_msg.success('更新前版本号: ' + pageData.ver);
        $.ajax({
          type: 'get',
          url: '/document/all?did=' + pageData.did + '&ver=' + pageData.ver,
          headers: {'X-CSRFToken': this.getCookie('csrftoken')},
          async: false,
          success: function (res) {
            if (console_debug) {
              console.log("(get)/document/all" + " : " + res.status);
            }
            if (res.status === 0) {
              pageData.file_name = res.name;
              pageData.initialData = res.content;
              pageData.ver = res.ver;
              alert_msg.success('更新后版本号: ' + pageData.ver);
            } else {
              switch (res.status) {
                case 1:
                  alert_box.msg('加载失败', '键值错误');
                  break;
                case 2:
                  alert_box.msg('加载失败', '您的权限不足或还没有登录');
                  break;
                case 3:
                  alert_box.msg('加载失败', '文档不存在');
                  break;
                default:
                  alert_msg.error('未知错误');
              }
              //跳转到首页
              // that.$router.push({path:'/workbench/recent_view'});
            }
          },
          error: function () {
            alert_msg.error('连接失败');
          }
        })
      },

      /*addComment(data) {
        console.log('Comment added', data);
        if (this.updateDocContent() !== 0) {
          alert_msg.error('上传评论失败: 您的文档不是最新');
          return Promise.reject();
        } else {
          let msg = {
            did: pageData.did,
            // uid: pageData.userId,
            threadId: data.threadId,
            commentId: data.commentId,
            content: data.content,
          };
          $.ajax({
            type: 'post',
            url: '/document/comment/add',
            data: JSON.stringify(msg),
            headers: {'X-CSRFToken': this.getCookie('csrftoken')},
            processData: false,
            contentType: false,
            async: false,
            success: function (res) {
              if (console_debug) {
                console.log("(post)/document/comment/add" + " : " + res.status);
              }
              if (res.status !== 0) {
                switch (res.status) {
                  case 1:
                    alert_msg.error('上传评论失败: 键值错误');
                    break;
                  case 2:
                    alert_msg.error('上传评论失败: 您的权限不足或还没有登录');
                    break;
                  case 3:
                    alert_msg.error('上传评论失败: 文档或评论不存在');
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
          return Promise.resolve({
            createdAt: new Date()       // Should be set on the server side.
          });
        }
        // Write a request to your database here. The returned `Promise`
        // should be resolved when the request has finished.
        // When the promise resolves with the comment data object, it
        // will update the editor comment using the provided data.

      },*/

      addComment(data) {
        console.log('Comment added', data);
        let msg = {
          did: pageData.did,
          // uid: pageData.userId,
          threadId: data.threadId,
          commentId: data.commentId,
          content: data.content,
        };
        $.ajax({
          type: 'post',
          url: '/document/comment/add',
          data: JSON.stringify(msg),
          headers: {'X-CSRFToken': this.getCookie('csrftoken')},
          processData: false,
          contentType: false,
          async: false,
          success: function (res) {
            if (console_debug) {
              console.log("(post)/document/comment/add" + " : " + res.status);
            }
            if (res.status !== 0) {
              switch (res.status) {
                case 1:
                  alert_msg.error('上传评论失败: 键值错误');
                  break;
                case 2:
                  alert_msg.error('上传评论失败: 您的权限不足或还没有登录');
                  break;
                case 3:
                  alert_msg.error('上传评论失败: 文档或评论不存在');
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
        let msg = {
          did: pageData.did,
          // uid: pageData.userId,
          threadId: data.threadId,
          commentId: data.commentId,
          content: data.content
        };
        $.ajax({
          type: 'post',
          url: '/document/comment/update',
          data: JSON.stringify(msg),
          headers: {'X-CSRFToken': this.getCookie('csrftoken')},
          processData: false,
          contentType: false,
          async: false,
          success: function (res) {
            if (console_debug) {
              console.log("(post)/document/comment/update" + " : " + res.status);
            }
            if (res.status !== 0) {
              switch (res.status) {
                case 1:
                  alert_msg.error('更新评论失败: 键值错误');
                  break;
                case 2:
                  alert_msg.error('更新评论失败: 您的权限不足或还没有登录');
                  break;
                case 3:
                  alert_msg.error('更新评论失败: 文档或评论不存在');
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
        // Write a request to your database here. The returned `Promise`
        // should be resolved when the request has finished.
        return Promise.resolve();
      },

      removeComment(data) {
        console.log('Comment removed', data);
        let msg = {
          did: pageData.did,
          // uid: pageData.userId,
          threadId: data.threadId,
          commentId: data.commentId,
        };
        $.ajax({
          type: 'post',
          url: '/document/comment/remove',
          data: JSON.stringify(msg),
          headers: {'X-CSRFToken': this.getCookie('csrftoken')},
          processData: false,
          contentType: false,
          async: false,
          success: function (res) {
            if (console_debug) {
              console.log("(post)/document/comment/remove" + " : " + res.status);
            }
            if (res.status !== 0) {
              switch (res.status) {
                case 1:
                  alert_msg.error('删除评论失败: 键值错误');
                  break;
                case 2:
                  alert_msg.error('删除评论失败: 您的权限不足或还没有登录');
                  break;
                case 3:
                  alert_msg.error('删除评论失败: 文档不存在');
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
        // Write a request to your database here. The returned `Promise`
        // should be resolved when the request has finished.
        return Promise.resolve();
      },

      getCommentThread(data) {
        console.log('Getting comment thread', data);
        var thread_comments;
        let msg = {
          did: pageData.did,
          threadId: data.threadId
        };
        $.ajax({
          type: 'get',
          url: '/document/comment/get_comments_of_thread?did=' + pageData.did + '&threadId=' + data.threadId,
          headers: {'X-CSRFToken': this.getCookie('csrftoken')},
          async: false,
          success: function (res) {
            if (console_debug) {
              console.log("(get)/document/comment/get_comments_of_thread" + " : " + res.status);
            }
            if (res.status === 0) {
              for (var it of res.list) {
                it.createdAt = new Date(it.createdAt);
              }
              //alert_msg.success('获取评论成功');
              thread_comments = res.list;
            } else {
              switch (res.status) {
                case 1:
                  alert_msg.error('加载评论失败: 键值错误');
                  break;
                case 2:
                  alert_msg.error('加载评论失败: 您的权限不足或还没有登录');
                  break;
                case 3:
                  alert_msg.error('加载评论失败: 文档或评论不存在');
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
        // data是thread的编号
        // Write a request to your database here. The returned `Promise`
        // should resolve with the comment thread data.
        return Promise.resolve({
          threadId: data.threadId,
          comments: thread_comments,
          isFromAdapter: true
        });
      },
    };
  }
}

export default {
  mounted() {
    this.init();
    pageData.did = this.$route.params.did;
    pageData.users = [];
    pageData.userId = 'user-1'
    // this.getDocAuth();
    var that = this;
    this.loading_percentage = 0;
    $('.loading_bar').removeClass('loading_bar_done');
    setTimeout(function(){
      that.loading_percentage = 30;
      that.getCurrentUserId();
    }, 0);
    // console.log(this.file_name);
  },

  destroyed(){
    this.applyVerCode_timer ? clearInterval(this.applyVerCode_timer) : '';
    this.online_timer ? clearInterval(this.online_timer) : '';
    this.$emit('refresh_online_list', []);
  },

  data() {
    return {
      Editor: null,//editor instance
      file_name: '',
      did:'',
      article:[],
      loading_percentage:0,
      is_loading: true,
      is_starred: false,
      ver:-1,
      is_newest: true,
      applyVerCode_timer:undefined,
      online_timer:undefined
    }
  },
  /*
  watch: {
    file_name: function () {
      pageData.file_name = this.file_name;
    }
  },*/

  methods: {
    init() {
      this.did = this.$route.params.did;
      this.applyVerCode_timer ? clearInterval(this.applyVerCode_timer) : '';
      this.online_timer ? clearInterval(this.online_timer) : '';
      this.is_newest = true;
      var that = this;
      setTimeout(function(){
        that.applyVerCode();
        that.getCurrentEditingUser();
      }, 0);
      this.applyVerCode_timer = setInterval(function(){
        that.applyVerCode();
      }, 1000*10);
      this.online_timer = setInterval(function(){
        that.getCurrentEditingUser();
      }, 1000*30);
      if(!this.login_manager.get()){
        that.alert_msg.warning('您还未登录，请先登录账号');
        this.$router.push({name:'login'});
        return;
      }
      pageData.did = this.did;
      this.getStarStatus();
      this.apply_for_info();
    },

    apply_for_info() {
      this.$refs.sidebar.init_doc_info(this.did);
    },

    getCookie(name) {
      var value = '; ' + document.cookie
      var parts = value.split('; ' + name + '=')
      if (parts.length === 2) return parts.pop().split(';').shift()
    },
    initCKEditor() {
      var that = this;
      CKEditor.create(document.querySelector('#editor'), {
        language: 'zh-cn',
        initialData: pageData.initialData,
        extraPlugins: [CommentsAdapter, MyCustomUploadAdapterPlugin],
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
          // waitingTime: 5000,
          save(editor) {
            // that.updateDocContent(editor.getData());
          }
        }
      }).then(editor => {
        window.editor = editor;
        //editor.plugins.get('Users').addUser({id: '0'});
        //editor.plugins.get('Users').defineMe('0');
        editor.isReadOnly = pageData.readOnly;
        const toolbarContainer = document.querySelector('#toolbar-container');
        toolbarContainer.appendChild(editor.ui.view.toolbar.element);
        document.querySelector('.ck-toolbar').classList.add('ck-reset_all');
      }).catch(error => {
        console.error(error);
      });
      that.loading_percentage = 100;
      that.loading_done();
    },
    getDocAuth() {
      var that = this;
      let msg = {
        did: pageData.did
      };
      $.ajax({
        type: 'get',
        url: '/document/auth?did=' + pageData.did,
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        // async: false,
        success: function (res) {
          if (that.console_debug) {
            console.log("(get)/document/auth" + " : " + res.status);
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
      // this.ver = this.$route.query.ver ? this.$route.query.ver : -1;
      $.ajax({
        type: 'get',
        url: '/document/all?did=' + pageData.did + '&ver=-1',
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        // async: false,
        success: function (res) {
          if (that.console_debug) {
            console.log("(get)/document/all" + " : " + res.status);
          }
          if (res.status === 0) {
            that.file_name = res.name;
            pageData.initialData = res.content;
            pageData.ver = res.ver;
            that.loading_percentage = 85;
            setTimeout(function(){
              that.initCKEditor();
            }, 100);
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
    applyDocContent() {
      var that = this;
      var content = window.editor.getData();
      // this.ver = this.$route.query.ver ? this.$route.query.ver : -1;
      that.alert_msg.success('更新前版本号: ' + pageData.ver);
      $.ajax({
        type: 'get',
        url: '/document/all?did=' + pageData.did + '&ver=' + pageData.ver,
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        async: false,
        success: function (res) {
          if (that.console_debug) {
            console.log("(get)/document/all" + " : " + res.status);
          }
          if (res.status === 0) {
            that.file_name = res.name;
            content = res.content;
            pageData.ver = res.ver;
            that.alert_msg.success('更新后版本号: ' + pageData.ver);
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
      });
      return content;
    },
    updateDocContent() {
      var that = this;
      let msg = {
        did: pageData.did,
        content: window.editor.getData(),
        name: this.file_name,
        ver: pageData.ver,
        auth: 'write'
      };
      $.ajax({
        type: 'post',
        url: '/document/edit',
        data: JSON.stringify(msg),
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        processData: false,
        contentType: false,
        success: function (res) {
          if (that.console_debug) {
            console.log("(post)/document/edit" + " : " + res.status);
          }
          if (res.status === 0) {
            pageData.ver = res.ver;
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
              case 6:
                that.alert_msg.warning('请手动合并文档');
                pageData.ver = res.ver;
                let newPage = that.$router.resolve({
                  name: 'doc_merge',
                  query:{
                    did: pageData.did
                  }
                })
                window.open(newPage.href, '_blank');
                break;
              case 7:
                that.alert_msg.warning('系统已经自动合并文档');
                const content = that.applyDocContent();
                console.log("获得自动merge后的内容：", content);
                window.editor.setData(content);
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
    },

    applyVerCode() {
      if(!this.is_newest || pageData.ver === -1){
        return;
      }
      var that = this;
      let url = '/document/ver_condition?did=' + pageData.did + '&ver=' + pageData.ver;
      $.ajax({
        type: 'get',
        url: url,
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        // async: false,
        success: function (res) {
          if (that.console_debug) {
            console.log(url + " : " + res.status);
          }
          if (res.status === 0) {
            that.is_newest = res.is_newest;
            if(!res.is_newest){
              clearInterval(that.applyVerCode_timer);
              that.$notify({
                title: '警告',
                message: '检测到有其他用户提交了当前文档，你在提交的时候可能需要合并内容。',
                type: 'warning',
                duration: 6900
              });
            }
          } else {
            switch (res.status) {
              // case 1:
              //   that.alert_msg.error('获取版本号失败: 键值错误');
              //   break;
              // case 2:
              //   that.alert_msg.error('获取版本号失败: 您的权限不足或还没有登录');
              //   break;
              // case 3:
              //   that.alert_msg.error('获取版本号失败: 文档不存在');
              //   break;
              // default:
              //   that.alert_msg.error('获取版本号失败: 未知错误');
            }
          }
        },
        error: function () {
          that.alert_msg.error('连接失败');
        }
      })
    },

    applyHistoryRecord() {
      var that = this;
      $.ajax({
        type: 'get',
        url: '/document/history?did=' + pageData.did,
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        // async: false,
        success: function (res) {
          if (that.console_debug) {
            console.log("(get)/document/all" + " : " + res.status);
          }
          if (res.status === 0) {
            //more operation
          } else {
            switch (res.status) {
              case 1:
                that.alert_msg.error('获取历史记录失败: 键值错误');
                break;
              case 2:
                that.alert_msg.error('获取历史记录失败: 您的权限不足或还没有登录');
                break;
              case 3:
                that.alert_msg.error('获取历史记录失败: 文档不存在');
                break;
              default:
                that.alert_msg.error('获取历史记录失败: 未知错误');
            }
          }
        },
        error: function () {
          that.alert_msg.error('连接失败');
        }
      })
    },

    //将文档内容存储为模版
    saveAsTemplate() {
      console.log('saving as template');
      var that = this;
      let msg = {
        name: this.file_name,
        content: window.editor.getData(),
      };
      $.ajax({
        type: 'post',
        url: '/temp/new',
        data: JSON.stringify(msg),
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        processData: false,
        contentType: false,
        // async: false,
        success: function (res) {
          if (that.console_debug) {
            console.log("(post)/temp/new" + " : " + res.status);
          }
          if (res.status === 0) {
            that.alert_msg.success('保存模板成功');
          } else {
            switch (res.status) {
              // case 1:
              //   that.alert_box.msg('保存模板失败', '键值错误');
              //   break;
              case 2:
                that.alert_msg.error('保存模板失败', '您的权限不足或还没有登录');
                break;
              case 3:
                that.alert_msg.error('您的模板之间的名字不得相同');
                break;
              case 4:
                that.alert_msg.error('模板名称非法');
                break;
              /*case 5:
                that.alert_box.msg('保存模板失败', '同目录下存在同名文件');
                break;*/
              default:
                that.alert_msg.error('发生未知错误');
            }
          }
        },
        error: function () {
          that.alert_msg.error('网络连接失败');
        }
      })
    },
    getAllCommentedUsers() {
      console.log('Getting all commented users');
      var that = this;
      let msg = {
        did: pageData.did
      };
      $.ajax({
        type: 'get',
        url: '/document/comment/get_users?did=' + pageData.did,
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        // async: false,
        success: function (res) {
          if (that.console_debug) {
            console.log("(get)/document/comment/get_users" + " : " + res.status);
          }
          if (res.status === 0) {
            pageData.users = res.list;
            that.loading_percentage = 60;
            setTimeout(function(){
              that.getInitialDocContent();
            }, 100);
            console.log(pageData.users);
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
    getCurrentUserId() {
      var that = this;
      $.ajax({
        type: 'get',
        url: '/user_info',
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        processData: false,
        contentType: false,
        success: function (res) {
          if (that.console_debug) {
            console.log("(get)/user_info" + " : " + res.status);
          }
          if (res.status === 0) {
            pageData.userId = res.uid;
            that.loading_percentage = 40;
            setTimeout(function(){
              that.getAllCommentedUsers();
            }, 100);
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
        error: function () {
          that.alert_msg.error('连接失败');
        }
      });
    },

    //is_starred: true：请求收藏，false：请求取消收藏
    starTheDoc(is_starred) {
      var that = this;
      let msg = {
        id: pageData.did,
        type: 'doc',
        is_starred: is_starred
      };
      $.ajax({
        type: 'post',
        url: '/fs/star',
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        data: JSON.stringify(msg),
        processData: false,
        contentType: false,
        success: function (res) {
          if (that.console_debug) {
            console.log("(post)/fs/star" + " : " + res.status);
          }
          if (res.status === 0) {

            //提示收藏成功/收藏图标变化
          } else {
            const op = is_starred ? '收藏' : '取消收藏';
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
        error: function () {
          that.alert_msg.error('连接失败');
        }
      });
    },
    getStarStatus() {
      var that = this;
      $.ajax({
        type: 'get',
        url: '/fs/star_condition?id=' + pageData.did + "&type=doc",
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        processData: false,
        contentType: false,
        success: function (res) {
          if (that.console_debug) {
            console.log("(post)/fs/star_condition" + " : " + res.status);
          }
          if (res.status === 0) {
            that.is_starred = res.is_starred;
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
        error: function () {
          that.alert_msg.error('连接失败');
        }
      });
    },

    getCurrentEditingUser() {
      var that = this;
      $.ajax({
        type: 'get',
        url: '/document/online?did=' + pageData.did,
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        processData: false,
        contentType: false,
        success: function (res) {
          if (that.console_debug) {
            console.log("(get)/document/online" + " : " + res.status);
          }
          if (res.status === 0) {
            that.$emit('refresh_online_list', res.list);
          } else {
            switch (res.status) {
              // case 1:
              //   that.alert_box.msg('获取正在编辑用户失败', '键值错误');
              //   break;
              // case 2:
              //   that.alert_box.msg('获取正在编辑用户失败', '您的权限不足或还没有登录');
              //   break;
              // case 3:
              //   that.alert_box.msg('获取正在编辑用户失败', '文档不存在');
              //   break;
              // default:
              //   that.alert_msg.error('未知错误');
            }
          }
        },
        error: function () {
          //that.alert_msg.error('连接失败');
        }
      });
    },

    loading_done(){
      var that = this;
      setTimeout(function(){
        that.is_loading = false;
        setTimeout(function(){
          $('.loading_bar').addClass('loading_bar_done');
        }, 360);
      }, 560);
    },

    open_chatting_dialog(){
      this.$emit('open_chatting_dialog');
    },

  },
  /*beforeDestroy() {
    //this.updateDocContent(window.editor.getData());
  },
  beforeRouteLeave() {
    this.updateDocContent(window.editor.getData());
  }*/
}
</script>

<style scoped>
@import url("../assets/common.css");

.ck-editor__editable {
  border: 1px solid #ccc !important;
  background-color: #ffffff;
}

.ck-editor__editable p {
  margin-block-start: 0.5em !important;
  margin-block-end: 0.5em !important;
}

>>>.ck.ck-toolbar{
  border:unset;

  min-width:830px;
}

.editor-container {
  height: calc(100vh - 90px);;
  overflow: overlay;
  background-color: #fff;
  border-right:solid 2px hsl(0, 0%, 90%);
  padding:45px 0 30px;
  min-width:800px;
}

#editor {
  /* height: 95%; */
  /* margin-top: 1%; */
  padding: 1.5em 2em;
  overflow:unset !important;
  height:fit-content !important;
  border:unset !important;
  color:hsl(0, 0%, 23%) !important;
  border-bottom:solid 1px #dedede !important;
  min-height:900px;
  margin:0 6% 0;
}

.editor_title{
  border:unset;
  font-size:30px;
  font-weight: bold;
  margin:1em auto 0;
  width:83%;
  padding:.6em .6em;
  border-bottom: solid 1px #dedede;
  display:block;
  color:hsl(0, 0%, 23%);
}

.editor_title:focus{
  outline: none;
}

#editor>>>p{
  margin: 10px 0;
  color:hsl(0, 0%, 23%) !important;
  font-size:18px;
}

.ck.ck-editor__editable:not(.ck-editor__nested-editable).ck-focused{
  box-shadow: none;
}

#comment-sidebar {
  height: 90vh;
}

.el-main {
  background-color: rgba(0, 0, 0, 0);
  overflow: inherit;
  margin-top: 62px;
}

.el-aside::-webkit-scrollbar {
  width: 0 !important;
}

.el-aside {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

.loading_bar{
    position: fixed;
    top:60px; /* 头部导航栏的高度 */
    left:-6px; /* 为了掩饰圆角，但其实可以设置成方角的 */
    width:calc(100vw + 8px);
    transition: 0.1s opacity linear;
    height:3px;
    z-index:2001
}

.loading_bar_done{
    opacity: 0;
}

>>>.el-progress-bar__inner{
  background-color: hsl(219, 9%, 78%)
}

.el-main>>>.el-loading-mask{
    height: calc(100vh - 56px) !important;
}

.editor_bottom{
  text-align: center;
  margin-top:-15px;
  opacity: 0.3;
}

.editor_bottom span{
  display: inline-block;
  background: url('../assets/logo.png');
  width:100px;
  height:100px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}

.new_toobar{
  border-bottom:solid 1px #ccc;
}

.append_tools{
  position: absolute;
  top: 4px;
  left:9px;
}

.append_tools span{
  font-size: 20px;
  padding: 4px;
  margin: 0;
  display:inline-block;
  border-radius: 2px;
}

.append_tools span:hover{
  background-color: var(--ck-color-button-default-hover-background);
}

#toolbar-container{
  margin-left:105px;
  /*margin-left:140px;*/
}

>>>.ck-user__img {
  border: none !important;
}

</style>
