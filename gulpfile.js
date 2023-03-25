const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
 


gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "src"
        }
        // proxy: "theage"
    });

    gulp.watch('src/*.html').on('change', browserSync.reload);
});



gulp.task('styles', function() {
    return gulp.src('src/sass/*.+(scss|sass)')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({
            prefix: "",
            suffix: ".min"
        }))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('src/css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('watch', function() {
    gulp.watch("src/sass/**/*.+(scss|sass)", gulp.parallel('styles'));
    gulp.watch('src/css/*.css').on('change', browserSync.reload);
    gulp.watch('src/js/*.js').on('change', browserSync.reload);
    gulp.watch('src/*.html').on('change', browserSync.reload);
});

gulp.task('html', function() {
    return gulp.src('src/*html')
        // .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest("src/"))
        .pipe(gulp.dest('dist/'));
});

gulp.task('images', function() {
    return gulp.src('src/img/**/*')
        .pipe(gulp.dest('src/img'))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('icons', function() {
    return gulp.src('src/icons/**/*')
        .pipe(gulp.dest('src/icons'))
        .pipe(gulp.dest('dist/icons'));
});

gulp.task('js', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('src/js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('json', function() {
    return gulp.src('src/*json')
        .pipe(gulp.dest('src/'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', gulp.parallel('watch', 'server', 'styles', 'images', 'icons', 'html', 'js', 'json'));