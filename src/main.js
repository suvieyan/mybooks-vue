import Vue from 'vue'
import App from './App'

// 生产环境的提示关闭
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
