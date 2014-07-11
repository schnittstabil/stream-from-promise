'use strict';
var fromPromise = require('./'),
    PromiseA = typeof Promise === 'undefined' ? require('promise') : Promise,
    merge = require('merge-stream'),
    assert = require('assert'),
    gulp = require('gulp'),
    recorder = require('stream-recorder'),
    File = require('vinyl'),
    testfilePath = '/test/file.coffee',
    testfile = new File({
      cwd: '/',
      base: '/test/',
      path: testfilePath,
      contents: new Buffer('answer: 42')
    });

function P(err, result) {
  return new PromiseA(function(resolve, reject) {
    setTimeout(function() {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    }, 500);
  });
}

describe('fromPromise', function() {

  describe('with string as value', function() {
    var input = '\uD834\uDF06';

    it('should emit value', function(done) {
      fromPromise(new P(null, input))
        .on('error', done)
        .pipe(recorder(function(result) {
          assert.deepEqual(result.toString(), input);
          done();
        }))
        .resume();
    });

    describe('and decodeStrings:false option', function() {
      it('should emit value', function(done) {
        fromPromise(new P(null, input), {decodeStrings: false})
          .on('error', done)
          .pipe(recorder(function(result) {
            assert.deepEqual(result.toString(), input);
            done();
          }))
          .resume();
      });
    });
  });

  it('should emit errors', function(done) {
    fromPromise(new P(new Error('test 42'), null))
      .on('error', function(err) {
        if (err) {
          assert.ok((err instanceof Error) && /rejected/.test(err), err);
          done();
        }
      })
      .resume();
  });

  it('should throw errors on non promise', function() {
    var sut = fromPromise(null);
    assert.throws(function() {
      sut.read();
    }, /null/);
  });

  it('constructor should return new instance w/o new', function() {
    var sut = fromPromise(new P());
    assert.strictEqual(sut instanceof fromPromise, true);
  });
});

describe('fromPromise.obj', function() {

  describe('with string array as value', function() {
    var input = ['foo', 'bar'];
    it('should emit value in object mode', function(done) {
      var opts = {objectMode: true};
      fromPromise(new P(null, input), opts)
        .on('error', done)
        .pipe(recorder(opts, function(result) {
          assert.deepEqual(result, [input]);
          done();
        }))
        .resume();
    });
  });

  [null, undefined].forEach(function(eof) {
    describe('with value == ' + eof, function() {
      it('should end stream', function(done) {
        var opts = {objectMode: true};
        fromPromise(new P(null, eof), opts)
          .on('error', done)
          .pipe(recorder(opts, function(result) {
            assert.deepEqual(result, []);
            done();
          }))
          .resume();
      });
    });
  });

  describe('with mixed object as value', function() {
    var input = ['foo', 1, { foobar: 'foobar', answer: 42 }, {}, 'bar',
          undefined, null];

    it('should emit value', function(done) {
      var opts = {objectMode: true};
      fromPromise.obj(new P(null, input))
        .on('error', done)
        .pipe(recorder(opts, function(result) {
          assert.deepEqual(result, [input]);
          done();
        }))
        .resume();
    });
  });

  describe('in duplex mode', function() {
    it('should insert vinyl file in gulp stream', function(done) {
      var opts = {objectMode: true};
      var sut = new fromPromise.obj(new P(null, testfile));
      sut = merge(gulp.src(__filename), sut)
        .on('error', done)
        .pipe(recorder(opts, function(result) {
          var paths = result.map(function(file) { return file.path; });
          assert.deepEqual(paths.sort(), [testfilePath, __filename].sort());
          done();
        }))
        .resume();
    });
  });

  it('constructor should return new instance w/o new', function() {
    assert.strictEqual(fromPromise.obj() instanceof fromPromise, true);
  });
});
