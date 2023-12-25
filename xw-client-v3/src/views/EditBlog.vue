<script setup lang="ts">
import { useAxios } from '@/composables/request.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import FormInput from '@/components/FormInput.vue'
import FormTextarea from '@/components/FormTextarea.vue'
import ManagementNavigation from '@/components/ManagementNavigation.vue'

const route = useRoute()
const router = useRouter()

const name = ref('')
const author = ref('')
const dynasty = ref('')
const summary = ref('')
const content = ref('')
const serverFeedback = ref('')
const disableSubmit = ref(false)
const blogId = route.query.id

fetchBlog()

async function fetchBlog() {
  if (blogId) {
    const rs = await useAxios().get(`/blogs/${blogId}`)
    name.value = rs.data.name
    author.value = rs.data.author
    dynasty.value = rs.data.dynasty
    summary.value = rs.data.summary
    content.value = rs.data.content
  }
}

async function onSubmit() {
  disableSubmit.value = true
  serverFeedback.value = ''
  try {
    // 编辑或创建文章
    const url = blogId ? `/blogs/${blogId}/update` : '/blogs/create'
    const rs = await useAxios().post(url, {
      name: name.value,
      author: author.value,
      dynasty: dynasty.value,
      summary: summary.value,
      content: content.value
    })
    if (rs.data.error) {
      serverFeedback.value = rs.data.message
    } else {
      router.replace('/manage/blogs')
    }
  } catch (error: any) {
    serverFeedback.value = error
  } finally {
    disableSubmit.value = false
  }
}
</script>

<template>
  <div>
    <ManagementNavigation :current-path="$route.path" />

    <form class="form" v-on:submit.prevent="onSubmit">
      <p v-if="serverFeedback" class="server-feedback text-center">{{ serverFeedback }}</p>
      <div class="mb-3">
        <FormInput
          id="inputName"
          type="text"
          label="标题"
          v-model="name"
          placeholder="请输入标题"
          :required="true"
        />
      </div>
      <div class="mb-3">
        <FormInput
          id="inputAuthor"
          type="text"
          label="作者"
          v-model="author"
          placeholder="请输入作者"
          :required="true"
        />
      </div>
      <div class="mb-3">
        <FormInput
          id="inputDynasty"
          type="text"
          label="朝代"
          v-model="dynasty"
          placeholder="请输入朝代"
          :required="true"
        />
      </div>
      <div class="mb-3">
        <FormTextarea
          id="inputSummary"
          label="摘要"
          v-model="summary"
          placeholder="请输入摘要"
          :rows="4"
          :required="true"
        ></FormTextarea>
      </div>
      <div class="mb-3">
        <FormTextarea
          id="inputContent"
          label="内容"
          v-model="content"
          placeholder="请输入内容"
          :rows="16"
          :required="true"
        ></FormTextarea>
      </div>
      <div class="text-center">
        <button type="submit" class="btn btn-md btn-primary mt-2">发布</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form {
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
  margin: auto; /* auto 属性用来分配剩余空间，可以使元素居中 */
}

.btn {
  width: 120px;
}

.server-feedback {
  display: none;
  width: 100%;
  font-size: 80%;
  color: #dc3545;
}
</style>
