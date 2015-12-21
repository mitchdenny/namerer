var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsconfig = require('./tsconfig.json');
var exec = require('child_process').exec;

var paths = {
	bin: 'bin/**/*',
	typescript: 'src/**/*.ts',
	javascript: '**/*.js',
	metadata: ['**/package.json', '!node_modules/**/package.json']
}

gulp.task('compile', function() {
	return gulp
		.src(paths.typescript)
		.pipe(ts(tsconfig.compilerOptions))
		.pipe(gulp.dest('.'));
});

gulp.task('pack', function(callback) {
	exec('npm pack', function(err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		callback(err);
	});
});

gulp.task('watch', ['default'], function() {
	gulp.watch(paths.metadata, ['pack']);
	gulp.watch(paths.bin, ['pack']);
	gulp.watch(paths.javascript, ['pack']);
	gulp.watch(paths.typescript, ['compile']);	
});

gulp.task('default', ['compile', 'pack']);