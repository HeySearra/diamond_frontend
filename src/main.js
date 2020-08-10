// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/element.css'
import Element from 'element-ui'
import echarts from 'echarts'
import mavonEditor from 'mavon-editor'
import 'jquery'
import './assets/icon_store/iconfont.css'
import 'mavon-editor/dist/css/index.css'
import './assets/common.css'

import msg from './assets/global.js';

import navbar from './components/header';
import arb from './components/article_block';
import udb from './components/user_detail_block';
import lb from './components/list_block';
import slb from './components/select_label_block';
import crb from './components/create_block';
import dab from './components/data_block';
import vcb from './components/view_change_block';
import full_article from './components/full_article_block';
import full_resource from './components/full_resource_block';
import comment from './components/comment_block';
import ccb from './components/comment_content_block';
import aib from './components/author_info_block';
import amb from './components/article_manager_block';
import smb from './components/special_manager_block';
import splb from './components/special_list_block';
import rbmb from './components/recycle_bin_manager_block';
import urb from './components/upload_resource_block';
import urmb from './components/upload_resource_manager_block';
import rsb from './components/resource_block';
import drmb from './components/download_resource_manager_block';
import clb from './components/collection_list_block';
import cmb from './components/collection_manager_block';
import cocb from './components/change_collection_block';
import ssmb from './components/subscribe_manager_block';
import ulb from './components/user_list_block';
import fmb from './components/fans_manager_block';
import vmb from './components/vip_manager_block';
import mb from './components/myinfo_block';
import sdb from './components/setting_diy_block';
import sab from './components/setting_account_block';
import msb from './components/message_block';
import adb from './components/ad_block';
import mec from './components/make_echarts';
import login from './components/login_block';
import reg from './components/register_block';
import vcd from './components/view_collection_dialog'
import vsd from './components/view_special_dialog'
import vtd from './components/view_tag_dialog'

Vue.use(Element);
Vue.use(echarts);
Vue.use(mavonEditor)

Vue.component('navbar', navbar);
Vue.component('arb', arb);
Vue.component('udb', udb);
Vue.component('lb', lb);
Vue.component('slb', slb);
Vue.component('crb', crb);
Vue.component('dab', dab);
Vue.component('vcb', vcb);
Vue.component('full-article', full_article);
Vue.component('full-resource', full_resource);
Vue.component('comment', comment);
Vue.component('ccb', ccb);
Vue.component('aib', aib);
Vue.component('amb', amb);
Vue.component('smb', smb);
Vue.component('splb', splb);
Vue.component('rbmb', rbmb);
Vue.component('urb', urb);
Vue.component('urmb', urmb);
Vue.component('rsb', rsb);
Vue.component('drmb', drmb);
Vue.component('clb', clb);
Vue.component('cmb', cmb);
Vue.component('cocb', cocb);
Vue.component('ssmb', ssmb);
Vue.component('ulb', ulb);
Vue.component('fmb', fmb);
Vue.component('vmb', vmb);
Vue.component('mb', mb);
Vue.component('sdb', sdb);
Vue.component('sab', sab);
Vue.component('msb', msb);
Vue.component('adb', adb);
Vue.component('mec', mec);
Vue.component('login', login);
Vue.component('reg', reg);
Vue.component('vcd', vcd);
Vue.component('vsd', vsd);
Vue.component('vtd', vtd);

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
  components: { App,navbar,arb,udb,lb,full_article,full_resource,ccb,comment,amb,splb,smb,rbmb,urb,rsb,drmb,cmb,cocb,ulb,ssmb,fmb,vmb,mb,sdb,sab,msb,adb,mec,login,reg},
  template: '<App/>'
})

