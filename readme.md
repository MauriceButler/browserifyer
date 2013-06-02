browserifer
==========

browserifer is a simple file watcher and browserif runner.

When you save changes to a .js file being watched browserifer is automagicly run for you.

Installation
------------

	npm install -g browserifer
	
	
Usage
-----

browserifer [options]

Options:

  -h, --help               Output usage information
  
  -V, --version            Output the version number
  
  -v, --verbose            Verbose output
  
  -w, --watch [path]       Watch Path [default ./]
  
  -i, --input [fileName]   Input File [default ./main.js]
  
  -o, --output [fileName]  Output File [default ./main.browser.js]
  
  -t, --throttle [milliseconds]  Minimum time between processing (milliseconds) [default 300]
  
  
  
Licence
-------

MIT