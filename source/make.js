#!/usr/bin/env node

var fs = require('fs');
var uglifyjs = require('uglify-js');
var parser = uglifyjs.parser;
var uglify = uglifyjs.uglify;

var code = fs.readFileSync('./charts.js', 'ascii')+'\n';

fs.readdir('charts', function(e, files){
	if (e) throw e;
	files.forEach(function(file){
		if (/\.js$/i.test(file)){
			code += fs.readFileSync('charts/' + file, 'ascii')+'\n';
		}
	});
	fs.readdir('wrappers', function(e, files){
		if (e) throw e;
		files.forEach(function(file){
			if (/\.js$/i.test(file)){
				code += fs.readFileSync('wrappers/' + file, 'ascii')+'\n';
			}
		});
		// fs.writeFile('../charts.js', code, function(){
		// 	console.log('charts.js created.');
		// });
		var ast = parser.parse(code);
		ast = uglify.ast_mangle(ast);
		ast = uglify.ast_squeeze(ast);
		var finalCode = uglify.gen_code(ast);
		fs.writeFile('../charts.min.js', finalCode, function(){
			console.log('charts.min.js created.');
		});
	});
});
