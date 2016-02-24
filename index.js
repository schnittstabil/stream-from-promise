'use strict';
var Readable = require('stream').Readable,
    inherits = require('util').inherits;

function StreamFromPromise(promise, options) {
  if (!(this instanceof StreamFromPromise)) {
    return new StreamFromPromise(promise, options);
  }

  Readable.call(this, options);

  this.__promise = promise;
  this.__resolvingPromise = false;
}
inherits(StreamFromPromise, Readable);

StreamFromPromise.obj = function(promise, options) {
  options = options || {};
  options.objectMode = true;
  return new StreamFromPromise(promise, options);
};

StreamFromPromise.prototype._read = function() {
  var self;
  if (!this.__resolvingPromise) {
    this.__resolvingPromise = true;
    self = this;
    this.__promise.then(
      function(value) {
        self.push(value);
        self.push(null);
      },
      function(reason) {
        var err = reason instanceof Error ? reason : new Error('rejected');
        self.emit('error', err);
        self.push(null);
      }
    );
  }
};

module.exports = StreamFromPromise;
