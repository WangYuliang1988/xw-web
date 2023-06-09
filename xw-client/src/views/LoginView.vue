<template>
  <div class="form-container">
    <form class="form-signin" @submit.prevent="onSubmit">
      <div class="mb-4 text-center">
        <img src="../assets/xuewen.png" alt="" width="72" height="72">
      </div>
      <p v-if="serverFeedback" class="server-feedback text-center">{{ serverFeedback }}</p>
      <div class="mb-3">
        <label for="inputEmail" class="sr-only">电子邮箱</label>
        <input class="form-control" type="email" id="inputEmail" v-model="email" placeholder="电子邮箱" maxlength="128" required autofocus>
      </div>
      <div class="mb-3">
        <label for="inputPassword" class="sr-only">登录密码</label>
        <input class="form-control" type="password" id="inputPassword" v-model="passwd" placeholder="登录密码" maxlength="32" minlength="6" required autocomplete="on">
      </div>
      <button type="submit" class="btn btn-lg btn-primary btn-block mt-3" :disabled="disableSubmit">登录</button>
      <p class="mt-3 mb-3 text-center text-muted"><span>没有账号？点击<router-link to="/register">注册</router-link></span></p>
    </form>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'

export default {
  name: 'LoginView',
  data() {
    return {
      email: null,
      passwd: null,
      disableSubmit: false,
      serverFeedback: null
    }
  },
  methods: {
    async onSubmit() {
      this.disableSubmit = true
      this.serverFeedback = null
      try {
        let rs = await this.$axios.post('/users/login', {
          email: this.email.trim(),
          passwd: CryptoJS.SHA1(this.passwd).toString()
        })
        if (rs.data.error) {
          this.serverFeedback = rs.data.message
        } else {
          this.$store.commit('saveUser', rs.data)
          this.$router.replace('/')
        }
      } catch (error) {
        this.serverFeedback = error
      } finally {
        this.disableSubmit = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-container {
  height: 100%;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
}

.form-signin {
  width: 100%;
  max-width: 320px;
  padding: 15px;
  margin: auto; /* auto 属性用来分配剩余空间，可以使元素居中 */
}

.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}

.form-signin .form-control:focus {
  z-index: 1; /* z-index 属性用来控制组件之间的覆盖情况 */
}

.server-feedback {
  width: 100%;
  font-size: 80%;
  color: #dc3545;
}
</style>