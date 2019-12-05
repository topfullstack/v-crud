<template>
  <div>
    <div>
      <el-button v-bind="get(config, 'create.button')"
      @click="showDialog(config.create, {})">{{get(config, 'create.button.label')}}</el-button>
    </div>

    <div>
      <h3>{{ get(config, "search.title", "搜索") }}</h3>
      <DataForm v-model="searchModel" v-bind="config.search" @submit.native.prevent="search"></DataForm>
    </div>

    <el-table :data="data.data" @sort-change="sortChange">
      <el-table-column v-bind="field" v-for="field in get(config, 'list.fields')" :key="field.prop">
        <template v-slot="{ row }">
          <DataValue v-bind="field" :value="row"></DataValue>
        </template>
      </el-table-column>
      <el-table-column
        v-bind="get(config, 'list.action.column', get(defaults, 'action.column'))"
        v-slot="{row}"
      >
        <el-button
          v-bind="get(config, 'list.action.edit')"
          @click="edit(row)"
        >{{get(config, 'list.action.edit.label')}}</el-button>
        <el-button
          v-bind="get(config, 'list.action.delete')"
          @click="remove(row)"
        >{{get(config, 'list.action.delete.label')}}</el-button>
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
import merge from "deepmerge";
import DataValue from "./DataValue.vue";
import DataForm from "./DataForm.vue";
import DataTableDialog from "./DataTableDialog.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import { get, set } from "dot-prop";

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

  defaultSize = 'small'
  defaults = {
    create: {
      button: {
        size: this.defaultSize,
        type: 'success'
      },
      form: {
        method: "post",
        action: "users",
        size: this.defaultSize,
      }
    },
    edit: {
      form: {
        method: "put",
        action: "users/${row._id}"
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
    this.model = model;
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
      data: {
        create: {
          button: {
            label: "创建用户"
          },
          dialog: {
            is: "el-drawer",
            title: "创建用户",
            size: "80%"
          },
          form: {
            labelWidth: "120px",
            method: "post",
            action: "users",
            successMessage: "用户创建成功",
            fields: [
              { prop: "name", label: "姓名" },
              { prop: "ID", label: "身份证" },
              {
                prop: "dob",
                label: "生日",
                type: "date",
                valueFormat: "yyyy-MM-dd"
              }
            ]
          }
        },
        edit: {
          title: "更新用户",
          form: {
            labelWidth: "120px",

            action: "users/${row._id}",
            successMessage: "用户更新成功",
            fields: [
              { prop: "name", label: "姓名" },
              { prop: "ID", label: "身份证" }
            ]
          }
        },
        search: {
          title: "搜索用户",
          submitText: "检索",
          inline: true,
          size: "small",
          fields: [
            { prop: "name", label: "姓名", regex: true },
            { prop: "ID", label: "身份证" }
          ]
        },
        list: {
          pagination: {
            pageSize: 2
          },
          fields: [
            { prop: "_id", label: "ID", sortable: true, filterable: true },
            { prop: "name", label: "姓名" },
            {
              prop: "createdAt",
              label: "创建时间",
              type: "datetime",
              format: "yyyy-MM-dd HH:mm"
            }
          ]
        }
      }
    };
    this.config = merge(this.defaults, res.data);
  }

  async search() {
    const where = { ...this.searchModel };
    const cond = {};
    for (let k in where) {
      const val = where[k];
      if (val === "") {
        continue;
      }
      cond[k] = val;
      const field: any = get(this.config, "search.fields", []).find(
        (v: any) => v.prop === k
      );
      if (field.regex && val) {
        cond[k] = { $regex: val };
      }
    }
    this.query.where = cond;
    this.fetch();
  }

  async edit(row) {
    const config = get(this.config, "edit", {});
    const action = get(config, "form.action", "");
    // set(config, 'form.action', eval('return ' + action))
    console.log(config, action);
    // this.showDialog(config, row)
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
      ({ pageSize }) => {
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
