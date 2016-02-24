import test from 'ava';
import recorder from 'stream-recorder';

import {buildPromise} from './helpers/promise-factory';
import fromPromise from '../';

const recorderOpts = {objectMode: true};
const stringArray = ['foo', 'bar', undefined];
const mixedArray = ['foo', 1, {foobar: 'foobar', answer: 42}, {}, 'bar', undefined, null];

test.cb('with value == null should end stream', t => {
	fromPromise.obj(buildPromise(null, null))
		.pipe(recorder(recorderOpts, result => {
			t.same(result, []);
			t.end();
		}))
		.resume();
});

test.cb('with string array as value should emit value in object mode', t => {
	fromPromise.obj(buildPromise(null, stringArray))
		.pipe(recorder(recorderOpts, result => {
			t.same(result, [stringArray]);
			t.end();
		}))
		.resume();
});

test.cb('with mixed object as value should emit value', t => {
	fromPromise.obj(buildPromise(null, mixedArray))
		.pipe(recorder(recorderOpts, result => {
			t.same(result, [mixedArray]);
			t.end();
		}))
		.resume();
});

test.cb('should emit errors', t => {
	fromPromise.obj(buildPromise(new Error('test 42'), null))
		.on('error', err => {
			t.ok(err instanceof Error);
			t.regex(err, /test 42/);
			t.end();
		})
		.resume();
});

test('should throw errors on non promise', t => {
	const sut = fromPromise.obj(null);
	t.throws(sut.read.bind(sut), /null/);
});

test('constructor should return new instance w/o new', t => {
	const sut = fromPromise.obj(buildPromise());
	t.same(sut instanceof fromPromise, true);
});
