const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const autoprefixer = require("gulp-autoprefixer");
const rm = require('rimraf');
//重命名
const rename = require("gulp-rename");
//压缩css
const minifycss = require("gulp-minify-css");

const config = {
  savePath: './dist/',
  staticPath: './src/'
};

function buildCss (entry, output, noMinName) {
  let surGulp = gulp.src(config.staticPath + entry)
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({browsers: ["last 2 versions"]}))
  // 判断是否压缩
  if (isMinifycss) {
    surGulp.pipe(minifycss())
    surGulp.pipe(rename((path) => {
      if (!noMinName) {
        path.basename += '.min';
      }
      return path;
    }))
  }
  // 判断是否是component
  if (noMinName) {
    surGulp = surGulp.pipe(rename((path) => {
      // path.basename = path.basename + '/' + path.basename;
      return path;
    }));
  }
  surGulp.pipe(gulp.dest(config.savePath + output));
}

// 当前模式
let isMinifycss = false;

gulp.task('sass', () => {
  buildCss('/scss/xui.scss', '/css/');
});

//拷贝字体
gulp.task('copy', () => {
  return gulp.src(config.staticPath + 'fonts/**/*.{swf,eot,svg,ttf,woff}')
      .pipe(plumber())
      .pipe(gulp.dest(config.savePath + 'fonts/'));
});

gulp.task('watch', () => {
  //监听sass
  gulp.watch(config.staticPath + '/**/**.scss', ['sass']);
  gulp.watch(config.staticPath + 'fonts/*.{swf,eot,svg,ttf,woff}', ['copy']);
});

//开发
gulp.task("dev", () => {
  gulp.start("sass", "copy", "watch");
});

// 打包
gulp.task("build", () => {
  gulp.start("sass", "copy");
});

// 打包 mini
gulp.task("build-mini", () => {
  isMinifycss = true;
  gulp.start("sass", "copy");
});

// 组件打包
gulp.task("build-components", () => {
  isMinifycss = true;
  rm(config.savePath + '/lib', () => {
    buildCss('scss/components/*.scss', '/css/lib/', true);
  });
});

gulp.task('build-xui', () => {
  gulp.start("build", "build-mini", "build-components");
});
