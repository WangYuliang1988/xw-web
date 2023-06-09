import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '@/stores/user'

// declare moudule 用来给第三方模块进行类型声明
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // 不做代码分割
      // HomeView对应的js和css内容将被打包至app.[hash].js和app.[hash].css中，并在应用初次加载时被加载，即使该路由并没有被访问
      component: HomeView,
      meta: {
        title: '日志 - 学文'
      }
    },
    {
      path: '/login',
      name: 'login',
      // 路由层面的代码分割
      // LoginView对应的js和css内容将被打包成独立的js（login.[hash].js）和css（login.[hash].css），且在该路由被访问时才加载（懒加载）
      component: () => import('@/views/LoginView.vue'),
      meta: {
        title: '登录 - 学文'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: {
        title: '注册 - 学文'
      }
    },
    {
      // 动态路径参数以冒号':'标记，当匹配到一个路由时，参数值会被设置到this.$route.params
      // 当使用路由参数时，例如从/blog/100导航到/blog/200，原来的组件实例会被复用，组件的生命周期钩子不会再被调用
      // 当组件被复用时，如果想对路由参数的变化作出响应，可以watch $route对象，或者使用beforeRouteUpdate导航守卫
      path: '/blog/:id',
      name: 'blog',
      component: () => import('@/views/BlogView.vue')
    },
    {
      path: '/manage/blogs',
      name: 'manage-blogs',
      component: () => import('@/views/ManageBlogs.vue'),
      meta: {
        title: '日志管理 - 学文'
      }
    },
    {
      path: '/manage/blogs/edit',
      name: 'manage-blogs-edit',
      component: () => import('@/views/EditBlog.vue'),
      meta: {
        title: '编辑日志 - 学文'
      }
    },
    {
      path: '/manage/comments',
      name: 'manage-comments',
      component: () => import('@/views/ManageComments.vue'),
      meta: {
        title: '评论管理 - 学文'
      }
    },
    {
      path: '/manage/users',
      name: 'manage-users',
      component: () => import('@/views/ManageUsers.vue'),
      meta: {
        title: '用户管理 - 学文'
      }
    }
  ]
})

router.beforeEach((to) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 检查权限并跳转登录页面
  const userStore = useUserStore()
  if (to.path.startsWith('/manage/') && !userStore.user?.admin) {
    return { name: 'login' }
  }
})

export default router
