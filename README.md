# v-crud 基于ElementUI的CRUD组件
> 参考 [avue](https://github.com/nmxiaowei/avue) 实现,更适用我自己的项目场景的CRUD组件.

## 安装
```
yarn add v-crud
```

```ts
// 确保先引用ElementUI
import VCrud from 'v-crud'
Vue.use(VCrud)

// 如果需要传递全局参数
Vue.use(VCrud, options)
```

## 使用

```html
<template>
  <v-crud-table resource="users" :config="config"></v-crud-table>
</template>

<script>
export default {
  data(){
    return {
      config: {
        title: '用户管理',
        list: {
          fields: [
            { prop: 'id', label: 'ID' },
            { prop: 'name', label: '用户名' },
            { prop: 'avatar', label: '头像', tag },
          ]
        }
      }
    }
  }
}
</script>
```
