<template>
  
  <component v-model="val" v-bind="field" :is="field.tag || 'el-input'" :title="subTag">
    <template v-if="subTag">
      <component
      :is="subTag"
      :label="isCheckboxOrRadio ? option.value : option.label"
      :value="isCheckboxOrRadio ? undefined : option.value"
      v-for="option in field.options"
      :key="option.value"
    >{{option.label}}</component>
    </template>
  </component>
</template>

<script lang="ts">
import { get } from "dot-prop";
import dayjs from "dayjs";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Field } from "../interfaces";

import UploadField from './fields/UploadField.vue'
import HtmlEditorField from './fields/HtmlEditorField.vue'

@Component({
  components: {
    UploadField,
    HtmlEditorField
  },
  filters: {
    formatDate(val, format = "YYYY-MM-DD HH:mm:ss") {
      return dayjs(val).format(format);
    }
  }
})
export default class DataInput extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  field!: Field;
  @Prop() value: any;

  get defaultValue() {
    let value;
    switch (this.field.type) {
      default:
        value = null;
    }
    return value;
  }

  get isCheckboxOrRadio(){
    return ['el-checkbox', 'el-radio'].includes(this.subTag as any)
  }

  get subTag(){
    if (!this.field.options) {
      return null
    }
    const tags = {
      'el-radio-group': 'el-radio',
      'el-checkbox-group': 'el-checkbox',
      'el-select': 'el-option',
    }
    return get(tags, this.field.tag, null)
  }

  get val() {
    return get(this.value, this.field.prop, this.defaultValue);
  }

  set val(value) {
    this.$emit("input", value);
  }

  get isDate() {
    return "year/month/date/week/datetime/datetimerange/daterange"
      .split("/")
      .includes(this.field.type);
  }
}
</script>

<style></style>
