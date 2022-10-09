# 工程简介
基于 Node.js 开发的后端服务，完全 JavaScript 语言编写，提供 REST 风格的API接口。

使用 Koa 作为 Web 框架，参考：https://www.koajs.com.cn/
使用 Sequelize 作为 ORM 框架，参考：https://www.sequelize.cn/

# 目录结构
```python
xw-server/                      # 根目录
|
+- apis/                        # 处理各类接口请求
|  |
|  +- blog.js                   # 处理 /api/blogs 前缀接口请求
|  |
|  +- comment.js                # 处理 /api/comments 前缀接口请求
|  |
|  +- user.js                   # 处理 /api/users 前缀接口请求
|
+- models/                      # 各类接口对应的数据库处理逻辑
|  |
|  +- blog.js                   # /api/blogs 前缀接口对应的数据库处理逻辑
|  |
|  +- comment.js                # /api/comments 前缀接口对应的数据库处理逻辑
|  |
|  +- user.js                   # /api/users 前缀接口对应的数据库处理逻辑
|
+- node_modules/                # 存放各依赖库
|
+- app.js                       # Koa 入口文件，用于启动服务
|
+- config-develop.js            # 本地数据库配置文件
|
+- config-production.js         # 生产环境数据库配置文件
|
+- cookie.js                    # 登录业务涉及 cookie 处理
|
+- database.js                  # 数据库初始化逻辑处理
|
+- package-lock.json            # 工程依赖描述文件
|
+- package.json                 # 工程依赖描述文件
|
+- router.js                    # 解析 apis 目录下的文件并生成相应的 router 路径
|
+- util.js                      # 通用工具方法
```