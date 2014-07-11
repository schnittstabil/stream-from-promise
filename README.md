# stream-from-promise [![Dependencies Status Image](https://gemnasium.com/schnittstabil/stream-from-promise.svg)](https://gemnasium.com/schnittstabil/stream-from-promise) [![Build Status Image](https://travis-ci.org/schnittstabil/stream-from-promise.svg)](https://travis-ci.org/schnittstabil/stream-from-promise) [![Coverage Status](https://coveralls.io/repos/schnittstabil/stream-from-promise/badge.png)](https://coveralls.io/r/schnittstabil/stream-from-promise)

Create streams from ECMAScript 6 Promises ([ES.next Draft Rev 25](http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts)).

```bash
npm install stream-from-promise --save
```

## Usage

As long as es6 is a draft:

```bash
npm install promise --save
```

### `String | Buffer` promises

```JavaScript
var StreamFromPromise = require('stream-from-promise'),
    Promise = require('promise');

var stringPromise = new Promise(function(resolve, reject) {
  setTimeout(function() { resolve('strrrring!'); }, 500);
});

StreamFromPromise(stringPromise)
  .pipe(process.stdout); // output: strrrring!


var bufferPromise = new Promise(function(resolve, reject) {
  setTimeout(function() { resolve(new Buffer('buff!')); }, 500);
});

StreamFromPromise(bufferPromise)
  .pipe(process.stdout); // output: buff!
```

### Arbitrary Promises

```JavaScript
var StreamFromPromise = require('stream-from-promise'),
    Promise = require('promise');

function logFunc(){
  console.log('func!?!');
};

var funcPromise = new Promise(function(resolve, reject) {
  setTimeout(function() { resolve(logFunc) }, 500);
});

StreamFromPromise.obj(funcPromise)
  .on('data', function(fn){
    fn(); // output: func!?!
  });
```

### Rejecting

```JavaScript
var StreamFromPromise = require('stream-from-promise'),
    Promise = require('promise');

var rejectPromise = new Promise(function(resolve, reject) {
  setTimeout(function() { reject(new Error('rejected')) }, 500);
});

StreamFromPromise(rejectPromise)
  .on('error', function(err){
    console.log(err); // output: [Error: rejected]
  })
  .on('data', function(data){
    // do something awsome
  });
```

### [Gulp](http://gulpjs.com/) File promises

Gulp files are [vinyl](https://github.com/wearefractal/vinyl) files:

```bash
npm install vinyl
```

Test some awsome Gulp plugin:

```JavaScript
var StreamFromPromise = require('stream-from-promise'),
    Promise = require('promise'),
    File = require('vinyl');

var hello = new File({
      cwd: '/',
      base: '/hello/',
      path: '/hello/hello.js',
      contents: new Buffer('console.log("Hello");')
    });

var helloFilePromise = new Promise(function(resolve, reject) {
  setTimeout(function() { resolve(hello) }, 500);
});

StreamFromPromise.obj(helloFilePromise)
  .pipe(someAwsomeGulpPlugin())
  .on('data', function(file){
    console.log(file.contents.toString()); // dunno what someAwsomeGulpPlugin does :)
  });
```

See also [stream-recorder](https://github.com/schnittstabil/stream-recorder) for testing gulp plugins.

## API

### Class: StreamFromPromise

_StreamFromPromises_ are [Readable](http://nodejs.org/api/stream.html#stream_class_stream_readable_1) streams.

#### new StreamFromPromise(promise, [options])

* _promise_ `Promise` ECMAScript 6 Promises returning Javascript values like numbers, strings, objects, functions, ...
* _options_ `Object` passed through [new Readable([options])](http://nodejs.org/api/stream.html#stream_new_stream_readable_options)

Note: The `new` operator can be omitted.

#### StreamFromPromise#obj(promise, [options])

A convenience wrapper for `new StreamFromPromise(promise, {objectMode: true, ...})`.

## License

Copyright (c) 2014 Michael Mayer

Licensed under the MIT license.
