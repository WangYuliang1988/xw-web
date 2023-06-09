<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useUserStore } from './stores/user'
import { useAxios } from './composables/request'

// 用户信息
const userStore = useUserStore()

// 顶部栏更新相关逻辑
const reloadHeader = ref(true)
async function logout() {
  try {
    await useAxios().get('/users/logout')
    userStore.clearUser()
  } catch (error) {
    console.log('fail to logout with error: ' + error)
  } finally {
    // 退出登录后，需要刷新顶部栏
    reloadHeader.value = false
    await nextTick()
    reloadHeader.value = true
  }
}

// 控制顶部栏展示样式
const route = useRoute()
const hideHeaderButtons = computed(() => {
  return ['/login', '/register'].includes(route.path)
})
</script>

<template>
  <header v-if="reloadHeader" class="base-header">
    <div :class="hideHeaderButtons ? 'header-center' : 'header-left'">
      <RouterLink to="/" class="header-title">学文</RouterLink>
    </div>
    <div v-if="!hideHeaderButtons" class="header-right">
      <template v-if="userStore.user">
        <span class="text-muted">{{ userStore.user.name }}</span>
        <RouterLink
          v-if="userStore.user.admin"
          to="/manage/blogs"
          class="btn btn-sm btn-outline-secondary ml-2"
          >管理</RouterLink
        >
        <span class="btn btn-sm btn-outline-secondary ml-2" @click="logout">退出</span>
      </template>
      <template v-else>
        <RouterLink to="/login" class="btn btn-sm btn-outline-secondary">登录</RouterLink>
        <RouterLink to="/register" class="btn btn-sm btn-outline-secondary ml-2">注册</RouterLink>
      </template>
    </div>
  </header>
  <main class="base-main" role="main">
    <RouterView />
  </main>
  <footer class="base-footer">
    <p>
      Powered by <a href="https://github.com/WangYuliang1988" target="_blank">WangYuliang</a>.
      Copyright &copy; 2023.
    </p>
    <p>
      <a href="https://github.com/WangYuliang1988" target="_blank">WangYuliang</a>. All rights
      reserved.
      <a target="_blank" href="http://beian.miit.gov.cn/" class="ml-2">豫ICP备19016855号</a>
      <a
        target="_blank"
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41019602002168"
        class="ml-2"
      >
        <img src="@/assets/gongan.png" />豫公网安备41019602002168号
      </a>
    </p>
  </footer>
</template>

<style>
.base-header {
  flex: 0 0 5%;
  line-height: 1;
  z-index: 1000;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  padding: 1rem 15px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e5e5;
}

.header-left {
  flex: 0 0 50%;
  max-width: 50%;
}

.header-center {
  flex: 0 0 100%;
  max-width: 100%;
  text-align: center;
}

.header-right {
  flex: 0 0 50%;
  max-width: 50%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.header-title {
  color: #343a40 !important;
  font-size: 1.75rem;
  text-decoration: none !important;
}

.base-main {
  flex: 0 1 80%;
  width: 100%;
  max-width: 1200px;
  padding: 15px;
  margin-left: auto;
  margin-right: auto;
}

.base-footer {
  flex: 0 0 10%;
  padding: 2rem 0;
  color: #999;
  text-align: center;
  font-size: 0.85rem;
  background-color: #f9f9f9;
  border-top: 0.05rem solid #e5e5e5;
}
</style>
