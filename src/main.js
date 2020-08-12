// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/element.css'
import Element from 'element-ui'
import echarts from 'echarts'
import mavonEditor from 'mavon-editor'
import CKEditor from '@ckeditor/ckeditor5-vue';
import 'jquery'
import './assets/icon_store/iconfont.css'
import './assets/diadoc_icon/iconfont.css'
import 'mavon-editor/dist/css/index.css'
import './assets/common.css'

import navbar from './components/header';
import login from './components/login_block';
import reg from './components/register_block';
import sidebar from './components/team_sidebar'
import forget_block from './components/forget_block';
import forget_set_block from './components/forget_set_block';
import file_block from './components/file_block';
import file_list_item from './components/file_list_item';
import fold_block from './components/fold_block';
import fold_list_item from './components/fold_list_item';
import team_block from './components/team_block';
import file_display_block from './components/file_display_block';
import file_display_list from './components/file_display_list';
import team_display_block from './components/team_display_block';
import template_block from './components/template_block';
import template_display_block from './components/template_display_block';
import doc_editor from './components/doc_editor';
import message_item from './components/message_item';

Vue.use(Element);
Vue.use(echarts);
Vue.use(mavonEditor);
Vue.use(CKEditor);

Vue.component('navbar', navbar);
Vue.component('login', login);
Vue.component('reg', reg);
Vue.component('sidebar', sidebar);
Vue.component('forget', forget_block);
Vue.component('forget-set', forget_set_block);
Vue.component('file-block', file_block);
Vue.component('file-list-item', file_list_item);
Vue.component('fold-block', fold_block);
Vue.component('fold-list-item', fold_list_item);
Vue.component('team-block', team_block);
Vue.component('file-display-block', file_display_block);
Vue.component('file-display-list', file_display_list);
Vue.component('team-display-block', team_display_block);
Vue.component('template-block', template_block);
Vue.component('template-display-block', template_display_block);
Vue.component('doc-editor', doc_editor);
Vue.component('message-item', message_item);

import { alert_msg } from './assets/global.js'
import { alert_box } from './assets/global.js'
import { login_manager } from './assets/login_state.js'
Vue.prototype.alert_msg = alert_msg;
Vue.prototype.alert_box = alert_box;
Vue.prototype.login_manager = login_manager;

Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
Vue.prototype.$host = 'http://localhost:8000'

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App,navbar,login,reg},
  template: '<App/>'
})

