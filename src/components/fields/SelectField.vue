<template>
  <el-select v-model="val" v-bind="$attrs" :remote-method="remoteConfig ? fetchSearchedOptions : null">
    <el-option v-bind="option" v-for="option in localOptions" :key="option.value">{{ option.label }}</el-option>
  </el-select>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { get, merge } from "../util";

@Component({})
export default class SelectField extends Vue {
  @Prop() value!: any;
  @Prop({
    default: () => []
  })
  options!: any;
  @Prop() remoteConfig!: any;

  localOptions = [...this.options];

  get isArray() {
    return get(this.$attrs, "multiple", false);
  }

  get val() {
    if (this.isArray && Array.isArray(this.value)) {
      return this.value.map(v => get(v, "_id", v));
    } else {
      return get(this.value, "_id", this.value);
    }
  }

  set val(value) {
    this.$emit("input", value);
  }

  async fetchSearchedOptions(q) {
    if (!q) {
      return;
    }
    const { url, labelField, valueField } = this.remoteConfig;
    const where = { [labelField]: { $regex: q } };
    const options = await this.fetchOptions(where);
    this.localOptions = [...new Set([...options, ...this.localOptions])]
  }

  async fetchSelectedOptions() {
    const { url, labelField, valueField } = this.remoteConfig;
    const where = {
      [valueField]: { $in: this.isArray ? this.val : [this.val] }
    };
    this.localOptions = await this.fetchOptions(where);
  }

  async fetchOptions(where) {
    const { url, labelField, valueField } = this.remoteConfig || {
      url: "",
      labelField: "",
      valueField: ""
    };
    if (!url) {
      return [];
    }

    const res = await this.$http.get(url, {
      params: {
        query: {
          where
        }
      }
    });
    return get(res.data, 'data', []).map(v => ({
      label: get(v, labelField),
      value: get(v, valueField)
    }));
  }

  async mounted() {
    await this.fetchSelectedOptions()
    // this.$watch("value", () => this.fetchSelectedOptions(), {
    //   // deep: true,
    //   immediate: true
    // });
  }
}
</script>
