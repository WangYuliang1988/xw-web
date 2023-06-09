// 可选配置文件，该文件出现的背景是：从vue-cli3开始，项目结构更加简洁，默认省略了一些配置文件（如webpack.config.js）。
// 如果需要进行某些配置，如项目打包相关、devServer、CSS处理等，可以通过vue.config.js进行配置。
// 当项目的根目录中存在该文件时，@vue/cli-service启动时会自动加载。

const bootstrapSassAbstractsImports = require("vue-cli-plugin-bootstrap-vue/sassAbstractsImports");
const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false, // 设置生产环境打包时不生成 sourceMap 文件
  publicPath: process.env.NODE_ENV === "production" ? "/v2/" : "/", // 该应用部署在服务器的子路径/v2/上，此处publicPath设置需保持一致
  css: {
    loaderOptions: {
      sass: {
        additionalData: bootstrapSassAbstractsImports.join("\n"),
      },
      scss: {
        additionalData: [...bootstrapSassAbstractsImports, ""].join(";\n"),
      },
    },
  },
  devServer: {
    proxy: {
      // 解决本地开发跨域问题，本地开发时，前端Vue服务和后端Node服务启动在不同的端口上，不符合同源策略，因此会产生跨域问题
      // 通过vue-cli启动Vue工程时，会启动一个Webpack开发服务器，这个Webpack开发服务器和Vue服务是同源的
      // 通过下列配置，将以'/reborn/api/'开头的链接，通过Webpack开发服务器代理到实际的后端服务器，从而解决跨域问题
      // 因为Vue服务和Webpack服务器同源，而Webpack服务器和后端服务器之间的交互不存在同源限制（同源策略只是浏览器的策略）
      // 该解决方案要求在Vue工程中的接口请求均是相对地址，本工程通过在/utils/request.js中设置axios的baseURL来实现所有接口请求均为相对地址
      // 假设Vue服务的基础地址是：http://locahost:8080，为axios设置的baseURL为'/reborn/api/'，则Vue端发出的完整请求为http://locahost:8080/reborn/api/xxx
      // Webpack服务器接收到上述请求后，根据下方配置，会去请求http://127.0.0.1:2046/reborn/api/xxx，然后将响应结果返回给Vue端
      "/reborn/api/": {
        target: "http://127.0.0.1:2046",
        changeOrigin: true,
      },
      // 解决本地开发时部分图片无法加载问题，数据库中存储的图片地址是针对生产环境的相对地址，本地没有这些图片，因此需要做个代理
      "/static/images/": {
        target: "http://www.yigelangzi.com",
      },
    },
  },
});
