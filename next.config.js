const withCSS = require("@zeit/next-css");

module.exports = withCSS({
  exportPathMap: function() {
    return {
      "/": { page: "/" },
      "/labs": { page: "/labs" },
      "/dedicon": { page: "/dedicon" },
      "/hilfiger": { page: "/hilfiger" }
    };
  }
});
