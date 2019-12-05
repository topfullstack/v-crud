<template>
  <span v-if="field.options">{{ getOptionLabel(val) }}</span>
  <span v-else-if="isDate">{{ val | formatDate }}</span>
  <span v-else :is="field.tag || 'span'" v-bind="attrs">{{ val }}</span>
</template>

<script lang="ts">
import { merge, get, set, render } from "@/components/util";
import dayjs from "dayjs";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Field } from "@/interfaces";


@Component<DataValue>({
  filters: {
    formatDate(val, format = "YYYY-MM-DD HH:mm:ss") {
      return dayjs(val).format(format);
    }
  }
})
export default class DataValue extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  field!: Field;
  @Prop() value: any;

  get attrs() {
    const attrs: any = merge({}, get(this.field, "attrs", {}));
    for (let k in attrs) {
      attrs[k] = render(attrs[k], { row: this.value });
    }
    return attrs;
  }

  get val() {
    let val = get(this.field, "value", null);
    if (val === null) {
      val = get(this.value, this.field.prop, null);
    }
    if (typeof val !== 'string') {
      return val
    }
    return render(val, { row: this.value });
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
