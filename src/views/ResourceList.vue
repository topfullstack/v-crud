<template>
  <DataTable :resource="resource">
    <!-- <template v-slot:prop:title="{row}">
      <el-button type="primary">{{row.title}}</el-button>
    </template> -->
  </DataTable>
</template>

<script lang="ts">
import DataTable from "../components/DataTable.vue";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: { DataTable }
})
export default class ResourceList extends Vue {
  @Prop(String) resource!: string;
}
</script>

<style>
</style>