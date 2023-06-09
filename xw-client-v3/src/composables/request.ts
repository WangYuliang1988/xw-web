import axios from 'axios'

const $axios = axios.create({
  baseURL: '/reborn/api/',
  timeout: 30000
})

export function useAxios() {
  return $axios
}
