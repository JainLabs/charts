// Copyright (C) 2012 JainLabs, Ajay Jain, Paras Jain
// This software is icensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License, found at http://creativecommons.org/licenses/by-nc/3.0/.

var fs = require('fs');
var uglifyjs = require('uglify-js');
var parser = uglifyjs.parser;
var uglify = uglifyjs.uglify;

var comment = "// Copyright (C) 2012 JainLabs, Ajay Jain, Paras Jain\n\
// This software is icensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License, found at http://creativecommons.org/licenses/by-nc/3.0/.";

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
		fs.writeFile('../charts.js', comment+"\n"+code, function(){
                        console.log('charts.js created.');
                });
		var ast = parser.parse(code);
		ast = uglify.ast_mangle(ast);
		ast = uglify.ast_squeeze(ast);
		var finalCode = uglify.gen_code(ast);
		fs.writeFile('../charts.min.js', comment+"\n"+finalCode, function(){
			console.log('charts.min.js created.');
		});
	});
});
