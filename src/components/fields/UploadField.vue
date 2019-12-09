<template>
  <el-upload
    v-bind="$attrs"
    :action="action"
    class="upload-field"
    :show-file-list="false"
    :http-request="upload"
  >
    <div v-if="value">
      <div v-if="preview !== false" @click.native.prevent="() => {}">
        <div
          :is="subTag"
          v-if="subTag"
          :src="value"
          class="preview"
          v-bind="$attrs.preview"
          :href="value"
          controls
        >{{value}}</div>
      </div>
      <div v-else>
        {{value}}
      </div>
    </div>
    <div>
      <el-button type="success" icon="el-icon-plus" size="mini">选择文件</el-button>
    </div>

    <!-- <i v-else class="el-icon-plus upload-field-icon"></i> -->
  </el-upload>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { get, merge } from "../util";

@Component({})
export default class UploadField extends Vue {
  @Prop(String) value!: string;

  @Prop({
    default: "/upload"
  })
  action!: string;
  @Prop({
    default: "url"
  })
  responseKey!: string;
  @Prop() preview!: any;

  get subTag() {
    if (get(this.preview, "tag")) {
      return get(this.preview, "tag");
    }
    const tags = {
      mp3: "audio",
      mp4: "video",
      jpg: "img",
      jpeg: "img",
      png: "img",
      ico: "img",
      gif: "img"
    };
    for (let k in tags) {
      if (String(this.value).match(new RegExp(`.${k}`))) {
        return tags[k];
      }
    }
    return null;
  }

  async upload(options) {
    const { action, data, file, filename } = options;
    const fd = new FormData();
    fd.append(filename, file);
    const res = await this.$http.post(action, fd);
    this.$emit("input", get(res.data, this.responseKey));
  }
}
</script>

<style lang="scss">
$height: 8rem;

.upload-field .el-upload {
  //
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  // overflow: hidden;
  max-height: $height;
}
.upload-field .el-upload:hover {
  border-color: #409eff;
}
.upload-field-icon {
  font-size: 28px;
  color: #8c939d;
  width: $height;
  height: $height;
  line-height: $height !important;
  text-align: center;
  border: 1px solid #d9d9d9;
}
.preview {
  max-width: 100%;
  max-height: $height;
}
img.preview {
  border: 1px solid #d9d9d9;
  width: auto;
  height: 100%;
  max-height: $height;
  display: block;
}
</style>