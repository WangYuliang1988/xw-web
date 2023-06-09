<script setup lang="ts">
import { useAxios } from '@/composables/request.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ManagementNavigation from '@/components/ManagementNavigation.vue'

const router = useRouter()

const page = ref<Page>()
const blogs = ref<Array<Blog>>([])

fetchBlogs(1)

async function fetchBlogs(pageIndex: number) {
  const rs = await useAxios().get('/blogs', {
    params: {
      size: 10,
      page: pageIndex
    }
  })
  page.value = rs.data.page
  blogs.value.push(...rs.data.blogs)
}

function editBlog(blog: Blog) {
  router.push(`/manage/blogs/edit?id=${blog.id}`)
}

async function deleteBlog(blog: Blog) {
  if (confirm('确认要删除“' + blog.name + '”？删除后不可恢复！')) {
    try {
      const rs = await useAxios().get(`/blogs/${blog.id}/delete`)
      if (rs.data.error) {
        console.log(rs.data.message)
      } else {
        blogs.value = blogs.value.filter((item) => {
          return item.id !== blog.id
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
      <template v-if="blogs.length > 0">
        <table class="table">
          <thead>
            <tr>
              <th>标题</th>
              <th>作者</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="blog in blogs" :key="blog.id">
              <td>
                <router-link v-bind:to="'/blog/' + blog.id">{{ blog.name }}</router-link>
              </td>
              <td><span v-text="blog.userName"></span></td>
              <td>
                <button class="btn btn-sm btn-outline-primary mx-1" v-on:click="editBlog(blog)">
                  编辑
                </button>
                <button class="btn btn-sm btn-outline-secondary mx-1" v-on:click="deleteBlog(blog)">
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
            @click="fetchBlogs(page ? page.currentPage + 1 : 1)"
          >
            加载更多
          </button>
        </nav>
      </template>
      <template>
        <div class="text-center" v-if="blogs.length === 0"><span>没有日志可供管理</span></div>
      </template>
    </div>
  </div>
</template>

<style scoped>
@import url('@/assets/table.css');
</style>
