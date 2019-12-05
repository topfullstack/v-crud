export const users = {
  create1: {
    button: {
      label: "创建用户"
    },
    dialog: {
      tag: "el-drawer",
      title: "创建用户",
      size: "80%",
      direction: "ltr"
    },
    form: {
      labelWidth: "120px",
      method: "post",
      action: "users",
      successMessage: "用户创建成功",
      fields: [
        { prop: "username", label: "用户名" },
        {
          prop: "role_id",
          label: "角色",
          tag: "el-radio-group",
          options: [
            { text: "讲师", value: 1 },
            { text: "用户", value: 2 }
          ]
        },
        {
          prop: "birthday",
          label: "生日",
          tag: "el-date-picker",
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
        { prop: "username", label: "姓名" },
        {
          prop: "role_id",
          label: "角色",
          tag: "el-radio-group",
          options: [
            { text: "讲师", value: 1 },
            { text: "用户", value: 2 }
          ]
        },
        {
          prop: "birthday",
          label: "生日",
          tag: "el-date-picker",
          type: "date",
          valueFormat: "yyyy-MM-dd"
        }
      ]
    }
  },
  search: {
    submitText: "检索",
    inline: true,
    size: "small",
    fields: [
      { prop: "username", label: "姓名", regex: true },
      { prop: "mobile", label: "手机号", regex: true },
      {
        prop: "balance",
        label: "余额",
        range: true,
        tag: "el-input-number"
      },
      {
        prop: "created_at",
        label: "注册时间",
        type: "datetimerange",
        tag: "el-date-picker",
        format: "yyyy-MM-dd",
        style: { width: "220px" }
      }
    ]
  },
  list: {
    size: "small",
    pagination: {
      pageSize: 10
    },
    fields: [
      { prop: "_id", label: "ID", sortable: true },
      { prop: "username", label: "用户名" },
      { prop: "mobile", label: "手机号" },

      {
        prop: "role_id",
        label: "角色",
        filterable: true,
        options: [
          { text: "讲师", value: 1 },
          { text: "用户", value: 2 }
        ]
      },
      {
        prop: "balance",
        label: "余额"
      },
      {
        prop: "created_at",
        label: "注册时间",
        type: "datetime",
        format: "yyyy-MM-dd HH:mm"
      }
    ]
  }
};

export const courses = {
  title: "课程管理",
  // tag: 'h2',
  search: {
    form: {
      fields: [{ prop: "title", label: "标题", regex: true }]
    }
  },
  create: {
    dialog: {
      title: "创建课程",
    },
    form: {
      labelWidth: '100px',
      fields: [
        { prop: "title", label: "标题" },
        {
          prop: "cover",
          label: "封面图",
          tag: "upload-field",
          action: "/upload"
        }
      ]
    }
  },
  edit: {
    dialog: {
      tag: "el-drawer",
      title: "编辑课程",
      size: "50%",
      direction: "ltr"
    },
    form: {
      fields: [
        { prop: "title", label: "标题" },
        {
          prop: "cover",
          label: "封面图",
          tag: "upload-field",
          action: "https://jsonplaceholder.typicode.com/posts/"
        }
      ]
    }
  },
  list: {
    title: "课程管理",
    fields: [
      { prop: "_id", label: "ID", width: 220 },
      { prop: "title", label: "标题" },
      { prop: "posts.length", value: "${row.posts.length}", label: "音频数量" },
      { prop: "price", label: "价格(值币)" },
      { prop: "user.username", label: "老师" },
      {
        prop: "cover",
        label: "封面图",
        width: "120px",
        type: "image",
        tag: "img",
        attrs: { src: "${row.cover}", height: "80" }
      }
    ]
  }
};
