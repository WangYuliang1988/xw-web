学文前端 Vue 3 实现版本

## 工程搭建

根据官方推荐，通过 `npm init vue@latest` 命令（Node 版本要求 16.0 及以上）创建基于 Vite 的 Vue3 项目，该命令会安装 [create-vue](https://www.npmjs.com/package/create-vue) 包并执行：`npm create vue@3` 命令。

工程创建后，参考官方建议，对 Visual Studio Code 开发环境进行如下配置，以提升开发效率：

1. 安装 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)插件，并针对本项目禁用 `Vetur`；
2. 安装 [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)，并针对本项目[禁用内置的 TypeScript 插件](https://cn.vuejs.org/guide/typescript/overview.html#volar-takeover-mode)。

## 目录结构

```sh
xw-client-v3/                   # 根目录
|
+- node_modules/                # 存放各依赖库
|
+- public/                      # 存放静态资源，该目录下的文件会被直接复制到最终的打包文件中，引用时需使用绝对路径
|
+- src/                         # 存放源码
|  |
|  +- assets                    # 存放静态资源，该目录下的文件会被解析为模块依赖，通过相对路径引用
|  |
|  +- components                # 存放自定义组件（用于提供某一特定功能或界面）
|  |
|  +- composables               # 存放组合式函数（用于提供某一公用逻辑功能）
|  |
|  +- router                    # Vue Router 相关文件目录，用于实现页面路由
|  |
|  +- stores                    # Pinia 相关文件目录，用于管理全局状态
|  |
|  +- types                     # 存放自定义类型声明文件，用于 TypeScript 类型检测
|  |
|  +- views                     # 存放自定义组件（用于作为页面进行展示）
|  |
|  +- App.vue                   # 首页组件，又称根组件
|  |
|  +- main.ts                   # 主入口文件
|
+- .eslintrc.cjs                # ESlint 配置文件
|
+- .prettierrc.json             # Prettier 配置文件
|
+- env.d.ts                     # 环境变量声明文件，为 Vite 提供的内建环境变量和开发者自定义的环境变量提供类型信息，用于智能提示和类型检查
|
+- index.html                   # 首页入口文件
|
+- package.json                 # 工程依赖描述文件
|
+- tsconfig.app.json            # 配置 TypeScript 对工程源码的编译选项
|
+- tsconfig.json                # 配置 TypeScript 对整个工程的编译选项，包括 tsconfig.app.json 和 tsconfig.node.json
|
+- tsconfig.node.json           # 配置 TypeScript 对工程配置文件（如 vite.config.ts）的编译选项
|
+- vite.config.js               # Vite 项目配置文件
```

## Vite

Vite 是 Vue 官方开发的全新构建工具，随 Vue3 一同发布，支持构建 Vue（不支持 Vue2）、React 等多种类型的项目。

Vite 在开发环境下基于浏览器原生的 ES6 Modules，无需打包，浏览器直接通过 HTTP 请求 JavaScript 模块，并在运行时处理，服务启动速度更快。

Vite 在生产环境下基于 Rollup 打包，同 Webpack 类似，需要将所有用到的 JavaScript 资源打包为 Bundle，因此 Vite 和 Vue-Cli 在为生产环境构建打包时花费时间相差不大。

Vue-Cli 目前已处于维护状态，Vue 官方推荐使用 Vite 创建 Vue3 项目。

参考：https://cn.vitejs.dev/guide/

## Pinia

Pinia 是 Vue 专属的状态管理库，用于跨组件或页面分享状态，已被 Vue 官方推荐用于替代 Vuex。

Pinia 为组合式 API（Composition API）和 TypeScript 提供了更好的支持，并且同时支持 Vue2 和 Vue3（作为对比：Vuex 3.x 只支持 Vue2，Vue 4.x 只支持 Vue3）。

参考：https://pinia.vuejs.org/zh/introduction.html

## TypeScript

TypeScript 是微软在 2012 年推出的开源编程语言，其诞生是为了解决 JavaScript 因动态类型设计导致的不适合开发大型应用的问题（原因：动态类型语言编写的代码，随着代码量的增加，代码的阅读和修改将变得越来越困难）。

TypeScript 是 JavaScript 的一个超集，支持 ES6 标准，并扩展了 JavaScript 的语法，为 JavaScript 增加了编译时类型检查等特性，并可以编译成纯 JavaScript 运行。

参考：https://www.typescriptlang.org/
