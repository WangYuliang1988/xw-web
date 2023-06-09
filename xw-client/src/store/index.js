import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex); // Vuex 是一个插件，需要通过 Vue.use() 方法来使用

const SESSION_NAME = "user";

// 创建 Vuex 的仓库
const store = new Vuex.Store({
  // state 用于存储状态，通过 store.state.xxx 方法读取状态信息
  state: {
    _user: null,
  },
  // getters 是对 state 加工后派生出来的数据，且同计算属性一样会缓存结果并在依赖改变时重新计算
  getters: {
    // getter 方法接收两个参数：state（可以用来访问数据）、getters（可以访问其它getter函数）
    user: (state) => {
      const local = sessionStorage.getItem(SESSION_NAME);
      if (local) {
        state._user = JSON.parse(local);
      }
      return state._user;
    },
  },
  // mutations 包含改变 state 中状态的方法，由 store.commit 方法触发
  mutations: {
    saveUser(state, user) {
      state._user = user;
      sessionStorage.setItem(SESSION_NAME, JSON.stringify(user));
    },
    clearUser(state) {
      state._user = null;
      sessionStorage.removeItem(SESSION_NAME);
    },
  },
});

export default store;
