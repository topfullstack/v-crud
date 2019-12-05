<template>
  <div>
    <div>
      <el-button
        v-if="get(config, 'create.form.fields')"
        v-bind="get(config, 'create.button')"
        @click="showDialog(config.create, {})"
        >{{ get(config, "create.button.label") }}</el-button>
    </div>

    <div style="margin-top: 1rem;" v-if="get(config, 'search.form.fields')">
      <h3 v-if="get(config, 'search.title')">
        {{ get(config, "search.title") }}
      </h3>
      <DataForm
        v-model="searchModel"
        v-bind="config.search"
        @submit.native.prevent="search"
      ></DataForm>
    </div>

    <el-table :data="data.data" @sort-change="sortChange" v-bind="config.list">
      <el-table-column
        :label="get(field, 'label', field.prop.toUpperCase())"
        v-bind="field"
        v-for="field in get(config, 'list.fields')"
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
        v-bind="
          get(config, 'list.action.column', get(defaults, 'action.column'))
        "
        v-slot="{ row, $index }"
      >
        <el-button
          v-if="get(config, 'edit.form.fields')"
          v-bind="get(config, 'list.action.edit')"
          @click="edit(row, $index)"
          >{{ get(config, "list.action.edit.label") }}</el-button
        >
        <el-button
          v-if="get(config, 'delete')"
          v-bind="get(config, 'list.action.delete')"
          @click="remove(row)"
          >{{ get(config, "list.action.delete.label") }}</el-button
        >
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top:1rem;"
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
      v-bind="get(config.list, 'page', defaults.pagination)"
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

import * as api from "../fake.config";

@Component({
  components: { DataValue, DataForm, DataTableDialog }
})
export default class DataTable extends Vue {
  @Prop(String) resource!: string;

  isShowDialog = false;

  get = get;

  data: any = {};

  model = {};
  searchModel = {};
  creating = false;

  config: any = {};
  page: any = {
    total: 0
  };

  query: any = { limit: 10, page: 1 };

  dialogConfig = {};

  defaultSize = "small";
  defaults = {
    create: {
      button: {
        label: "创建",
        size: this.defaultSize,
        type: "success"
      },
      form: {
        method: "post",
        action: "users",
        size: this.defaultSize
      }
    },
    edit: {
      form: {
        method: "put",
        action: "users/${_id}"
      }
    },
    search: {
      form: {
        submitText: "搜索"
      }
    },
    list: {
      action: {
        column: {
          label: "操作",
          width: "220px"
        },
        edit: {
          type: "text",
          label: "编辑",
          icon: "el-icon-edit",
          size: this.defaultSize
        },
        delete: {
          type: "text",
          label: "删除",
          icon: "el-icon-delete",
          size: this.defaultSize
        }
      }
    }
  };

  get pageSizes() {
    return get(this.config.list, "page.pageSizes", [
      get(this.config.list, "page.pageSize", 10)
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
    this.page.total = res.data.total;
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
    // const res = await this.$http.get(`${this.resource}/config`);
    const res = {
      data: api[this.resource]
    };
    this.config = merge(this.defaults, res.data);
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
      const field: any = get(this.config, "search.fields", []).find(
        (v: any) => v.prop === k
      );
      if (field.regex && val) {
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

  async edit(row, index) {
    const config = get(this.config, "edit", {});
    const action = get(config, "form.action", "");
    const actionUrl = render(action, { row, index }, {}, ["${", "}"]);
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

  created() {
    this.fetchConfig();
    this.fetch();
    this.$watch(
      "config.list.pagination",
      page => {
        const pageSize = get(page, "pageSize", 10);
        this.query.limit = pageSize;
        if (!get(this.config, "list.pagination")) {
          set(this.config, "list.pagination", {
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

<style></style>
