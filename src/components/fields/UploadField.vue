<template>
  <el-upload v-bind="$attrs" :action="action" class="avatar-uploader" :show-file-list="false" :http-request="upload">
    <img v-if="value" :src="value" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { get, merge } from "../util";

@Component({})
export default class UploadField extends Vue {
  @Prop(String) value!: string;

  @Prop({
    default: '/upload'
  }) action!: string;
  @Prop({
    default: 'url'
  }) responseKey!: string;

  async upload(options) {
    const { action, data, file, filename } = options;
    const fd = new FormData();
    fd.append(filename, file);
    const res = await this.$http.post(action, fd)
    this.$emit('input', get(res.data, this.responseKey))
  }
}
</script>

<style lang="scss">
$height: 8rem;

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  max-height: $height;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: $height;
  height: $height;
  line-height: $height !important;
  text-align: center;
}
.avatar {
  width: auto;
  height: 100%;
  max-height: $height;
  display: block;
}
</style>