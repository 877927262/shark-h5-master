/**
 * Created by violinsolo on 01/05/2017.
 */

const webpack = require("webpack");

const vendors = [
  "react-weui"
];

module.exports = {
  output: {
    path: __dirname + "/dist",
    filename: "[name].js",
    library: "[name]",
  },
  entry: {
    "vendor": vendors,
  },
  plugins: [
    new webpack.DllPlugin({
      path: "manifest.json",
      name: "[name]",
      context: __dirname,
    }),
  ],
};