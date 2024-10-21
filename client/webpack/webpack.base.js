const path = require("path");

const bundleStatsWebpackPlugin = require("./plugins/bundle-stats-webpack-plugin");
const cleanWebpackPlugin = require("./plugins/clean-webpack-plugin");
// const copyWebpackPlugin = require("./plugins/copy-webpack-plugin");
const htmlWebpackPlugin = require("./plugins/html-webpack-plugin");
const handleImages = require("./rules/handle-images");
const handleSvg = require("./rules/handle-svg");
const handleStyles = require("./rules/handle-styles");
const handleTs = require("./rules/handle-ts");

module.exports = {
  entry: path.resolve(__dirname, "../src/index.tsx"),
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "../dist"),
    filename: "bundle.[chunkhash:8].js",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [handleTs(), handleStyles(), handleImages(), handleSvg()],
  },
  plugins: [
    htmlWebpackPlugin(),
    cleanWebpackPlugin(),
    bundleStatsWebpackPlugin(),
  ],
};
