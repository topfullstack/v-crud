<template>
  <div class="data-table">
    <h3 v-if="get(localConfig, 'title')" :is="get(localConfig, 'tag', 'h3')">
      {{ get(localConfig, "title") }}
    </h3>
    <div class="toolbar">
      <el-button
        v-if="get(localConfig, 'create.form.fields')"
        v-bind="get(localConfig, 'create.button')"
        @click="showDialog(localConfig.create, {})"
        >{{ get(localConfig, "create.button.label") }}</el-button
      >
      <slot name="buttons"></slot>
    </div>

    <div
      style="margin-top: 1rem;"
      v-if="get(localConfig, 'search.form.fields')"
    >
      <h3 v-if="get(localConfig, 'search.title')">
        {{ get(localConfig, "search.title") }}
      </h3>
      <DataForm
        v-model="searchModel"
        v-bind="get(localConfig, 'search.form')"
        inline
        @submit.native.prevent="search"
      ></DataForm>
    </div>

    <el-table
      :data="data.data"
      @sort-change="sortChange"
      v-bind="localConfig.list"
    >
      <el-table-column
        :label="get(field, 'label', field.prop.toUpperCase())"
        v-bind="field"
        v-for="field in get(localConfig, 'list.fields')"
        :key="field.prop"
        :filters="field.filterable ? field.options : null"
        :filter-method="field.filterable ? filter : null"
      >
        <template v-slot="{ row }">
          <slot :name="`prop:${field.prop}`" v-bind:row="row">
            <DataValue :field="field" :value="row"></DataValue>
          </slot>
        </template>
      </el-table-column>
      <el-table-column
        v-if="get(localConfig, 'list.action', {})"
        v-bind="get(localConfig, 'list.action', {})"
        v-slot="{ row, $index }"
      >
        <el-button
          v-if="get(localConfig, 'edit')"
          v-bind="get(localConfig, 'edit.button')"
          @click="edit(row, $index)"
          >{{ get(localConfig, "edit.button.label") }}</el-button
        >
        <el-button
          v-if="get(localConfig, 'delete')"
          v-bind="get(localConfig, 'delete.button')"
          @click="remove(row)"
          >{{ get(localConfig, "delete.button.label") }}</el-button
        >
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="
        val => {
          query.limit = val;
          fetch();
        }
      "
      @current-change="
        val => {
          query.page = val;
          fetch();
        }
      "
      v-bind="get(localConfig.list, 'page', defaults.pagination)"
      :current-page="currentPage"
      :total="total"
    ></el-pagination>

    <DataTableDialog
      v-bind="dialogConfig"
      v-model="model"
      :visible.sync="isShowDialog"
      @success="fetch"
    ></DataTableDialog>
  </div>
</template>

<script lang="ts">
import { merge, get, set, render } from "@/components/util";
import DataValue from "./DataValue.vue";
import DataForm from "./DataForm.vue";
import DataTableDialog from "./DataTableDialog.vue";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: { DataValue, DataForm, DataTableDialog }
})
export default class DataTable extends Vue {
  @Prop(String) resource!: string;
  @Prop() config!: any;

  isShowDialog = false;

  get = get;

  data: any = {};

  model = {};
  searchModel = {};
  creating = false;

  localConfig: any = {};

  query: any = { limit: 10, page: 1 };

  dialogConfig = {};

  defaultSize = "small";
  defaults = {};

  get pageSizes() {
    return get(this.localConfig.list, "page.pageSizes", [
      get(this.localConfig.list, "page.pageSize", 10)
    ]);
  }

  get total() {
    return get(this.data, "total", 0);
  }

  get currentPage() {
    return get(this.data, "page", 1);
  }

  set currentPage(val) {
    this.$set(this.data, "page", val);
  }

  showDialog(config, model = {}) {
    this.dialogConfig = config;
    this.model = merge({}, model);
    this.isShowDialog = true;
  }

  async fetch() {
    const res = await this.$http.get(`${this.resource}`, {
      params: {
        query: this.query
      }
    });
    this.data = res.data;
  }

