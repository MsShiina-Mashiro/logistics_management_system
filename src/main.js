import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

import axios from 'axios'
// 配置请求的根路径
//axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios.interceptors.request.use(config => {
//   NProgress.start()
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   // 最后必须返回config
//   return config
// })

// axios.interceptors.response.use(config => {
//   NProgress.done()
//   return config
// })

Vue.prototype.$http = axios

Vue.config.productionTip = false

if(process.env.NODE_ENV=='development')
{
  import('./mock')
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
