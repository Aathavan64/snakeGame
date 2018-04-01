const gulp = require ('gulp');
const sass = require ('gulp-sass');
const concat = require ('gulp-concat');
const babel = require ('gulp-babel');
const browserSync = require ('browser-sync').create();
const reload = browserSync.reload;

gulp.task('styles', () => {
    return gulp.src('./styles/style.scss')
    .pipe(sass().on('error',sass.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./styles'))
    .pipe(reload({stream: true}));
});

gulp.task ('scripts',() => {
    return gulp.src('./js/script.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./js'))
        .pipe(reload({stream: true}));
});

gulp.task('bs', () => {
    browserSync.init({
        server:'.'
    })
});

gulp.task('default', ['styles', 'scripts', 'bs'] ,() => {
    gulp.watch('./styles/**/*.scss', ['styles']);
    gulp.watch('./js/sript.js', ['scripts']);
    gulp.watch('*.html', reload);
});