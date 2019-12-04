import Vue from 'vue'
declare module '*.vue' {
  export default Vue
}

import VueRouter, { Route } from "vue-router";
import { AxiosInstance } from "axios";

declare module "vue/types/vue" {
  interface Vue {
    $http: AxiosInstance
  }
}


