# 工程简介
完全使用 JavaScript 语言开发的网站，前端基于 Vue 框架，后端基于 Node.js 框架。

# 目录结构
```python
xw-web/                         # 根目录
|
+- dist/                        # 存放后端工程 xw-server 的打包文件，用于自动化部署
|
+- node_modules/                # 存放各依赖库
|
+- utils/                       # 存放后端工程 xw-server 自动化部署脚本所需的工具类
|  |
|  +- connect.js                # 提供同服务器建立 SSH 连接并进行交互的工具方法
|  |
|  +- constants.js              # 存放后端工程 xw-server 自动化部署涉及的服务器路径常量
|  |
|  +- question.js               # 提供命令行交互方法的工具类
|
+- xw-client/                   # 前端工程
|
+- xw-server/                   # 后端工程
|
+- deploy.js                    # 后端工程 xw-server 自动化部署脚本
|
+- package-lock.json            # 后端工程 xw-server 自动化部署所需的依赖描述文件
|
+- package.json                 # 后端工程 xw-server 自动化部署所需的依赖描述文件
|
+- rollback.js                  # 后端工程 xw-server 自动化回滚脚本
```