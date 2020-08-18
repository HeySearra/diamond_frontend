// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/element.css'
import Element from 'element-ui'
// import echarts from 'echarts'
// import mavonEditor from 'mavon-editor'
import CKEditor from '@ckeditor/ckeditor5-vue';
import Ripple from 'vue-ripple-directive'
import VueClipboard from 'vue-clipboard2'
import 'jquery'
import './assets/icon_store/iconfont.css'
import './assets/diadoc_icon/iconfont.css'
// import 'mavon-editor/dist/css/index.css'
import './assets/common.css'

import navbar from './components/header';
import sidebar from './components/sidebar_block'

import message_drawer from './components/message_drawer';
import file_system_block from './components/file_system_block';
import file_system_list from './components/file_system_list';

import edit_user_info_dialog from './components/edit_user_info_dialog';
import change_password_dialog from './components/change_password_dialog';

import chatting_dialog from './components/chatting_dialog';
import team_invite_dialog from './components/team_invite_dialog';


Vue.use(Element);
// Vue.use(echarts);
// Vue.use(mavonEditor);
Vue.use(CKEditor);
Vue.directive('ripple',Ripple);
Vue.use(VueClipboard);

Vue.component('navbar', navbar);
Vue.component('sidebar', sidebar);

Vue.component('message-drawer', message_drawer);
Vue.component('file-system-block', file_system_block);
Vue.component('file-system-list', file_system_list);

Vue.component('edit-user-info-dialog', edit_user_info_dialog);
Vue.component('change-password-dialog', change_password_dialog);

Vue.component('chatting-dialog', chatting_dialog);
Vue.component('team-invite-dialog', team_invite_dialog);

import { alert_msg } from './assets/global.js'
import { alert_box } from './assets/global.js'
import { view_type_manager } from './assets/global.js'
import { login_manager } from './assets/login_state.js'
import { console_debug } from './assets/global.js';
import { datetime_format } from './assets/global.js';
import { magic_word } from './assets/global.js';

Vue.prototype.alert_msg = alert_msg;
Vue.prototype.alert_box = alert_box;
Vue.prototype.login_manager = login_manager;
Vue.prototype.view_type_manager = view_type_manager;
Vue.prototype.console_debug = console_debug;
Vue.prototype.datetime_format = datetime_format;
Vue.prototype.magic_word = magic_word;

Vue.config.productionTip = false;
// Vue.prototype.$echarts = echarts;
Vue.prototype.$host = 'http://47.96.109.229'

Ripple.color = 'rgba(0, 0, 0, 0.07)'

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
  components: { App },
  template: '<App/>'
})

