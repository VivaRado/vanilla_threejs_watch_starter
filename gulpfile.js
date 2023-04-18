global._r_      = __dirname;
const gulp      = require('gulp');
const path      = require('path');
const port      = require( path.join( _r_, 'app' ,'port.js' ) );
const nodemon   = require('nodemon');
const fs        = require('fs');

const spawn = require('child_process').spawn;

path.join(_r_,'node_modules','three')

gulp.task('default', function () {
  nodemon({
    script: 'server.js',
    env: {
      'PORT': port.address
    },
    args: ['--bundle'],
    watch: ["server.js", 'gulpfile.js', 'static/**/*.*']
  })
  .on('restart', function() {
    console.log("Restarted")
  })
});

gulp.task("default");
