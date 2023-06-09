<script setup lang="ts">
defineProps<{
  currentPath: string
}>()

const navMap = new Map([
  ['/manage/blogs/edit', '编写日志'],
  ['/manage/blogs', '日志管理'],
  ['/manage/comments', '评论管理'],
  ['/manage/users', '用户管理']
])
</script>

<template>
  <nav>
    <template v-for="path in navMap.keys()" :key="path">
      <RouterLink v-if="path !== currentPath" class="p-2" :to="path">{{
        navMap.get(path)
      }}</RouterLink>
      <span v-else class="p-2 text-muted">{{ navMap.get(path) }}</span>
    </template>
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}
</style>
