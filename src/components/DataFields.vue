<template>
  <div>
    <el-form-item
      v-for="field in fields"
      :key="field.prop"
      :label="field.label"
    >
      <DataInput
        :value="value"
        :field="field"
        @input="val => setFieldValue(field, val)"
      ></DataInput>
    </el-form-item>
  </div>
</template>