<script setup lang="ts">
import { useAxios } from '@/composables/request.js'
import { ref } from 'vue'
import ManagementNavigation from '@/components/ManagementNavigation.vue'
import type { Page, Comment } from '@/types/xw'

const page = ref<Page>()
const comments = ref<Array<Comment>>([])

fetchComments(1)

async function fetchComments(pageIndex: number) {
  const rs = await useAxios().get('/comments', {
    params: {
      size: 10,
      page: pageIndex
    }
  })
  page.value = rs.data.page
  comments.value.push(...rs.data.comments)
}

async function deleteComment(comment: Comment) {
  const content =
    comment.content.length > 20 ? comment.content.substring(0, 20) + '...' : comment.content
  if (confirm('确认要删除“' + content + '”？删除后不可恢复！')) {
    try {
      const rs = await useAxios().get(`/comments/${comment.id}/delete`)
      if (rs.data.error) {
        console.log(rs.data.message)
      } else {
        comments.value = comments.value.filter((item) => {
          return item.id !== comment.id
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<template>
  <div>
    <ManagementNavigation :current-path="$route.path" />

    <div class="table-container">
      <template v-if="comments.length > 0">
        <table class="table">
          <thead>
            <tr>
              <th>作者</th>
              <th>内容</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="comment in comments" :key="comment.id">
              <td><span v-text="comment.userName"></span></td>
              <td><span v-text="comment.content"></span></td>
              <td>
                <button
                  class="btn btn-sm btn-outline-secondary"
                  v-on:click="deleteComment(comment)"
                >
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-if="page && page.hasNext">
        <nav class="text-center">
          <button
            class="btn btn-outline-primary my-2"
            @click="fetchComments(page ? page.currentPage + 1 : 1)"
          >
            加载更多
          </button>
        </nav>
      </template>
      <template v-if="comments.length === 0">
        <div class="text-center"><span>没有评论可供管理</span></div>
      </template>
    </div>
  </div>
</template>

<style scoped>
@import url('@/assets/table.css');
</style>
