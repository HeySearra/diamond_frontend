import Vue from 'vue'
import Router from 'vue-router'

import login from '@/pages/login.vue'
import register from '@/pages/register.vue'
import forget from '@/pages/forget.vue'
import message_drawer from '@/components/message_drawer.vue'
import forget_set from '@/pages/forget_set.vue'
import workbench from '@/pages/workbench.vue'
import workbench_recent from '@/pages/workbench_recent.vue'
import workbench_star from '@/pages/workbench_star.vue'
import workbench_create from '@/pages/workbench_create.vue'
import workbench_share from '@/pages/workbench_share.vue'
import team_center from '@/pages/team_center.vue'
import file_system from '@/pages/file_system.vue'
import team_file_system from '@/pages/team_file_system.vue'
import template_store from '@/pages/template_store.vue'
import recycle from '@/pages/recycle.vue'
import test from '@/components/chatting_room.vue'
import doc_editor from "@/pages/doc_editor.vue"
import doc_read_only from "@/pages/doc_read_only.vue"
import doc_comment_only from "@/pages/doc_comment_only.vue"

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
      redirect:'/workbench',
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
      path: '/workbench',
      name: 'workbench',
      component: workbench,
      meta:{
        title:'DiaDoc 工作台',
      },
      children: [
        {
            path: '/workbench',
            redirect:'/workbench/recent_view'
        },
        {
          path:'/workbench/recent_view',
          name: 'workbench_recent',
          component: workbench_recent,
          meta:{
              title:'DiaDoc 最近浏览',
          }
        },
        {
          path:'/workbench/star_view',
          name: 'workbench_star',
          component: workbench_star,
          meta:{
              title:'DiaDoc 我的收藏',
          }
        },
        {
          path:'/workbench/create_view',
          name: 'workbench_create',
          component: workbench_create,
          meta:{
              title:'DiaDoc 我创建的',
          }
        },
        {
          path:'/workbench/share_view',
          name: 'workbench_share',
          component: workbench_share,
          meta:{
              title:'DiaDoc 共享文件',
          }
        },
        {
          path: '/workbench/*',
          redirect:'/workbench/recent_view'
        },
      ]
    },
    {
      path: '/team',
      name: 'team_center',
      component: team_center,
      meta:{
        title:'DiaDoc 我的团队'
      }
    },
    {
      path: '/team/:tid/file/:id',
      name: 'team_file_system',
      component: team_file_system,
      meta:{
        title:'DiaDoc 团队空间'
      }
    },
    {
      path: '/test',
      name: 'test',
      component: test,
      meta:{
        title:'test',
      }
    },
    {
      path: '/file/:id',
      name: 'file_system',
      component: file_system,
      meta:{
        title:'DiaDoc 文件夹',
      }
    },
    {
      path: '/file',
      redirect:'/file/desktop'
    },
    {
      path: '/template',
      name: 'template_store',
      component: template_store,
      meta:{
        title:'DiaDoc 模板库',
      }
    },
    {
      path: '/recycle',
      name: 'recycle',
      component: recycle,
      meta:{
        title:'DiaDoc 回收站',
      },
    },
    {
      path: '/doc/:did',
      name: 'doc',
      component: doc_editor,
      meta:{
        title:'DiaDoc 文章',
      }
    },
  ],
});

export default router;
