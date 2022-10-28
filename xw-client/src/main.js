import '@babel/polyfill'
import 'mutationobserver-shim'
import './plugins/bootstrap-vue'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import request from './utils/request'
import dayjs from 'dayjs'

Vue.config.productionTip = false

// Vue 原型属性中添加 axios 和 dayjs，方便调用
Vue.prototype.$axios = request
Vue.prototype.$dayjs = dayjs

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
