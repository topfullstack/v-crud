<template>
  <el-select
    v-model="val"
    v-bind="$attrs"
    :remote-method="remoteConfig ? fetchOptions : null"
  >
    <el-option v-bind="option" v-for="option in options" :key="option.value">
      {{ option.label }}
    </el-option>
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

  async fetchOptions(q = "") {
    console.log(this.remoteConfig)
    const { url, labelField, valueField } = this.remoteConfig || {
      url: "",
      labelField: "",
      valueField: ""
    };
    console.log({url})
    if (!url) {
      return [];
    }

    const searchRes = await this.$http.get(url, {
      params: {
        query: {
          where: { [labelField]: { $regex: q } }
        }
      }
    });
    const selectedRes = await this.$http.get(url, {
      params: {
        query: {
          where: {
            [valueField]: { $in: this.isArray ? this.val : [this.val] }
          }
        }
      }
    });
    const searchData = get(searchRes.data, "data", []);
    const selectedData = get(selectedRes.data, "data", []).filter(
      (v: any) => !searchData.find((vv: any) => vv._id === v._id)
    );
    this.localOptions = searchData.concat(selectedData).map(v => ({
      label: get(v, labelField),
      value: get(v, valueField)
    }));
  }

  created() {
    this.$watch("value", () => this.fetchOptions(), {
      deep: true,
      immediate: true
    });
  }
}
</script>
