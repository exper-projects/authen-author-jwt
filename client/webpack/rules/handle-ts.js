module.exports = () => ({
  test: /\.(ts|js)x?$/,
  exclude: /node_modules/,
  use: [
    {
      loader: "babel-loader",
    },
  ],
});
