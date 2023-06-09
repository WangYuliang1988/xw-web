<script setup lang="ts">
// 声明属性
defineProps<{
  id: string
  type: string
  name?: string
  label: string
  modelValue: string
  placeholder?: string
  maxlength?: number
  minlength?: number
  required?: boolean
  autofocus?: boolean
  autocomplete?: string
}>()

// 声明事件（可选，不影响使用，通过声明可方便调用者知悉组件可以触发的事件）
defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <label :for="id" class="screen-reader-label">{{ label }}</label>
  <input
    class="form-control"
    :id="id"
    :type="type"
    :name="name"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    :placeholder="placeholder"
    :maxlength="maxlength"
    :minlength="minlength"
    :required="required"
    :autofocus="autofocus"
    :autocomplete="autocomplete"
  />
</template>

<style scoped>
@import '@/assets/form.css';
</style>
