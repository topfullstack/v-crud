<template>
  <div>

    <DataForm v-model="createModel" v-bind="config.create" @submit.native.prevent="create"></DataForm>

    <el-row >
      <el-button type="primary" @click="isShowCreateForm = true">{{config.create.title}}</el-button>
      
    </el-row>
    
    <el-table :data="data.data" @sort-change="sortChange">
      <el-table-column v-bind="field" v-for="field in config.list.fields" :key="field.prop">
        <template v-slot="{row}">
          <DataValue v-bind="field" :value="row"></DataValue>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import DataValue from "./DataValue.vue";
import DataForm from "./DataForm.vue";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: { DataValue, DataForm }
})
export default class DataTable extends Vue {
  @Prop(String) resource!: string;

  isShowCreateForm = false
  isShowUpdateForm = false

  data: any = {};
  
  createModel = {}

  config = {
    create: {
      title: "创建用户",
      fields: [
        { prop: "name", label: "姓名" }, { prop: "ID", label: "身份证" },
        {prop: 'dob', label: '生日', type: 'date', valueFormat: 'yyyy-MM-dd'}
      ]
    },
    update: {
      fields: [{ prop: "name", label: "姓名" }, { prop: "ID", label: "身份证" }]
    },
    search: {
      fields: [{ prop: "name", label: "姓名" }, { prop: "ID", label: "身份证" }]
    },
    list: {
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

  query: any = {};

  showCreate(){

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

  async changepage({ pageSize, currentPage }) {
    this.query.limit = pageSize;
    this.query.page = currentPage;
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

  async create(row, done, loading) {
    console.log(this.createModel)
    // await this.$http.post(`${this.resource}`, row);
    // this.$message.success("创建成功");
    // this.fetch();
    // done();
  }

  async update(row, index, done, loading) {
    const data = JSON.parse(JSON.stringify(row));
    delete data.$index;
    await this.$http.put(`${this.resource}/${row._id}`, data);
    this.$message.success("更新成功");
    this.fetch();
    done();
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
  }
}
</script>

<style>
</style>