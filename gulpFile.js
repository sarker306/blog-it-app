var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var fs = require('fs');
var karma = require('karma').server;
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var stylish = require('jshint-stylish');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var minifyCss = require('gulp-minify-css');
var html2js = require('gulp-ng-html2js');
var minifyHtml = require('gulp-minify-html');
var jasmine = require('gulp-jasmine');

var cp = require('child_process');

var modulesFiles = ['./public/app.js', './public/modules/**/module.js', './public/modules/**/*.js'];
var disFolder = './dist/';

//modules
gulp.task('modules', function () {
    gulp.src(modulesFiles)
        .pipe(concat('modules.min.js'))
        .pipe(uglify(
            {mangle: false}//if true then angular throw error at run time, need to find out
        ))
        .pipe(gulp.dest(disFolder + 'js'));
});

gulp.task('templates', function () {
    gulp.src(['./public/modules/**/*.html', './public/themes/default/view/**.html'])
        .pipe(minifyHtml())
        .pipe(html2js(
            {
                moduleName: 'blog-it.partials',
                rename: function (url) {
                    var prepend = '/static/';

                    if (url.indexOf('/') !== -1) {
                        //internal partial
                        prepend += 'modules/';
                    } else {
                        //view
                        prepend += 'themes/default/view/';
                    }

                    return prepend + url;
                }
            }
        ))
        .pipe(concat('partials.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(disFolder + 'js'));
});

//just as indication
gulp.task('lint', function () {
    gulp.src(modulesFiles)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

//bower components
gulp.task('components', function () {
    gulp.src(['./public/bower_components/**/*.js', '!./public/bower_components/**/*.min.js'])
        .pipe(concat('components.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(disFolder + 'js'));
});

//lib
gulp.task('lib', function () {

    //Angular
    //Angular
    gulp.src(['./public/lib/angular/*'])
        .pipe(gulp.dest(disFolder + 'lib/angular'));

    //highlight.js
    gulp.src(['./public/lib/highlight/highlight.pack.js', './public/lib/highlight/styles/default.css'])
        .pipe(gulp.dest(disFolder + 'lib/highlight'));

    //showdown
    gulp.src(['./public/lib/showdown/showdown.min.js'])
        .pipe(gulp.dest(disFolder + '/lib/showdown'));
});

//theme

//sass
gulp.task('sass', function () {
    gulp.src(['./public/themes/default/theme.scss'])
        .pipe(sass())
        .pipe(minifyCss())
        .pipe(gulp.dest(disFolder + 'themes/default'));
});

gulp.task('theme', ['sass'], function () {
    gulp.src(['./public/themes/default/view/**.html'])
        .pipe(gulp.dest(disFolder + 'themes/default/view'));

    gulp.src(['./public/themes/default/fonts/**'])
        .pipe(gulp.dest(disFolder + 'themes/default/fonts'));
});

//index
gulp.task('index', function () {
    gulp.src(['./public/index.html'])
        .pipe(useref())
        .pipe(gulp.dest(disFolder));
});

//test
gulp.task('test-server', function (done) {

    cp.exec("NODE_ENV=test ./node_modules/.bin/jasmine-node ./server/spec --verbose --forceexit", function (err, stdout, stderr) {
        console.log(stdout);
    });
//
//    gulp.src('./server/spec/*.js')
//        .pipe(jasmine({verbose: true, forceExit: true}));
});

gulp.task('karma-CI', function (done) {
    var conf = require('./public/spec/karma-common.js');
    conf.singleRun = true;
    conf.browsers = ['PhantomJS'];
    conf.basePath = './public';
    karma.start(conf, done);
});

gulp.task('test', ['karma-CI']);

gulp.task('build', ['test', 'modules', 'templates', 'lib', 'components', 'theme', 'index']);

