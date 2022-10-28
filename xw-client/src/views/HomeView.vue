<template>
  <div class="row">
    <div class="col-md-8">
      <div>
      <template v-if="blogs.length > 0">
        <div class="blog-post" v-for="blog in blogs" :key="blog.id">
          <h2 class="blog-post-title"><router-link :to="`/blog/${blog.id}`" v-text="blog.name"></router-link></h2>
          <p class="blog-post-meta" v-text="'发表于 ' + $dayjs(blog.createTime * 1000).format('YYYY-MM-DD HH:mm:ss')"></p>
          <p v-text="blog.summary"></p>
          <p><router-link :to="`/blog/${blog.id}`">继续阅读</router-link></p>
        </div>
      </template>
      <template v-if="page.hasNext">
        <button class="btn btn-outline-primary mb-3" @click="fetchBlogs(++page.currentPage)">查看更多</button>
      </template>
      <template v-if="blogs.length === 0">
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
    </div>
    <aside class="col-md-4">
      <div class="p-4 mb-3 bg-light rounded">
        <h4>关于</h4>
        <p class="mb-0">学文，一个用JavaScript编写的网站，使用Node.js实现服务接口，使用Vue实现前端MVVM框架，使用Bootstrap实现移动优先的响应式UI。</p>
      </div>
      <div class="p-4">
        <h4>友链</h4>
        <ol class="list-unstyled">
          <li><a href="https://vuejs.org/" target="_blank">Vue</a></li>
          <li><a href="https://nodejs.org" target="_blank">Node</a></li>
          <li><a href="https://getbootstrap.com" target="_blank">Bootstrap</a></li>
        </ol>
      </div>
    </aside>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      page: {},
      blogs: []
    }
  },
  created() {
    this.fetchBlogs(1)
  },
  methods: {
    async fetchBlogs(pageIndex) {
      let rs = await this.$axios.get('/blogs', {
        params: {
          page: pageIndex, 
          size: 10
        } 
      })
      this.page = rs.data.page
      this.blogs.push(...rs.data.blogs)
    }
  }
}
</script>

<style lang="scss" scoped>
.blog-post {
  margin-bottom: 4rem;
}
.blog-post-title {
  margin-bottom: .50rem;
  font-size: 1.50rem;
}
.blog-post-meta {
  margin-bottom: 1.25rem;
  font-size: 0.85rem;
  color: #999;
}
</style>