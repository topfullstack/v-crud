<template>
  <component v-model="val" v-bind="field" :is="component">
    <template v-if="subComponent">
      <component
        :is="subComponent"
        :label="isCheckboxOrRadio ? option.value : option.label"
        :value="isCheckboxOrRadio ? undefined : option.value"
        v-for="option in localOptions"
        :key="option.value"
      >{{ option.label }}</component>
    </template>
  </component>
</template>

<script lang="ts">
import { get } from "dot-prop";
import dayjs from "dayjs";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Field } from "../interfaces";

import UploadField from "./fields/UploadField.vue";
import HtmlEditorField from "./fields/HtmlEditorField.vue";
import SubField from "./fields/SubField.vue";
import TableField from "./fields/TableField.vue";
import CardField from "./fields/CardField.vue";
import SelectField from "./fields/SelectField.vue";

@Component({
  components: {
    UploadField,
    HtmlEditorField,
    SubField,
    TableField,
    SelectField,
    CardField
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

  localOptions = get(this.field, "options", []);
  // .concat(
  //   this.optionsFromValue
  // );

  get optionsFromValue() {
    return [
      {
        [get(this.value, get(this.field, "labelField", "_id"), "")]: get(
          this.val,
          get(this.field, "valueField", "title")
        )
      }
    ];
  }

  get defaultValue() {
    let value;

    if (this.isArray) {
      return [];
    } else {
      switch (this.field.type) {
        default:
          value = null;
      }
    }
    return value;
  }

  get isCheckboxOrRadio() {
    return ["el-checkbox", "el-radio"].includes(this.subComponent as any);
  }

  get component() {
    return get(this.field, "component", "el-input");
  }

  get subComponent() {
    const tags = {
      "el-radio-group": "el-radio",
      "el-checkbox-group": "el-checkbox",
      "el-select": "el-option"
    };
    return get(tags, this.field.component, null);
  }

  get isArray() {
    return get(this.field, "multiple", false);
  }

  get isSelect() {
    return ["el-select"].includes(this.field.component);
  }

  get val() {
    return get(this.value, this.field.prop, this.defaultValue);
  }

  set val(value) {
    this.$emit("input", value);
  }
}
</script>

<style></style>
