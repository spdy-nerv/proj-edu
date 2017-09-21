var gulp = require('gulp');
var prompt = require('gulp-prompt');
var copy = require('gulp-copy');
var file = require('gulp-file');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var changed = require('gulp-changed');
var runSequence = require('run-sequence');
var glob = require('glob');

var options = {};

// 配置参数输入
gulp.task('prompt', function(cb) {
	gulp.src('base/**/*')
	.pipe(prompt.prompt([{
		type: 'input',
		name: 'caseName',
		message: '请输入实例项目名称（英文小写加短横杠，必填）？',
		validate: notNullValidateFn
	}, {
		type: 'input',
		name: 'themeName',
		message: '请输入主题皮肤文件名称（不需要输入文件后缀，必填）？',
		validate: notNullValidateFn
	}, {
		type: 'input',
		name: 'domainPrefix',
		message: '请输入接口请求的域名前缀（如https://microcloudtech.com/gateway/fudan，必填）？',
		validate: notNullValidateFn
	}], function(res) {
		options = res;
		cb();
	}));
});

// 复制项目文件
gulp.task('copy', function() {
	gulp.src(['base/**/*', '!base/config.js'])
	.pipe(gulp.dest('cases/' + options.caseName));
});

// 创建主题皮肤文件
gulp.task('theme', function() {
	gulp.src('base/themes/default.js')
	.pipe(rename('themes/' + options.themeName + '.js'))
	.pipe(gulp.dest('cases/' + options.caseName));
});

// 更改项目配置项
gulp.task('config', function() {
	gulp.src('base/config.js')
	.pipe(replace(/caseName:\s\'.*\'/g, 'caseName: ' + "'" + options.caseName + "'"))
	.pipe(replace(/themeName:\s\'.*\'/g, 'themeName: ' + "'" + options.themeName + "'"))
	.pipe(replace(/domainPrefix:\s\'.*\'/g, 'domainPrefix: ' + "'" + options.domainPrefix + "'"))
	.pipe(gulp.dest('cases/' + options.caseName));
});

// 从基础项目代码拉取创建项目
gulp.task('new', function(cb) {
	runSequence('prompt', 'copy', 'theme', 'config', cb);
});

// 同步基础代码到各项目
gulp.task('sync', function() {
	glob('./cases/**/config.js', function(err, files) {
		files.forEach(function(f) {
			var cfg = require(f);
			console.log('==============================================');
			console.log('同步代码至项目"' + cfg.caseName + '"...');
			console.log('项目的同步glob配置如下: ' + cfg.syncGlob);
			gulp.src(cfg.syncGlob)
			.pipe(changed('cases/' + cfg.caseName))
			.pipe(gulp.dest('cases/' + cfg.caseName));
		});
	});
});

function notNullValidateFn(val) {
	if (!val) {
		return false;
	} else {
		return true;
	}
}
