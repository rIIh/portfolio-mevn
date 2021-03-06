const path = require("path");

module.exports = {
  outputDir: path.resolve(__dirname, "server/public"),
  devServer: {
    watchOptions: {
      ignored: ["/node_modules/", "/server/"],
    },
    proxy: {
      "/api": {
        target: "http://localhost:" + (process.env.PORT || 5000),
      },
    },
  },
};
