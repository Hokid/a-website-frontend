


// Подключаемые модули

var gulp = require('gulp'),
    browserSync = require("browser-sync"),
    del = require("del"),
    htmlmin = require("gulp-htmlmin"),
    rubySass = require("gulp-ruby-sass"),
    compass = require("gulp-compass"),
    htmlTagInclude = require("gulp-html-tag-include");



// Директории проэкта

var path = {

    src: {
      root: "sourses/",
      sass: "sourses/css/sass/",
      html: "sourses/html/",
      img: "sourses/img/",
      glyphicons: "sourses/glyph-icons/"
    },

    build: {
      root: "build/",
      css: "build/css/",
      img: "build/img/",
      glyphicons: "build/glyph-icons/"
    }
};



// Опции модулей

var opts = {

    sass: { outputStyle: "expanded" },

    compass: {

      sass: path.src.sass,

      css: path.build.css,

      style: "compressed",

      time: true

    },

    browserSync : {

      server: {
        baseDir: path.build.root
      },

      port: 8000,

      ui: false,

      online: false,

      open: false,

      files: path.build.root + "**/*",

      notify: false,

      ghostMod: false,

      logPrefix: "a-website"

    },

    htmlmin: {
      removeComments: true
    },

    htmlTagInclude: {
      // tagName: string, default include
      autoIndent: false //boolean, default true
      // prefixVar: string, default @@
    }

};





//===============================================
//
// Задачи
//
//===============================================

/**
 * Слежка за изменением файлов и запуск задач после изменения.
 *
 * До запуска слежки выполняется:
 *   1. Сборка проэкта
 *   2. Запуск лок. сервера
 *
 * Во время слежки выполняется:
 *   1. Сборка SASS
 *   2. Сборка HTML
 *   3. Сборка изображений
 *   4. Сборка иконочных шрифтов
 */

gulp.task('watch', [ "build", "server" ], function(){

    gulp.watch( path.src.sass + "**/*.scss", ["compass"] );
    gulp.watch( path.src.html + "**/*.html", ["html"] );
    gulp.watch( path.src.img + "**/*", ["img"] );
    gulp.watch( path.src.glyphicons + "**/*", ["glyphicons"] );
});



// Полная сборка проэкта

gulp.task('build', [ "compass", "html", "img", "glyphicons" ], function(){});



// Компиляция sass compass-м

gulp.task('compass', function(){

  del( path.build.css + "style.css", function( err, deletedFiles ){});

  gulp.src( path.src.sass + "style.scss" )
   .pipe( compass( opts.compass ) );

});



// Сборку SASS(основана на Ruby)

gulp.task('ruby-sass', function(){

  del( path.build.css + "style.css", function( err, deletedFiles ){});

  rubySass( path.src.sass + "style.scss" )
   .pipe( gulp.dest( path.build.css ) );

});



/**
 * Сборка HTML:
 *   1. Сборка шаблонов(gulp-html-tag-include)
 *   2. Минификация(gulp-htmlmin)
 */

gulp.task("html", function(){

  del( path.build.root + "*.html", function( err, deletedFiles ){});

  gulp.src( path.src.html + "*.html" )
    .pipe( htmlTagInclude(opts.htmlTagInclude) )
    .pipe( htmlmin( opts.htmlmin ) )
    .pipe( gulp.dest( path.build.root ) );

});



// Запуск локального сервера

gulp.task("server", function(){

  browserSync(opts.browserSync);

});



// Перенос изображений в билд версию

gulp.task('img', function(){

  del( path.build.img + "**/*", function( err, deletedFiles ){});

  gulp.src( path.src.img + "**/*" )
    .pipe( gulp.dest( path.build.img ) );
});



// Перенос иконочных шрифтов в билд версию

gulp.task('glyphicons', function(){

  del( path.build.glyphicons + "**/*", function( err, deletedFiles ){});

  gulp.src( path.src.glyphicons + "**/*" )
    .pipe( gulp.dest( path.build.glyphicons ) );
});
