<template>
  <el-select
    v-model="val"
    v-bind="$attrs"
    :remote-method="remoteConfig ? fetchSearchedOptions : null"
  >
    <el-option
      v-bind="option"
      v-for="option in localOptions"
      :key="option.value"
      >{{ option.label }}</el-option
    >
  </el-select>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { get, merge, uniqBy } from "../util";

@Component({})
export default class SelectField extends Vue {
  @Prop() value!: any;
  @Prop({
    default: () => []
  })
  options!: any;
  @Prop() remoteConfig!: any;

  localOptions:any = [...this.options];
  selectedOptions:any = []

  q = ''

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

  async fetchSearchedOptions(q = this.q) {
    const { url, labelField, valueField, options = {} } = this.remoteConfig;
    const cond = { [labelField]: { $regex: this.q } };
    const queryOptions = merge({}, options, { where: cond })
    const fetchedOptions = await this.fetchOptions(queryOptions);
    this.localOptions = uniqBy(fetchedOptions.concat(this.selectedOptions), 'value');
  }

  async fetchSelectedOptions() {
    const { url, labelField, valueField } = this.remoteConfig;
    const where = {
      [valueField]: { $in: this.isArray ? this.val : [this.val] }
    };
    this.selectedOptions = await this.fetchOptions({ where });
    this.localOptions = this.selectedOptions.slice(0)
  }

  async fetchOptions(query) {
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
        query: JSON.stringify(query)
      }
    });
    return get(res.data, "data", []).map(v => ({
      label: get(v, labelField),
      value: get(v, valueField)
    }));
  }

  async mounted() {
    this.remoteConfig &&  this.fetchSelectedOptions();
    // this.$watch("value", () => this.fetchSearchedOptions(''), {
    //   // deep: true,
    //   immediate: true
    // });
  }
}
</script>
