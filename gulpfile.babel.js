import gulp from "gulp";
import gutil from "gulp-util";
import gulpif from "gulp-if";
import del from "del";
import sprity from "sprity";

import webpack from "webpack";
import webpackConfig from "./webpack.config.js";

import connect from "gulp-connect";
import rest from "connect-rest";
// import mocks from "./mocks";

const src = {
  html: "src/html/index.html",
  vendor: "vendor/**/*",
  style: "src/style/**.sass",
  assets: "assets/**/*"
};

const dist = {
  root: "dist/",
  html: "dist/",
  vendor: "dist/vendor.js",
  assets: "dist/assets"
};

const bin = {
  root: "bin/",
  html: "bin/",
  vendor: "bin/vendor",
  assets: "bin/assets"
};

/**
 * clean build dir
 */
let clean = (done) => {
  del.sync([`${dist.root}/**/*`, `!${dist.vendor}`]);
  done();
};

/**
 * [cleanBin description]
 * @return {[type]} [description]
 */
let cleanBin = (done) => {
  del.sync(bin.root);
  done();
};

/**
 * [copyVendor description]
 * @return {[type]} [description]
 */
let copyVendor = () =>
  gulp.src(src.vendor)
    .pipe(gulp.dest(dist.vendor));

/**
 * [copyAssets description]
 * @return {[type]} [description]
 */
let copyAssets = () =>
  gulp.src(src.assets)
    .pipe(gulp.dest(dist.assets));

/**
 * [copyDist description]
 * @return {[type]} [description]
 */
let copyDist = () =>
  gulp.src(dist.root + "**/*")
    .pipe(gulp.dest(bin.root));

/**
 * [html description]
 * @return {[type]} [description]
 */
let html = () =>
  gulp.src(src.html)
    .pipe(gulp.dest(dist.html));

/**
 * [webpackProduction description]
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
let webpackProduction = (done) => {
  let config = Object.create(webpackConfig);
  config.plugins = config.plugins.concat(
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": "production"
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
  );

  webpack(config, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack:build", err);
    gutil.log("[webpack:production]", stats.toString({
      colors: true
    }));
    done();
  });
};


/**
 * [webpackDevelopment description]
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
let devConfig, devCompiler;

devConfig = Object.create(webpackConfig);
devConfig.devtool = "sourcemap";
devConfig.debug = true;
devCompiler = webpack(devConfig);

let webpackDevelopment = (done) => {
  devCompiler.run((err, stats) => {
    if (err) {
      throw new gutil.PluginError("webpack:build-dev", err);
    }
    gutil.log("[webpack:build-dev]", stats.toString({
      colors: true
    }));
    done();
  });
};


let connectServer = (done) => {
  connect.server({
    root: dist.root,
    port: 5000,
    livereload: true,
    middleware: (connect, opt) => {
      return [rest.rester({
        context: "/api"
      })]
    },
    fallback: dist.root + "index.html"
  });
  // mocks(rest);
  done();
};

/**
 * [iconSprity description]
 * @return {[type]} [description]
 */

let iconSprity = (done) => {
  sprity.src({
    src: "./src/img/icons/**/*.{png, jpg}",
    name: "icons",
    style: "./icons-sprite.scss",
    cssPath: "../img",
    prefix: "icon-gb",
    dimension: [{
        ratio: 1, dpi: 72
    }, {
        ratio: 2, dpi: 192
    }],
    processor: "sass",
    "style-type": "scss"
  })
  .pipe(gulpif("*.{png, jpg}", gulp.dest("src/img"), gulp.dest("src/style")));
};

gulp.task("sprity", gulp.series(
  iconSprity
));

/**
 * [watch description]
 * @return {[type]} [description]
 */
let watch = () => {
  gulp.watch(src.html, html);
  gulp.watch("src/**/*.scss", webpackDevelopment);
  gulp.watch(src.assets, copyAssets);
  gulp.watch("src/**/*.js", webpackDevelopment);
  gulp.watch("dist/**/*").on("change", () => {
    gulp.src("dist/")
      .pipe(connect.reload());
  });
};

/**
 * default task
 */
gulp.task("default", gulp.series(
  clean,
  gulp.parallel(copyAssets, copyVendor, html, webpackDevelopment),
  connectServer,
  watch
));

/**
 * production build task
 */
gulp.task("build", gulp.series(
  clean,
  gulp.parallel(copyAssets, copyVendor, html, webpackProduction),
  cleanBin,
  copyDist,
  (done) => {
    console.log("build success");
    done();
  }
));