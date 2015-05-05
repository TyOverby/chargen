var gulp = require('gulp');
var source = require('vinyl-source-stream');
var ts = require('gulp-typescript');
var merge = require('merge2');
var sourcemaps = require('gulp-sourcemaps');
var tslint = require('gulp-tslint');
var browserify = require('browserify');

var TS_DIR = './lib/*.ts';
var MAIN_JS ='./release/js/main.js'

gulp.task("compile", function() {
    var tsResult =
        gulp.src(TS_DIR)
            .pipe(sourcemaps.init())
            .pipe(ts({
                declarationFiles: true,
                noExternalResolve: true,
                module: "commonjs"
            }));
    return merge([
        tsResult.dts.pipe(gulp.dest('release/definitions')),
        tsResult.js.pipe(gulp.dest('release/js'))
    ]);
});

gulp.task("lint", function() {
    return gulp.src(TS_DIR)
               .pipe(tslint())
               .pipe(tslint.report('verbose'));
});

gulp.task("browserify", function() {
    var b = browserify({
        debug: true,
    }).add('./release/js/main.js');

    return b.bundle()
            .pipe(source('out.js'))
            .pipe(gulp.dest('release/js'));
});

gulp.task('watch', function() {
    gulp.watch([TS_DIR], ['lint', 'compile', ['browserify']])
});
