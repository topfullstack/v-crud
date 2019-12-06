<template>
  <vue-editor
    :value="value"
    @input="val => $emit('input', val)"
    useCustomImageHandler
    @image-added="upload"
  ></vue-editor>
</template>

<script lang="ts">
import { VueEditor } from "vue2-editor";

import { Vue, Component, Prop } from "vue-property-decorator";
import { get, merge } from "../util";

@Component({
  components: {
    VueEditor
  }
})
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

  @Prop({ default: "file" }) name!: string;

  async upload(file, Editor, cursorLocation, resetUploader) {
    const fd = new FormData();
    fd.append(this.name, file);
    const res = await this.$http.post(this.action, fd);
    const url = get(res.data, this.responseKey);
    Editor.insertEmbed(cursorLocation, "image", url);
    resetUploader();
  }
}
</script>

<style lang="scss">
.ql-toolbar{
  line-height: 1;
}

</style>