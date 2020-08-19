<template>
  <el-main>
    <el-aside>
      <sidebar
        id="sidebar"
        ref="sidebar"
        class="blur_div"
        context="doc"
        :file_name="file_name"
      ></sidebar>
      <transition name="el-zoom-in-top">
      <div v-show="show_history" id="history"
        style="z-index: 1000;
                  width: 320px;
                  height: 100%;
                  background-color: rgba(245, 245, 245, 0.69);
                  position: absolute;
                  left: 0;
                  top: 0;
                  display: none;
                  overflow: overlay;
                  ">
        <el-row style="margin-top: 20px;
                       margin-bottom: 20px;
                       padding: 0 10px 0 30px;">
          <el-col :span="20" style="font-size:20px; font-weight: bolder">历史记录</el-col>
          <el-col :span="4"><span class="icon iconfont"
                                  style="font-size: 25px; margin-top: 1px; cursor: pointer;"
                                  @click="closeHistoryBlock">&#xe79b;</span></el-col>
        </el-row>
        <div style="background-color:#ddd; height:1px"></div>
        <history-block
          v-for="item in history_list"
          :key="item.ver"
          :name="item.name"
          :dt="item.dt"
          :portrait="item.portrait"
          :ver="item.ver"
          :did="did"
          @rollbackHistory="rollbackHistory">
        </history-block>
      </div>
      </transition>
    </el-aside>
    <div v-loading="is_loading" class="blur_div">
      <el-row style="z-index: 999">
        <!-- Toolbar Container -->
        <div class="new_toobar">
          <div class="append_tools can_not_choose">
            <el-tooltip class="item" effect="dark" content="保存" placement="bottom">
              <span class="icon iconfont" style="color:hsl(202, 69%, 36%)" @click="updateDocContent">&#xe82b;</span>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="保存为模板" placement="bottom">
              <span class="icon iconfont" @click="saveAsTemplate">&#xe672;</span>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-if="!is_starred" content="收藏" placement="bottom">
              <span class="icon iconfont" @click="starTheDoc(is_starred)">&#xe65c;</span>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-if="is_starred" content="取消收藏" placement="bottom">
              <span class="icon iconfont" @click="starTheDoc(is_starred)">&#xe65e;</span>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="历史记录" placement="bottom">
              <span class="icon iconfont" @click="showHistoryBlock">&#xe7de;</span>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-if="!is_locking&&locking_uid==''" content="开启编辑锁" placement="bottom">
              <span class="icon iconfont" @click="lock">&#xe62d;</span>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-if="!is_locking&&locking_uid!=''" content="其他用户已开启编辑锁" placement="bottom">
              <span class="icon iconfont" style="color:hsl(1, 69%, 73%)" @click="lock">&#xe62b;</span>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-if="is_locking" content="编辑锁已开启" placement="bottom">
              <span class="icon iconfont" style="color:hsl(100, 45%, 45%)" @click="lock">&#xe62b;</span>
            </el-tooltip>
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

var pageData = {
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
  status: '',
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
        //console.log(respJson);
        if (respJson.code === 0) {
          resolve({
            default: respJson.url
          });
        } else {
          //console.log('上传错误');
        }
      },
      error: function (e) {
        //console.log('error uploading img');
        //console.log(e);
      }
    });
  }

  // Aborts the upload process.
  abort() {
    // Reject the promise returned from the upload() method.
    if (this.xhr) {
      this.xhr.abort();
      //console.log('abort uploading img');
    }
  }
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    // Configure the URL to the upload script in your back-end here!
    return new MyUploadAdapter(loader);
  };
}

