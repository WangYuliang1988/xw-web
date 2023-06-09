<script setup lang="ts">
import { useAxios } from '@/composables/request.js'
import { ref } from 'vue'
import CryptoJS from 'crypto-js'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import FormInput from '@/components/FormInput.vue'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const passwd = ref('')
const serverFeedback = ref('')
const disableSubmit = ref(false)

async function onSubmit() {
  disableSubmit.value = true
  serverFeedback.value = ''
  try {
    const rs = await useAxios().post('/users/login', {
      email: email.value.trim(),
      passwd: CryptoJS.SHA1(passwd.value).toString()
    })
    if (rs.data.error) {
      serverFeedback.value = rs.data.message
    } else {
      userStore.saveUser(rs.data)
      router.replace('/')
    }
  } catch (error: any) {
    serverFeedback.value = error
  } finally {
    disableSubmit.value = false
  }
}
</script>

<template>
  <div class="container">
    <form class="form" @submit.prevent="onSubmit">
      <div class="logo">
        <img src="@/assets/xuewen.png" alt="" width="72" height="72" />
      </div>
      <p v-if="serverFeedback" class="server-feedback">{{ serverFeedback }}</p>
      <div class="mb-3">
        <FormInput
          id="inputEmail"
          type="email"
          label="电子邮箱"
          v-model="email"
          placeholder="电子邮箱"
          :maxlength="128"
          :required="true"
          :autofocus="true"
        ></FormInput>
      </div>
      <div class="mb-3">
        <FormInput
          id="inputPassword"
          type="password"
          label="登录密码"
          v-model="passwd"
          placeholder="登录密码"
          :maxlength="32"
          :minlength="6"
          :required="true"
          autocomplete="on"
        ></FormInput>
      </div>
      <button type="submit" class="btn btn-lg btn-primary btn-block mt-3" :disabled="disableSubmit">
        登录
      </button>
      <p class="register-tips">
        <span>没有账号？点击<router-link to="/register">注册</router-link></span>
      </p>
    </form>
  </div>
</template>

<style scoped>
.container {
  height: 100%;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
}

.form {
  width: 100%;
  max-width: 320px;
  padding: 15px;
  margin: auto; /* auto 属性用来分配剩余空间，可以使元素居中 */
}

.logo {
  margin-bottom: 1.5rem;
  text-align: center;
}

.server-feedback {
  width: 100%;
  font-size: 80%;
  color: #dc3545;
  text-align: center;
}

.register-tips {
  margin: 1rem 0;
  color: #6c757d;
  text-align: center;
}
</style>