  async sortChange({ prop, order }) {
    if (!order) {
      this.query.sort = null;
    } else {
      this.query.sort = {
        [prop]: order === "ascending" ? 1 : -1
      };
    }
    this.fetch();
  }

  async fetchConfig() {
    const res = await this.$http.get(`${this.resource}/config`);
    this.setConfig(res.data);
  }

  setConfig(config, override = false) {
    if (override) {
      this.localConfig = merge({}, config);
    }
    this.localConfig = merge({}, this.defaults, config);
  }

  async filter(value, row, column) {
    return get(row, column.property) === value;
  }

  async search() {
    const where = { ...this.searchModel };
    const cond = {};
    for (let k in where) {
      const val = where[k];
      if (val === "" || val === null) {
        continue;
      }
      cond[k] = val;
      const field: any = get(this.localConfig, "search.form.fields", []).find(
        (v: any) => v.prop === k
      );
      if (field && field.regex && val) {
        cond[k] = { $regex: val };
      }
      if (Array.isArray(val) && val[0] instanceof Date) {
        cond[k] = { $gte: val[0], $lt: val[1] };
      }
    }
    this.query.where = cond;
    this.query.page = 1;
    this.fetch();
  }

  async edit(currentRow, index) {
    let row = merge({}, currentRow);
    const config = get(this.localConfig, "edit", {});
    let { fetchUrl } = config;
    if (fetchUrl) {
      fetchUrl = render(fetchUrl, { row, index });
      const res = await this.$http.get(fetchUrl);
      row = res.data;
    }

    const action = get(config, "form.action", "");
    const actionUrl = render(action, { row, index });
    set(config, "form.action", actionUrl);
    this.showDialog(config, row);
  }

  async remove(row) {
    try {
      await this.$confirm("是否确认删除");
    } catch (e) {
      return;
    }
    await this.$http.delete(`${this.resource}/${row._id}`);
    this.$message.success("删除成功");
    this.fetch();
  }

  get localDefaults() {
    return {
      create: {
        button: {
          label: "创建",
          size: this.defaultSize,
          type: "success"
        },
        form: {
          method: "post",
          action: this.resource,
          size: this.defaultSize
        }
      },
      edit: {
        button: {
          type: "text",
          label: "编辑",
          icon: "el-icon-edit",
          size: this.defaultSize
        },
        form: {
          method: "put",
          action: `${this.resource}/\${row._id}`
        }
      },
      search: {
        form: {
          submitText: "搜索"
        }
      },
      delete: {
        button: {
          type: "text",
          label: "删除",
          icon: "el-icon-delete",
          size: this.defaultSize
        }
      },
      list: {
        page: {
          pageSize: 10,
          pageSizes: [10, 20],
          background: true,
          layout: "total, sizes, prev, pager, next, jumper"
        },
        action: {
          label: "操作",
          width: "220px"
        }
      }
    };
  }

  mounted() {
    this.defaults = merge({}, this.localDefaults, this.$crudDefaults);
    this.$watch(
      "config",
      config => {
        this.setConfig(config);
      },
      {
        deep: true,
        immediate: true
      }
    );

    if (!this.config) {
      this.fetchConfig();
    }

    // this.showDialog(this.localConfig.create, {})
    this.fetch();

    this.$watch(
      "localConfig.list.pagination",
      page => {
        const pageSize = get(page, "pageSize", 10);
        this.query.limit = pageSize;
        if (!get(this.localConfig, "list.pagination")) {
          set(this.localConfig, "list.pagination", {
            pageSize,
            pageSizes: [pageSize]
          });
        }
      },
      { deep: true, immediate: true }
    );
  }
}
</script>

<style lang="scss">
* {
  outline: none;
}
.data-table {
  .el-pagination {
    margin-top: 20px;
  }
  .toolbar > * {
    margin-left: 20px;
    &:first-child {
      margin-left: 0;
    }
  }
}
</style>
