import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './plugins/element.js'

// 导入弹框提升组件
import { Message, MessageBox } from 'element-ui'
// 导入全局样式表
import './assets/css/global.css'
import './assets/iconfont/iconfont.css'

// 导入Aplayer
import APlayer from '@moefe/vue-aplayer'
Vue.use(APlayer, {
  defaultCover: 'https://blog-1302314564.cos.ap-chengdu.myqcloud.com/images/ghsr.png',
  productionTip: true
})

// $bus 事件总线的导入
Vue.prototype.$bus = new Vue()
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  // getMonth是从0开始的，padStart(a,b)代表有a位，不足用b补充
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.filter('dateFormatMax', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  // getMonth是从0开始的，padStart(a,b)代表有a位，不足用b补充
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  return `${y}-${m}-${d}`
})

Vue.filter('dateFormatmini', function (originVal) {
  const dt = new Date(originVal)
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${mm}:${ss}`
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
