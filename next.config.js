const withCSS = require("@zeit/next-css");

module.exports = withCSS({
  exportPathMap: function() {
    return {
      "/": { page: "/" },
      "/profile": { page: "/labs" },
      "/dedicon": { page: "/dedicon" },
      "/hilfiger": { page: "/hilfiger" }
    };
  }
});
