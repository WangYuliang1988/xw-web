<template>
  <div>
    <nav class="nav d-flex justify-content-center mb-4">
      <span class="p-2 text-muted">编写日志</span>
      <router-link class="p-2" to="/manage/blogs">日志管理</router-link>
      <router-link class="p-2" to="/manage/comments">评论管理</router-link>
      <router-link class="p-2" to="/manage/users">用户管理</router-link>
    </nav>
    <form class="form-blog" v-on:submit.prevent="onSubmit">
      <p v-if="serverFeedback" class="server-feedback text-center">{{ serverFeedback }}</p>
      <div class="mb-3">
        <label for="inputName" class="sr-only">标题</label>
        <input type="text" class="form-control" id="inputName" v-model="name" placeholder="请输入标题" required>
      </div>
      <div class="mb-3">
        <label for="inputAuthor" class="sr-only">作者</label>
        <input type="text" class="form-control" id="inputAuthor" v-model="author" placeholder="请输入作者" required>
      </div>
      <div class="mb-3">
        <label for="inputDynasty" class="sr-only">朝代</label>
        <input type="text" class="form-control" id="inputDynasty" v-model="dynasty" placeholder="请输入朝代" required>
      </div>
      <div class="mb-3">
        <label for="inputSummary" class="sr-only">摘要</label>
        <textarea class="form-control" id="inputSummary" v-model="summary" placeholder="请输入摘要" rows="4" required></textarea>
      </div>
      <div class="mb-3">
        <label for="inputContent" class="sr-only">内容</label>
        <textarea class="form-control" id="inputContent" v-model="content" placeholder="请输入内容" rows="16" required></textarea>
      </div>
      <div class="text-center"><button type="submit" class="btn btn-md btn-primary mt-2">发布</button></div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'EditBlog',
  data() {
    return {
      name: null,
      author: null,
      dynasty: null,
      summary: null,
      content: null,
      disableSubmit: false,
      serverFeedback: null
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  async created() {
    if (this.id) { // 编辑已有文章
      let rs = await this.$axios.get(`/blogs/${this.id}`)
      this.name = rs.data.name
      this.author = rs.data.author
      this.dynasty = rs.data.dynasty
      this.summary = rs.data.summary
      this.content = rs.data.content
    }
  },
  methods: {
    async onSubmit() {
      this.disableSubmit = true
      this.serverFeedback = null
      try {
        let url = this.id ? `/blogs/${this.id}/update` : '/blogs/create'
        let rs = await this.$axios.post(url, {
          name: this.name,
          author: this.author,
          dynasty: this.dynasty,
          summary: this.summary,
          content: this.content
        })
        if (rs.data.error) {
          this.serverFeedback = rs.data.message
        } else {
          this.$router.replace('/manage/blogs')
        }
      } catch (error) {
        this.serverFeedback = error
      } finally {
        this.disableSubmit = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-blog {
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
  margin: auto; /* auto 属性用来分配剩余空间，可以使元素居中 */
}
.form-blog .btn {
  width: 120px;
}

.server-feedback {
  display: none;
  width: 100%;
  font-size: 80%;
  color: #dc3545;
}
</style>