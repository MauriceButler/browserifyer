#!/usr/bin/env node

var program = require('commander'),
    browserify = new require('browserify'),
    fs = require('fs'),
    path = require('path'),
    packageJson = require('./package.json'),
    watchPath = './',
    outputFile = './main.browser.js';
    
program
  .version(packageJson.version)
  .option('-v, --verbose', 'Verbose output')
  // TODO: Add debud flag to browserify call
  // .option('-d, --debug', 'Browserify in debug mode')
  .option('-w, --watch [path]', 'Watch Path [default ./]')
  .option('-o, --output [fileName]', 'Output File [default ./main.browser.js]')
  .parse(process.argv);


 if(program.watch){
    watchPath = program.watch;
 }

 if(program.output){
    outputFile = program.output;
 }

function hasError(error){
    if(error){
        console.log(error.stack);
        return true;
    }
}

function log(message){
    if(program.verbose){
        console.log(message);
    }
}

function bundle(error, data) {
    if (!hasError(error)) {
        fs.writeFile(outputFile, data, function(){
            if (!hasError(error)) {
                log('Updated: ' + outputFile);
            }
        });
    }
}

log('Watching ' + watchPath + ' for changes.');
log('Output file is ' + outputFile);

fs.watch(watchPath, function(eventType, filename){
    if(eventType !== 'change' || 
        path.extname(filename).toLowerCase() !== '.js' ||
        filename.toLowerCase() === path.basename(outputFile).toLowerCase()){
        return;
    }
        
    var relativePath = path.relative(__dirname, path.join(watchPath, filename));
        result = browserify(relativePath);
        
    result.bundle(bundle).on('error', hasError);
});