var gulp         = require('gulp');
var browserSync  = require('browser-sync').create();
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var jade         = require('gulp-jade');
var uglify       = require('gulp-uglify');
var pump         = require('pump');
var plumber      = require('gulp-plumber');
var notify       = require('gulp-notify');
var beep         = require('beepbeep');
var cssmin       = require('gulp-cssmin');
var rename       = require('gulp-rename');

// Function for error handling
var onError = function(err){
    notify.onError({
        title: "gulp error in " + err.plugin,
        message: err.toString()
    })(err);
    beep(3);
    this.emit('end');
};

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'jade','compress'], function() {
  browserSync.init({
      server: "./"
  });

  gulp.watch("./dev/js/*.js", ['compress']);
  gulp.watch("./dev/sass/**/*.scss", ['sass']).on('change', browserSync.reload);
  gulp.watch("./build/templates/**/*.jade", ['jade']);
  gulp.watch("./*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("./dev/sass/**/*.scss")
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6']
			}))
    .pipe(gulp.dest("./css"))
    .pipe(cssmin()) // min css
    .pipe(rename({ // rename file to styles.min.css
        suffix:'.min'
    }))
    .pipe(gulp.dest("./css"))
    .pipe(browserSync.stream());
});

// Jade Task
// Converts Jade to HTML
gulp.task('jade', function(){
  gulp.src('./build/templates/**/*.jade')
  .pipe(plumber({
    errorHandler: onError
  }))
  .pipe(jade({
    pretty: true
  }))
  .pipe(gulp.dest('./build/development'));
});

// Compress task for uglify for Javascript
gulp.task('compress', function (cb) {
  pump([
      gulp.src('./dev/js/*.js'),
      uglify(),
      gulp.dest('./js/')
    ],
    cb
  );
});


gulp.task('default', ['serve']);
