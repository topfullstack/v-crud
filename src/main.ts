import Vue from 'vue'
import './plugins/element'
import VueCrud from 'v-crud'

import App from './App.vue'
import router from './router'



import QrcodeVue from 'qrcode.vue'
Vue.component('vue-qrcode', QrcodeVue)

import axios from 'axios'


const http = axios.create({
  baseURL: 'http://localhost:4001/admin/api',
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
})
Vue.config.productionTip = false
Vue.prototype.$http = http

Vue.use(VueCrud, {
  http
})



new Vue({
  router,
  render: h => h(App),
  created(){

  }
}).$mount('#app')
