export const users = {
  create: {
    button: {
      label: "创建用户"
    },
    dialog: {
      // tag: "el-drawer",
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
            { label: "讲师", value: 1 },
            { label: "用户", value: 2 }
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
            { label: "讲师", value: 1 },
            { label: "用户", value: 2 }
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
          { label: "讲师", value: 1 },
          { label: "用户", value: 2 }
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
      title: "创建课程"
    },
    form: {
      labelWidth: "100px",
      tabs: true,
      fields: [
        {
          prop: "basic",
          label: "基础信息",
          fields: [
            { prop: "title", label: "标题" },
            {
              prop: "cover",
              label: "封面图",
              tag: "upload-field"
            }
          ]
        }
      ]
    }
  },
  edit: {
    dialog: {
      // tag: "el-drawer",
      title: "编辑课程",
      width: "80%"
      // direction: "ltr"
    },
    form: {
      labelWidth: "100px",
      tabs: true,
      fields: [
        {
          prop: "basic",
          label: "基础信息",
          fields: [
            { prop: "title", label: "标题" },
            {
              prop: "posts",
              label: "音频",
              tag: "select-field",
              filterable: true,
              multiple: true,
              remote: true,
              reserveKeyword: true,
              collapseTags: true,
              style: {
                width: "25em"
              },
              remoteConfig: {
                url: "posts",
                labelField: "title",
                valueField: "_id"
              }
            },
            {
              prop: "cover",
              label: "封面图",
              tag: "upload-field"
            }
          ]
        },
        {
          prop: "content",
          label: "详情",
          fields: [
            { prop: "content1", label: "详情1", tag: "html-editor-field" }
          ]
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

export const groups = {
  title: "班级管理",
  create: {
    title: "创建班级",
    form: {
      fields: [{ prop: "title" }]
    }
  },
  edit: {
    dialog: {
      title: "编辑班级",
    },

    form: {
      
      tabs: {
        value: 'steps',
      },
      labelWidth: "6em",
      size: "small",
      fields: [
        {
          prop: "modular",
          label: "功能模块",
          fields: [
            {
              prop: "modular",
              label: "功能模块",
              tag: 'SubField',
              fields: [
                { prop: "is_show_sign", label: "签到", tag: "el-switch" },
                { prop: "is_show_research", label: "调研", tag: "el-switch" }
              ]
            }
          ]
        },
        {
          prop: "steps",
          label: "培训阶段",
          fields: [
            {
              prop: "steps",
              label: "阶段",
              tag: 'table-field',
              multiple: true,
              type: "table",
              fields: [
                { prop: "name", label: "名称", width: '120px' },
                {
                  prop: "dates",
                  label: "时间",
                  tag: "el-date-picker",
                  type: "datetimerange",
                  format: "yyyy-MM-dd",
                  style: {
                    width: '100% !important'
                  }
                },
                {
                  prop: "courses",
                  label: "专栏",
                  tag: "select-field",
                  filterable: true,
                  multiple: true,
                  remote: true,
                  reserveKeyword: true,
                  collapseTags: true,
                  style: {
                    width: "25em"
                  },
                  remoteConfig: {
                    url: "courses",
                    labelField: "title",
                    valueField: "_id"
                  }
                },
              ]
            }
          ]
        },
        {
          prop: "basic",
          label: "基础信息",
          fields: [
            { prop: "title", label: "标题" },
            { prop: "amount", label: "人数", tag: "el-input-number" }
          ]
        }
      ]
    }
  },
  list: {
    fields: [{ prop: "_id" }, { prop: "title" }, { prop: "teacher.username" }]
  }
};
