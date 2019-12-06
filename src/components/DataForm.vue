<template>
  <component :is="component" v-bind="$attrs" @submit.native.prevent="submit" v-loading="loading">
    <el-tabs v-model="active" v-bind="tabsOptions" v-if="tabs">
      <el-tab-pane v-for="item in fields" :key="item.key" :label="item.label" :name="item.id">
        <el-form-item v-for="field in item.children" :key="field.prop" :label="field.label">
          <DataInput :value="value" :field="field" @input="val => setFieldValue(field, val)"></DataInput>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>

    <template v-else>
      <el-form-item v-for="field in fields" :key="field.prop" :label="field.label">
        <DataInput :value="value" :field="field" @input="val => setFieldValue(field, val)"></DataInput>
      </el-form-item>
    </template>

    <el-form-item v-if="submitText">
      <el-button type="primary" native-type="submit">
        {{
        submitText
        }}
      </el-button>
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

  @Prop() tabs!: any;

  @Prop({ default: () => ({}) })
  value!: any;

  @Prop(Array) fields!: any[];

  @Prop({ default: "提交" })
  submitText!: string;
  @Prop({ default: "" })
  backText!: string;

  loading = false;
  active = null

  get tabsOptions(){
    return typeof this.tabs === 'object' ? this.tabs : {}
  }

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
    try {
      const res = await this.$http[method](action, this.value);
      successMessage && this.$message.success(successMessage);
      this.$emit("success", res.data);
    } catch (e) {
      this.$message.error(`出错了： ${e.message}`);
    }
    this.loading = false;
  }
}
</script>

<style></style>
