const pkg = require("./package.json");

const commitHash = require("child_process")
  .execSync('git log --pretty=format:"%h" -n1')
  .toString()
  .trim();

module.exports = {
  env: {
    APP_VERSION: pkg.version,
    COMMIT_HASH: commitHash,
  },
  exportPathMap: function () {
    return {
      "/": { page: "/" },
      "/labs": { page: "/labs" },
      "/dedicon": { page: "/dedicon" },
      "/hilfiger": { page: "/hilfiger" },
    };
  },
};
