var gulp = require('gulp');
var fs = require('fs');
var ts = require('gulp-typescript');
var tsconfig = require('./tsconfig.json');
var exec = require('child_process').exec;

var paths = {
	bin: 'bin/**/*',
	typescript: 'src/**/*.ts',
	javascript: '**/*.js',
	docs: 'docs/**/*',
	metadata: ['**/package.json', '!node_modules/**/package.json', '**/tsconfig.json', '**/jsconfig.json']
}

gulp.task('compile', function () {
	return gulp
		.src(paths.typescript)
		.pipe(ts(tsconfig.compilerOptions))
		.pipe(gulp.dest('.'));
});

function updatePackage(version) {
	var originalContents = fs.readFileSync('package.json', 'utf8');
	var pkg = JSON.parse(originalContents);

	pkg.version = version;

	var updatedContents = JSON.stringify(pkg, null, '\t');
	fs.writeFileSync('package.json', updatedContents);
}

function appendVersionToBuildNumber(version) {
	var buildNumber = process.env.BUILD_BUILDNUMBER + '_' + version;
	console.log('##vso[build.updatebuildnumber]%s', buildNumber);
}

gulp.task('stamp', function (callback) {
	exec('git describe --abbrev=0', function (err, stdout, stderr) {
		var version = stdout.toString().split('\n')[0];
		console.log('git detected version was: %s', version);
		updatePackage(version);
		appendVersionToBuildNumber(version);
		callback(err);
	});
});

gulp.task('pack', function (callback) {
	exec('npm pack', function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		callback(err);
	});
});

gulp.task('docs', function (callback) {
	exec('make -C docs html', function(err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		callback(err);
	});
});

gulp.task('watch', ['default'], function () {
	gulp.watch(paths.metadata, ['pack']);
	gulp.watch(paths.bin, ['pack']);
	gulp.watch(paths.javascript, ['pack']);
	gulp.watch(paths.typescript, ['compile']);
	gulp.watch(paths.docs, ['docs']);
});

gulp.task('default', ['stamp', 'compile', 'pack', 'docs']);