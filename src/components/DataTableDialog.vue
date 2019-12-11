<template>
  <component
    class="data-table-dialog"
    v-bind="dialog"
    :is="get(dialog, 'component', 'el-dialog')"
    :visible="visible"
    @update:visible="val => $emit('update:visible', val)"
  >
    <DataForm v-model="model" v-bind="form" @success="success"></DataForm>
  </component>
</template>

<script lang="ts">
import DataForm from "./DataForm.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import { get, merge } from "./util";

@Component({
  components: { DataForm }
})
export default class DataTableDialog extends Vue {
  @Prop(Boolean) visible!: boolean;
  @Prop({}) dialog!: any;
  @Prop({}) form!: any;

  @Prop() value!: any;

  get = get;

  get model() {
    return merge({}, this.value);
  }

  set model(val: any) {
    this.$emit("input", merge({}, val));
  }

  success(data) {
    this.$emit("success", data);
    this.$emit("update:visible", false);
  }
}
</script>

<style lang="scss">
.data-table-dialog {
  .el-drawer__body {
    padding: 20px;
  }
}
</style>