// 可选配置文件，该文件出现的背景是：从vue-cli3开始，项目结构更加简洁，默认省略了一些配置文件（如webpack.config.js）。
// 如果需要进行某些配置，如项目打包相关、devServer、CSS处理等，可以通过vue.config.js进行配置。
// 当项目的根目录中存在该文件时，@vue/cli-service启动时会自动加载。

const bootstrapSassAbstractsImports = require('vue-cli-plugin-bootstrap-vue/sassAbstractsImports.js')
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
		loaderOptions: {
			sass: {
				additionalData: bootstrapSassAbstractsImports.join('\n')
			},
			scss: {
				additionalData: [...bootstrapSassAbstractsImports, ''].join(';\n')
			}
		}
	}
})