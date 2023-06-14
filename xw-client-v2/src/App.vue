<template>
  <div id="app" class="base-container">
    <header class="base-header py-3">
      <div v-if="reloadHeader" class="row justify-content-between align-items-center">
        <div :class="[hideHeaderButtons ? 'col-12 text-center' : 'col-6']">
          <router-link to="/" class="base-header-title text-dark text-decoration-none">学文</router-link>
        </div>
        <div v-if="!hideHeaderButtons" class="col-6 d-flex justify-content-end align-items-center">
          <template v-if="user">
            <span class="text-muted">{{ user.name }}</span>
            <router-link v-if="user.admin" to="/manage/blogs" class="btn btn-sm btn-outline-secondary ml-2">管理</router-link>
            <span class="btn btn-sm btn-outline-secondary ml-2" @click="logout">退出</span>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-sm btn-outline-secondary">登录</router-link>
            <router-link to="/register" class="btn btn-sm btn-outline-secondary ml-2">注册</router-link>
          </template>
        </div>
      </div>
    </header>
    <main class="base-main" role="main">
      <router-view/>
    </main>
    <footer class="base-footer">
      <p>Powered by <a href="https://github.com/WangYuliang1988" target="_blank">WangYuliang</a>. Copyright &copy; 2023.</p>
      <p>
        <a href="https://github.com/WangYuliang1988" target="_blank">WangYuliang</a>. All rights reserved.
        <a target="_blank" href="http://beian.miit.gov.cn/" class="ml-2">豫ICP备19016855号</a>
        <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41019602002168" class="ml-2" >
          <img src="/static/images/gongan.png" class="mb-1">豫公网安备41019602002168号
        </a>
      </p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      reloadHeader: true
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    },
    hideHeaderButtons() {
      // 登录和注册页面需隐藏顶部按钮区域，同时设置标题居中
      return ['/login', '/register'].includes(this.$route.path)
    }
  },
  created() {
    console.log('xw-client-v2 started')
  },
  methods: {
    async logout() {
      try {
        await this.$axios.get('/users/logout')
        this.$store.commit('clearUser')
        // 如果是在管理页面退出，则回到主页
        if (this.$route.path.startsWith('/manage/')) {
          this.$router.replace('/')
        }
      } catch (error) {
        console.log('fail to logout with error: ' + error)
      } finally {
        this.reloadHeader = false
        this.$nextTick(() => {
          this.reloadHeader = true
        })
      }
    }
  }
}
</script>


<style lang="scss">
// 导入 Bootstrap 样式，可直接在代码中使用如 col-6 等 Bootstrap 定义的样式
// 波浪线 ~ 表示其后跟着的 @ 是一个别名（alias），需要去 webpack alias 配置中找相应的值，然后拼接成最终的地址
@import '~@/assets/scss/vendors/bootstrap-vue';

html,
body {
  height: 100%;
}

.base-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.base-header {
  flex: 0 0 5%;
  line-height: 1;
  z-index: 1000;
  border-bottom: 1px solid #e5e5e5;
}
.base-header .row {
  margin: 0px;
}
.base-header-title {
  font-size: 1.75rem;
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
  padding: 2.5rem 0;
  color: #999;
  text-align: center;
  font-size: .85rem;
  background-color: #f9f9f9;
  border-top: .05rem solid #e5e5e5;
}
.base-footer p:last-child {
  margin-bottom: 0;
}
</style>
