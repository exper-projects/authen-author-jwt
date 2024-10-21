const { merge } = require("webpack-merge");

const dotenvWebpack = require("./plugins/dotenv-webpack");
const webpackBase = require("./webpack.base");

module.exports = merge(webpackBase, {
  mode: "production",
  plugins: [dotenvWebpack({ path: ".env.production" })],
});
