<script setup lang="ts">
import { useAxios } from '@/composables/request.js'
import { ref } from 'vue'
import dayjs from 'dayjs'
import ManagementNavigation from '@/components/ManagementNavigation.vue'
import type { Page, User } from '@/types/xw'

const page = ref<Page>()
const users = ref<Array<User>>([])

fetchUsers(1)

async function fetchUsers(pageIndex: number) {
  const rs = await useAxios().get('/users', {
    params: {
      size: 10,
      page: pageIndex
    }
  })
  page.value = rs.data.page
  users.value.push(...rs.data.users)
}
</script>

<template>
  <div>
    <ManagementNavigation :current-path="$route.path" />

    <div class="table-container">
      <template v-if="users.length > 0">
        <table class="table">
          <thead>
            <tr>
              <th>名字</th>
              <th>电子邮箱</th>
              <th>注册时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>
                <span v-text="user.name"></span
                ><template v-if="user.admin"
                  ><span class="text-admin ml-1">(管理员)</span></template
                >
              </td>
              <td><a v-bind:href="'mailto:' + user.email" v-text="user.email"></a></td>
              <td>
                <span v-text="dayjs(user.createTime * 1000).format('YYYY-MM-DD HH:mm:ss')"></span>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-if="page && page.hasNext">
        <nav class="text-center">
          <button
            class="btn btn-outline-primary my-2"
            @click="fetchUsers(page ? page.currentPage + 1 : 1)"
          >
            加载更多
          </button>
        </nav>
      </template>
      <template v-if="users.length === 0">
        <div class="text-center"><span>没有用户可供管理</span></div>
      </template>
    </div>
  </div>
</template>

<style scoped>
@import url('@/assets/table.css');
.text-admin {
  color: #d05;
  font-size: 0.8rem;
}
</style>
