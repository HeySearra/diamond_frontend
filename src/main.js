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
import Ripple from 'vue-ripple-directive'
import VueClipboard from 'vue-clipboard2'
import 'jquery'
import './assets/icon_store/iconfont.css'
import './assets/diadoc_icon/iconfont.css'
import 'mavon-editor/dist/css/index.css'
import './assets/common.css'

import navbar from './components/header';
import login from './components/login_block';
import reg from './components/register_block';
import sidebar from './components/sidebar_block'
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
import message_item from './components/message_item';
import message_drawer from './components/message_drawer';
import file_system_block from './components/file_system_block';
import file_system_list from './components/file_system_list';
import file_info_dialog from './components/file_info_dialog';
import move_file_window from './components/move_file_window';
import new_dialog from './components/new_dialog';
import admin_edit_dialog from './components/admin_edit_dialog';
import user_list_item from './components/user_list_item';
import manage_member_dialog from './components/manage_member_dialog';
import choose_path_dialog from './components/choose_path_dialog';
import choose_path_list_item from './components/choose_path_list_item';
import edit_team_info_dialog from './components/edit_team_info_dialog';
import share_dialog from './components/share_dialog';
import edit_user_info_dialog from './components/edit_user_info_dialog';
import change_password_dialog from './components/change_password_dialog';
import chatting_bubble from './components/chatting_bubble';
import chatting_room from './components/chatting_room';
import chatting_dialog from './components/chatting_dialog';
import team_invite_dialog from './components/team_invite_dialog';
import choose_path_dialog_for_template from './components/choose_path_dialog_for_template';

Vue.use(Element);
Vue.use(echarts);
Vue.use(mavonEditor);
Vue.use(CKEditor);
Vue.directive('ripple',Ripple);
Vue.use(VueClipboard);

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
Vue.component('message-item', message_item);
Vue.component('message-drawer', message_drawer);
Vue.component('file-system-block', file_system_block);
Vue.component('file-system-list', file_system_list);
Vue.component('file-info-dialog', file_info_dialog);
Vue.component('new-dialog', new_dialog);
Vue.component('move-file-window', move_file_window);
Vue.component('admin-edit-dialog', admin_edit_dialog);
Vue.component('user-list-item', user_list_item);
Vue.component('manage-member-dialog', manage_member_dialog);
Vue.component('choose-path-dialog', choose_path_dialog);
Vue.component('choose-path-list-item', choose_path_list_item);
Vue.component('edit-team-info-dialog', edit_team_info_dialog);
Vue.component('share-dialog', share_dialog);
Vue.component('edit-user-info-dialog', edit_user_info_dialog);
Vue.component('change-password-dialog', change_password_dialog);
Vue.component('chatting-bubble', chatting_bubble);
Vue.component('chatting-room', chatting_room);
Vue.component('chatting-dialog', chatting_dialog);
Vue.component('team-invite-dialog', team_invite_dialog);
Vue.component('choose-path-dialog-for-template', choose_path_dialog_for_template);

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
Vue.prototype.$echarts = echarts;
Vue.prototype.$host = 'http://localhost:8000'

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
  components: { App,navbar,login,reg},
  template: '<App/>'
})

