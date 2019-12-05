<template>
  <div id="app">
    <el-container>
      <el-aside width="200px">
        <el-menu :default-active="$route.path" router>
          <el-menu-item index="/">Home</el-menu-item>
          <el-menu-item index="/users/list">Users</el-menu-item>
          <el-menu-item index="/courses/list">Courses</el-menu-item>
          <el-menu-item index="/posts/list">Posts</el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header height>
          <!-- Header content -->
        </el-header>
        <el-main height>
          <router-view :key="$route.path"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
export default {
  name: "app",
  components: {}
};
</script>


