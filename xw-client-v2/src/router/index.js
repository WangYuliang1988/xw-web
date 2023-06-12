import Vue from 'vue'
import store from "../store"
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter) // Vue通过Vue.use()方法来使用插件

// 定义路由，每个路由映射一个组件
const routes = [
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
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue'),
    meta: {
      title: '登录 - 学文'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ '../views/RegisterView.vue'),
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
    component: () => import(/* webpackChunkName: "blog" */ '../views/BlogView.vue')
  },
  {
    path: '/manage/blogs',
    name: 'manage-blogs',
    component: () => import(/* webpackChunkName: "manage-blogs" */ '../views/ManageBlogs.vue'),
    meta: {
      title: '日志管理 - 学文'
    }
  },
  {
    path: '/manage/blogs/edit',
    name: 'manage-blogs-edit',
    component: () => import(/* webpackChunkName: "manage-blogs-edit" */ '../views/EditBlog.vue'),
    meta: {
      title: '编辑日志 - 学文'
    }
  },
  {
    path: '/manage/comments',
    name: 'manage-comments',
    component: () => import(/* webpackChunkName: "manage-comments" */ '../views/ManageComments.vue'),
    meta: {
      title: '评论管理 - 学文'
    }
  },
  {
    path: '/manage/users',
    name: 'manage-users',
    component: () => import(/* webpackChunkName: "manage-users" */ '../views/ManageUsers.vue'),
    meta: {
      title: '用户管理 - 学文'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 检查权限并跳转登录页面
  const user = store.getters.user
  if (to.path.startsWith("/manage/") && !user?.admin) {
    next("/login")
  } else {
    next()
  }
})

export default router
