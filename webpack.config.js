import webpack from "webpack";
import glob from "glob";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

let extractCSS = new ExtractTextPlugin("../style/[hash:8].vendor.bundle.css");
let extractSASS = new ExtractTextPlugin("../style/[hash:8].style.bundle.css");

const config = {
  entry: {
    "polyfill": "babel-polyfill"
  },
  output: {
    path: __dirname + "/dist/js/",
    filename: "[hash:8].[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel"
      },
      {
        test: /\.scss$/,
        loader: extractSASS.extract("style", "css!postcss!sass?sourceMap")
      },
      {
        test: /\.css$/,
        loader: extractCSS.extract("style", "css!postcss")
      },
      {
        test: /\.(png|jpg|svg)$/,
        loader: "url?limit=25000&name=../img/[hash:8].[name].[ext]"
      }
    ],
  },
  plugins: [
    extractCSS,
    extractSASS,
    new webpack.optimize.CommonsChunkPlugin("vendor", "[hash:8].vendor.bundle.js"),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require("./manifest.json"),
    }),
    //为了解决hash化文件名之后的html单页面的js css文件名问题，添加以下的html渲染插件，将index.tpl.html渲染成index.html
    new HtmlWebpackPlugin({
      template: __dirname + '/src/html/index.tpl.html',
      chunksSortMode: 'dependency',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: false,
      filename: __dirname + '/dist/index.html'
    }),
  ],
  eslint: {
    configFile: "./.eslintrc"
  }
};
/**
 * find entries
 */
let files = glob.sync("./src/js/*/index.js");
let newEntries = files.reduce((memo, file) => {
  let name = /.*\/(.*?)\/index\.js/.exec(file)[1];
  memo[name] = entry(name);
  return memo;
}, {});
config.entry = Object.assign({}, config.entry, newEntries);
/**
 * [entry description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function entry(name) {
  return "./src/js/" + name + "/index.js";
}

module.exports = config;