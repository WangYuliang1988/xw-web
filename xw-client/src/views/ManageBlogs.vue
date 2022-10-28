<template>
  <div>
    <nav class="nav d-flex justify-content-center mb-4">
      <router-link class="p-2" to="/manage/blogs/edit">编写日志</router-link>
      <span class="p-2 text-muted">日志管理</span>
      <router-link class="p-2" to="/manage/comments">评论管理</router-link>
      <router-link class="p-2" to="/manage/users">用户管理</router-link>
    </nav>
    <div class="table-responsive">
      <template v-if="blogs.length > 0">
        <table class="table table-striped table-sm text-center">
          <thead>
            <tr>
              <th>标题</th>
              <th>作者</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="blog in blogs" :key="blog.id">
              <td><router-link v-bind:to="'/blog/' + blog.id" v-text="blog.name"></router-link></td>
              <td><span v-text="blog.userName"></span></td>
              <td>
                <button class="btn btn-sm btn-outline-primary ml-1 mr-1" v-on:click="editBlog(blog)">编辑</button>
                <button class="btn btn-sm btn-outline-secondary ml-1 mr-1" v-on:click="deleteBlog(blog)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-if="page.hasNext">
        <nav class="text-center">
          <button class="btn btn-outline-primary my-2" id="btnMore" @click="fetchBlogs(++page.currentPage)">加载更多</button>
        </nav>
      </template>
      <template>
        <div class="text-center" v-if="blogs.length === 0"><span>没有日志可供管理</span></div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ManageBlogs',
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
    },
    editBlog(blog) {
      this.$router.push(`/manage/blogs/edit?id=${blog.id}`)
    },
    async deleteBlog(blog) {
      if (confirm('确认要删除“' + blog.name + "”？删除后不可恢复！")) {
        try {
          let rs = await this.$axios.get(`/blogs/${blog.id}/delete`)
          if (rs.data.error) {
            console.log(rs.data.message)
          } else {
            this.blogs = this.blogs.filter(item => {
              return item.id !== blog.id
            })
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>