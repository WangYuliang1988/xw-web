// Axios 网络请求工具类，参考：https://www.axios-http.cn/

import axios from "axios"

const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://www.yigelangzi.com/reborn/api/' : 'http://127.0.0.1:2046/reborn/api/'

const request = axios.create({
  baseURL: BASE_URL,
  timeout: 30000
})

export default request