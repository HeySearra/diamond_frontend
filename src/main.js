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
import './assets/diadoc_icon/iconfont.css'
import 'mavon-editor/dist/css/index.css'
import './assets/common.css'

import navbar from './components/header';
import login from './components/login_block';
import reg from './components/register_block';

Vue.use(Element);
Vue.use(echarts);
Vue.use(mavonEditor)

Vue.component('navbar', navbar);
Vue.component('login', login);
Vue.component('reg', reg);

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

