#!/usr/bin/env node

var program = require('commander'),
    browserify = new require('browserify'),
    fs = require('fs'),
    path = require('path'),
    packageJson = require('./package.json'),
    watchPath = './',
    inputFile = './main.js',
    outputFile = './main.browser.js',
    throttle = 300,
    throttleTimeout,
    relativeInputFile,
    uglify = require("uglify-js");
    
program
    .version(packageJson.version)
    .option('-v, --verbose', 'Verbose output')
    // TODO: Add debud flag to browserify call
    // .option('-d, --debug', 'Browserify in debug mode')
    .option('-w, --watch [path]', 'Watch Path [default ' + watchPath +']',  String, watchPath)
    .option('-i, --input [fileName]', 'Input File [default ' + inputFile +']',  String, inputFile)
    .option('-o, --output [fileName]', 'Output File [default ' + outputFile +']',  String, outputFile)
    .option('-t, --transform [transform]', 'transform [default none]',  String)
    .option('-T, --throttle [milliseconds]', 'Minimum time between processing (milliseconds) [default ' + throttle +']', Number, throttle)
    .option('-m, --minify', 'Minify output')
    .parse(process.argv);


function hasError(error){
    if(error){
        console.log(error);
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
        if(program.minify){
            data = uglify.minify(data, {fromString: true}).code;
        }
        fs.writeFile(program.output, data, function(){
            if (!hasError(error)) {
                log('Browserfied ' + inputFile + ' -> ' + outputFile);
            }
        });
    }
}

function tryToProcess(filename){
    var now = new Date();
    
    clearTimeout(throttleTimeout);
    throttleTimeout = setTimeout(function(){
            processFile(filename);
        }, program.throttle);
}

function processFile(filename) {
    if(filename){
        log('Processing triggered by save on: ' + filename);
    }

    var result = browserify(relativeInputFile);
    
    if(program.transform){
        result.transform(program.transform);
    }

    result.bundle(bundle).on('error', hasError);
}

relativeInputFile = path.relative(__dirname, path.join(program.watch, program.input));
console.log(relativeInputFile);
log('Watching ' + program.watch + ' for changes.');
log('Output file is ' + program.output);
tryToProcess();

fs.watch(watchPath, function(eventType, filename){
    if(eventType !== 'change' || 
        path.extname(filename).toLowerCase() !== '.js' ||
        filename.toLowerCase() === path.basename(program.output).toLowerCase()){
        return;
    }

    tryToProcess(filename);
});