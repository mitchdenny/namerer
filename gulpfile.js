var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsconfig = require('./tsconfig.json');
var npm = require('npm');

console.log(npm);

var paths = {
	bin: 'bin/**/*',
	typescript: 'src/**/*.ts',
	javascript: '**/*.js'
}

gulp.task('compile', function() {
	return gulp
		.src(paths.typescript)
		.pipe(ts(tsconfig.compilerOptions))
		.pipe(gulp.dest('.'));
});

gulp.task('pack', function() {
	console.log('Packing');
});

gulp.task('watch', ['default'], function() {
	gulp.watch(paths.bin, ['pack']);
	gulp.watch(paths.javascript, ['pack']);
	gulp.watch(paths.typescript, ['compile']);	
});

gulp.task('default', ['compile', 'pack']);