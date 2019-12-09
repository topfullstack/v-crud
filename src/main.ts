import Vue from 'vue'
// import 'bootstrap/dist/css/bootstrap.min.css'
import './plugins/element'
import './plugins/crud'
import App from './App.vue'
import router from './router'

import QrcodeVue from 'qrcode.vue'
Vue.component('vue-qrcode', QrcodeVue)

import axios from 'axios'


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
