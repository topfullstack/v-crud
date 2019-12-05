<template>
  <component
    v-bind="$attrs"
    :is="get($attrs, 'is', 'el-dialog')"
    :visible="visible"
    @update:visible="val => $emit('update:visible', val)"
  >
    <DataForm v-model="model" v-bind="form" @success="success"></DataForm>
  </component>
</template>

<script lang="ts">
import DataForm from "./DataForm.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import { get } from "dot-prop";
import merge from "deepmerge";

@Component({
  components: { DataForm }
})
export default class DataTableDialog extends Vue {
  @Prop(Boolean) visible!: boolean;
  @Prop({}) form!: any;

  @Prop() value!: any;

  get = get;

  get model() {
    return merge({}, this.value);
  }

  set model(val) {
    this.$emit("input", merge({}, val));
  }

  success(data) {
    this.$emit("success", data);
    this.$emit("update:visible", false);
  }
}
</script>
