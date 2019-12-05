import Vue from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'
import './plugins/element'

Vue.config.productionTip = false
Vue.prototype.$http = axios.create({
  baseURL: 'http://localhost:4001/admin/api',
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
})


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')