const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    proxy("/files/original/", {
      target: "http://www.dbportal.ic-access.specs-lab.com/",
      changeOrigin: true
    })
  );
};
