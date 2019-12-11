<template>
  <v-crud-table :resource="resource" :config="api[resource]">
    <!-- <template v-slot:prop:title="{row}">
      <el-button type="primary">{{row.title}}</el-button>
    </template> -->
  </v-crud-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import * as api from "../fake.config";

@Component({
})
export default class ResourceList extends Vue {
  @Prop(String) resource!: string;

  api = api
}
</script>

<style>
</style>