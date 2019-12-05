<template>
  <el-radio-group v-if="['radio', 'radio-group', 'el-radio-group'].includes(field.is)" v-model="val">
    <el-radio :label="option.value" v-for="option in field.options" :key="option.value">{{option.text}}</el-radio>
  </el-radio-group>
  <el-input v-else v-model="val" v-bind="field" :is="field.tag || 'el-input'" ></el-input>
  
</template>

<script lang="ts">
import { get } from "dot-prop";
import dayjs from "dayjs";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Field } from "../interfaces";

@Component({
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
