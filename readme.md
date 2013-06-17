browserifyer
==========

browserifyer is a simple file watcher and browserif runner.

When you save changes to a .js file being watched browserifyer is automagicly run for you.

Installation
------------

	npm install -g browserifyer
	
	
Usage
-----

browserifyer [options]

Options:

  -h, --help                     output usage information
  
  -V, --version                  output the version number
  
  -v, --verbose                  Verbose output
  
  -d, --debug                    Browserify in debug mode (generate source maps)
  
  -m, --minify                   Minify output
  
  -w, --watch [path]             Watch Path [default ./]
  
  -i, --input [fileName]         Input File [default ./main.js]
  
  -o, --output [fileName]        Output File [default ./main.browser.js]
  
  -t, --transform [transform]    transform [default none]
  
  -T, --throttle [milliseconds]  Minimum time between processing (milliseconds) [default 300]
  
  
  
Licence
-------

MIT