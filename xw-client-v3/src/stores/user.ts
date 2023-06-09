import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const SESSION_NAME = 'user'

export const useUserStore = defineStore('userStore', () => {
  const _user = ref<User | null>(null)

  const user = computed(() => {
    const local = sessionStorage.getItem(SESSION_NAME)
    if (local) {
      _user.value = JSON.parse(local)
    }
    return _user.value
  })

  function saveUser(user: User) {
    _user.value = user
    sessionStorage.setItem(SESSION_NAME, JSON.stringify(user))
  }

  function clearUser() {
    _user.value = null
    sessionStorage.removeItem(SESSION_NAME)
  }

  return { user, saveUser, clearUser }
})
