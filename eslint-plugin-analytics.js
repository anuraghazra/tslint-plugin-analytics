const noAnalytics = require("./dist/no-analytics");
const plugin = { rules: { "no-analytics": noAnalytics } };
module.exports = plugin;
