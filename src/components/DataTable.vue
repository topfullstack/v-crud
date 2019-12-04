<template>
  <div>
    <div>
      <el-button type="primary" @click="showDialog(config.create, {})">
        {{ config.create.title }}
      </el-button>
    </div>

    <el-table :data="data.data" @sort-change="sortChange">
      <el-table-column
        v-bind="field"
        v-for="field in config.list.fields"
        :key="field.prop"
      >
        <template v-slot="{ row }">
          <DataValue v-bind="field" :value="row"></DataValue>
        </template>
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
      v-bind="get(config.list, 'page', defaultPagination)"
      :current-page="currentPage"
      :total="total"
    >
    </el-pagination>

    <DataTableDialog
      v-bind="dialogConfig"
      v-model="model"
      :visible.sync="isShowDialog"
      @success="fetch"
    ></DataTableDialog>
  </div>
</template>

<script lang="ts">
import DataValue from "./DataValue.vue";
import DataForm from "./DataForm.vue";
import DataTableDialog from "./DataTableDialog.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import { get } from "dot-prop";

@Component({
  components: { DataValue, DataForm, DataTableDialog }
})
export default class DataTable extends Vue {
  @Prop(String) resource!: string;

  isShowDialog = false;

  get = get;

  data: any = {};

  model = {};
  creating = false;

  config = {
    create: {
      title: "创建用户",
      dialog: {
        is: "el-drawer",
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
    update: {
      title: "更新用户",
      form: {
        labelWidth: "120px",
        method: "put",
        action: "users/${model._id}",
        successMessage: "用户更新成功",
        fields: [
          { prop: "name", label: "姓名" },
          { prop: "ID", label: "身份证" }
        ]
      }
    },
    search: {
      fields: [
        { prop: "name", label: "姓名" },
        { prop: "ID", label: "身份证" }
      ]
    },
    list: {
      pagination: {
        pageSize: 2
      },
      fields: [
        { prop: "_id", label: "ID" },
        { prop: "url", label: "URL" },
        {
          prop: "createdAt",
          label: "创建时间",
          type: "datetime",
          format: "yyyy-MM-dd HH:mm"
        }
      ]
    }
  };
  page: any = {
    total: 0
  };

  query: any = { limit: 10, page: 1 };

  dialogConfig = {};

  defaultPagination = {};

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
    const res = await this.$http.get(`${this.resource}/config`);
    this.config = res.data;
  }

  async search(where) {
    const cond = {};
    for (let k in where) {
      const val = where[k];
      if (val === "") {
        continue;
      }
      cond[k] = val;
      const field: any = this.config.list.fields.find(v => v.prop === k);
      if (field.regex && val) {
        cond[k] = { $regex: val };
      }
    }
    this.query.where = cond;
    this.fetch();
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
    // this.fetchConfig();
    this.fetch();
    this.$watch("config.list.pagination", ({
      pageSize
    }) => {
      this.query.limit = pageSize
      this.defaultPagination = {
        pageSize,
        pageSizes: [pageSize]
      }
    }, { deep: true, immediate: true });
  }
}
</script>

<style></style>
