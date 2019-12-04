<template>
  <component
    v-bind="$attrs"
    :is="get($attrs, 'is', 'el-dialog')"
    :visible.sync="visible"
  >
    <DataForm v-model="model" v-bind="form" @success="success"></DataForm>
  </component>
</template>

<script lang="ts">
import DataForm from "./DataForm.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import { get } from "dot-prop";

@Component({
  components: { DataForm }
})
export default class DataTable extends Vue {
  @Prop(Boolean) visible!: boolean;
  @Prop({}) form!: any;

  @Prop() value!: any;

  get = get;

  model = {};

  created() {
    this.model = { ...this.value };
  }

  success(data) {
    this.$emit("success", data);
    this.$emit("update:visible", false);
  }
}
</script>
