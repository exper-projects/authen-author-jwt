const Dotenv = require("dotenv-webpack");

module.exports = ({ path }) =>
  new Dotenv({
    path,
  });
