const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const clean = require('gulp-clean');
 


const dev = () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

    gulp.watch('./src/**/*', gulp.series('cleanDist', gulp.parallel('styles', 'images', 'icons', 'html', 'js', 'json'), (next) => {
        browserSync.reload()
        next();
    }))
}

gulp.task('cleanDist', function() {
    return gulp.src('./dist', {read: false})
    .pipe(clean());
})

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
        .pipe(gulp.dest('dist/css'));
});

gulp.task('html', function() {
    return gulp.src('src/*html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist/'));
});

gulp.task('images', function() {
    return gulp.src('src/img/**/*')
        .pipe(gulp.dest('dist/img'));
});

gulp.task('icons', function() {
    return gulp.src('src/icons/**/*')
        .pipe(gulp.dest('dist/icons'));
});

gulp.task('js', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('dist/js'));
});

gulp.task('json', function() {
    return gulp.src('src/*.json')
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', gulp.series(gulp.parallel('styles', 'images', 'icons', 'html', 'js', 'json'), dev));