<script setup lang="ts">
import { useAxios } from '@/composables/request.js'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import xwImg from '@/assets/xuewen.png'
import FormTextarea from '@/components/FormTextarea.vue'
import type { Blog } from '@/types/xw'

const route = useRoute()
const userStore = useUserStore()

const blog = ref<Blog>()
const inputComment = ref('')
const disableSubmit = ref(false)
const blogId = route.params.id

fetchBlog()

// 获取文章信息
async function fetchBlog() {
  const rs = await useAxios().get(`/blogs/${blogId}`)
  blog.value = rs.data
  document.title = `${blog.value?.name} - 学文`
}

// 发表评论
async function makeComment() {
  try {
    disableSubmit.value = true
    const rs = await useAxios().post('/comments/create', {
      blogId: blogId,
      content: inputComment.value
    })
    if (rs.data.error) {
      console.log(rs.data.message)
    } else {
      inputComment.value = ''
      blog.value?.comments?.unshift(rs.data)
    }
  } catch (error) {
    console.log(error)
  } finally {
    disableSubmit.value = false
  }
}
</script>

<template>
  <div class="container">
    <div class="blog">
      <div v-if="blog" class="single-box">
        <h2 v-text="blog.name"></h2>
        <p
          class="blog-meta"
          v-text="'发表于 ' + dayjs(blog.createTime * 1000).format('YYYY-MM-DD HH:mm:ss')"
        ></p>
        <p v-html="blog.html"></p>
      </div>
      <div class="single-box mt-4">
        <h4>评论</h4>
        <template v-if="blog?.comments && blog.comments.length > 0">
          <div class="comment" v-for="comment in blog.comments" :key="comment.id">
            <div class="comment-image">
              <img
                class="round-image"
                v-bind:src="comment.userImage || xwImg"
                width="65"
                height="65"
              />
            </div>
            <div class="comment-info">
              <div class="text-muted mb-2">
                <span class="mr-2" v-text="comment.userName"></span
                ><span
                  v-text="dayjs(comment.createTime * 1000).format('YYYY-MM-DD HH:mm:ss')"
                ></span>
              </div>
              <p v-html="comment.html"></p>
            </div>
          </div>
        </template>
        <template v-else>
          <span class="text-muted">还没有人评论...</span>
        </template>
        <form v-if="userStore.user" class="mt-4" v-on:submit.prevent="makeComment">
          <div class="mb-2">
            <FormTextarea
              id="inputComment"
              v-model="inputComment"
              label="评论内容"
              placeholder="说点什么吧"
              :rows="6"
              :required="true"
            ></FormTextarea>
          </div>
          <button type="submit" class="btn btn-md btn-primary mt-2 px-4" :disabled="disableSubmit">
            发表评论
          </button>
        </form>
      </div>
    </div>
    <div class="author">
      <div class="single-box">
        <div>
          <img
            class="round-image mb-1"
            v-bind:src="blog?.userImage || xwImg"
            width="120"
            height="120"
          />
          <h4>
            <a
              href="https://github.com/WangYuliang1988"
              v-text="blog?.userName"
              target="_blank"
            ></a>
          </h4>
          <p>Non-Professional Blogger</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
}

.blog {
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .blog {
    flex: 0 0 66.66666667%;
    max-width: 66.66666667%;
    padding-right: 15px;
  }
}

.blog-meta {
  margin-bottom: 1.25rem;
  font-size: 0.85rem;
  color: #999;
}

.comment {
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

.author {
  position: relative;
  width: 100%;
  text-align: center;
}

@media (min-width: 768px) {
  .author {
    flex: 0 0 33.33333333%;
    max-width: 33.33333333%;
    padding-left: 15px;
  }
}

.single-box {
  -webkit-box-shadow: 0 0 35px rgba(220, 219, 255, 0.45);
  -o-box-shadow: 0 0 35px rgba(220, 219, 255, 0.45);
  -moz-box-shadow: 0 0 35px rgba(220, 219, 255, 0.45);
  -ms-box-shadow: 0 0 35px rgba(220, 219, 255, 0.45);
  box-shadow: 0px 0px 35px rgba(220, 219, 255, 0.45);
  padding: 30px;
}

.round-image {
  padding: 0.25rem;
  background-color: #fff;
  border: 1px solid #dee2e6;
  max-width: 100%;
  height: auto;
  vertical-align: middle;
  border-radius: 50%;
}
</style>
