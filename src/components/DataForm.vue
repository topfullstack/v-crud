<template>
  <component
    :is="component"
    v-bind="$attrs"
    @submit.native.prevent="submit"
    v-loading="loading"
  >
    <el-form-item v-for="field in fields" :key="field.prop" v-bind="field">
      <DataInput
        :value="value"
        :field="field"
        @input="val => setFieldValue(field, val)"
      ></DataInput>
    </el-form-item>

    <el-form-item v-if="submitText">
      <el-button type="primary" native-type="submit">{{
        submitText
      }}</el-button>
      <el-button v-if="backText">{{ backText }}</el-button>
    </el-form-item>
  </component>
</template>

<script lang="ts">
import DataInput from "./DataInput.vue";
import { get } from "dot-prop";

import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    DataInput
  }
})
export default class DataForm extends Vue {
  @Prop({
    type: String,
    default: "el-form"
  })
  component!: string;

  @Prop({ default: () => ({}) })
  value!: any;

  @Prop(Array) fields!: any[];

  @Prop({ default: "提交" }) submitText!: string;
  @Prop({ default: "" }) backText!: string;

  loading = false

  getFieldValue(field) {
    return get(this.value, field.prop);
  }

  setFieldValue(field, value) {
    this.$emit("input", { ...this.value, [field.prop]: value });
  }

  async submit() {
    if (!this.$attrs.action) {
      return;
    }
    this.loading = true;
    const { action, method = "post", successMessage } = this.$attrs;
    const res = await this.$http[method](action, this.value);
    successMessage && this.$message.success(successMessage);
    this.$emit("success", res.data);
    this.loading = false;
  }
}
</script>

<style></style>
