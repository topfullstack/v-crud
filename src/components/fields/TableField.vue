<template>
  <el-table :data="value">
    <el-table-column v-bind="field" v-for="field in fields" :key="field.prop">
      <template v-slot="{ row, $index }">
        <DataInput
          :field="field"
          :value="row"
          @input="val => setFieldValue($index, field, val)"
        ></DataInput>
      </template>
    </el-table-column>
    <el-table-column width="200px">
      <template #default="{row, $index}">
        <el-button
          circle
          size="small"
          @click="
            () => {
              localValue.splice($index + 1, 0, {});
              updateValue();
            }
          "
          icon="el-icon-plus"
        ></el-button>

        <el-button
          circle
          size="small"
          @click="
            () => {
              localValue.splice($index, 1);
              updateValue();
            }
          "
          icon="el-icon-minus"
        ></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { get, merge, set } from "../util";

@Component({})
export default class TableField extends Vue {
  @Prop() value!: any;
  @Prop() fields!: any[];

  localValue: [];

  getFieldValue(field) {
    return get(this.localValue, field.prop);
  }

  setFieldValue(index, field, value) {
    set(this.localValue, `${index}.${field.prop}`, value);
    this.updateValue();
  }

  updateValue() {
    this.$emit("input", this.localValue);
  }

  mounted() {
    this.$watch("value", () => (this.localValue = [...this.value]), {
      deep: true,
      immediate: true
    });
  }

  beforeCreate() {
    this.$options.components.DataInput = () => import("../DataInput.vue");
  }
}
</script>
