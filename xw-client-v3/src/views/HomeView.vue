<script setup lang="ts">
import { useAxios } from '@/composables/request.js'
import type { Page, Blog } from '@/types/xw'
import dayjs from 'dayjs'
import { ref } from 'vue'

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
</script>

<template>
  <div class="container">
    <div class="blog-list">
      <template v-if="blogs.length > 0">
        <div class="blog" v-for="blog in blogs" :key="blog.id">
          <h2>
            <RouterLink :to="`/blog/${blog.id}`">{{ blog.name }}</RouterLink>
          </h2>
          <p
            class="blog-meta"
            v-text="'发表于 ' + dayjs(blog.createTime * 1000).format('YYYY-MM-DD HH:mm:ss')"
          ></p>
          <p v-text="blog.summary"></p>
          <p><RouterLink :to="`/blog/${blog.id}`">继续阅读</RouterLink></p>
        </div>
        <button
          v-if="page && page.hasNext"
          class="btn btn-outline-primary mb-3"
          @click="fetchBlogs(page ? page.currentPage + 1 : 1)"
        >
          查看更多
        </button>
      </template>
      <template v-else>
        <p>昔人已乘黄鹤去</p>
        <p>此地空余黄鹤楼</p>
        <p>黄鹤一去不复返</p>
        <p>白云千载空悠悠</p>
        <p>晴川历历汉阳树</p>
        <p>芳草萋萋鹦鹉洲</p>
        <p>日暮乡关何处是</p>
        <p>烟波江上使人愁</p>
      </template>
    </div>
    <aside class="aside">
      <div class="about">
        <h4>关于</h4>
        <p class="mb-0">
          学文，一个用JavaScript编写的网站，使用Node.js实现服务接口，使用Vue实现前端MVVM框架，使用Bootstrap实现移动优先的响应式UI。
        </p>
      </div>
      <div class="outer-link">
        <h4>友链</h4>
        <ol>
          <li><a href="https://vuejs.org/" target="_blank">Vue</a></li>
          <li><a href="https://nodejs.org" target="_blank">Node</a></li>
          <li><a href="https://getbootstrap.com" target="_blank">Bootstrap</a></li>
        </ol>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
}

.blog-list {
  position: relative;
  width: 100%;
}

@media (min-width: 768px) {
  .blog-list {
    flex: 0 0 66.66666667%;
    max-width: 66.66666667%;
    padding-right: 15px;
  }
}

.blog {
  margin-bottom: 4rem;
}

.blog-meta {
  margin-bottom: 1.25rem;
  font-size: 0.85rem;
  color: #999;
}

.aside {
  position: relative;
  width: 100%;
}

@media (min-width: 768px) {
  .aside {
    flex: 0 0 33.33333333%;
    max-width: 33.33333333%;
    padding-left: 15px;
  }
}

.about {
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 0.25rem;
  background-color: #f8f9fa;
}

.outer-link {
  padding: 1.5rem;
}

.outer-link ol {
  padding-left: 0;
  list-style: none;
}
</style>
