import Vue from 'vue'
import './plugins/element'
import VueCrud from 'v-crud'

import App from './App.vue'
import router from './router'

Vue.use(VueCrud)

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
  created(){

  }
}).$mount('#app')
