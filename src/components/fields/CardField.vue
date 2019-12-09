<template>
  <div class="card-field">
    <el-button
      v-show="localValue.length < 1"
      circle
      size="small"
      @click="
        () => {
          localValue.push({});
          updateValue();
        }
      "
      icon="el-icon-plus"
    ></el-button>

    <el-row type="flex" :gutter="gutter">
      <el-col
        :span="$attrs.span || 8"
        v-for="(row, $index) in localValue"
        :key="`card-${$index}`"
        :style="{ 'margin-bottom': gutter + 'px' }"
      >
        <el-card>
          <SubField
            :fields="fields"
            :value="row"
            @input="val => setIndexValue($index, val)"
          ></SubField>
          <div style="text-align:center;">
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
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import SubField from "./SubField.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import { get, merge, set } from "../util";

@Component({
  components: {
    SubField
  }
})
export default class CardField extends Vue {
  @Prop() value!: any;
  @Prop() fields!: any[];

  localValue: any = [];

  get gutter() {
    return this.$attrs.gutter || 10;
  }

  getFieldValue(field) {
    return get(this.localValue, field.prop);
  }

  setIndexValue(index, value) {
    set(this.localValue, `${index}`, value);
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
    (this.$options.components as any).DataInput = () =>
      import("../DataInput.vue");
  }
}
</script>

<style lang="scss">
.card-field {
  .el-row--flex {
    flex-wrap: wrap;
  }
}
</style>
