import Vue from 'vue'
import Router from 'vue-router'

import login from '@/pages/login.vue'
import register from '@/pages/register.vue'
import forget from '@/pages/forget.vue'
import message_drawer from '@/components/message_drawer.vue'
import forget_set from '@/pages/forget_set.vue'
import test_sidebar from '@/pages/test_sidebar.vue'

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
      path: '/forget/set',
      name: 'forget_set',
      component: forget_set,
      meta:{
        title:'DiaDoc 重置密码',
      }
    },
    {
      path: '/message_drawer',
      name: 'message_drawer',
      component: message_drawer,
      meta:{
        title:'消息抽屉',
      }
    },
    {
      path: '/test_sidebar',
      name: 'test_sidebar',
      component: test_sidebar,
      meta:{
        title:'DiaDoc 侧边栏测试',
      }
    },
  ],
});

export default router;
