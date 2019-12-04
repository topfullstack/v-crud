<template>
  <img v-if="type === 'image'" :src="val" width="100%">
  <span v-else-if="isDate">{{val|formatDate}}</span>
  <span v-else>{{val}}</span>
</template>

<script lang="ts">
import {get} from 'dot-prop'
import dayjs from 'dayjs'
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  filters: {
    formatDate(val, format = 'YYYY-MM-DD HH:mm:ss'){
      return dayjs(val).format(format)
    }
  }
})
export default class DataValue extends Vue {
  @Prop(String) prop!: string
  @Prop({
    type: String,
    default: 'text'
  })
  type!: string
  @Prop(String) format?: string
  @Prop() value:any

  get val(){
    return get(this.value, this.prop, null)
  }

  get isDate(){
    return 'year/month/date/week/datetime/datetimerange/daterange'.split('/').includes(this.type)
  }
}
</script>

<style>

</style>