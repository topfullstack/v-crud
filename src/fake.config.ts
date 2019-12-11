export const users = {
  create: {
    button: {
      label: "创建用户"
    },
    dialog: {
      component: "el-drawer",
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
          component: "el-radio-group",
          options: [
            { label: "讲师", value: 1 },
            { label: "用户", value: 2 }
          ]
        },
        {
          prop: "birthday",
          label: "生日",
          component: "el-date-picker",
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
      successMessage: "用户更新成功",
      fields: [
        { prop: "username", label: "姓名" },
        {
          prop: "role_id",
          label: "角色",
          component: "el-radio-group",
          options: [
            { label: "讲师", value: 1 },
            { label: "用户", value: 2 }
          ]
        },
        {
          prop: "birthday",
          label: "生日",
          component: "el-date-picker",
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
        component: "el-input-number"
      },
      {
        prop: "created_at",
        label: "注册时间",
        type: "datetimerange",
        component: "el-date-picker",
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
  // component: 'h2',
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
              component: "upload-field"
            }
          ]
        }
      ]
    }
  },
  edit: {
    fetchUrl: "courses/${row._id}",
    dialog: {
      // component: "el-drawer",
      title: "编辑课程",
      width: "80%"
      // direction: "ltr"
    },
    form: {
      labelWidth: "100px",
      tabs: true,
      size: "small",
      rules: {
        title: [{ required: true, message: "请填写标题" }]
      },
      fields: [
        {
          prop: "basic",
          label: "基础信息",

          fields: [
            {
              prop: "title",
              label: "标题",
              placeholder: "课程标题",
              hint: "30字以内",
              span: 12
            },
            {
              prop: "posts",
              label: "音频",
              component: "select-field",
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
              },
              span: 12,
              row: true
            },
            {
              prop: "cover",
              label: "封面图",
              component: "upload-field",
              span: 12
            }
          ]
        },
        {
          prop: "content",
          label: "详情",
          fields: [
            { prop: "content1", label: "详情1", component: "html-editor-field" }
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
        component: "img",
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
      component: "el-drawer",
      size: "90%"
    },

    form: {
      tabs: {
        value: "steps"
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
              component: "SubField",
              fields: [
                { prop: "is_show_sign", label: "签到", component: "el-switch" },
                {
                  prop: "is_show_research",
                  label: "调研",
                  component: "el-switch"
                }
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
              component: "card-field",
              multiple: true,
              labelWidth: 0,
              span: 8,
              fields: [
                { prop: "name", label: "名称", width: "120px" },
                {
                  prop: "dates",
                  label: "时间",
                  component: "el-date-picker",
                  type: "datetimerange",
                  format: "yyyy-MM-dd",
                  style: {
                    width: "100% !important"
                  }
                },
                {
                  prop: "courses",
                  label: "专栏",
                  component: "select-field",
                  filterable: true,
                  multiple: true,
                  remote: true,
                  reserveKeyword: true,
                  collapseTags: true,
                  style: {
                    width: "100%"
                  },
                  remoteConfig: {
                    url: "courses",
                    labelField: "title",
                    valueField: "_id",
                    options: {
                      where: {
                        title: { $regex: "^6" }
                      },
                      sort: {
                        _id: -1
                      }
                    }
                  }
                }
              ]
            }
          ]
        },
        {
          prop: "basic",
          label: "基础信息",
          fields: [
            { prop: "title", label: "标题" },
            { prop: "amount", label: "人数", component: "el-input-number" }
          ]
        }
      ]
    }
  },
  list: {
    fields: [
      { prop: "_id" },
      { prop: "title" },
      { prop: "teacher.username" },
      {
        prop: "logo",
        component: "el-image",
        width: "100px",
        dialog: {
          title: "预览",
          width: "20rem"
        },
        attrs: {
          src: "${row.logo}",
          fit: "cover"
        }
      },
      {
        prop: "qrcode",
        component: "vue-qrcode",
        dialog: {
          title: "二维码",
          width: "20rem",
          center: true,
          alert: {
            title: "扫码加入班级",
            showIcon: true
          }
        },
        attrs: {
          size: 100,
          value: "http://www.baidu.com/s?wd=${row.title}"
        }
      }
    ]
  }
};

export const posts = {
  title: "音频管理",
  list: {
    action: {},
    fields: [{ prop: "title", label: "标题" }]
  },
  create: {
    fields: [{ prop: "title", label: "标题", regex: true }]
  },
  search: {
    form: {
      fields: [{ prop: "title", label: "标题", regex: true }]
    }
  },
  edit: {
    form: {
      labelWidth: "100px",
      fields: [
        { prop: "title", label: "标题" },
        {
          prop: "cover",
          label: "封面图",
          component: "upload-field"
        },
        {
          prop: "voice",
          label: "音频/视频",
          component: "upload-field",
          preview: {
            component: "a"
          }
        },
        {
          prop: "tags",
          label: "TAGS",
          component: "select-field",
          multiple: true,
          filterable: true,
          allowCreate: true,
          defaultFirstOption: true
        }
      ]
    }
  }
};
