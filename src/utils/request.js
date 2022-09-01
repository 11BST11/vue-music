import axios from 'axios'

// 以入nprogress包对应的css和js
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'

const baseURL = process.env.NODE_ENV === 'development' ? '/api' : 'https://lianghj.top:3000'

const service = axios.create({
  baseURL,
  timeout: 5000
})

service.interceptors.request.use(response => {
  NProgress.start()
  // console.log(config)
  // 在最后必须 return config
  return response
})

service.interceptors.response.use(
  response => {
    NProgress.done()
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    error && Message({
      type: 'error',
      message: '网络连接出问题了~',
      showClose: true
    })
  }
)

export default service
