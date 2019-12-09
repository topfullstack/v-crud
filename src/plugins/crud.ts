import Vue1 from "vue";
// import ElementUI from 'element-ui'
// Vue.use(ElementUI)

import DataTable from "../components/DataTable.vue";
import DataForm from "../components/DataForm.vue";
import DataInput from "../components/DataInput.vue";
import DataValue from "../components/DataValue.vue";

// Vue.prototype.$http = {}

export default {
  DataTable, DataForm, DataInput, DataValue,
  install(Vue, options) {
    
    
    Vue.prototype.$crudConfig = options
    Vue.component(DataTable.name, DataTable);
    Vue.component(DataForm.name, DataForm);
    Vue.component(DataInput.name, DataInput);
    Vue.component(DataValue.name, DataValue);
    
  }
};
