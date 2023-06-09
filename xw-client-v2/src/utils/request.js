// Axios 网络请求工具类，参考：https://www.axios-http.cn/

import axios from "axios"

const request = axios.create({
  baseURL: '/reborn/api/',
  timeout: 30000
})

export default request