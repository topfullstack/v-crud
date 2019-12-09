<template>
  <div id="app">
    <el-container>
      <el-header height="50px" style="border-bottom:1px solid #ddd;">
          <h3 class="m-0">后台管理系统</h3>
        </el-header>
      
      <el-container>
        <el-aside width="200px">
        <el-menu :default-active="$route.path" router  style="min-height: 100vh;height:100%;">
          <el-menu-item index="/">Home</el-menu-item>
          <el-menu-item index="/users/list">Users</el-menu-item>
          <el-menu-item index="/courses/list">Courses</el-menu-item>
          <el-menu-item index="/posts/list">Posts</el-menu-item>
          <el-menu-item index="/groups/list">Groups</el-menu-item>
        </el-menu>
      </el-aside>
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

<style lang="scss">
  *:focus{
    outline: none !important;
  }
</style>


