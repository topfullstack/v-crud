<template>
  <DataTable :resource="resource" :config="api[resource]">
    <!-- <template v-slot:prop:title="{row}">
      <el-button type="primary">{{row.title}}</el-button>
    </template> -->
  </DataTable>
</template>

<script lang="ts">
import DataTable from "../components/DataTable.vue";
import { Component, Prop, Vue } from "vue-property-decorator";

import * as api from "../fake.config";

@Component({
  components: { DataTable }
})
export default class ResourceList extends Vue {
  @Prop(String) resource!: string;

  api = api
}
</script>

<style>
</style>