module.exports = () => ({
  test: /\.css$/, // Target CSS files
  use: [
    "style-loader", // Injects styles into the DOM
    "css-loader", // Translates CSS into CommonJS
  ],
});
