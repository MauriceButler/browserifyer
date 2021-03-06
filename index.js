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
    absoluteInputFile,
    uglify = require("uglify-js");

program._name = 'browserifyer';
    
program
    .version(packageJson.version)
    .option('-v, --verbose', 'Verbose output')
    .option('-d, --debug', 'Browserify in debug mode (generate source maps)', Boolean, false)
    .option('-m, --minify', 'Minify output')
    .option('-w, --watch [path]', 'Watch Path [default ' + watchPath +']',  String, watchPath)
    .option('-i, --input [fileName]', 'Input File [default ' + inputFile +']',  String, inputFile)
    .option('-o, --output [fileName]', 'Output File [default ' + outputFile +']',  String, outputFile)
    .option('-t, --transform [transform]', 'transform [default none]',  String)
    .option('-T, --throttle [milliseconds]', 'Minimum time between processing (milliseconds) [default ' + throttle +']', Number, throttle)
    .parse(process.argv);


function hasError(error){
    if(error){
        console.log(error.stack || error);
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
            var options = {
                fromString: true
            };

            data = uglify.minify(data, options).code;
        }

        fs.writeFile(program.output, data, function(){
            if (!hasError(error)) {
                log('Browserfied ' + program.input + ' -> ' + program.output);
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

    var result = browserify(absoluteInputFile),
        options = {
            debug: program.debug
        };
    
    if(program.transform){
        result.transform(program.transform);
    }

    result.bundle(options, bundle).on('error', hasError);
}

absoluteInputFile = path.join(process.cwd(), program.watch, program.input);

log('Watching ' + program.watch + ' for changes.');
log('Input file is ' + program.input);
log('Output file is ' + program.output);

tryToProcess();

fs.watch(program.watch, function(eventType, filename){
    if(eventType !== 'change' || 
        path.extname(filename).toLowerCase() !== '.js' ||
        filename.toLowerCase() === path.basename(program.output).toLowerCase()){
        return;
    }

    tryToProcess(filename);
});