// 指定项目的 polyfill 配置，一个默认的 Vue CLI 项目会使用 @vue/babel-preset-app，通过 @babel/preset-env 和 browserslist 配置来决定项目需要的 polyfill。

module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ]
}