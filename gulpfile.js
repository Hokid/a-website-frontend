


// Подключаемые модули

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    server = require("gulp-server-livereload"),
    del = require("del"),
    htmlmin = require("gulp-htmlmin"),
    rubySass = require("gulp-ruby-sass");



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

    server : {
      livereload: true,
      directoryListning: true
    },

    htmlmin: {
      removeComments: true
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
 *   1. Сборка SASS
 *   2. Запуск лок. сервера
 *
 * Во время слежки выполняется:
 *   1. Сборка SASS
 */

gulp.task('watch', [ "ruby-sass", "htmlmin", "server", "img", "glyphicons" ], function(){

    gulp.watch( path.src.sass + "**/*.scss", ["ruby-sass"] );
    gulp.watch( path.src.html + "*.html", ["htmlmin"] );
    gulp.watch( path.src.img + "**/*", ["img"] );
    gulp.watch( path.src.glyphicons + "**/*", ["glyphicons"] );
});



// Полная сборка проэкта

gulp.task('build', [ "ruby-sass", "htmlmin", "img", "glyphicons" ], function(){});



// Компиляция SASS файлов(на основе libsass)

gulp.task('sass', function(){

  del( path.build.css + "style.css", function( err, deletedFiles ){});

  gulp.src( path.src.sass + "style.scss" )
   .pipe( sass( opts.sass ) )
   .pipe( gulp.dest( path.build.css ) );

});



// Использовать эту сборку SASS для поддержки всех фич(@at-root и т.п.)

gulp.task('ruby-sass', function(){

  del( path.build.css + "style.css", function( err, deletedFiles ){});

  rubySass( path.src.sass + "style.scss" )
   .pipe( gulp.dest( path.build.css ) );

});



// Минификация HTML

gulp.task("htmlmin", function(){

  del( path.build.root + "*.html", function( err, deletedFiles ){});

  gulp.src( path.src.html + "*.html" )
    .pipe( htmlmin( opts.htmlmin ) )
    .pipe( gulp.dest( path.build.root ) );

});



// Запуск локального сервера

gulp.task("server", function(){

  gulp.src( path.build.root )
    .pipe( server( opts.server ) );

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
