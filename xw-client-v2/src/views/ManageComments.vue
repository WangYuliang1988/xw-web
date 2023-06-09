<template>
  <div>
    <nav class="nav d-flex justify-content-center mb-4">
      <router-link class="p-2" to="/manage/blogs/edit">编写日志</router-link>
      <router-link class="p-2" to="/manage/blogs">日志管理</router-link>
      <span class="p-2 text-muted">评论管理</span>
      <router-link class="p-2" to="/manage/users">用户管理</router-link>
    </nav>
    <div class="table-responsive">
      <template v-if="comments.length > 0">
        <table class="table table-striped table-sm text-center">
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
              <td><button class="btn btn-sm btn-outline-secondary" v-on:click="deleteComment(comment)">删除</button></td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-if="page.hasNext">
        <nav class="text-center">
          <button class="btn btn-outline-primary my-2" @click="fetchComments(++page.currentPage)">加载更多</button>
        </nav>
      </template>
      <template v-if="comments.length === 0">
        <div class="text-center"><span>没有评论可供管理</span></div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ManageComments',
  data() {
    return {
      page: {},
      comments: []
    }
  },
  async created() {
    this.fetchComments(1)
  },
  methods: {
    async fetchComments(pageIndex) {
      let rs = await this.$axios.get('/comments', {
        params: {
          page: pageIndex, 
          size: 10
        } 
      })
      this.page = rs.data.page
      this.comments.push(...rs.data.comments)
    },
    async deleteComment(comment) {
      let content = comment.content.length > 20 ? comment.content.substring(0, 20) + '...' : comment.content
      if (confirm('确认要删除“' + content + "”？删除后不可恢复！")) {
        try {
          let rs = await this.$axios.get(`/comments/${comment.id}/delete`)
          if (rs.data.error) {
            console.log(rs.data.message)
          } else {
            this.comments = this.comments.filter(item => {
              return item.id !== comment.id
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