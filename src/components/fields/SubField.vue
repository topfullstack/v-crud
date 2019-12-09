<template>
  <div>
    <el-form-item
      v-bind="getFormItemOptions(field)"
      v-for="field in fields"
      :key="field.prop"
    >
      <DataInput
        :value="value"
        :field="field"
        @input="val => setFieldValue(field, val)"
      ></DataInput>
    </el-form-item>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from "vue-property-decorator";
import { get, merge, pick } from "../util";

@Component({})
export default class SubField extends Vue {
  @Prop() value!: any;
  @Prop() fields!: any[];

  getFieldValue(field) {
    return get(this.value, field.prop);
  }

  setFieldValue(field, value) {
    this.$emit("input", { ...this.value, [field.prop]: value });
  }

  getFormItemOptions(field){
    return pick(field, ['prop', 'label','required', 'labelWidth', 'rules', ''])
  }

  beforeCreate(){
    (this.$options.components as any).DataInput = () => import('../DataInput.vue')
  }
}
</script>
