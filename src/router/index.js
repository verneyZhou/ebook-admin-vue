import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)', // 表示匹配零个或多个路由，比如路由为 /redirect 时，仍然能匹配到 redirect 组件
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true } // affix为true则在面包屑导航上始终展示
      }
    ]
  }
]

export const asyncRoutes = [

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'Error Pages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },

  {
    path: '/book',
    name: 'book',
    component: Layout,
    redirect: '/book/create',
    meta: {
      title: '图书管理',
      icon: 'documentation',
      roles: ['editor']
    },
    children: [
      {
        path: '/book/create',
        name: 'bookCreate',
        component: () => import('@/views/book/create'),
        meta: { title: '上传图书', icon: 'edit', roles: ['admin'] }
      },
      {
        path: '/book/edit/:fileName',
        name: 'bookEdit',
        component: () => import('@/views/book/edit'),
        hidden: true, // 隐藏路由
        meta: {
          title: '编辑图书',
          icon: 'edit',
          roles: ['admin'],
          activeMenu: '/book/list' // 指定高亮的路由
        }
      },
      {
        path: '/book/list',
        name: 'bookList',
        component: () => import('@/views/book/list'),
        meta: { title: '图书列表', icon: 'list', roles: ['editor'] }
      },
      {
        path: '/book/search',
        name: 'bookSearch',
        component: () => import('@/views/book/search'),
        meta: { title: '图书查询', icon: 'edit' },
        hidden: true
      }
    ]
  },
  {
    path: '/resource',
    component: Layout,
    redirect: '/resource/list',
    meta: {
      title: '资源管理',
      icon: 'documentation',
      roles: ['editor']
    },
    children: [
      {
        path: '/resource/list',
        component: () => import('@/views/book/create'),
        meta: { title: '资源列表', icon: 'edit', roles: ['qa'] }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
