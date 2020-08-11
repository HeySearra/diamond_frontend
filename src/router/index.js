import Vue from 'vue'
import Router from 'vue-router'

import login from '@/pages/login.vue'
import register from '@/pages/register.vue'
import forget from '@/pages/forget.vue'
import forget_set from '@/pages/forget.vue'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router =  new Router({
  mode: 'history',//改成history模式
  routes: [
    {
      path: '/',
      redirect:'/index',
    },
    {
      path: '/index',
      name: 'index',
      component: login,

    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta:{
        title:'DiaDoc 登录',
      }
    },
    {
      path: '/register',
      name: 'register',
      component: register,
      meta:{
        title:'DiaDoc 注册',
      }
    },
    {
      path: '/forget',
      name: 'forget',
      component: forget,
      meta:{
        title:'DiaDoc 找回密码',
      }
    },
    {
      path: '/forget_set',
      name: 'forget_set',
      component: forget_set,
      meta:{
        title:'DiaDoc 重置密码',
      }
    },
  ],
});

export default router;
