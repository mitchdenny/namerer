var gulp = require('gulp');

var paths = {
	bin: 'bin/**/*',
	scripts: '**/*.js'
}

gulp.task('bump', function() {
	console.log('Just pretend I\'m bumping the version number');
});

gulp.task('pack', function() {
	console.log('Just pretend I\'m packing the NPMs');
});

gulp.task('default', ['watch', 'bump', 'pack']);
gulp.task('watch', function() {
	gulp.watch(paths.bin);
	gulp.watch(paths.scripts);	
});