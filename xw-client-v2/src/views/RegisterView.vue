<template>
  <div class="form-container">
    <!-- 通过v-on:submit.prevent，Vue将表单提交事件关联至onSubmit()方法 -->
    <form class="form-register"  @submit.prevent="onSubmit">
      <div class="mb-4 text-center">
        <img src="../assets/xuewen.png" alt="" width="72" height="72">
      </div>
      <p v-if="serverFeedback" class="server-feedback text-center">{{ serverFeedback }}</p>
      <div class="mb-3">
        <label for="inputName" class="sr-only">用户名称</label>
        <!-- 通过v-model，可以让Vue把Model和View关联起来，此处是将input的value和Model的name关联起来 -->
        <input class="form-control" type="text" id="inputName" v-model="name" placeholder="请填写用户名称（至少2个字符）" minlength="2" maxlength="64" required>
      </div>
      <div class="mb-3">
        <label for="inputEmail" class="sr-only">电子邮箱</label>
        <input class="form-control" type="email" id="inputEmail" v-model="email" maxlength="128" placeholder="请填写电子邮箱" required>
      </div>
      <div class="mb-3">
        <label for="inputPassword" class="sr-only">输入密码</label>
        <input class="form-control" type="password" id="inputPassword" v-model="passwd" placeholder="请设置登录密码（至少6个字符）" maxlength="32" minlength="6" required autocomplete="on">
      </div>
      <div class="mb-3">
        <label for="reinputPassword" class="sr-only">再次输入密码</label>
        <input class="form-control" type="password" id="reinputPassword" v-model="rePasswd" placeholder="请再次输入密码" maxlength="32" minlength="6" required autocomplete="on">
      </div>
      <button type="submit" class="btn btn-lg btn-primary btn-block mt-3" :disabled="disableSubmit">注册</button>
    </form>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'

export default {
  name: 'RegisterView',
  data() {
    return {
      name: null,
      email: null,
      passwd: null,
      rePasswd: null,
      disableSubmit: false,
      serverFeedback: null
    }
  },
  methods: {
    async onSubmit() {
      this.disableSubmit = true
      this.serverFeedback = null
      try {
        if (this.passwd !== this.rePasswd) throw new Error('两次输入的密码不一致')

        let rs = await this.$axios.post('/users/register', {
          name: this.name.trim(),
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

.form-register {
  width: 100%;
  max-width: 320px;
  padding: 15px;
  margin: auto;
}

.form-register .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}

.form-register .form-control:focus {
  z-index: 1; /* z-index 属性用来控制组件之间的覆盖情况 */
}

.server-feedback {
  width: 100%;
  font-size: 80%;
  color: #dc3545;
}
</style>