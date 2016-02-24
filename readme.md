# stream-from-promise [![Dependencies Status Image](https://gemnasium.com/schnittstabil/stream-from-promise.svg)](https://gemnasium.com/schnittstabil/stream-from-promise) [![Build Status Image](https://travis-ci.org/schnittstabil/stream-from-promise.svg)](https://travis-ci.org/schnittstabil/stream-from-promise) [![Coverage Status](https://coveralls.io/repos/schnittstabil/stream-from-promise/badge.png)](https://coveralls.io/r/schnittstabil/stream-from-promise)

Create streams from [ECMAScript 2015 Promises](http://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects).

```bash
npm install stream-from-promise --save
```


## Usage


### `String | Buffer` promises

```JavaScript
import StreamFromPromise from 'stream-from-promise';

const stringPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('strrrring!');
  }, 500);
});

StreamFromPromise(stringPromise)
  .pipe(process.stdout); // output: strrrring!


const bufferPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(new Buffer('buff!'));
  }, 500);
});

StreamFromPromise(bufferPromise)
  .pipe(process.stdout); // output: buff!
```


### Arbitrary Promises

```JavaScript
import StreamFromPromise from 'stream-from-promise';

const funcPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(() => {
      console.log('func!?!');
    });
  }, 500);
});

StreamFromPromise.obj(funcPromise)
  .on('data', fn => {
    fn(); // output: func!?!
  });
```


### Rejecting

```JavaScript
import StreamFromPromise from 'stream-from-promise';

const rejectPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('rejected'));
  }, 500);
});

StreamFromPromise(rejectPromise)
  .on('error', err => {
    console.log(err); // output: [Error: rejected]
  })
  .on('data', data => {
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
import StreamFromPromise from 'stream-from-promise';
import File from 'vinyl';

const hello = new File({
      cwd: '/',
      base: '/hello/',
      path: '/hello/hello.js',
      contents: new Buffer('console.log("Hello");')
    });

const helloFilePromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(hello);
  }, 500);
});

StreamFromPromise.obj(helloFilePromise)
  .pipe(someAwsomeGulpPlugin())
  .on('data', file => {
    console.log(file.contents.toString()); // dunno what someAwsomeGulpPlugin does :)
  });
```

See also [stream-recorder](https://github.com/schnittstabil/stream-recorder) for testing gulp plugins.


## API


### Class: StreamFromPromise

_StreamFromPromises_ are [Readable](http://nodejs.org/api/stream.html#stream_class_stream_readable_1) streams.


#### new StreamFromPromise(promise, [options])

* _promise_ `Promise` ECMAScript 2015 Promises returning Javascript values like numbers, strings, objects, functions, ...
* _options_ `Object` passed through [new Readable([options])](http://nodejs.org/api/stream.html#stream_new_stream_readable_options)

Note: The `new` operator can be omitted.


#### StreamFromPromise#obj(promise, [options])

A convenience wrapper for `new StreamFromPromise(promise, {objectMode: true, ...})`.


## License

MIT © [Michael Mayer](http://schnittstabil.de)
