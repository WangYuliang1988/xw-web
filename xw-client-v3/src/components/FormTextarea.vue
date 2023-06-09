<script setup lang="ts">
// 声明属性
defineProps<{
  id: string
  name?: string
  label: string
  rows?: number
  modelValue: string
  placeholder?: string
  required?: boolean
}>()

// 声明事件（可选，不影响使用，通过声明可方便调用者知悉组件可以触发的事件）
defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <label :for="id" class="screen-reader-label">{{ label }}</label>
  <textarea
    class="form-control"
    :id="id"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    :placeholder="placeholder"
    :rows="rows"
    :required="required"
  ></textarea>
</template>

<style scoped>
@import '@/assets/form.css';

textarea {
  overflow: auto;
  resize: vertical;
  font-family: inherit;
}
</style>
