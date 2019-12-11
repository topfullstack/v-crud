const path = require("path")


module.exports = {
  // css: { extract: false },
  outputDir: "docs",
  configureWebpack: {
    output: {
      libraryExport: "default"
    },
    externals: {
      'element-ui': 'element-ui',
      'vue2-editor': 'vue2-editor',
      'vue': 'vue',
      'vue-class-component': 'vue-class-component',
      'vue-property-decorator': 'vue-property-decorator',
    },
    resolve: {
      // 设置别名
      alias: {
        "v-crud": path.resolve(__dirname, "./")
      }
    }
  }
};
