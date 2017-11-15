const webpack = require("webpack");

const vendors = [
  "react",
  "react-dom",
  "react-router",
  "mobx",
  "mobx-react",
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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.DllPlugin({
      path: "manifest.json",
      name: "[name]",
      context: __dirname,
    }),
    new webpack.optimize.UglifyJsPlugin({
      //增加vendor.js的uglify插件，将vendor.js从 1.5 mB 压缩至 499 kB
      beautify: false,
      comments: false,
      compress: {
        warnings: false
      }
    }),
  ],
};
