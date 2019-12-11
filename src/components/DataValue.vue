<template>
  <div>
    <span v-if="isDate">{{ val | formatDate(field.format) }}</span>
    <el-tooltip
      v-else-if="field.prop === '_id'"
      :content="val"
      placement="left"
    >
      <el-tag size="small">{{ val.substr(-4) }}</el-tag>
    </el-tooltip>
    <span v-else-if="field.options">{{ getOptionLabel(val) }}</span>
    <div
      v-else
      :is="component"
      v-bind="attrs"
      @click.native="!!field.dialog && (isShow = true)"
    >
      {{ val }}
    </div>

    <el-dialog v-if="field.dialog" v-bind="field.dialog" :visible.sync="isShow">
      <div
        style="display:flex;justify-content: center;flex-direction: column;align-items: center;"
      >
        <span :is="component" v-bind="attrs"></span>
        <el-alert
          v-if="get(field, 'dialog.alert')"
          v-bind="get(field, 'dialog.alert', {})"
          style="margin-top: 20px;text-align: center;"
          :closable="false"
        ></el-alert>
      </div>

      <span slot="footer">
        <el-button @click="isShow = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { merge, get, set, template, formatDate } from "@/components/util";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Field } from "@/interfaces";

@Component<DataValue>({
  filters: {
    formatDate
  }
})
export default class DataValue extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  field!: Field;
  @Prop() value: any;

  isShow = false;

  get = get;

  get attrs() {
    const attrs: any = merge({}, get(this.field, "attrs", {}));
    for (let k in attrs) {
      attrs[k] = template(attrs[k])({ row: this.value });
    }
    return attrs;
  }

  get component() {
    return this.field.component || "span";
  }

  get val() {
    let val = get(this.field, "value", null);
    if (val === null) {
      val = get(this.value, this.field.prop, null);
    }
    if (typeof val !== "string") {
      return val;
    }
    return template(val)({ row: this.value });
  }

  get isDate() {
    return "year/month/date/week/datetime/datetimerange/daterange"
      .split("/")
      .includes(this.field.type);
  }

  getOptionLabel(val) {
    if (Array.isArray(this.field.options)) {
      return get(
        this.field.options.find(v => v.value === val),
        "text"
      );
    }
    return val;
  }
}
</script>

<style></style>
