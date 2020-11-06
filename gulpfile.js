// Подключаем Gulp
const { parallel } = require("gulp");
var gulp = require("gulp");

// // Создаем простой таск
// gulp.task('myFirstTask', function (done) {
//   console.log('Привет, я твой первый таск!');
//   done()
// });

// // Запуск тасков по умолчанию
// gulp.task("default", gulp.series('myFirstTask'));

// Подключаем плагины Gulp
var sass = require("gulp-sass"), // переводит SASS в CSS
  cssnano = require("gulp-cssnano"), // Минимизация CSS
  autoprefixer = require('gulp-autoprefixer'), // Проставлет вендорные префиксы в CSS для поддержки старых браузеров
  imagemin = require('gulp-imagemin'), // Сжатие изображение
  concat = require("gulp-concat"), // Объединение файлов - конкатенация
  uglify = require("gulp-uglify"), // Минимизация javascript
  rename = require("gulp-rename"); // Переименование файлов

// Tasks /////

// Копирование файлов HTML в папку dist
gulp.task("html", function(done) {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("dist"));
    done();
});

// Объединение, компиляция Sass в CSS, простановка венд. префиксов и дальнейшая минимизация кода
gulp.task("sass", function(done) {
  return gulp.src("source/sass/*.sass")
    .pipe(concat('styles.sass'))
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest("dist/css"));
    done();
});

// Объединение и сжатие JS-файлов
gulp.task("scripts", function(done) {
  return gulp.src("source/js/*.js") // директория откуда брать исходники
    .pipe(concat('scripts.js')) // объеденим все js-файлы в один 
    .pipe(uglify()) // вызов плагина uglify - сжатие кода
    .pipe(rename({ suffix: '.min' })) // вызов плагина rename - переименование файла с приставкой .min
    .pipe(gulp.dest("dist/js")); // директория продакшена, т.е. куда сложить готовый файл
    done();
});

// Сжимаем картинки
gulp.task('img', function(done) {
  return gulp.src("source/images/*.+(jpg|jpeg|png|gif)")
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      interlaced: true
    }))
    .pipe(gulp.dest("dist/images"));
    done();
});

// Задача слежения за измененными файлами
gulp.task("watch", function(done) {
  gulp.watch("source/*.html", ["html"]);
  gulp.watch("source/js/*.js", ["scripts"]);
  gulp.watch("source/sass/*.sass", ["sass"]);
  gulp.watch("source/images/*.+(jpg|jpeg|png|gif)", ["img"]);
  done();
});

///// Таски ///////////////////////////////////////

// Запуск тасков по умолчанию
gulp.task("default", gulp.series('html', 'sass', 'scripts', 'img', 'watch'));