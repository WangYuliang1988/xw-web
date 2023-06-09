<template>
  <div>
    <nav class="nav d-flex justify-content-center mb-4">
      <router-link class="p-2" to="/manage/blogs/edit">编写日志</router-link>
      <router-link class="p-2" to="/manage/blogs">日志管理</router-link>
      <router-link class="p-2" to="/manage/comments">评论管理</router-link>
      <span class="p-2 text-muted">用户管理</span>
    </nav>
    <div class="table-responsive">
      <template v-if="users.length > 0">
        <table class="table table-striped table-sm text-center">
          <thead>
            <tr>
              <th>名字</th>
              <th>电子邮箱</th>
              <th>注册时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td><span v-text="user.name"></span><template v-if="user.admin"><span class="text-admin ml-1">(管理员)</span></template></td>
              <td><a v-bind:href="'mailto:' + user.email" v-text="user.email"></a></td>
              <td><span v-text="$dayjs(user.createTime * 1000).format('YYYY-MM-DD HH:mm:ss')"></span></td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-if="page.hasNext">
        <nav class="text-center">
          <button class="btn btn-outline-primary my-2" @click="fetchUsers(++page.currentPage)">加载更多</button>
        </nav>
      </template>
      <template v-if="users.length === 0">
        <div class="text-center"><span>没有用户可供管理</span></div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ManageUsers',
  data() {
    return {
      page: {},
      users: []
    }
  },
  async created() {
    this.fetchUsers(1)
  },
  methods: {
    async fetchUsers(pageIndex) {
      let rs = await this.$axios.get('/users', {
        params: {
          page: pageIndex, 
          size: 10
        } 
      })
      this.page = rs.data.page
      this.users.push(...rs.data.users)
    }
  }
}
</script>

<style lang="scss" scoped>
.text-admin {
  color: #d05;
  font-size: 0.8rem;
}
</style>>