var tthat;

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
          async: false,
          success: function (res) {
            pageData.initialData = res.status;
            if (console_debug) {
              console.log("(post)/document/edit" + " : " + res.status);
            }
            //console.log("(post)/document/edit" + " : " + res.status);
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
                    params:{
                      did: pageData.did
                    }
                  })
                  window.open(newPage.href, '_blank');
                  break;
                case 7:
                  alert_msg.warning('系统已经自动合并文档');
                  window.editor.setData(that.applyDocContent());
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
        return pageData.initialData;
      },

      applyDocContent() {
        var that = this;
        pageData.initialData = window.editor.getData();
        $.ajax({
          type: 'get',
          url: '/document/all?did=' + pageData.did + '&ver=-1',
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
              //alert_msg.success('更新后版本号: ' + pageData.ver);
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
            }
          },
          error: function () {
            alert_msg.error('连接失败');
          }
        });
        return pageData.initialData;
      },

      /*addComment(data) {
        console.log('Comment added', data);
        let msg = {
          did: pageData.did,
          // uid: pageData.userId,
          threadId: data.threadId,
          commentId: data.commentId,
          content: data.content,
        };
        var ajaxStatus = 0;
        $.ajax({
          type: 'post',
          url: '/document/comment/add',
          data: JSON.stringify(msg),
          headers: {'X-CSRFToken': this.getCookie('csrftoken')},
          processData: false,
          contentType: false,
          async: false,
          success: function (res) {
            ajaxStatus = res.status;
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
        const status = this.updateDocContent();
        console.log(status);
        if (status !== 0 && status !== 7) {
          this.removeComment(data);
        }
        console.log(window.editor.getData());
        setTimeout(function () {
          $('.ck-user').off('click');
          $('.ck-user').click(function () {
            var uid = $(this).attr('data-user-id');
            alert(uid);
          });
        }, 0);
        // Write a request to your database here. The returned `Promise`
        // should be resolved when the request has finished.
        // When the promise resolves with the comment data object, it
        // will update the editor comment using the provided data.
        return Promise.resolve({
          createdAt: new Date()       // Should be set on the server side.
        });


      },*/
      removeCommentInDB(data) {
        //console.log('Comment removed in db', data);
        let msg = {
          did: pageData.did,
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
        });
      },

      addComment(data) {
        //console.log('Comment added', data);
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
        setTimeout(function () {
          $('.ck-user').off('click');
          $('.ck-user').click(function () {
            var uid = $(this).attr('data-user-id');
            tthat.$emit('open_user_info', uid);
          });
        }, 0);
        // Write a request to your database here. The returned `Promise`
        // should be resolved when the request has finished.
        // When the promise resolves with the comment data object, it
        // will update the editor comment using the provided data.
        return Promise.resolve({
          createdAt: new Date()       // Should be set on the server side.
        });
      },

      updateComment(data) {
        //console.log('Comment updated', data);
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
        //console.log('Comment removed', data);
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
        //console.log('Getting comment thread', data);
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
    this.did = this.$route.params.did;
    if (!this.getDocAuth()) {
      return;
    }
    this.init();
    pageData.did = this.$route.params.did;
    pageData.users = [];
    pageData.userId = 'user-1'
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
    this.locking_timer ? clearInterval(this.locking_timer) : '';
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
      is_locked: false,
      ver:-1,
      is_newest: true,
      applyVerCode_timer:undefined,
      online_timer:undefined,
      history_list:[],
      show_history: false,
      is_locking: false,
      locking_flag: false,
      locking_uid: '',
      locking_timer: undefined
    }
  },

  watch: {
    file_name: function () {
      pageData.file_name = this.file_name;
    },
    locking_uid(value, old_value){
      const h = this.$createElement;
      if(value == this.login_manager.get_uid()){
        this.is_locking = true;
      }
      else{
        if(value!='' && old_value==''){
          this.$notify({
            title: '有其他用户开启了编辑锁',
            message: '你不能保存该文档了',
            type: 'warning',
          });
          this.locking_flag = true;
        }
        else{
          if(this.is_locking==false && old_value!='' && old_value!=this.login_manager.get_uid()){
            this.$notify({
              title: '编辑锁已释放',
              message: '重新进入该页面可保存文档',
            });
          }
        }
        this.is_locking = false;
      }
    },
    $route(value, old_value) {
      location.reload();
    }
  },

  methods: {
    init() {
      this.applyVerCode_timer ? clearInterval(this.applyVerCode_timer) : '';
      this.online_timer ? clearInterval(this.online_timer) : '';
      this.is_newest = true;
      this.is_locking = false;
      this.locking_flag = false;
      this.locking_uid = '';
      this.locking_timer = undefined;
      tthat = this;
      var that = this;
      if(!this.login_manager.get()){
        that.alert_msg.warning('您还未登录，请先登录账号');
        this.$router.push({name:'login'});
        return;
      }
      setTimeout(function(){
        that.getCurrentEditingUser();
      }, 0);
      this.applyVerCode_timer = setInterval(function(){
        that.applyVerCode();
      }, 1000*10);
      this.online_timer = setInterval(function(){
        that.getCurrentEditingUser();
      }, 1000*10);
      this.locking_timer = setInterval(function(){
        that.repeat_send_lock();
      }, 1000*60);
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
            'comment',
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
        setTimeout(function () {
          $('.ck-user').off('click');
          $('.ck-user').click(function () {
            var uid = $(this).attr('data-user-id');
            that.$emit('open_user_info', uid);
          });
        }, 0);
      }).catch(error => {
        console.error(error);
      });
      that.loading_percentage = 100;
      that.loading_done();
    },
    getDocAuth() {
      var that = this;
      var ret = true;
      let msg = {
        did: pageData.did
      };
      $.ajax({
        type: 'get',
        url: '/document/auth?did=' + this.did,
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        async: false,
        success: function (res) {
          if (that.console_debug) {
            console.log("(get)/document/auth" + " : " + res.status);
          }
          if (res.status === 0) {
            switch (res.auth) {
              case "comment":
                that.$router.push({name: 'doc_comment_only', params: {did:that.did}});
                ret = false;
                break;
              case "read":
                that.$router.push({name: 'doc_read_only', params: {did:that.did}});
                ret = false;
                break;
              case "none":
                that.$router.push({path: '/'});
                ret = false;
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
      return ret;
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
      pageData.initialData = window.editor.getData();
      // this.ver = this.$route.query.ver ? this.$route.query.ver : -1;
      $.ajax({
        type: 'get',
        url: '/document/all?did=' + pageData.did + '&ver=-1',
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        async: false,
        success: function (res) {
          if (that.console_debug) {
            console.log("(get)/document/all" + " : " + res.status);
          }
          if (res.status === 0) {
            that.file_name = res.name;
            pageData.initialData = res.content;
            pageData.ver = res.ver;
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
      return pageData.initialData;
    },
    updateDocContent() {
      if(this.locking_flag){
        if(this.locking_uid != ''){
          this.alert_msg.warning('该文档已被上锁，您不能保存该文章');
        }
        else{
          this.alert_msg.warning('你需要重新进入该文档才能保存');
        }
        return;
      }
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
                  params:{
                    did: pageData.did
                  }
                })
                window.open(newPage.href, '_blank');
                break;
              case 7:
                that.alert_msg.warning('系统已经自动合并文档');
                const content = that.applyDocContent();
                //console.log("获得自动merge后的内容：", content);
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
      //console.log('saving as template');
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
      //console.log('Getting all commented users');
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
            //console.log(pageData.users);
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
        is_starred: !is_starred
      };
      $.ajax({
        type: 'post',
        url: '/fs/star',
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        data: JSON.stringify(msg),
        processData: false,
        contentType: false,
        async: false,
        success: function (res) {
          if (that.console_debug) {
            console.log("(post)/fs/star" + " : " + res.status);
          }
          if (res.status === 0) {
            var opp = !is_starred ? '收藏' : '取消收藏';
            that.is_starred = !that.is_starred;
            that.alert_msg.success(opp + '成功');
          } else {
            const op = is_starred ? '收藏' : '取消收藏';
            switch (res.status) {
              case 2:
                that.alert_msg.error('您的权限不足或还没有登录');
                break;
              case 3:
                that.alert_msg.error('找不到文档');
                break;
              default:
                that.alert_msg.error('发生未知错误');
            }
          }
        },
        error: function () {
          that.alert_msg.error('网络连接失败');
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
            that.locking_uid = res.locked_uid;
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

    showHistoryBlock(){
      if(this.show_history){
        this.closeHistoryBlock();
        return;
      }
      this.show_history = true;
      $('.sidebar').addClass('blur_style');
      //$('.el-aside').attr('overflow', 'hidden !important');
      //$('#sidebar').css('display', 'none');
      var that = this;
      $.ajax({
        type: 'get',
        url: '/document/history?did=' + pageData.did,
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        processData: false,
        contentType: false,
        async: true,
        success: function (res) {
          //console.log("(get)/document/history" + " : " + res.status);
          if (res.status === 0) {
            that.history_list = res.list;
          }
        },
        error: function () {
          //that.alert_msg.error('连接失败');
        }
      });
    },
    closeHistoryBlock(){
      $('.sidebar').removeClass('blur_style');
      this.show_history = false;
      //$('#sidebar').css('display', 'inherit');
    },

    lock(){
      if(this.locking_flag){
        if(this.locking_uid != ''){
          this.alert_msg.warning('有其他用户正开启编辑锁');
        }
        else{
          this.alert_msg.warning('你必须重新进入文章才会开启编辑锁');
        }
        return;
      }
      let url = "/document/lock";
      var that = this;
      let data = new Object();
      data.did = this.did;
      data.op = this.is_locking ? false : true;
      $.ajax({
        type:'post',
        url: url,
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        data: JSON.stringify(data),
        async:false,
        success:function (res){
            if(that.console_debug)console.log(url+ " : " +res.status);
            if(res.status == 0){
              that.is_locking = !that.is_locking;
              if(that.is_locking){
                that.alert_msg.success('成功开启编辑锁');
                that.locking_uid = that.login_manager.get_uid();
              }
              else{
                that.alert_msg.success('成功释放编辑锁');
                that.locking_uid = '';
              }
            }
            else{
                switch(res.status){
                  case 2:
                    that.alert_msg.error('权限不足');
                    break;
                  case 3:
                    that.alert_msg.error('文档不存在');
                    break;
                  case 4:
                    that.alert_msg.error('有其他用户开启了编辑锁');
                    break;
                  default:
                    that.alert_msg.error('发生未知错误');
                }
            }
        },
        error:function(){
            that.alert_msg.error('网络连接失败');
        }
      });
    },

    repeat_send_lock(){
      if(!this.is_locking){
        return;
      }
      let url = "/document/lock";
      var that = this;
      let data = new Object();
      data.did = this.did;
      data.op = true;
      $.ajax({
        type:'post',
        url: url,
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        data: JSON.stringify(data),
        processData: false,
        contentType: false,
        success:function (res){
            if(that.console_debug)console.log(url+ " : " +res.status);
            if(res.status == 0){

            }
            else{
                that.alert_msg.error('编辑锁状态更新失败');
            }
        },
        error:function(){
            that.alert_msg.error('网络连接失败');
        }
      });
    },

    rollbackHistory(his_ver) {
      var that = this;
      // this.ver = this.$route.query.ver ? this.$route.query.ver : -1;
      $.ajax({
        type: 'get',
        url: '/document/all?did=' + pageData.did + '&ver=' + his_ver,
        headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        async: false,
        success: function (res) {
          if (that.console_debug) {
            console.log("(get)/document/all" + " : " + res.status);
          }
          if (res.status === 0) {
            that.file_name = res.name;
            window.editor.setData(res.content);
            that.alert_msg.success('导入历史记录成功');
          } else {
            that.alert_msg.error('导入历史记录失败，请重新尝试');
          }
        },
        error: function () {

        }
      });
    }


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
  /*overflow: hidden !important;*/

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
  top: 5px;
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
  /*margin-left:140px*/
  margin-left:169px;
}

>>>.ck-user__img{
  border: none !important;
}

>>>.ck-user{
  cursor:pointer !important;
}

</style>
