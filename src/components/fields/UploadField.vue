<template>
  <el-upload
    v-bind="$attrs"
    class="avatar-uploader"
    :show-file-list="false"
    :on-success="success"
  >
    <img v-if="value" :src="value" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { get, merge } from "../util";

@Component({})
export default class UploadField extends Vue {

  @Prop(String) value !: string

  async success(data){
    console.log(data)
  }
}
</script>

<style lang="scss">

$height: 178px;

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: $height;
  height: $height;
  line-height: $height;
  text-align: center;
}
.avatar {
  max-width: 100%;
  max-height: 100%;
  display: inline-block;
}
</style>