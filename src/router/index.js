import Vue from 'vue'
import Router from 'vue-router'


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
      redirect:'/file/desktop',
    },
    {
      path: '/login',
      name: 'login',
      component: login => require(['@/pages/login.vue'], login),
      meta:{
        title:'DiaDoc 登录',
      }
    },
    {
      path: '/register',
      name: 'register',
      component: register => require(['@/pages/register.vue'], register),
      meta:{
        title:'DiaDoc 注册',
      }
    },
    {
      path: '/forget',
      name: 'forget',
      component: forget => require(['@/pages/forget.vue'], forget),
      meta:{
        title:'DiaDoc 找回密码',
      }
    },
    {
      path: '/forget/set',
      name: 'forget_set',
      component: forget_set => require(['@/pages/forget_set.vue'], forget_set),
      meta:{
        title:'DiaDoc 重置密码',
      }
    },
    {
      path: '/workbench',
      name: 'workbench',
      component: workbench => require(['@/pages/workbench.vue'], workbench),
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
          component: workbench_recent => require(['@/pages/workbench_recent.vue'], workbench_recent),
          meta:{
              title:'DiaDoc 最近浏览',
          }
        },
        {
          path:'/workbench/star_view',
          name: 'workbench_star',
          component: workbench_star => require(['@/pages/workbench_star.vue'], workbench_star),
          meta:{
              title:'DiaDoc 我的收藏',
          }
        },
        {
          path:'/workbench/create_view',
          name: 'workbench_create',
          component: workbench_create => require(['@/pages/workbench_create.vue'], workbench_create),
          meta:{
              title:'DiaDoc 我创建的',
          }
        },
        {
          path:'/workbench/share_view',
          name: 'workbench_share',
          component: workbench_share => require(['@/pages/workbench_share.vue'], workbench_share),
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
      component: team_center => require(['@/pages/team_center.vue'], team_center),
      meta:{
        title:'DiaDoc 我的团队'
      }
    },
    {
      path: '/team/:tid/file/:id',
      name: 'team_file_system',
      component: team_file_system => require(['@/pages/team_file_system.vue'], team_file_system),
      meta:{
        title:'DiaDoc 团队空间'
      }
    },
    {
      path: '/file/:id',
      name: 'file_system',
      component: file_system => require(['@/pages/file_system.vue'], file_system),
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
      component: template_store => require(['@/pages/template_store.vue'], template_store),
      meta:{
        title:'DiaDoc 模板库',
      }
    },
    {
      path: '/recycle',
      name: 'recycle',
      component: recycle => require(['@/pages/recycle.vue'], recycle),
      meta:{
        title:'DiaDoc 回收站',
      },
    },
    {
      path: '/doc/:did',
      name: 'doc',
      component: doc_editor => require(["@/pages/doc_editor.vue"], doc_editor),
      meta:{
        title:'DiaDoc 文章',
      }
    },
    {
      path: '/doc/comment_only/:did',
      name: 'doc_comment_only',
      component: doc_comment_only => require(["@/pages/doc_comment_only.vue"], doc_comment_only),
      meta:{
        title:'DiaDoc 文章',
      }
    },
    {
      path: '/doc/read_only/:did',
      name: 'doc_read_only',
      component: doc_read_only => require(["@/pages/doc_read_only.vue"], doc_read_only),
      meta:{
        title:'DiaDoc 文章',
      }
    },
    {
      path: '/doc/:did/merge',
      name: 'doc_merge',
      component: doc_merge => require(["@/pages/doc_merge"], doc_merge),
      meta:{
        title:'DiaDoc 合并文章',
      }
    },
    {
      path: '/search',
      name: 'search',
      component: search => require(['@/pages/search.vue'], search),
      meta:{
        title:'DiaDoc 搜索结果',
      }
    },
  ],
});

export default router;
