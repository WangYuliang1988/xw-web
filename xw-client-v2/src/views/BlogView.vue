<template>
  <div class="row">
    <div class="col-md-8 mb-3">
      <div class="single-widget box-shadow">
        <h2 class="blog-title" v-text="blog.name"></h2>
        <p class="blog-meta" v-text="blog.dynasty + ' · ' + blog.author"></p>
        <p v-html='blog.html'></p>
      </div>
      <div class="single-widget box-shadow mt-4">
        <h4 class="comment-title">评论</h4>
        <template v-if="comments.length > 0">
          <div class="single-comment" v-for="comment in comments" :key="comment.id">
            <div class="comment-image">
              <img class="img-thumbnail rounded-circle" v-bind:src="comment.userImage || require('../assets/xuewen.png')" width="65" height="65">
            </div>
            <div class="comment-info">
              <div class="text-muted mb-2">
                <span class="mr-2" v-text="comment.userName"></span><span v-text="$dayjs(comment.createTime * 1000).format('YYYY-MM-DD HH:mm:ss')"></span>
              </div>
              <p v-html="comment.html"></p>
            </div>
          </div>
        </template>
        <template v-else>
          <span class="text-muted">还没有人评论...</span>
        </template>
        <form v-if="user" class="mt-4" v-on:submit.prevent="makeComment">
          <div class="mb-2">
            <label for="inputComment" class="sr-only">评论内容</label>
            <textarea class="form-control" v-model="inputComment" placeholder="说点什么吧" rows="6" required></textarea>
          </div>
          <button type="submit" class="btn btn-md btn-primary mt-2 px-4" :disabled="disableSubmit">发表评论</button>
        </form>
      </div>
    </div>
    <div class="col-md-4">
      <div class="single-widget box-shadow">
        <div class="text-center">
          <img class="img-thumbnail rounded-circle mb-1" v-bind:src="blog.userImage || require('../assets/xuewen.png')" width="120" height="120">
          <h4><a href="https://github.com/WangYuliang1988" v-text="blog.userName" target="_blank"></a></h4>
          <p>Non-Professional Blogger</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlogView',
  data() {
    return {
      blog: {},
      comments: [],
      inputComment: null,
      disableSubmit: false
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    blogId() {
      return this.$route.params.id
    }
  },
  async created() {
    let rs = await this.$axios.get(`/blogs/${this.blogId}`)
    this.blog = rs.data
    this.comments = this.blog.comments
    document.title = `${this.blog.name} - 学文`
  },
  methods: {
    async makeComment() {
      try {
        this.disableSubmit = true
        let rs = await this.$axios.post('/comments/create', {
          blogId: this.blogId,
          content: this.inputComment
        })
        if (rs.data.error) {
          console.log(rs.data.message)
        } else {
          this.inputComment = null
          this.comments.unshift(rs.data)
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.disableSubmit = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.single-widget {
  padding: 30px;
}

.box-shadow {
  -webkit-box-shadow: 0 0 35px rgba(220, 219, 255, 0.45);
  -o-box-shadow: 0 0 35px rgba(220, 219, 255, 0.45);
  -moz-box-shadow: 0 0 35px rgba(220, 219, 255, 0.45);
  -ms-box-shadow: 0 0 35px rgba(220, 219, 255, 0.45);
  box-shadow: 0px 0px 35px rgba(220,219,255,0.45);
}

.blog-title {
  margin-bottom: .50rem;
  font-size: 1.50rem;
}

.blog-meta {
  margin-bottom: 1.25rem;
  font-size: 0.85rem;
  color: #999;
}

.comment-title{
  font-size: 1.35rem;
}

.single-comment {
  overflow: hidden;
  margin-top: 1.2rem;
}

.comment-image {
  float: left;
  width: 10%;
}
@media (max-width: 768px) {
  .comment-image {
    float: left;
    width: 20%;
  }
}

.comment-info {
  float: left;
  width: 90%;
  padding-left: 15px;
}
@media (max-width: 768px) {
  .comment-info {
    float: left;
    width: 80%;
  }
}
</style>