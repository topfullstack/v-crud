<template>
  <component :is="component" v-model="val" v-bind="field"></component>
</template>

<script lang="ts">
import {get} from 'dot-prop'
import dayjs from 'dayjs'
import { Vue, Component, Prop } from "vue-property-decorator";
import {Field} from '../interfaces'

@Component({
  filters: {
    formatDate(val, format = 'YYYY-MM-DD HH:mm:ss'){
      return dayjs(val).format(format)
    }
  }
})
export default class DataInput extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  field!: Field
  @Prop() value:any

  get component(){
    return get({
      'date': 'el-date-picker',
      'datetime': 'el-datetime-picker',
    }, this.field.type, 'el-input')
  }
  
  get defaultValue(){
    let value
    switch(this.field.type) {
      default:
        value = null
    }
    return value
  }

  get val(){
    return get(this.value, this.field.prop, this.defaultValue)
  }

  set val(value){
    this.$emit('input', value)
  }

  get isDate(){
    return 'year/month/date/week/datetime/datetimerange/daterange'.split('/').includes(this.field.type)
  }
}
</script>

<style>

</style>