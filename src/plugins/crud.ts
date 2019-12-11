import Vue1 from "vue";
// import ElementUI from 'element-ui'
// Vue.use(ElementUI)

import VCrudTable from "../components/DataTable.vue";
import VCrudForm from "../components/DataForm.vue";
import VCrudInput from "../components/DataInput.vue";
import VCrudValue from "../components/DataValue.vue";

// Vue.prototype.$http = {}

export default {
  VCrudTable, VCrudForm, VCrudInput, VCrudValue,
  install(Vue, options) {
    
    
    Vue.prototype.$crudConfig = options
    Vue.component('VCrudTable', VCrudTable);
    Vue.component('VCrudForm', VCrudForm);
    Vue.component('VCrudInput', VCrudInput);
    Vue.component('VCrudValue', VCrudValue);
    
  }
};
