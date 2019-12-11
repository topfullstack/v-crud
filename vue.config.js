const path = require("path")


module.exports = {
  css: { extract: false },
  outputDir: "docs",
  configureWebpack: {
    output: {
      libraryExport: "default"
    },
    externals: {
      'element-ui': 'element-ui',
      'vue2-editor': 'vue2-editor',
      'lodash': 'lodash'
    },
    resolve: {
      // 设置别名
      alias: {
        "v-crud": path.resolve(__dirname, "./")
      }
    }
  }
};
