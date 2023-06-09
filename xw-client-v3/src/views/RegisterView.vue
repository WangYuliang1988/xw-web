<script setup lang="ts">
import { useAxios } from '@/composables/request.js'
import { ref } from 'vue'
import CryptoJS from 'crypto-js'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import FormInput from '@/components/FormInput.vue'

const router = useRouter()
const userStore = useUserStore()

const name = ref('')
const email = ref('')
const passwd = ref('')
const rePasswd = ref('')
const serverFeedback = ref('')
const disableSubmit = ref(false)

async function onSubmit() {
  disableSubmit.value = true
  serverFeedback.value = ''
  try {
    if (passwd.value !== rePasswd.value) throw new Error('两次输入的密码不一致')

    const rs = await useAxios().post('/users/register', {
      name: name.value.trim(),
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
    <!-- 通过v-on:submit.prevent，Vue将表单提交事件关联至onSubmit()方法 -->
    <form class="form" @submit.prevent="onSubmit">
      <div class="logo">
        <img src="@/assets/xuewen.png" alt="" width="72" height="72" />
      </div>
      <p v-if="serverFeedback" class="server-feedback">{{ serverFeedback }}</p>
      <div class="mb-3">
        <FormInput
          id="inputName"
          type="text"
          label="用户名称"
          v-model="name"
          placeholder="请填写用户名称（至少2个字符）"
          :minlength="2"
          :maxlength="64"
          :required="true"
        />
      </div>
      <div class="mb-3">
        <FormInput
          id="inputEmail"
          type="email"
          label="电子邮箱"
          v-model="email"
          placeholder="请填写电子邮箱"
          :maxlength="128"
          :required="true"
        />
      </div>
      <div class="mb-3">
        <FormInput
          id="inputPassword"
          type="password"
          label="输入密码"
          v-model="passwd"
          placeholder="请设置登录密码（至少6个字符）"
          :maxlength="32"
          :minlength="6"
          :required="true"
          autocomplete="on"
        />
      </div>
      <div class="mb-3">
        <FormInput
          id="reinputPassword"
          type="password"
          label="再次输入密码"
          v-model="rePasswd"
          placeholder="请再次输入密码"
          :maxlength="32"
          :minlength="6"
          :required="true"
          autocomplete="on"
        />
      </div>
      <button type="submit" class="btn btn-lg btn-primary btn-block mt-3" :disabled="disableSubmit">
        注册
      </button>
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
</style>
