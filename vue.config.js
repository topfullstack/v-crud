const path = require("path")


module.exports = {
  css: { extract: false },
  outputDir: "docs",
  configureWebpack: {
    output: {
      libraryExport: "default"
    },
    resolve: {
      // 设置别名
      alias: {
        "v-crud": path.resolve(__dirname, "./")
      }
    }
  }
};
