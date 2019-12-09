<template>
  <component
    class="data-form"
    :is="tag"
    v-bind="$attrs"
    @submit.native.prevent="submit"
    v-loading="loading"
    ref="form"
    :model="value"
  >
    <el-tabs v-model="activeTab" v-bind="tabsOptions" v-if="tabs">
      <el-tab-pane
        v-for="item in fields"
        :key="item.prop"
        :label="item.label"
        :name="item.prop"
      >
        <el-row type="flex" style="flex-wrap: wrap;">
          <el-col
            :span="field.span"
            v-for="field in item.fields"
            :key="field.prop"
          >
            <el-form-item v-bind="getFormItemOptions(field)">
              <DataInput
                :value="value"
                :field="field"
                @input="val => setFieldValue(field, val)"
              ></DataInput>
              <div class="hint" v-html="field.hint"></div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <template v-else>
      <el-form-item
        v-for="field in fields"
        :key="field.prop"
        v-bind="getFormItemOptions(field)"
      >
        <DataInput
          :value="value"
          :field="field"
          @input="val => setFieldValue(field, val)"
        ></DataInput>
      </el-form-item>
    </template>

    <el-form-item v-if="submitText">
      <el-button type="primary" native-type="submit">
        {{ submitText }}
      </el-button>
      <el-button v-if="backText">{{ backText }}</el-button>
    </el-form-item>
  </component>
</template>

<script lang="ts">
import DataInput from "./DataInput.vue";
import { get, merge, pick } from "./util";

import { Vue, Component, Prop } from "vue-property-decorator";
import { ElForm } from "element-ui/types/form";

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
  tag!: string;

  @Prop() tabs!: any;

  @Prop({ default: () => ({}) })
  value!: any;

  @Prop(Array) fields!: any[];

  @Prop({ default: "提交" })
  submitText!: string;
  @Prop({ default: "" })
  backText!: string;

  loading = false;

  activeTab = get(this.tabsOptions, "value", get(this.fields, "0.prop"));

  get tabsOptions() {
    return typeof this.tabs === "object" ? this.tabs : {};
  }

  getFieldValue(field) {
    return get(this.value, field.prop);
  }

  setFieldValue(field, value) {
    this.$emit("input", { ...this.value, [field.prop]: value });
  }

  getFormItemOptions(field) {
    return pick(field, [
      "prop",
      "label",
      "required",
      "labelWidth",
      "rules",
      ""
    ]);
  }

  async submit() {
    const { action, method = "post", successMessage, rules } = this.$attrs;
    if (!action) {
      return;
    }
    if (rules) {
      try {
        await (this.$refs.form as ElForm).validate();
      } catch (e) {
        return false;
      }
    }
    this.loading = true;
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

<style lang="scss">
.data-form {
  .hint {
    color: gray;
    font-size: 12px;
  }
}
</style>
