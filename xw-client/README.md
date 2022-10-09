# 工程简介
基于 Vue.js 开发的 Web 前端工程，通过 Bootstrap 实现移动优先的响应式 UI。

- **Vue** 是一个前端 MVVM 框架，可实现**数据-视图**的双向绑定，简化视图层开发，参考：https://vuejs.bootcss.com/guide/

- **Bootstrap** 是一个偏前端样式实现的库，秉持移动优先原则，提供大量的定制CSS、图标、组件等，其实现基于原始的 JavaScript，并且需依赖 jQuery，参考：https://getbootstrap.com

- **BootstrapVue** 是 Bootstrap 库的 Vue 实现，其实现基于 Vue，且无需依赖 jQuery，参考：https://bootstrap-vue.org/

# 工程搭建
通过 Vue CLI 创建 Vue 工程，并以安装插件的形式引入 BootstrapVue，自动完成各类依赖的安装和引用，简化操作。具体步骤如下：

1. 在 xw-web 目录下执行：vue create xw-client，安装过程中出现的选项选默认，Vue 版本选择 Vue 2；
2. 在 xw-web 目录下执行：cd xw-client，切换目录；
3. 在 xw-client 目录下执行：vue add bootstrap-vue，安装过程中出现的提示选 Y;
4. 在 xw-client 目录下执行：npm run serve，提示编译成功，完成。

# 目录结构
```python
xw-client/                      # 根目录
|
+- node_modules/                # 存放各依赖库
|
+- public/                      # 存放静态资源，该目录下的文件会被直接复制到最终的打包文件中，而不经过 Webpack 处理，引用时需使用绝对路径
|
+- src/                         # 存放源码
|  |
|  +- assets                    # 存放静态资源，该目录下的文件会被 Webpack 解析为模块依赖，通过相对路径引用
|  |
|  +- components                # 存放自定义组件
|  |
|  +- plugins                   # 存放用到的插件
|  |
|  +- App.vue                   # 首页组件，又称根组件
|  |
|  +- main.js                   # 主入口文件
|
+- babel.config.js              # 项目的 polyfill 配置文件
|
+- jsconfig.json                # Visual Studio Code 使用，可以通过一些配置来提升开发体验和开发效率
|
+- package-lock.json            # 工程依赖描述文件
|
+- package.json                 # 工程依赖描述文件
|
+- vue.config.js                # 用于进行如项目打包、devServer、CSS处理等配置
```

# 依赖介绍

## Axios
参考：https://www.axios-http.cn/docs/intro

Axios 是一个基于 Promise 的网络请求库，可用于 Node.js 和浏览器中。在 Node.js 中它使用原生的 http 模块, 而在浏览器中则使用 XMLHttpRequests。

## Vue Router
参考：https://router.vuejs.org/zh/

Vue Router 是 Vue.js 官方的路由插件，用于构建单页面应用。

Vue Router 是基于路由和组件的，具体来说：
- 路由是一组映射关系（key-value），用来将路径（key）和组件（value）映射起来；
- 在单页面应用中，页面路径的改变实际上是组件的切换。

## Vuex
参考：https://vuex.vuejs.org/zh/guide/

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式，通俗地说，就是存储并管理需要被多个 Vue 组件共享的状态（或者说是数据），比如用户的登录状态、购物车数据等。

Vuex 的核心是 store，store 存储并管理着需要被 Vue 组件共享的状态（或者说是数据）。

Vuex 和全局对象的对象有以下两点不同：
1. Vuex 的状态存储是响应式的，当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么组件也会相应地得到更新。
2. store 中状态的改变，只能通过显式地提交（commit）mutation 实现，无法通过直接赋值等方式改变 store 中的状态。